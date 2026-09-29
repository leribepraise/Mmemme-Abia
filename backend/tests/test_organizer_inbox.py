from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from apps.messaging.models import Conversation


class OrganizerInboxAccessTests(APITestCase):
    def test_support_staff_can_read_organizer_support_threads_but_other_organizers_cannot(self):
        users = get_user_model()
        organizer = users.objects.create_user(username='inbox-organizer', email='inbox-organizer@example.test',
            role='ORGANIZER', email_verified=True, is_verified=True)
        other = users.objects.create_user(username='inbox-other', email='inbox-other@example.test',
            role='ORGANIZER', email_verified=True, is_verified=True)
        staff = users.objects.create_superuser(username='inbox-staff', email='inbox-staff@example.test',
            password='Strong-test-42!')
        assigned = users.objects.create_superuser(username='inbox-assigned', email='inbox-assigned@example.test',
            password='Strong-test-42!')
        conversation = Conversation.objects.create(customer=organizer, provider=assigned,
            direct_key=f'support:{organizer.pk}', is_support=True)

        self.client.force_authenticate(staff)
        result = self.client.get('/api/v1/conversations/')
        self.assertEqual(result.status_code, 200)
        self.assertEqual(result.data['results'][0]['id'], str(conversation.pk))
        self.assertEqual(result.data['results'][0]['customer_role'], 'ORGANIZER')
        self.assertEqual(self.client.get(f'/api/v1/conversations/{conversation.pk}/messages/').status_code, 200)

        self.client.force_authenticate(other)
        self.assertEqual(self.client.get(f'/api/v1/conversations/{conversation.pk}/messages/').status_code, 404)
