import io
import json
from unittest.mock import patch
from urllib.error import HTTPError

from django.contrib.auth import get_user_model
from django.core.mail import EmailMessage, EmailMultiAlternatives
from django.test import SimpleTestCase, TestCase, override_settings
from django.utils import timezone

from apps.notifications.backends import EmailDeliveryError, ResendEmailBackend
from apps.notifications.services import deliver_one, notify


@override_settings(RESEND_API_KEY="re_unit_test_only")
class ResendBackendTests(SimpleTestCase):
    def test_https_payload_supports_text_html_and_private_recipient_lists(self):
        message = EmailMultiAlternatives("Test subject", "Plain body", "Mmemme <noreply@example.test>", ["customer@example.test"], cc=["copy@example.test"], bcc=["hidden@example.test"], reply_to=["support@example.test"], headers={"X-Mmemme-Notification-Key":"test-job"})
        message.attach_alternative("<p>HTML body</p>", "text/html")
        with patch("apps.notifications.backends.urlopen", return_value=io.BytesIO(b'{"id":"email-123"}')) as send:
            self.assertEqual(ResendEmailBackend().send_messages([message]), 1)
        request = send.call_args.args[0]
        self.assertEqual(request.full_url, "https://api.resend.com/emails")
        self.assertEqual(request.get_method(), "POST")
        self.assertEqual(request.get_header("Authorization"), "Bearer re_unit_test_only")
        self.assertTrue(request.get_header("Idempotency-key").startswith("mmemme-email-"))
        self.assertEqual(send.call_args.kwargs["timeout"], 15)
        payload = json.loads(request.data)
        self.assertEqual(payload["text"], "Plain body")
        self.assertEqual(payload["html"], "<p>HTML body</p>")
        self.assertEqual(payload["bcc"], ["hidden@example.test"])
        self.assertNotIn("headers", payload)

    def test_rejections_do_not_leak_email_contents_or_credentials(self):
        error = HTTPError("https://api.resend.com/emails", 429, "private response", {}, io.BytesIO(b"re_unit_test_only private email body"))
        with patch("apps.notifications.backends.urlopen", side_effect=error) as send:
            with self.assertRaises(EmailDeliveryError) as raised:
                ResendEmailBackend().send_messages([EmailMessage("Test", "Private body", to=["customer@example.test"])])
        self.assertEqual(str(raised.exception), "Resend rejected email delivery (HTTP 429).")
        self.assertTrue(raised.exception.__suppress_context__)
        self.assertEqual(send.call_count, 1)

    def test_invalid_response_is_not_treated_as_delivery(self):
        with patch("apps.notifications.backends.urlopen", return_value=io.BytesIO(b'{"message":"not accepted"}')):
            self.assertEqual(ResendEmailBackend(fail_silently=True).send_messages([EmailMessage("Test", "Body", to=["customer@example.test"])]), 0)

    def test_missing_key_and_attachments_do_not_make_requests(self):
        message = EmailMessage("Test", "Body", to=["customer@example.test"])
        with patch("apps.notifications.backends.urlopen") as send:
            with override_settings(RESEND_API_KEY=""), self.assertRaises(EmailDeliveryError):
                ResendEmailBackend().send_messages([message])
            message.attach("test.txt", "attachment", "text/plain")
            with self.assertRaises(EmailDeliveryError):
                ResendEmailBackend().send_messages([message])
            send.assert_not_called()


@override_settings(EMAIL_BACKEND="apps.notifications.backends.ResendEmailBackend", RESEND_API_KEY="re_unit_test_only", DEFAULT_FROM_EMAIL="Mmemme <noreply@example.test>")
class ResendQueueTests(TestCase):
    def test_timeout_retries_the_same_email_key_and_preserves_security_link(self):
        user = get_user_model().objects.create_user(username="email-customer", email="customer@example.test")
        job, _ = notify(user, "verification-unique-key", "Verify email", "Private verification URL", private=True)
        responses = [TimeoutError(), io.BytesIO(b'{"id":"email-accepted"}')]
        with patch("apps.notifications.backends.urlopen", side_effect=responses) as send:
            self.assertTrue(deliver_one())
            job.refresh_from_db()
            self.assertIsNone(job.sent_at)
            self.assertEqual(job.body, "Private verification URL")
            job.available_at = timezone.now()
            job.save(update_fields=["available_at"])
            self.assertTrue(deliver_one())
        first, second = [call.args[0] for call in send.call_args_list]
        self.assertEqual(first.data, second.data)
        self.assertEqual(first.get_header("Idempotency-key"), second.get_header("Idempotency-key"))
        job.refresh_from_db()
        self.assertEqual(job.attempts, 2)
        self.assertIsNotNone(job.sent_at)
        self.assertEqual(job.body, "Security email delivered.")

    def test_separate_notifications_use_separate_delivery_keys(self):
        user = get_user_model().objects.create_user(username="email-customer", email="customer@example.test")
        notify(user, "first-key", "Same subject", "Same body")
        notify(user, "second-key", "Same subject", "Same body")
        with patch("apps.notifications.backends.urlopen", side_effect=lambda *a, **k: io.BytesIO(b'{"id":"accepted"}')) as send:
            deliver_one()
            deliver_one()
        first, second = [call.args[0] for call in send.call_args_list]
        self.assertNotEqual(first.get_header("Idempotency-key"), second.get_header("Idempotency-key"))
