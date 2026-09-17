import io
import time
from contextlib import redirect_stdout
from unittest.mock import patch
from urllib.parse import parse_qs, urlsplit

from django.contrib.auth import get_user_model
from django.core import signing
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from apps.notifications.models import Notification
from apps.notifications.services import deliver_one


@override_settings(
    EMAIL_BACKEND="apps.common.mail.DevelopmentConsoleEmailBackend",
    FRONTEND_URL="http://localhost:5173",
)
class SecurityEmailTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def deliver_link(self):
        job = Notification.objects.get()
        expected_url = job.body.splitlines()[-1]
        output = io.StringIO()
        with redirect_stdout(output):
            self.assertTrue(deliver_one())
        # Copy exactly one line from the console, as a developer would.
        urls = [line for line in output.getvalue().splitlines() if line.startswith("http://")]
        self.assertEqual(urls, [expected_url])
        self.assertGreater(len(urls[0]), 78)
        self.assertNotIn("token=3D", urls[0])
        job.refresh_from_db()
        self.assertIsNotNone(job.sent_at)
        self.assertEqual(job.body, "Security email delivered.")
        return {key: values[0] for key, values in parse_qs(urlsplit(urls[0]).query).items()}

    def test_registration_console_link_verifies_the_account(self):
        response = self.client.post("/api/v1/auth/register/", {
            "email": "new-customer@example.test",
            "password": "UniqueS3curePhrase!894",
        }, format="json")
        self.assertEqual(response.status_code, 201, response.data)
        user = get_user_model().objects.get(email="new-customer@example.test")
        self.assertFalse(user.email_verified)

        response = self.client.post("/api/v1/auth/verify-email/", self.deliver_link(), format="json")
        self.assertEqual(response.status_code, 200, response.data)
        user.refresh_from_db()
        self.assertTrue(user.email_verified)

    def test_password_reset_console_link_is_usable_and_single_use(self):
        user = get_user_model().objects.create_user(
            username="customer", email="customer@example.test", password="OriginalPhrase!379"
        )
        response = self.client.post("/api/v1/auth/password-reset/", {"email": user.email}, format="json")
        self.assertEqual(response.status_code, 200, response.data)
        payload = {**self.deliver_link(), "password": "ReplacementPhrase!824"}
        response = self.client.post("/api/v1/auth/password-reset/confirm/", payload, format="json")
        self.assertEqual(response.status_code, 200, response.data)
        user.refresh_from_db()
        self.assertTrue(user.check_password(payload["password"]))
        response = self.client.post("/api/v1/auth/password-reset/confirm/", payload, format="json")
        self.assertEqual(response.status_code, 400)

    def test_modified_and_expired_verification_links_still_fail(self):
        user = get_user_model().objects.create_user(username="customer", email="customer@example.test")
        data = {"user": user.pk, "email": user.email}
        token = signing.dumps(data, salt="verify-email")
        with patch("django.core.signing.time.time", return_value=time.time() - 86401):
            expired = signing.dumps(data, salt="verify-email")
        for invalid in ("3D" + token, token[:-1], expired):
            with self.subTest(token_type="expired" if invalid == expired else "modified"):
                response = self.client.post("/api/v1/auth/verify-email/", {"token": invalid}, format="json")
                self.assertEqual(response.status_code, 400)
                user.refresh_from_db()
                self.assertFalse(user.email_verified)
