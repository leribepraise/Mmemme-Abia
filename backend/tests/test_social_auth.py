from urllib.parse import parse_qs, urlsplit
from unittest.mock import patch
import time

import jwt
from cryptography.hazmat.primitives.asymmetric import rsa

from django.test import override_settings
from rest_framework.test import APITestCase

from apps.accounts.models import EmailVerificationCode, SocialIdentity, User
from apps.accounts.social_auth import SocialAuthError, verified_claims
from apps.notifications.models import Notification


SOCIAL_SETTINGS = {
    'FRONTEND_URL': 'https://mmemme.com.ng',
    'SOCIAL_AUTH_ORIGIN': 'https://mmemme.com.ng',
    'GOOGLE_OAUTH_CLIENT_ID': 'google-client.example',
    'GOOGLE_OAUTH_CLIENT_SECRET': 'google-secret-example',
    'APPLE_SERVICES_ID': 'com.mmemme.web',
    'APPLE_TEAM_ID': 'TEAM123456',
    'APPLE_KEY_ID': 'KEY1234567',
    'APPLE_PRIVATE_KEY': 'test-key-patched-before-use',
    'REFRESH_COOKIE_SECURE': True,
}


@override_settings(**SOCIAL_SETTINGS)
class SocialAuthTests(APITestCase):
    def start(self, provider='google', flow='user'):
        response = self.client.get(f'/api/v1/auth/social/{provider}/start/?flow={flow}')
        self.assertEqual(response.status_code, 302)
        params = parse_qs(urlsplit(response['Location']).query)
        return response, params['state'][0], params

    def test_google_start_uses_code_flow_state_and_pkce(self):
        response, state, params = self.start()
        self.assertIn('accounts.google.com', response['Location'])
        self.assertEqual(params['response_type'], ['code'])
        self.assertEqual(params['code_challenge_method'], ['S256'])
        self.assertEqual(params['redirect_uri'], ['https://mmemme.com.ng/api/v1/auth/social/google/callback/'])
        self.assertEqual(response.cookies['mmemme_oauth_google'].value, state)

    def test_callback_rejects_missing_or_mismatched_browser_state(self):
        _, state, _ = self.start()
        response = self.client.get(f'/api/v1/auth/social/google/callback/?state=wrong&code=sample')
        self.assertIn('error=failed', response['Location'])
        self.assertFalse(User.objects.exists())
        self.client.cookies.clear()
        response = self.client.get(f'/api/v1/auth/social/google/callback/?state={state}&code=sample')
        self.assertIn('error=failed', response['Location'])
        self.assertFalse(User.objects.exists())

    @patch('apps.accounts.social_views.verified_claims')
    @patch('apps.accounts.social_views.exchange_code', return_value='signed-token')
    def test_google_requires_email_otp_and_password_before_creating_account(self, exchange, verify):
        verify.return_value = {'subject': 'google-sub-123', 'email': 'person@example.test',
                               'first_name': 'Ada', 'last_name': 'Nwosu'}
        _, state, _ = self.start()
        with patch('apps.accounts.email_codes.secrets.randbelow', return_value=12345):
            response = self.client.get(f'/api/v1/auth/social/google/callback/?state={state}&code=one-time-code')
        self.assertIn('verify=1', response['Location'])
        self.assertNotIn('mmemme_refresh', response.cookies)
        self.assertFalse(User.objects.exists())
        self.assertEqual(Notification.objects.count(), 1)
        self.assertEqual(self.client.get('/api/v1/auth/social/pending/').data['stage'], 'otp')
        self.assertEqual(self.client.post('/api/v1/auth/social/password/', {'password': 'StrongPassword1!', 'confirm_password': 'StrongPassword1!'}).status_code, 400)
        self.assertEqual(self.client.post('/api/v1/auth/social/verify/', {'otp_code': '000000'}).status_code, 400)
        self.assertFalse(User.objects.exists())
        verified = self.client.post('/api/v1/auth/social/verify/', {'otp_code': '012345'})
        self.assertEqual(verified.status_code, 200, verified.data)
        self.assertTrue(verified.data['needs_password'])
        self.assertFalse(User.objects.exists())
        self.assertEqual(self.client.get('/api/v1/auth/social/pending/').data['stage'], 'password')
        self.assertEqual(self.client.post('/api/v1/auth/social/password/', {'password': 'weakpassword', 'confirm_password': 'weakpassword'}).status_code, 400)
        self.assertFalse(User.objects.exists())
        created = self.client.post('/api/v1/auth/social/password/', {'password': 'StrongPassword1!', 'confirm_password': 'StrongPassword1!'})
        self.assertEqual(created.status_code, 200, created.data)
        self.assertIn('mmemme_refresh', created.cookies)
        user = User.objects.get(email='person@example.test')
        self.assertTrue(user.email_verified)
        self.assertTrue(user.check_password('StrongPassword1!'))
        self.assertEqual(SocialIdentity.objects.get(user=user).subject, 'google-sub-123')
        self.assertEqual(self.client.post('/api/v1/auth/refresh/').status_code, 200)
        _, state, _ = self.start()
        login = self.client.get(f'/api/v1/auth/social/google/callback/?state={state}&code=another-code')
        self.assertNotIn('verify=1', login['Location'])
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(SocialIdentity.objects.count(), 1)

    @patch('apps.accounts.social_views.verified_claims')
    @patch('apps.accounts.social_views.exchange_code', return_value='signed-token')
    def test_existing_organizer_keeps_role_and_approval(self, exchange, verify):
        organizer = User.objects.create_user(username='organizer', email='organizer@example.test',
                                             role=User.Role.ORGANIZER, is_verified=True, email_verified=True)
        verify.return_value = {'subject': 'google-organizer-sub', 'email': organizer.email,
                               'first_name': '', 'last_name': ''}
        _, state, _ = self.start(flow='organizer')
        response = self.client.get(f'/api/v1/auth/social/google/callback/?state={state}&code=code')
        self.assertIn('flow=organizer', response['Location'])
        self.assertEqual(SocialIdentity.objects.get(provider='google').user_id, organizer.pk)
        organizer.refresh_from_db()
        self.assertTrue(organizer.is_verified)
        self.assertEqual(organizer.role, User.Role.ORGANIZER)

    @patch('apps.accounts.social_views.verified_claims')
    @patch('apps.accounts.social_views.exchange_code', return_value='signed-token')
    def test_staff_email_cannot_be_linked_automatically(self, exchange, verify):
        User.objects.create_superuser(username='staff', email='staff@example.test', password='Secret!123')
        verify.return_value = {'subject': 'google-staff-sub', 'email': 'staff@example.test',
                               'first_name': '', 'last_name': ''}
        _, state, _ = self.start()
        response = self.client.get(f'/api/v1/auth/social/google/callback/?state={state}&code=code')
        self.assertIn('error=failed', response['Location'])
        self.assertFalse(SocialIdentity.objects.exists())

    @patch('apps.accounts.social_views.verified_claims')
    @patch('apps.accounts.social_views.exchange_code', return_value='signed-token')
    def test_apple_form_post_requires_state_otp_and_password(self, exchange, verify):
        verify.return_value = {'subject': 'apple-sub-123', 'email': 'relay@privaterelay.appleid.com',
                               'first_name': '', 'last_name': ''}
        response, state, params = self.start('apple', 'organizer')
        self.assertEqual(params['response_mode'], ['form_post'])
        self.assertEqual(params['nonce'][0] != '', True)
        self.assertEqual(response.cookies['mmemme_oauth_apple']['samesite'], 'None')
        with patch('apps.accounts.email_codes.secrets.randbelow', return_value=12345):
            callback = self.client.post('/api/v1/auth/social/apple/callback/',
                                        {'state': state, 'code': 'apple-code',
                                         'user': '{"name":{"firstName":"Amaka","lastName":"Okoro"}}'})
        self.assertIn('flow=organizer', callback['Location'])
        self.assertIn('verify=1', callback['Location'])
        self.assertFalse(User.objects.exists())
        self.assertEqual(self.client.post('/api/v1/auth/social/verify/', {'otp_code': '012345'}).data['needs_password'], True)
        self.assertFalse(User.objects.exists())
        self.assertEqual(self.client.post('/api/v1/auth/social/password/', {'password': 'StrongPassword1!', 'confirm_password': 'StrongPassword1!'}).status_code, 200)
        user = User.objects.get(email='relay@privaterelay.appleid.com')
        self.assertEqual(user.first_name, 'Amaka')
        self.assertEqual(user.role, User.Role.USER)
        self.assertTrue(user.check_password('StrongPassword1!'))

    @patch('apps.accounts.social_views.verified_claims')
    @patch('apps.accounts.social_views.exchange_code', return_value='signed-token')
    def test_unverified_existing_account_requires_otp_but_keeps_its_password(self, exchange, verify):
        existing = User.objects.create_user(username='unverified', email='person@example.test', password='Original1!')
        verify.return_value = {'subject': 'google-sub-existing', 'email': existing.email,
                               'first_name': '', 'last_name': ''}
        _, state, _ = self.start()
        with patch('apps.accounts.email_codes.secrets.randbelow', return_value=12345):
            self.client.get(f'/api/v1/auth/social/google/callback/?state={state}&code=one-time-code')
        result = self.client.post('/api/v1/auth/social/verify/', {'otp_code': '012345'})
        self.assertEqual(result.status_code, 200, result.data)
        self.assertFalse(result.data['needs_password'])
        existing.refresh_from_db()
        self.assertTrue(existing.email_verified)
        self.assertTrue(existing.check_password('Original1!'))
        self.assertEqual(SocialIdentity.objects.get(subject='google-sub-existing').user_id, existing.pk)
        self.assertFalse(EmailVerificationCode.objects.get(email=existing.email).code_hash)

    def test_disabled_provider_is_reported_without_secrets(self):
        with override_settings(GOOGLE_OAUTH_CLIENT_SECRET='', APPLE_PRIVATE_KEY=''):
            config = self.client.get('/api/v1/auth/social/config/')
            self.assertEqual(config.data, {'google': False, 'apple': False})
            self.assertNotIn('secret', str(config.data))

    def test_signed_identity_token_checks_audience_email_and_apple_nonce(self):
        key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        now = int(time.time())
        base = {'iss': 'https://appleid.apple.com', 'aud': 'com.mmemme.web', 'sub': 'apple-verified-sub',
                'iat': now, 'exp': now + 300, 'email': 'verified@example.test',
                'email_verified': 'true', 'nonce': 'expected-nonce'}
        with patch('apps.accounts.social_auth.jwt.PyJWKClient') as jwks:
            jwks.return_value.get_signing_key_from_jwt.return_value.key = key.public_key()
            token = jwt.encode(base, key, algorithm='RS256', headers={'kid': 'test-key'})
            self.assertEqual(verified_claims('apple', token, 'expected-nonce')['email'], 'verified@example.test')
            with self.assertRaises(SocialAuthError):
                verified_claims('apple', token, 'wrong-nonce')
            for changes in ({'aud': 'another-app'}, {'email_verified': 'false'}, {'exp': now - 1}):
                bad = jwt.encode({**base, **changes}, key, algorithm='RS256', headers={'kid': 'test-key'})
                with self.assertRaises(SocialAuthError):
                    verified_claims('apple', bad, 'expected-nonce')
            google = {**base, 'iss': 'https://accounts.google.com', 'aud': 'google-client.example'}
            signed_google = jwt.encode(google, key, algorithm='RS256', headers={'kid': 'test-key'})
            self.assertEqual(verified_claims('google', signed_google, 'ignored')['subject'], 'apple-verified-sub')
