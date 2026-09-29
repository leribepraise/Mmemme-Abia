from datetime import timedelta
from decimal import Decimal
from io import BytesIO

from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from django.utils import timezone
from PIL import Image
from rest_framework.test import APITestCase

from apps.events.models import Event, TicketType
from apps.events.images import process_event_image
from apps.bookings.models import Booking, BookingItem
from apps.payments.models import Payment, Refund


@override_settings(STORAGES={'default': {'BACKEND': 'django.core.files.storage.InMemoryStorage'}})
class EventImageUploadTests(APITestCase):
    def test_verified_organizer_can_create_event_with_gallery_image(self):
        owner = get_user_model().objects.create_user(
            username='image-organizer', email='image-organizer@example.test',
            email_verified=True, is_verified=True, role='ORGANIZER',
        )
        self.client.force_authenticate(owner)
        image = BytesIO()
        Image.new('RGB', (40, 40), '#f46f1a').save(image, format='PNG')
        start = timezone.now() + timedelta(days=5)
        result = self.client.post('/api/v1/events/', {
            'title': 'Gallery event', 'description': 'A local event',
            'category': 'Music', 'venue': 'Aba hall', 'city': 'Aba',
            'capacity': 40, 'start_datetime': start.isoformat(),
            'end_datetime': (start + timedelta(hours=3)).isoformat(),
            'image': SimpleUploadedFile('event.png', image.getvalue(), content_type='image/png'),
        }, format='multipart')
        self.assertEqual(result.status_code, 201, result.data)
        event = Event.objects.get(pk=result.data['id'])
        self.assertTrue(event.image.name.startswith('events/'))
        self.assertEqual(event.status, 'DRAFT')
        self.assertEqual(event.category, 'Entertainment')

    def test_uploaded_event_gets_small_webp_versions_and_edit_invalidates_them(self):
        owner = get_user_model().objects.create_user(username='artist', email='artist@example.test',
            email_verified=True, is_verified=True, role='ORGANIZER')
        self.client.force_authenticate(owner)
        image = BytesIO()
        Image.new('RGB', (1600, 900), '#f46f1a').save(image, format='PNG')
        start = timezone.now() + timedelta(days=5)
        result = self.client.post('/api/v1/events/', {
            'title': 'Gallery event', 'description': 'A local event', 'category': 'Music',
            'venue': 'Aba hall', 'city': 'Aba', 'capacity': 40,
            'start_datetime': start.isoformat(), 'end_datetime': (start + timedelta(hours=3)).isoformat(),
            'image': SimpleUploadedFile('event.png', image.getvalue(), content_type='image/png'),
        }, format='multipart')
        self.assertEqual(result.status_code, 201, result.data)
        event = Event.objects.get(pk=result.data['id'])
        self.assertTrue(process_event_image(event.pk))
        event.refresh_from_db()
        with Image.open(event.image_card) as card, Image.open(event.image_detail) as detail:
            self.assertEqual(card.format, 'WEBP')
            self.assertLessEqual(card.width, 640)
            self.assertLessEqual(detail.width, 1280)
        self.assertTrue(self.client.get(f'/api/v1/events/{event.pk}/manage/').data['image_card'])
        edited = self.client.patch(f'/api/v1/events/{event.pk}/', {
            'image': SimpleUploadedFile('new.png', image.getvalue(), content_type='image/png'),
        }, format='multipart')
        self.assertEqual(edited.status_code, 200, edited.data)
        event.refresh_from_db()
        self.assertFalse(event.image_card)
        self.assertTrue(process_event_image(event.pk))

    def test_admin_reviews_removal_and_books_event_cancellation(self):
        owner = get_user_model().objects.create_user(username='owner-removal', email='owner-removal@example.test',
            email_verified=True, is_verified=True, role='ORGANIZER')
        admin = get_user_model().objects.create_superuser(username='reviewer-removal',
            email='reviewer-removal@example.test', password='Strong-test-42!')
        start = timezone.now() + timedelta(days=5)
        event = Event.objects.create(organizer=owner, title='Private event', slug='private-event-removal',
            description='A local event', category='Music', venue='Aba hall', city='Aba', capacity=40,
            start_datetime=start, end_datetime=start + timedelta(hours=3))
        self.client.force_authenticate(owner)
        path = f'/api/v1/events/{event.pk}/'
        self.assertEqual(self.client.delete(path).status_code, 409)
        self.assertEqual(self.client.post(path + 'request-deletion/').status_code, 200)
        self.assertEqual(self.client.post(path + 'request-deletion/').status_code, 409)
        self.client.force_authenticate(admin)
        self.assertEqual(self.client.post(f'/api/v1/admin/events/{event.pk}/approve-deletion/').status_code, 200)
        event.refresh_from_db()
        self.assertTrue(event.is_archived)
        self.assertTrue(Event.objects.filter(pk=event.pk).exists())
        self.client.force_authenticate(owner)
        self.assertEqual(self.client.get('/api/v1/events/mine/').data['count'], 0)

        second = Event.objects.create(organizer=owner, title='Booked event', slug='booked-event-removal',
            description='Another event', category='Music', venue='Aba hall', city='Aba', capacity=40,
            start_datetime=start, end_datetime=start + timedelta(hours=3))
        Booking.objects.create(user=owner, kind='EVENT', parent_id=str(second.pk),
            booking_reference='MM-REMOVAL-TEST', total_amount=0)
        self.assertEqual(self.client.post(f'/api/v1/events/{second.pk}/request-deletion/').status_code, 200)
        self.client.force_authenticate(admin)
        self.assertEqual(self.client.post(f'/api/v1/admin/events/{second.pk}/approve-deletion/').status_code, 200)
        self.assertEqual(Booking.objects.get(booking_reference='MM-REMOVAL-TEST').status, 'CANCELLED')

    def test_admin_approval_queues_full_paystack_refund_and_cancels_tickets(self):
        owner = get_user_model().objects.create_user(username='refund-owner', email='refund-owner@example.test',
            email_verified=True, is_verified=True, role='ORGANIZER')
        buyer = get_user_model().objects.create_user(username='refund-buyer', email='refund-buyer@example.test')
        admin = get_user_model().objects.create_superuser(username='refund-admin',
            email='refund-admin@example.test', password='Strong-test-42!')
        start = timezone.now() + timedelta(days=5)
        event = Event.objects.create(organizer=owner, title='Refund event', slug='refund-event-test',
            description='An event', category='Music', venue='Aba hall', city='Aba', capacity=40,
            status='PUBLISHED', start_datetime=start, end_datetime=start + timedelta(hours=3))
        ticket_type = TicketType.objects.create(event=event, name='Regular', price=Decimal('5000.00'),
            quantity=40, quantity_sold=1)
        booking = Booking.objects.create(user=buyer, supplier=owner, kind='EVENT', parent_id=str(event.pk),
            booking_reference='MM-REFUND-TEST', status='CONFIRMED', total_amount=Decimal('5000.00'),
            details={'title': event.title, 'start_datetime': start.isoformat()})
        BookingItem.objects.create(booking=booking, ticket_type=ticket_type, quantity=1,
            unit_price=Decimal('5000.00'), subtotal=Decimal('5000.00'))
        payment = Payment.objects.create(booking=booking, user=buyer, reference='PAY-REFUND-TEST',
            idempotency_key='booking:refund-test', provider='PAYSTACK', provider_reference='12345',
            amount=Decimal('5000.00'), status='SUCCESS')
        self.client.force_authenticate(owner)
        self.assertEqual(self.client.post(f'/api/v1/events/{event.pk}/request-deletion/').status_code, 200)
        self.client.force_authenticate(admin)
        self.assertEqual(self.client.post(f'/api/v1/admin/events/{event.pk}/approve-deletion/').status_code, 200)
        booking.refresh_from_db()
        payment.refresh_from_db()
        event.refresh_from_db()
        ticket_type.refresh_from_db()
        self.assertEqual(booking.status, 'REFUND_PENDING')
        self.assertEqual(payment.status, 'REFUND_PENDING')
        self.assertEqual(Refund.objects.get(payment=payment).amount, Decimal('5000.00'))
        self.assertEqual(ticket_type.quantity_sold, 0)
        self.assertTrue(event.is_archived)
        self.assertEqual(self.client.post(f'/api/v1/admin/events/{event.pk}/approve-deletion/').status_code, 409)
        self.assertEqual(Refund.objects.filter(payment=payment).count(), 1)

    def test_published_event_edit_updates_attendees_but_locks_existing_ticket_price(self):
        owner = get_user_model().objects.create_user(username='edit-owner', email='edit-owner@example.test',
            email_verified=True, is_verified=True, role='ORGANIZER')
        start = timezone.now() + timedelta(days=5)
        event = Event.objects.create(organizer=owner, title='Original title', slug='edit-published-test',
            description='Original description', category='Music', venue='Aba hall', city='Aba', capacity=40,
            status='PUBLISHED', start_datetime=start, end_datetime=start + timedelta(hours=3))
        ticket_type = TicketType.objects.create(event=event, name='Regular', price=Decimal('5000.00'), quantity=40)
        self.client.force_authenticate(owner)
        path = f'/api/v1/events/{event.pk}/'
        self.assertEqual(self.client.patch(path, {'title': 'New title'}, format='json').status_code, 200)
        booking = Booking.objects.create(user=owner, kind='EVENT', parent_id=str(event.pk),
            booking_reference='MM-EDIT-TEST', total_amount=0, details={'title': event.title})
        self.assertTrue(self.client.get(path + 'manage/').data['has_bookings'])
        self.assertEqual(self.client.patch(path, {'venue': 'Different hall'}, format='json').status_code, 200)
        booking.refresh_from_db()
        self.assertIn('Different hall', booking.details['location'])
        self.assertEqual(self.client.patch(path, {'description': 'Updated details'}, format='json').status_code, 200)
        self.assertEqual(self.client.patch(path + 'ticket-types/', {'id': str(ticket_type.pk), 'price': '6000.00'}, format='json').status_code, 400)
        self.assertEqual(self.client.post(path + 'ticket-types/', {'name': 'VIP', 'price': '10000.00', 'quantity': 10}, format='json').status_code, 201)
        draft = Event.objects.create(organizer=owner, title='Draft', slug='edit-price-draft-test',
            description='Draft description', category='Music', venue='Aba hall', city='Aba', capacity=40,
            status='DRAFT', start_datetime=start, end_datetime=start + timedelta(hours=3))
        draft_ticket = TicketType.objects.create(event=draft, name='Regular', price=Decimal('5000.00'), quantity=40)
        self.assertEqual(self.client.patch(f'/api/v1/events/{draft.pk}/ticket-types/',
            {'id': str(draft_ticket.pk), 'price': '6000.00'}, format='json').status_code, 400)
        event.status = 'COMPLETED'
        event.save(update_fields=['status'])
        self.assertEqual(self.client.post(path + 'request-deletion/').status_code, 409)

    def test_booking_uses_its_event_photo(self):
        owner = get_user_model().objects.create_user(username='photo-owner', email='photo-owner@example.test',
            email_verified=True, is_verified=True, role='ORGANIZER')
        buyer = get_user_model().objects.create_user(username='photo-buyer', email='photo-buyer@example.test')
        start = timezone.now() + timedelta(days=5)
        event = Event.objects.create(organizer=owner, title='Photo event', slug='photo-event-booking',
            description='A local event', category='Music', venue='Aba hall', city='Aba', capacity=40,
            start_datetime=start, end_datetime=start + timedelta(hours=3))
        image = BytesIO()
        Image.new('RGB', (900, 500), '#f46f1a').save(image, format='PNG')
        event.image.save('photo.png', ContentFile(image.getvalue()), save=True)
        process_event_image(event.pk)
        ticket = TicketType.objects.create(event=event, name='Regular', price=0, quantity=40)
        booking = Booking.objects.create(user=buyer, kind='EVENT', parent_id=str(event.pk),
            booking_reference='MM-PHOTO-TEST', total_amount=0)
        BookingItem.objects.create(booking=booking, ticket_type=ticket, quantity=1, unit_price=0, subtotal=0)
        self.client.force_authenticate(buyer)
        result = self.client.get(f'/api/v1/bookings/{booking.pk}/')
        self.assertEqual(result.status_code, 200)
        self.assertIn('image_card', result.data['image'].replace('-', '_') if result.data['image'] else '')
