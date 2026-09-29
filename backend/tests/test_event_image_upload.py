from datetime import timedelta
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

    def test_admin_reviews_removal_and_bookings_block_deletion(self):
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
        self.assertEqual(self.client.post(f'/api/v1/events/{second.pk}/request-deletion/').status_code, 409)

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
