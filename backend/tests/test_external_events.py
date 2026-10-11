from datetime import timedelta

from django.utils import timezone
from rest_framework.test import APITestCase

from apps.accounts.models import User
from apps.bookings.models import Booking
from apps.bookings.services import reserve, still_deliverable
from apps.common.api import Conflict
from apps.events.announcements import announce_new_event_batch
from apps.events.models import Event, EventAnnouncement, MajorEventAnnouncement, TicketType
from apps.events.moderation import moderate_event
from apps.notifications.models import Notification
from apps.notifications.services import major_event_email_details


class ExternalEventTests(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user('external-host', 'host@example.test',
            role=User.Role.ORGANIZER, is_verified=True, email_verified=True)
        self.admin = User.objects.create_superuser('external-admin', 'admin@example.test')
        self.reader = User.objects.create_user('external-reader', 'reader@example.test', email_verified=True)
        self.client.force_authenticate(self.owner)
        start = timezone.now() + timedelta(days=4)
        self.payload = {
            'title': 'Abia Tech Rise', 'description': 'Build and learn together',
            'category': 'Leadership', 'venue': 'Conference Hall', 'city': 'Umuahia',
            'capacity': 100, 'start_datetime': start.isoformat(),
            'end_datetime': (start + timedelta(hours=4)).isoformat(),
            'image_url': 'https://example.test/event.png',
            'registration_type': 'EXTERNAL', 'registration_url': 'https://www.abiatechrise.ng/',
        }

    def create_event(self, **changes):
        response = self.client.post('/api/v1/events/', {**self.payload, **changes}, format='json')
        self.assertEqual(response.status_code, 201, response.data)
        return Event.objects.get(pk=response.data['id'])

    def test_external_event_submit_approve_and_public_details_without_tickets(self):
        event = self.create_event()
        self.assertFalse(event.ticket_types.exists())
        result = self.client.post(f'/api/v1/events/{event.pk}/submit/')
        self.assertEqual(result.status_code, 200, result.data)
        self.assertEqual(result.data['status'], 'IN_REVIEW')
        moderate_event(self.admin, event.pk, 'approve')
        self.client.force_authenticate(self.reader)
        result = self.client.get(f'/api/v1/events/{event.pk}/')
        self.assertEqual(result.status_code, 200, result.data)
        self.assertEqual(result.data['registration_type'], 'EXTERNAL')
        self.assertEqual(result.data['registration_url'], self.payload['registration_url'])
        self.assertEqual(result.data['ticket_types'], [])

    def test_default_ticketed_events_still_require_tickets(self):
        payload = {key: value for key, value in self.payload.items() if key not in {'registration_type', 'registration_url'}}
        result = self.client.post('/api/v1/events/', payload, format='json')
        self.assertEqual(result.status_code, 201, result.data)
        self.assertEqual(result.data['registration_type'], 'TICKETED')
        event = Event.objects.get(pk=result.data['id'])
        self.assertEqual(self.client.post(f'/api/v1/events/{event.pk}/submit/').status_code, 409)
        TicketType.objects.create(event=event, name='Free ticket', price=0, quantity=100)
        self.assertEqual(self.client.post(f'/api/v1/events/{event.pk}/submit/').status_code, 200)
        self.assertEqual(moderate_event(self.admin, event.pk, 'approve').status, 'PUBLISHED')

    def test_external_requires_safe_https_link(self):
        for url in ['', 'http://example.com/register', 'javascript:alert(1)', 'https://user:password@example.com/', 'https://example.com\\evil']:
            with self.subTest(url=url):
                result = self.client.post('/api/v1/events/', {**self.payload, 'registration_url': url}, format='json')
                self.assertEqual(result.status_code, 400, result.data)
                self.assertIn('registration_url', result.data['error'])
        self.assertFalse(Event.objects.exists())

    def test_ticketed_cannot_store_external_link(self):
        result = self.client.post('/api/v1/events/', {**self.payload, 'registration_type': 'TICKETED'}, format='json')
        self.assertEqual(result.status_code, 400, result.data)
        self.assertIn('registration_url', result.data['error'])

    def test_external_events_block_ticket_management_and_booking_even_with_stale_stock(self):
        event = self.create_event()
        result = self.client.post(f'/api/v1/events/{event.pk}/ticket-types/', {'name': 'General', 'price': 0, 'quantity': 10}, format='json')
        self.assertEqual(result.status_code, 409, result.data)
        event.status = Event.Status.PUBLISHED
        event.save()
        stock = TicketType.objects.create(event=event, name='Stale ticket', price=0, quantity=10)
        with self.assertRaisesMessage(Conflict, 'external registration'):
            reserve(self.reader, 'external-booking-test', 'EVENT', [{'id': stock.pk, 'quantity': 1}], {})
        self.assertFalse(Booking.objects.exists())
        booking = Booking(user=self.reader, kind='EVENT', parent_id=str(event.pk), total_amount=0)
        self.assertFalse(still_deliverable(booking, event))
        result = self.client.get(f'/api/v1/events/{event.pk}/')
        self.assertEqual(result.data['ticket_types'], [])

    def test_any_booking_history_prevents_registration_mode_change(self):
        event = self.create_event(registration_type='TICKETED', registration_url='')
        Booking.objects.create(user=self.reader, kind='EVENT', parent_id=str(event.pk),
            booking_reference='EXTERNAL-EXISTING', total_amount=0, status=Booking.Status.CANCELLED)
        result = self.client.patch(f'/api/v1/events/{event.pk}/', {
            'registration_type': 'EXTERNAL', 'registration_url': self.payload['registration_url'],
        }, format='json')
        self.assertEqual(result.status_code, 400, result.data)
        self.assertIn('registration_type', result.data['error'])
        event.refresh_from_db()
        self.assertEqual(event.registration_type, 'TICKETED')

    def test_mode_change_removes_unused_tickets_and_requires_review(self):
        event = self.create_event(registration_type='TICKETED', registration_url='')
        TicketType.objects.create(event=event, name='General', price=1000, quantity=100)
        Event.objects.filter(pk=event.pk).update(status=Event.Status.PUBLISHED)
        result = self.client.patch(f'/api/v1/events/{event.pk}/', {
            'registration_type': 'EXTERNAL', 'registration_url': self.payload['registration_url'],
        }, format='json')
        self.assertEqual(result.status_code, 200, result.data)
        self.assertEqual(result.data['status'], 'DRAFT')
        self.assertFalse(event.ticket_types.exists())
        self.client.force_authenticate(self.reader)
        self.assertEqual(self.client.get(f'/api/v1/events/{event.pk}/').status_code, 404)
        self.client.force_authenticate(self.owner)
        self.assertEqual(self.client.post(f'/api/v1/events/{event.pk}/submit/').status_code, 200)
        self.assertEqual(moderate_event(self.admin, event.pk, 'approve').status, 'PUBLISHED')

    def test_published_external_can_become_ticketed_through_review(self):
        event = self.create_event()
        Event.objects.filter(pk=event.pk).update(status=Event.Status.PUBLISHED)
        result = self.client.patch(f'/api/v1/events/{event.pk}/', {'registration_type': 'TICKETED'}, format='json')
        self.assertEqual(result.status_code, 200, result.data)
        self.assertEqual(result.data['status'], 'DRAFT')
        self.assertEqual(result.data['registration_url'], '')
        result = self.client.post(f'/api/v1/events/{event.pk}/ticket-types/', {'name': 'General', 'price': 0, 'quantity': 100}, format='json')
        self.assertEqual(result.status_code, 201, result.data)
        self.assertEqual(self.client.post(f'/api/v1/events/{event.pk}/submit/').status_code, 200)
        self.assertEqual(moderate_event(self.admin, event.pk, 'approve').status, 'PUBLISHED')

    def test_published_external_link_change_requires_review_but_content_edit_does_not(self):
        event = self.create_event()
        Event.objects.filter(pk=event.pk).update(status=Event.Status.PUBLISHED)
        unchanged = self.client.patch(f'/api/v1/events/{event.pk}/', {'description': 'Updated content',
            'registration_type': 'EXTERNAL', 'registration_url': self.payload['registration_url']}, format='json')
        self.assertEqual(unchanged.status_code, 200, unchanged.data)
        self.assertEqual(unchanged.data['status'], 'PUBLISHED')
        changed = self.client.patch(f'/api/v1/events/{event.pk}/', {'registration_url': 'https://example.test/new-registration'}, format='json')
        self.assertEqual(changed.status_code, 200, changed.data)
        self.assertEqual(changed.data['status'], 'DRAFT')

    def test_new_event_announcement_uses_registration_copy(self):
        event = self.create_event()
        Event.objects.filter(pk=event.pk).update(status=Event.Status.IN_REVIEW)
        moderate_event(self.admin, event.pk, 'approve')
        self.assertTrue(EventAnnouncement.objects.filter(event=event).exists())
        self.assertTrue(announce_new_event_batch())
        notice = Notification.objects.get(key=f'event-new:{event.pk}:{self.reader.pk}')
        self.assertIn('register with the organizer', notice.body)
        self.assertNotIn('get your ticket', notice.body)

    def test_external_event_can_be_promoted_and_email_uses_register_cta(self):
        event = self.create_event()
        Event.objects.filter(pk=event.pk).update(status=Event.Status.PUBLISHED)
        self.client.force_authenticate(self.admin)
        result = self.client.put('/api/v1/admin/major-event/', {'event_id': str(event.pk)}, format='json')
        self.assertEqual(result.status_code, 200, result.data)
        self.assertEqual(result.data['kind'], 'registration')
        self.assertEqual(result.data['cta'], 'Register now')
        self.assertEqual(result.data['url'], f'/events/{event.pk}')
        job = MajorEventAnnouncement.objects.get()
        details = major_event_email_details(f'major-event:{job.pk}:{self.reader.pk}')
        self.assertEqual(details[1], 'Register now')
        Event.objects.filter(pk=event.pk).update(is_suspended=True)
        self.assertIsNone(self.client.get('/api/v1/events/major/').data)

    def test_only_organizers_can_create_external_events(self):
        self.client.force_authenticate(self.reader)
        self.assertEqual(self.client.post('/api/v1/events/', self.payload, format='json').status_code, 403)
