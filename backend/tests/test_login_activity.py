from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase


class LoginActivityTests(APITestCase):
    def test_details_show_only_the_account_owners_recent_sign_ins(self):
        users = [get_user_model().objects.create_user(
            username=f'activity-{number}', email=f'activity-{number}@example.test',
            password='Strong-test-42!', email_verified=True,
        ) for number in (1, 2)]
        self.assertEqual(self.client.get('/api/v1/auth/login-activity/').status_code, 401)
        for user in users:
            response = self.client.post('/api/v1/auth/login/',
                {'email': user.email, 'password': 'Strong-test-42!'},
                format='json', HTTP_USER_AGENT=f'Test Browser {user.pk}')
            self.assertEqual(response.status_code, 200)
        self.client.force_authenticate(users[0])
        rows = self.client.get('/api/v1/auth/login-activity/')
        self.assertEqual(rows.status_code, 200)
        self.assertEqual(len(rows.data), 1)
        self.assertEqual(rows.data[0]['device'], f'Test Browser {users[0].pk}')
