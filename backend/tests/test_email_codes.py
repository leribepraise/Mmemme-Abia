from datetime import timedelta
from unittest.mock import patch

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from django.core.cache import cache
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.models import EmailVerificationCode
from apps.notifications.models import Notification
from apps.notifications.services import deliver_one

User = get_user_model()


class EmailCodeTests(TestCase):
    def setUp(self):
        cache.clear()
        self.addCleanup(cache.clear)
        self.client = APIClient()
        self.email = 'new@example.test'
        self.password = 'UniqueS3curePhrase!894'

    def request_code(self, code=12345, email=None):
        with patch('apps.accounts.email_codes.secrets.randbelow', return_value=code):
            return self.client.post('/api/v1/auth/resend-verification/', {'email': email or self.email}, format='json')

    def register(self, **changes):
        return self.client.post('/api/v1/auth/register/', {
            'email': self.email, 'password': self.password, 'otp_code': '012345', **changes,
        }, format='json')

    def allow_resend(self):
        EmailVerificationCode.objects.update(sent_at=timezone.now()-timedelta(seconds=61))

    def test_request_stores_hash_without_creating_account_or_session(self):
        response = self.request_code()
        self.assertEqual(response.status_code, 202)
        self.assertFalse(User.objects.exists())
        self.assertNotIn('access', response.data)
        self.assertNotIn(settings.REFRESH_COOKIE_NAME, response.cookies)
        challenge = EmailVerificationCode.objects.get()
        self.assertNotEqual(challenge.code_hash, '012345')
        self.assertTrue(check_password('012345', challenge.code_hash))
        self.assertIsNone(Notification.objects.get().user_id)
        self.assertNotIn('012345', str(response.data))

    def test_no_code_or_bad_code_cannot_create_account(self):
        for code in ('', '12345', 'abcdef', '1234567', '012345'):
            self.assertEqual(self.register(otp_code=code, email_verified=True).status_code, 400)
        self.assertFalse(User.objects.exists())

    def test_success_consumes_code_and_allows_login(self):
        self.request_code()
        response = self.register()
        self.assertEqual(response.status_code, 201, response.data)
        self.assertNotIn('password', response.data)
        self.assertNotIn('otp_code', response.data)
        self.assertTrue(User.objects.get().email_verified)
        self.assertTrue(User.objects.get().major_event_popup_pending)
        challenge = EmailVerificationCode.objects.get()
        self.assertIsNotNone(challenge.consumed_at)
        self.assertEqual(challenge.code_hash, '')
        self.assertEqual(self.register().status_code, 400)
        self.assertEqual(User.objects.count(), 1)
        response = self.client.post('/api/v1/auth/login/', {'email': self.email, 'password': self.password}, format='json')
        self.assertEqual(response.status_code, 200, response.data)

    def test_code_is_bound_to_normalized_email(self):
        self.request_code(email='NEW@EXAMPLE.TEST')
        self.assertEqual(self.register(email='someoneelse@example.test').status_code, 400)
        self.assertEqual(self.register(email='New@Example.test').status_code, 201)
        self.assertEqual(User.objects.get().email, self.email)

    def test_expiry_prevents_creation_and_delivery(self):
        self.request_code()
        past = timezone.now()-timedelta(seconds=1)
        EmailVerificationCode.objects.update(expires_at=past)
        Notification.objects.update(expires_at=past)
        self.assertEqual(self.register().status_code, 400)
        self.assertFalse(User.objects.exists())
        with patch('apps.notifications.services.EmailMultiAlternatives.send') as send:
            self.assertFalse(deliver_one())
        send.assert_not_called()
        self.assertFalse(Notification.objects.exists())

    def test_wrong_attempts_persist_and_lock_code(self):
        self.request_code()
        for _ in range(5):
            self.assertEqual(self.register(otp_code='999999').status_code, 400)
        self.assertEqual(EmailVerificationCode.objects.get().attempts, 5)
        self.assertEqual(self.register().status_code, 400)
        self.assertFalse(User.objects.exists())

    def test_resend_cooldown_and_replacement(self):
        self.request_code()
        self.assertEqual(self.request_code().status_code, 429)
        self.allow_resend()
        self.assertEqual(self.request_code(code=987654).status_code, 202)
        self.assertEqual(Notification.objects.count(), 1)
        self.assertIn('987654', Notification.objects.get().body)
        self.assertEqual(self.register().status_code, 400)
        self.assertEqual(self.register(otp_code='987654').status_code, 201)

    def test_hourly_limit_applies_across_resends_then_recovers(self):
        for _ in range(5):
            self.assertEqual(self.request_code().status_code, 202)
            self.allow_resend()
        self.assertEqual(self.request_code().status_code, 429)
        EmailVerificationCode.objects.update(window_started_at=timezone.now()-timedelta(hours=1, seconds=1))
        self.assertEqual(self.request_code().status_code, 202)

    def test_weak_password_does_not_consume_code(self):
        self.request_code()
        self.assertEqual(self.register(password='12345678').status_code, 400)
        self.assertIsNone(EmailVerificationCode.objects.get().consumed_at)
        self.assertEqual(self.register().status_code, 201)

    def test_failed_queue_insert_rolls_back_challenge(self):
        from apps.accounts.email_codes import request_email_code
        with patch('apps.accounts.email_codes.Notification.objects.create', side_effect=RuntimeError('queue unavailable')):
            with self.assertRaises(RuntimeError):
                request_email_code(self.email)
        self.assertFalse(EmailVerificationCode.objects.exists())
        self.assertFalse(User.objects.exists())

    def test_unverified_account_blocked_for_login_refresh_and_existing_jwt(self):
        user = User.objects.create_user(username='legacy', email=self.email, password=self.password)
        refresh = RefreshToken.for_user(user)
        response = self.client.post('/api/v1/auth/login/', {'email': self.email, 'password': self.password}, format='json')
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data['error']['code'], 'email_not_verified')
        self.client.cookies[settings.REFRESH_COOKIE_NAME] = str(refresh)
        self.assertEqual(self.client.post('/api/v1/auth/refresh/').status_code, 401)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + str(refresh.access_token))
        self.assertEqual(self.client.get('/api/v1/auth/me/').status_code, 401)
        self.assertEqual(self.request_code().status_code, 202)
        response = self.client.post('/api/v1/auth/verify-email/', {'email': self.email, 'otp_code': '012345'}, format='json')
        self.assertEqual(response.status_code, 200, response.data)
        user.refresh_from_db()
        self.assertTrue(user.email_verified)
        self.assertEqual(User.objects.count(), 1)
        response = self.client.post('/api/v1/auth/login/', {'email': self.email, 'password': self.password}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.request_code().status_code, 400)

    def test_verify_endpoint_does_not_create_a_user(self):
        self.request_code()
        response = self.client.post('/api/v1/auth/verify-email/', {'email': self.email, 'otp_code': '012345'}, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertFalse(User.objects.exists())
        self.assertEqual(self.register().status_code, 201)

    def test_otp_writes_require_csrf(self):
        client = APIClient(enforce_csrf_checks=True)
        for path in ('resend-verification', 'verify-email', 'register'):
            self.assertEqual(client.post(f'/api/v1/auth/{path}/', {'email': self.email}, format='json').status_code, 403)
        csrf = client.get('/api/v1/auth/csrf/').data['csrf_token']
        self.assertEqual(client.post('/api/v1/auth/resend-verification/', {'email': self.email}, format='json', HTTP_X_CSRFTOKEN=csrf).status_code, 202)

    def test_invalid_birth_dates_rejected_on_registration_and_profile(self):
        self.request_code()
        tomorrow = str(timezone.localdate()+timedelta(days=1))
        for date in (tomorrow, '2025-02-29', '2000-02-30', '0000-01-01', 'not-a-date'):
            response = self.register(date_of_birth=date)
            self.assertEqual(response.status_code, 400, response.data)
            self.assertIn('date_of_birth', response.data['error'])
        self.assertFalse(User.objects.exists())
        self.assertEqual(self.register(date_of_birth='2000-02-29').status_code, 201)
        user = User.objects.get()
        self.client.force_authenticate(user)
        for date in (tomorrow, '2025-02-29'):
            self.assertEqual(self.client.patch('/api/v1/auth/me/', {'date_of_birth': date}, format='json').status_code, 400)
        self.assertEqual(self.client.patch('/api/v1/auth/me/', {'date_of_birth': str(timezone.localdate())}, format='json').status_code, 200)
