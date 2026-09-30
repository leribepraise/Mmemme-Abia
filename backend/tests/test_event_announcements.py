import json
from datetime import timedelta
from types import SimpleNamespace
from unittest.mock import patch

from django.test import override_settings
from django.core import mail
from django.utils import timezone
from rest_framework.test import APITestCase

from apps.accounts.models import User
from apps.events.announcements import announce_new_event_batch
from apps.events.models import Event, EventAnnouncement, TicketType
from apps.events.moderation import moderate_event
from apps.notifications.models import Notification, PushDelivery, PushSubscription
from apps.notifications.push import deliver_push_one
from apps.notifications.services import deliver_one
from tests.test_notifications_push import PUSH_SETTINGS


@override_settings(**PUSH_SETTINGS)
class EventAnnouncementTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser(username='admin-event-news', email='admin-news@example.test')
        self.organizer = User.objects.create_user(username='organizer-event-news', email='organizer-news@example.test',
            role=User.Role.ORGANIZER, is_verified=True, email_verified=True)
        self.reader = User.objects.create_user(username='reader-event-news', email='reader-news@example.test',
            email_verified=True)
        self.second_reader = User.objects.create_user(username='second-event-news', email='second-news@example.test',
            email_verified=True, email_notifications=False)
        self.unverified = User.objects.create_user(username='unverified-event-news', email='unverified-news@example.test')
        self.event = Event.objects.create(organizer=self.organizer, title='Aba Festival', slug='aba-festival-news',
            description='Festival', category='Music', venue='Aba Hall', city='Aba', capacity=100,
            start_datetime=timezone.now() + timedelta(days=4),
            end_datetime=timezone.now() + timedelta(days=4, hours=3), status=Event.Status.IN_REVIEW)
        TicketType.objects.create(event=self.event, name='Regular', price=0, quantity=100)
        PushSubscription.objects.create(user=self.reader, endpoint='https://fcm.googleapis.com/fcm/send/news',
            p256dh='test-key', auth='test-auth')

    def test_approval_queues_default_email_and_opt_out_only_disables_email(self):
        self.assertFalse(EventAnnouncement.objects.exists())
        moderate_event(self.admin, self.event.pk, 'approve')
        job = EventAnnouncement.objects.get(event=self.event)
        self.assertIsNone(job.completed_at)
        self.assertTrue(announce_new_event_batch(batch_size=1))
        self.assertTrue(announce_new_event_batch(batch_size=1))
        self.assertTrue(announce_new_event_batch(batch_size=1))
        self.assertFalse(announce_new_event_batch(batch_size=1))
        notes = Notification.objects.filter(key__startswith=f'event-new:{self.event.pk}:')
        self.assertEqual(notes.count(), 2)
        self.assertIsNone(notes.get(user=self.reader).sent_at)
        self.assertIsNotNone(notes.get(user=self.second_reader).sent_at)
        self.assertEqual(PushDelivery.objects.filter(notification__in=notes).count(), 1)
        self.assertFalse(notes.filter(user=self.unverified).exists())
        job.refresh_from_db()
        self.assertIsNotNone(job.completed_at)
        job.last_user_id = 0
        job.completed_at = None
        job.save()
        for _ in range(3):
            announce_new_event_batch(batch_size=1)
        self.assertEqual(Notification.objects.filter(key__startswith='event-new:').count(), 2)
        self.assertEqual(PushDelivery.objects.filter(notification__key__startswith='event-new:').count(), 1)

        note = notes.get(user=self.reader)
        self.client.force_authenticate(self.reader)
        self.assertEqual(self.client.get(f'/api/v1/notifications/{note.pk}/').data['url'], f'/events/{self.event.pk}')
        with patch('apps.notifications.push.webpush', return_value=SimpleNamespace(status_code=201)) as send:
            self.assertTrue(deliver_push_one())
        payload = json.loads(send.call_args.kwargs['data'])
        self.assertEqual(payload['kind'], 'event')
        self.assertEqual(payload['url'], f'/events/{self.event.pk}')
        self.assertIn('Aba Festival', payload['body'])

    @override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend', FRONTEND_URL='https://mmemme.com.ng')
    def test_new_event_email_links_to_the_event(self):
        moderate_event(self.admin, self.event.pk, 'approve')
        self.assertTrue(announce_new_event_batch())
        # Skip the organizer's event-review email and send the reader's announcement.
        Notification.objects.exclude(key__startswith='event-new:').update(sent_at=timezone.now())
        self.assertTrue(deliver_one())
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, [self.reader.email])
        self.assertIn(f'https://mmemme.com.ng/events/{self.event.pk}', mail.outbox[0].alternatives[0][0])

    def test_rejected_event_does_not_announce(self):
        moderate_event(self.admin, self.event.pk, 'reject', 'Please update the venue.')
        self.assertFalse(EventAnnouncement.objects.exists())
        self.assertFalse(announce_new_event_batch())

    def test_withdrawn_event_stops_pending_announcement(self):
        moderate_event(self.admin, self.event.pk, 'approve')
        self.event.refresh_from_db()
        self.event.is_suspended = True
        self.event.save(update_fields=['is_suspended'])
        self.assertTrue(announce_new_event_batch())
        self.assertFalse(Notification.objects.filter(key__startswith='event-new:').exists())
