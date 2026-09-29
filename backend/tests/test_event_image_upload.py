from datetime import timedelta
from io import BytesIO

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from django.utils import timezone
from PIL import Image
from rest_framework.test import APITestCase

from apps.events.models import Event


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
