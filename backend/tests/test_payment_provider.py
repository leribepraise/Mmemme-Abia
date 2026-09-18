import io
import json
from unittest.mock import patch
from urllib.error import HTTPError, URLError

from django.core.cache import cache
from django.test import SimpleTestCase, override_settings

from apps.common.management.commands.process_jobs import Command
from apps.payments.provider import Paystack, PaystackUnavailable


@override_settings(PAYSTACK_SECRET_KEY="sk_test_transport_fixture_only")
class PaymentProviderTests(SimpleTestCase):
    def test_reads_and_writes_identify_the_application(self):
        def gateway(request, timeout):
            # Reproduce the edge rejection seen with urllib's default identity.
            if request.get_header("User-agent") != "MmemmeAbia/1.0":
                raise HTTPError(request.full_url, 403, "Forbidden", {}, io.BytesIO(b"error code: 1010"))
            self.assertEqual(request.get_header("Accept"), "application/json")
            self.assertEqual(request.get_header("Authorization"), "Bearer sk_test_transport_fixture_only")
            self.assertEqual(timeout, 15)
            if request.get_method() == "POST":
                self.assertEqual(json.loads(request.data), {"amount": 100000})
            return io.BytesIO(b'{"status":true,"data":{"reference":"test-reference"}}')

        for path, payload in [("/transaction/verify/test-reference", None), ("/transaction/initialize", {"amount": 100000})]:
            with self.subTest(path=path), patch("apps.payments.provider.urlopen", side_effect=gateway) as mocked:
                self.assertEqual(Paystack().request(path, payload), {"reference": "test-reference"})
                self.assertEqual(mocked.call_count, 1)

    def test_http_failure_keeps_only_status_and_never_retries_a_write(self):
        raw = b'{"message":"private-provider-details sk_test_transport_fixture_only"}'
        for status in [400, 401, 403, 429, 500]:
            with self.subTest(status=status):
                upstream = HTTPError("https://api.paystack.co/transaction/initialize", status, "private-provider-details", {}, io.BytesIO(raw))
                with patch("apps.payments.provider.urlopen", side_effect=upstream) as mocked:
                    with self.assertRaises(PaystackUnavailable) as raised:
                        Paystack().request("/transaction/initialize", {"amount": 100000})
                self.assertEqual(raised.exception.http_status, status)
                self.assertNotIn("private-provider-details", str(raised.exception))
                self.assertNotIn("sk_test_", str(raised.exception))
                self.assertTrue(raised.exception.__suppress_context__)
                self.assertEqual(mocked.call_count, 1)

    def test_timeout_and_malformed_response_are_not_retried(self):
        for failure in [URLError("private-network-details"), TimeoutError("private-network-details")]:
            with self.subTest(failure=type(failure).__name__), patch("apps.payments.provider.urlopen", side_effect=failure) as mocked:
                with self.assertRaises(PaystackUnavailable) as raised:
                    Paystack().request("/transaction/initialize", {"amount": 100000})
                self.assertIsNone(raised.exception.http_status)
                self.assertNotIn("private-network-details", str(raised.exception))
                self.assertEqual(mocked.call_count, 1)
        for body in [b"not-json", b'{"status":false}', b'[]']:
            with self.subTest(body=body), patch("apps.payments.provider.urlopen", return_value=io.BytesIO(body)) as mocked:
                with self.assertRaises(PaystackUnavailable):
                    Paystack().request("/transaction/verify/test-reference")
                self.assertEqual(mocked.call_count, 1)

    def test_worker_reports_expected_failure_without_traceback_and_continues(self):
        command = Command()
        failure = PaystackUnavailable(http_status=403)
        with patch("apps.common.management.commands.process_jobs.logger") as logger:
            with patch("apps.payments.provider.Paystack.verify", side_effect=failure):
                self.assertIsNone(command.run_job("payment reconciliation", Paystack().verify, "test-reference"))
            logger.warning.assert_called_once_with(
                "Background job deferred: %s (provider HTTP status: %s)", "payment reconciliation", 403
            )
            logger.exception.assert_not_called()
            self.assertTrue(command.run_job("next job", lambda: True))
        self.assertTrue(cache.get("worker:heartbeat"))
        cache.delete("worker:heartbeat")

    def test_worker_still_reports_unexpected_errors(self):
        def broken_job():
            raise RuntimeError("Unexpected application error")

        with patch("apps.common.management.commands.process_jobs.logger") as logger:
            Command().run_job("payment reconciliation", broken_job)
            logger.exception.assert_called_once_with("Background job failed: %s", "payment reconciliation")
            logger.warning.assert_not_called()
        cache.delete("worker:heartbeat")
