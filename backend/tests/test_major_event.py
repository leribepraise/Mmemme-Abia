from datetime import timedelta
from io import BytesIO
from tempfile import TemporaryDirectory

from django.contrib.auth.models import Permission
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from django.utils import timezone
from PIL import Image
from rest_framework.test import APITestCase

from apps.accounts.models import User
from apps.events.models import Event, TicketType


class MajorEventTests(APITestCase):
    def setUp(self):
        self.media = TemporaryDirectory()
        self.addCleanup(self.media.cleanup)
        media_settings = override_settings(MEDIA_ROOT=self.media.name)
        media_settings.enable()
        self.addCleanup(media_settings.disable)
        self.staff = User.objects.create_user('editor', 'editor@example.test', 'Test!Password123', is_staff=True)
        self.staff.user_permissions.add(Permission.objects.get(codename='change_event', content_type__app_label='events'))
        self.user = User.objects.create_user('visitor', 'visitor@example.test', 'Test!Password123')
        self.organizer = User.objects.create_user('host', 'host@example.test', 'Test!Password123', role='ORGANIZER', is_verified=True)
        now = timezone.now()
        self.event = Event.objects.create(organizer=self.organizer, title='Big Night', slug='big-night',
            description='A major night in Abia', category='Entertainment', venue='Aba Hall', city='Aba',
            capacity=100, start_datetime=now + timedelta(days=2), end_datetime=now + timedelta(days=2, hours=3),
            status=Event.Status.PUBLISHED, image_url='https://example.test/poster.png')
        self.ticket = TicketType.objects.create(event=self.event, name='General', price=1000, quantity=100)

    def image(self):
        buffer = BytesIO()
        Image.new('RGB', (2, 2), 'green').save(buffer, 'PNG')
        return SimpleUploadedFile('poster.png', buffer.getvalue(), content_type='image/png')

    def test_only_event_staff_can_publish_ticketed_major_event(self):
        path = '/api/v1/admin/major-event/'
        self.client.force_authenticate(self.user)
        self.assertEqual(self.client.put(path, {'event_id': str(self.event.pk)}, format='json').status_code, 403)
        self.client.force_authenticate(self.staff)
        result = self.client.put(path, {'event_id': str(self.event.pk)}, format='json')
        self.assertEqual(result.status_code, 200, result.data)
        self.client.force_authenticate(None)
        public = self.client.get('/api/v1/events/major/')
        self.assertEqual(public.data['title'], 'Big Night')
        self.assertEqual(public.data['cta'], 'Get tickets')
        self.ticket.is_active = False
        self.ticket.save()
        self.assertIsNone(self.client.get('/api/v1/events/major/').data)
        self.client.force_authenticate(self.staff)
        self.assertFalse(self.client.get(path).data['active'])

    def test_external_registration_card_expires_and_can_be_removed(self):
        self.client.force_authenticate(self.staff)
        response = self.client.put('/api/v1/admin/major-event/', {
            'title': 'Abia Tech Rise', 'description': 'Join the conference',
            'image': self.image(), 'registration_url': 'https://www.abiatechrise.ng/',
            'ends_at': (timezone.now() + timedelta(days=5)).isoformat(),
        }, format='multipart')
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data['cta'], 'Register now')
        self.assertEqual(response.data['url'], 'https://www.abiatechrise.ng/')
        from apps.events.models import MajorEventPromotion
        MajorEventPromotion.objects.update(ends_at=timezone.now() - timedelta(minutes=1))
        self.assertIsNone(self.client.get('/api/v1/events/major/').data)
        self.assertFalse(self.client.get('/api/v1/admin/major-event/').data['active'])
        self.assertEqual(self.client.put('/api/v1/admin/major-event/', {
            'title': 'Bad link', 'image': self.image(), 'registration_url': 'http://example.com/',
            'ends_at': (timezone.now() + timedelta(days=5)).isoformat(),
        }, format='multipart').status_code, 400)
        self.assertEqual(self.client.delete('/api/v1/admin/major-event/').status_code, 204)
        self.assertIsNone(self.client.get('/api/v1/events/major/').data)

    def test_popup_dismissal_is_private_and_durable(self):
        self.user.major_event_popup_pending = True
        self.user.save()
        self.assertIn(self.client.post('/api/v1/auth/major-event-popup/dismiss/').status_code, (401, 403))
        self.client.force_authenticate(self.user)
        self.assertEqual(self.client.post('/api/v1/auth/major-event-popup/dismiss/').status_code, 200)
        self.user.refresh_from_db()
        self.assertFalse(self.user.major_event_popup_pending)
        self.assertFalse(self.client.get('/api/v1/auth/me/').data['major_event_popup_pending'])
