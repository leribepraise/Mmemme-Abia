from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.cache import cache
from django.core.exceptions import ValidationError
from django.test import SimpleTestCase, TestCase
from rest_framework.test import APIClient

User = get_user_model()


class PasswordPolicyTests(SimpleTestCase):
    def test_only_agreed_complexity_rules_are_required(self):
        user = User(username='Wayne123', first_name='Wayne', email='wayne123@gmail.com')
        for password in ['Wayne123!', 'Password1!', 'ABCDEFG1!', 'Abcdef1_', 'Abcdef1£', 'Abcdef1😀']:
            with self.subTest(password=password):
                validate_password(password, user)

    def test_missing_requirements_and_whitespace_are_rejected(self):
        for password in ['Abc1!', 'abcdef1!', 'Abcdefg!', 'Abcdefg1', 'Abcdef1 ', 'Abcdef1\n', 'A1!' + 'x' * 126]:
            with self.subTest(password=password):
                with self.assertRaises(ValidationError):
                    validate_password(password)


class PasswordPolicyAPITests(TestCase):
    def setUp(self):
        cache.clear()
        self.addCleanup(cache.clear)
        self.client = APIClient()

    def test_signup_allows_name_similarity_but_requires_email_and_otp(self):
        email = 'wayne123@gmail.com'
        body = {'email': email, 'username': 'Wayne123', 'first_name': 'Wayne', 'password': 'Wayne123!', 'otp_code': '123456'}
        with patch('apps.accounts.email_codes.secrets.randbelow', return_value=123456):
            self.assertEqual(self.client.post('/api/v1/auth/resend-verification/', {'email': email}).status_code, 202)
        for changes in [{'password': 'wayne123!'}, {'email': 'bad@gmail'}, {'otp_code': '999999'}]:
            response = self.client.post('/api/v1/auth/register/', {**body, **changes})
            self.assertEqual(response.status_code, 400, response.data)
            self.assertFalse(User.objects.exists())
        response = self.client.post('/api/v1/auth/register/', body)
        self.assertEqual(response.status_code, 201, response.data)
        self.assertTrue(User.objects.get().email_verified)

    def test_change_reset_and_existing_login_are_consistent(self):
        user = User.objects.create_user('Wayne123', 'wayne123@gmail.com', 'oldpassword', email_verified=True)
        # New composition rules are not applied when authenticating an existing password.
        self.assertEqual(self.client.post('/api/v1/auth/login/', {'email': user.email, 'password': 'oldpassword'}).status_code, 200)
        self.client.force_authenticate(user)
        for password in ['wayne123!', 'Wayneabc!', 'Wayne1234']:
            self.assertEqual(self.client.post('/api/v1/auth/password-change/', {'current_password': 'oldpassword', 'password': password}).status_code, 400)
        self.assertEqual(self.client.post('/api/v1/auth/password-change/', {'current_password': 'oldpassword', 'password': 'Wayne123!'}).status_code, 200)
        user.refresh_from_db()
        self.assertTrue(user.check_password('Wayne123!'))
        self.client.force_authenticate(None)
        token = default_token_generator.make_token(user)
        body = {'user': user.pk, 'token': token, 'password': 'wayne123!'}
        self.assertEqual(self.client.post('/api/v1/auth/password-reset/confirm/', body).status_code, 400)
        self.assertEqual(self.client.post('/api/v1/auth/password-reset/confirm/', {**body, 'password': 'Wayne456!'}).status_code, 200)
        user.refresh_from_db()
        self.assertTrue(user.check_password('Wayne456!'))
