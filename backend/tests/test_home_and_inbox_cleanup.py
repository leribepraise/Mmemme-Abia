from datetime import datetime, timedelta, timezone as dt_timezone
from unittest.mock import patch

from django.core import mail
from django.test import override_settings
from django.utils import timezone
from rest_framework.test import APITestCase

from apps.accounts.models import User
from apps.bookings.models import Booking
from apps.events.models import Event
from apps.notifications.models import Notification
from apps.notifications.services import deliver_one


class HomeAndInboxCleanupTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='cleanup-user', email='cleanup@example.test', email_verified=True)
        self.other = User.objects.create_user(username='cleanup-other', email='other@example.test', email_verified=True)

    def test_featured_events_rotate_five_at_a_time(self):
        organizer = User.objects.create_user(username='featured-organizer', email='organizer@example.test',
                                             role=User.Role.ORGANIZER, is_verified=True, email_verified=True)
        now = timezone.now()
        for index in range(8):
            Event.objects.create(organizer=organizer, title=f'Event {index}', slug=f'featured-event-{index}',
                                 description='Upcoming event', category='Culture', venue='Aba Hall', city='Aba',
                                 capacity=100, start_datetime=now + timedelta(days=5),
                                 end_datetime=now + timedelta(days=5, hours=2), status=Event.Status.PUBLISHED)
        next_slot = datetime.fromtimestamp((int(now.timestamp() // 300) + 1) * 300, tz=dt_timezone.utc)
        with patch('apps.events.views.timezone.now', return_value=next_slot):
            first = self.client.get('/api/v1/events/featured/')
        with patch('apps.events.views.timezone.now', return_value=next_slot + timedelta(minutes=5)):
            second = self.client.get('/api/v1/events/featured/')
        self.assertEqual(first.status_code, 200)
        self.assertEqual(len(first.data), 5)
        self.assertEqual(len(second.data), 5)
        self.assertNotEqual({row['id'] for row in first.data}, {row['id'] for row in second.data})

    @override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
    def test_user_deletes_own_notification_without_erasing_audit_row(self):
        notice = Notification.objects.create(user=self.user, key='cleanup:one', subject='Update',
                                             body='Details', email=self.user.email)
        other = Notification.objects.create(user=self.other, key='cleanup:other', subject='Other',
                                            body='Details', email=self.other.email, sent_at=timezone.now())
        self.client.force_authenticate(self.user)
        self.assertEqual(self.client.delete(f'/api/v1/notifications/{other.pk}/').status_code, 404)
        self.assertEqual(self.client.delete(f'/api/v1/notifications/{notice.pk}/').status_code, 204)
        notice.refresh_from_db()
        self.assertIsNotNone(notice.deleted_at)
        self.assertEqual(self.client.get('/api/v1/notifications/live/').data['unread_count'], 0)
        self.assertEqual(self.client.get(f'/api/v1/notifications/{notice.pk}/').status_code, 404)
        self.assertFalse(deliver_one())
        self.assertEqual(len(mail.outbox), 0)

    def test_cancelled_booking_can_be_hidden_but_refund_pending_stays_visible(self):
        cancelled = Booking.objects.create(user=self.user, booking_reference='CLEAN-CANCELLED',
                                           status=Booking.Status.CANCELLED, total_amount=0)
        pending = Booking.objects.create(user=self.user, booking_reference='CLEAN-PENDING',
                                         status=Booking.Status.REFUND_PENDING, total_amount=100)
        other = Booking.objects.create(user=self.other, booking_reference='CLEAN-OTHER',
                                       status=Booking.Status.CANCELLED, total_amount=0)
        self.client.force_authenticate(self.user)
        self.assertEqual(self.client.delete(f'/api/v1/bookings/{other.pk}/hide/').status_code, 404)
        self.assertEqual(self.client.delete(f'/api/v1/bookings/{pending.pk}/hide/').status_code, 400)
        self.assertEqual(self.client.delete(f'/api/v1/bookings/{cancelled.pk}/hide/').status_code, 204)
        cancelled.refresh_from_db()
        self.assertIsNotNone(cancelled.hidden_by_user_at)
        self.assertEqual(self.client.get(f'/api/v1/bookings/{cancelled.pk}/').status_code, 404)
        self.assertEqual(self.client.get(f'/api/v1/bookings/{pending.pk}/').status_code, 200)

    def test_cancelled_booking_automatically_leaves_list_after_30_days(self):
        old = Booking.objects.create(user=self.user, booking_reference='CLEAN-OLD',
                                     status=Booking.Status.CANCELLED, total_amount=0)
        recent = Booking.objects.create(user=self.user, booking_reference='CLEAN-RECENT',
                                        status=Booking.Status.CANCELLED, total_amount=0)
        Booking.objects.filter(pk=old.pk).update(updated_at=timezone.now() - timedelta(days=31))
        self.client.force_authenticate(self.user)
        ids = {row['id'] for row in self.client.get('/api/v1/bookings/').data['results']}
        self.assertNotIn(str(old.pk), ids)
        self.assertIn(str(recent.pk), ids)
        self.assertTrue(Booking.objects.filter(pk=old.pk).exists())
