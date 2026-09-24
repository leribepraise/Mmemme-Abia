from datetime import timedelta
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APITestCase
from apps.events.models import Event, TicketType
from apps.hotels.models import Hotel, RoomType, RoomNight


class FrontendContractTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='buyer', email='buyer@example.test', password='Testing!12345', email_verified=True)
        self.owner = get_user_model().objects.create_user(username='owner', email='owner@example.test', role='ORGANIZER', is_verified=True)
        self.client.force_authenticate(self.user)

    def test_profile_fields_persist_without_escalating_privileges(self):
        result = self.client.patch('/api/v1/auth/me/', {'whatsapp': '08000000000', 'bio': 'Hello Abia', 'date_of_birth': '2000-01-01', 'role': 'ADMIN', 'is_staff': True}, format='json')
        self.assertEqual(result.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(self.user.bio, 'Hello Abia')
        self.assertEqual(self.user.role, 'USER')
        self.assertFalse(self.user.is_staff)
        result = self.client.patch('/api/v1/auth/me/', {'date_of_birth': str(timezone.localdate()+timedelta(days=1))}, format='json')
        self.assertEqual(result.status_code, 400)

    def test_free_booking_returns_real_reference_and_ticket(self):
        event = Event.objects.create(organizer=self.owner, title='Live event', slug='live-event', category='Culture', venue='Venue', city='Aba', start_datetime=timezone.now()+timedelta(days=2), end_datetime=timezone.now()+timedelta(days=2,hours=3), capacity=5, status='PUBLISHED')
        ticket = TicketType.objects.create(event=event, name='Free', price=0, quantity=5)
        body = {'kind': 'EVENT', 'items': [{'id': str(ticket.id), 'quantity': 1}], 'customer_name': 'Test Buyer', 'customer_phone': '08000000000', 'details': {'attendee_email': 'guest@example.test', 'booking_for_someone_else': True}}
        result = self.client.post('/api/v1/bookings/', body, format='json', HTTP_IDEMPOTENCY_KEY='frontend-free-booking')
        self.assertEqual(result.status_code, 201)
        self.assertEqual(result.data['status'], 'CONFIRMED')
        self.assertEqual(result.data['details']['attendee_email'], 'guest@example.test')
        self.assertEqual(result.data['details']['event_id'], str(event.pk))
        again = self.client.post('/api/v1/bookings/', body, format='json', HTTP_IDEMPOTENCY_KEY='frontend-free-booking')
        self.assertEqual(again.data['id'], result.data['id'])
        issued = self.client.get('/api/v1/tickets/').json()['results']
        self.assertEqual(len(issued), 1)
        self.assertEqual(issued[0]['booking'], result.data['id'])
        self.assertTrue(issued[0]['qr_code'])
        self.client.force_authenticate(self.owner)
        attendees = self.client.get(f'/api/v1/events/{event.pk}/attendees/').json()['results']
        self.assertEqual(attendees[0]['email'], 'guest@example.test')
        self.assertNotIn('qr_code', attendees[0])
        outsider = get_user_model().objects.create_user(username='outsider', role='ORGANIZER', is_verified=True)
        self.client.force_authenticate(outsider)
        self.assertEqual(self.client.get(f'/api/v1/events/{event.pk}/attendees/').status_code, 404)
        self.client.force_authenticate(self.user)
        conversation = self.client.post('/api/v1/conversations/', {'booking': result.data['id']}, format='json')
        self.assertEqual(conversation.status_code, 201)
        conversation_id = conversation.data['id']
        self.assertEqual(self.client.post(f'/api/v1/conversations/{conversation_id}/messages/', {'body': 'Test booking question'}, format='json').status_code, 201)
        self.client.force_authenticate(self.owner)
        inbox = self.client.get('/api/v1/conversations/').json()['results']
        self.assertEqual(inbox[0]['customer_name'], 'buyer')
        self.assertEqual(inbox[0]['booking_reference'], result.data['booking_reference'])
        self.assertTrue(inbox[0]['unread'])
        self.assertEqual(inbox[0]['last_message'], 'Test booking question')
        self.client.post(f'/api/v1/conversations/{conversation_id}/read/')
        self.assertFalse(self.client.get('/api/v1/conversations/').json()['results'][0]['unread'])
        self.client.force_authenticate(outsider)
        self.assertEqual(self.client.get('/api/v1/conversations/').json()['results'], [])
        self.assertEqual(self.client.get(f'/api/v1/conversations/{conversation_id}/messages/').status_code, 404)

    def test_event_image_urls_reject_unsafe_schemes(self):
        from apps.events.serializers import EventSerializer
        from rest_framework.exceptions import ValidationError
        serializer = EventSerializer()
        for value in ['javascript:alert(1)', '//example.test/image.jpg', 'http://example.test/image.jpg', 'https://name:pass@example.test/image.jpg']:
            with self.assertRaises(ValidationError):
                serializer.validate_image_url(value)
        self.assertEqual(serializer.validate_image_url('/event.jpg'), '/event.jpg')
        self.assertEqual(serializer.validate_image_url('https://example.test/image.jpg'), 'https://example.test/image.jpg')

    def test_hotel_price_comes_from_available_inventory(self):
        hotel = Hotel.objects.create(owner=self.owner, name='Hotel', city='Aba', address='Aba', is_active=True)
        room = RoomType.objects.create(hotel=hotel, name='Double')
        tomorrow = timezone.localdate()+timedelta(days=1)
        RoomNight.objects.create(room_type=room, date=tomorrow, price=10, quantity=1, quantity_sold=1)
        RoomNight.objects.create(room_type=room, date=tomorrow+timedelta(days=1), price=100, quantity=2)
        result = self.client.get(f'/api/v1/hotels/{hotel.pk}/')
        self.assertEqual(result.status_code, 200)
        self.assertEqual(result.data['minimum_price'], '100')
