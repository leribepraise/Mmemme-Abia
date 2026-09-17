import hashlib
import hmac
import json
from datetime import timedelta
from decimal import Decimal
from unittest.mock import patch
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.db import IntegrityError, transaction
from django.test import override_settings
from django.utils import timezone
from rest_framework.exceptions import PermissionDenied
from rest_framework.test import APIClient
from apps.bookings.models import Booking
from apps.bookings.services import fulfill
from apps.common.api import Conflict, ServiceUnavailable
from apps.payments.models import Payout, PayoutAccount, PayoutItem, PayoutAttempt, PaymentEvent, Refund
from apps.payments import payouts
from apps.payments.services import settle, process_event
from .test_workflows import Fixture


@override_settings(PAYSTACK_TRANSFERS_ENABLED=True, PAYOUT_HOLD_DAYS=7, PLATFORM_COMMISSION_BPS=500)
class PayoutTests(Fixture):
    def setUp(self):
        super().setUp()
        cache.clear()
        self.staff = get_user_model().objects.create_user(username="finance",email="finance@example.test",is_staff=True,is_superuser=True)
        self.account = PayoutAccount.objects.create(provider=self.owner,recipient_code="RCP_test",recipient_id="123",bank_code="058",bank_name="Test Bank",account_name="Test Provider",account_last4="6789",status="APPROVED")
        self.booking = self.reserve()
        self.charge = self.payment(self.booking)
        settle(self.charge.pk,self.verified(self.charge))
        Booking.objects.filter(pk=self.booking.pk).update(fulfillment_status="COMPLETED",completed_at=timezone.now()-timedelta(days=8))

    def requested(self):
        return payouts.request_payout(self.owner,"payout-request-001")[0]

    def approved(self):
        return payouts.approve(self.requested().pk,self.staff,"Verified delivered service and reconciled funds")

    def transfer_data(self,payout,status="success",**changes):
        attempt=payout.attempts.first()
        return {"reference":attempt.reference,"amount":int(payout.amount*100),"currency":"NGN",
                "recipient":{"id":123,"recipient_code":"RCP_test"},"transfer_code":"TRF_"+str(attempt.pk),"status":status,**changes}

    def sent(self,status="success"):
        payout=self.approved()
        with patch("apps.payments.payouts.Paystack.transfer"), patch("apps.payments.payouts.Paystack.verify_transfer",side_effect=lambda ref:self.transfer_data(payout,status)):
            payouts.submit(payout.pk)
        payout.refresh_from_db()
        return payout

    def test_request_is_idempotent_and_server_prices_net_earnings(self):
        self.client.force_authenticate(self.owner)
        response=self.client.post("/api/v1/payouts/",{"amount":"1","provider":self.other.pk},format="json",HTTP_IDEMPOTENCY_KEY="payout-api-001")
        self.assertEqual(response.status_code,201,response.data)
        self.assertEqual(Decimal(response.data["amount"]),Decimal("1900"))
        second=self.client.post("/api/v1/payouts/",{},format="json",HTTP_IDEMPOTENCY_KEY="payout-api-001")
        self.assertEqual(second.status_code,200)
        self.assertEqual(Payout.objects.count(),1)
        with self.assertRaises(Conflict):payouts.request_payout(self.owner,"different-request")
        self.assertEqual(payouts.balance(self.owner)["payouts_reserved"],1900)

    def test_earnings_require_completion_hold_success_and_no_refund(self):
        for changes in [{"completed_at":None},{"completed_at":timezone.now()},{"status":"REFUND_PENDING"},{"fulfillment_status":"NEW"}]:
            with self.subTest(changes=changes):
                Booking.objects.filter(pk=self.booking.pk).update(status="CONFIRMED",fulfillment_status="COMPLETED",completed_at=timezone.now()-timedelta(days=8))
                Booking.objects.filter(pk=self.booking.pk).update(**changes)
                self.assertEqual(payouts.eligible_sales(self.owner).count(),0)
        Booking.objects.filter(pk=self.booking.pk).update(status="CONFIRMED",fulfillment_status="COMPLETED",completed_at=timezone.now()-timedelta(days=8))
        Refund.objects.create(payment=self.charge,amount=2000,reason="Support review")
        self.assertFalse(payouts.eligible_sales(self.owner).exists())

    def test_bank_account_approval_is_required(self):
        self.account.status="PENDING";self.account.save()
        with self.assertRaises(Conflict):self.requested()

    def test_verified_bank_details_are_masked_and_replacement_needs_review(self):
        recipient={"id":456,"recipient_code":"RCP_new","active":True,"currency":"NGN","details":{"account_number":"0123456789","bank_code":"058"}}
        self.client.force_authenticate(self.owner)
        with patch("apps.payments.payouts.bank_list",return_value=[{"code":"058","name":"Test Bank"}]), patch("apps.payments.payouts.Paystack.resolve_account",return_value={"account_number":"0123456789","account_name":"VERIFIED NAME"}),patch("apps.payments.payouts.Paystack.create_recipient",return_value=recipient):
            response=self.client.post("/api/v1/payout-accounts/",{"bank_code":"058","account_number":"0123456789"},format="json")
        self.assertEqual(response.status_code,201,response.data)
        self.assertEqual(response.data["status"],"PENDING")
        self.assertEqual(response.data["account_name"],"VERIFIED NAME")
        self.assertEqual(response.data["account_last4"],"6789")
        self.assertNotIn("0123456789",json.dumps(response.data))
        self.assertNotIn("recipient_code",response.data)
        self.account.refresh_from_db();self.assertFalse(self.account.is_current)
        self.assertFalse(any(f.name=="account_number" for f in PayoutAccount._meta.fields))

    def test_bank_mismatch_never_replaces_existing_account(self):
        with patch("apps.payments.payouts.bank_list",return_value=[{"code":"058","name":"Test Bank"}]),patch("apps.payments.payouts.Paystack.resolve_account",return_value={"account_number":"9999999999","account_name":"WRONG"}):
            with self.assertRaises(ServiceUnavailable):payouts.register_account(self.owner,"0123456789","058")
        self.account.refresh_from_db();self.assertTrue(self.account.is_current)

    def test_bank_change_is_blocked_during_outstanding_payout(self):
        self.requested()
        with patch("apps.payments.payouts.Paystack.resolve_account") as resolve:
            with self.assertRaises(Conflict):payouts.register_account(self.owner,"0123456789","058")
        resolve.assert_not_called()

    def test_private_access_and_finance_permissions(self):
        payout=self.requested()
        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.get(f"/api/v1/payouts/{payout.pk}/").status_code,404)
        self.assertEqual(self.client.get("/api/v1/payouts/queue/").status_code,403)
        self.assertEqual(self.client.get("/api/v1/payout-accounts/queue/").status_code,403)
        self.assertEqual(self.client.post(f"/api/v1/payouts/{payout.pk}/approve/",{"note":"Approve"}).status_code,403)
        self.other.is_staff=True;self.other.save()
        with self.assertRaises(PermissionDenied):payouts.approve(payout.pk,self.other,"Unprivileged staff")
        self.owner.is_staff=True;self.owner.is_superuser=True;self.owner.save()
        with self.assertRaises(PermissionDenied):payouts.approve(payout.pk,self.owner,"Approve own funds")
        with self.assertRaises(PermissionDenied):payouts.review_account(self.account.pk,self.owner,"APPROVED","Own bank account")

    def test_database_prevents_duplicate_earnings_allocation(self):
        payout=self.requested();item=payout.items.get()
        with self.assertRaises(IntegrityError),transaction.atomic():
            PayoutItem.objects.create(payout=payout,sale=item.sale,amount=item.amount)

    def test_success_verified_once_and_repeat_submission_is_noop(self):
        payout=self.sent()
        self.assertEqual(payout.status,"PAID")
        self.assertEqual(payouts.balance(self.owner)["paid_out"],1900)
        self.assertEqual(payouts.balance(self.owner)["payouts_reserved"],0)
        with patch("apps.payments.payouts.Paystack.transfer") as transfer:
            payouts.submit(payout.pk)
        transfer.assert_not_called()
        self.assertEqual(payout.attempts.count(),1)

    def test_timeout_cannot_send_again_or_release_earnings(self):
        payout=self.approved()
        with patch("apps.payments.payouts.Paystack.transfer",side_effect=ServiceUnavailable()) as transfer:
            payouts.submit(payout.pk);payouts.submit(payout.pk)
        self.assertEqual(transfer.call_count,1)
        payout.refresh_from_db();self.assertEqual(payout.status,"UNKNOWN")
        with self.assertRaises(Conflict):payouts.retry(payout.pk,self.staff,"Uncertain outcome")
        with self.assertRaises(Conflict):payouts.cancel(payout.pk,self.staff,"Uncertain outcome")
        with patch("apps.payments.payouts.Paystack.verify_transfer",return_value=self.transfer_data(payout)):
            payouts.reconcile(payout.attempts.get().pk)
        payout.refresh_from_db();self.assertEqual(payout.status,"PAID")

    def test_unverifiable_initiation_is_not_marked_paid(self):
        payout=self.approved()
        with patch("apps.payments.payouts.Paystack.transfer",return_value={"status":"success"}),patch("apps.payments.payouts.Paystack.verify_transfer",side_effect=ServiceUnavailable()):
            payouts.submit(payout.pk)
        payout.refresh_from_db();self.assertEqual(payout.status,"UNKNOWN")

    def test_mismatched_recipient_requires_review(self):
        payout=self.approved()
        with patch("apps.payments.payouts.Paystack.transfer"),patch("apps.payments.payouts.Paystack.verify_transfer",side_effect=lambda ref:self.transfer_data(payout,recipient={"id":999,"recipient_code":"RCP_other"})):
            payouts.submit(payout.pk)
        payout.refresh_from_db();self.assertEqual(payout.status,"REVIEW")
        self.assertEqual(payouts.balance(self.owner)["paid_out"],0)

    def test_suspended_bank_blocks_approved_transfer(self):
        payout=self.approved()
        payouts.review_account(self.account.pk,self.staff,"SUSPENDED","Dispute investigation")
        with patch("apps.payments.payouts.Paystack.transfer") as transfer:payouts.submit(payout.pk)
        transfer.assert_not_called()
        payout.refresh_from_db();self.assertEqual(payout.status,"REVIEW")

    @override_settings(PAYSTACK_TRANSFERS_ENABLED=False)
    def test_transfers_disabled_prevents_outgoing_calls(self):
        payout=self.approved()
        with patch("apps.payments.payouts.Paystack.transfer") as transfer:payouts.submit(payout.pk)
        transfer.assert_not_called()
        self.assertEqual(PayoutAttempt.objects.count(),0)

    def test_retry_requires_fresh_provider_confirmation_and_new_attempt(self):
        payout=self.sent("failed")
        with patch("apps.payments.payouts.Paystack.verify_transfer",side_effect=ServiceUnavailable()):
            with self.assertRaises(Conflict):payouts.retry(payout.pk,self.staff,"Retry after failure")
        old=payout.attempts.get()
        with patch("apps.payments.payouts.Paystack.verify_transfer",return_value=self.transfer_data(payout,"failed")):
            payouts.retry(payout.pk,self.staff,"Provider confirmed failed transfer")
            payouts.reconcile(old.pk)  # A replay must not remove retry approval.
        payout.refresh_from_db();self.assertEqual(payout.status,"APPROVED")
        with patch("apps.payments.payouts.Paystack.transfer"),patch("apps.payments.payouts.Paystack.verify_transfer",side_effect=lambda ref:self.transfer_data(payout)):
            payouts.submit(payout.pk)
        payout.refresh_from_db();self.assertEqual(payout.status,"PAID")
        self.assertEqual(payout.attempts.count(),2)
        self.assertNotEqual(payout.attempts.first().reference,old.reference)
        self.assertEqual(payouts.balance(self.owner)["paid_out"],1900)

    def test_reversal_reopens_liability_without_freeing_allocation(self):
        payout=self.sent()
        with patch("apps.payments.payouts.Paystack.verify_transfer",return_value=self.transfer_data(payout,"reversed")):
            payouts.reconcile(payout.attempts.get().pk)
        payout.refresh_from_db();self.assertEqual(payout.status,"REVERSED")
        self.assertEqual(payouts.balance(self.owner)["paid_out"],0)
        self.assertEqual(payouts.balance(self.owner)["payouts_reserved"],1900)
        self.assertFalse(payouts.eligible_sales(self.owner).exists())

    def test_cancel_unsent_request_preserves_history_and_releases_earnings(self):
        payout=self.requested()
        payouts.cancel(payout.pk,self.staff,"Bank details need correction")
        payout.refresh_from_db();self.assertEqual(payout.status,"CANCELLED")
        self.assertFalse(payout.items.get().active)
        self.assertEqual(payouts.balance(self.owner)["available_for_payout"],1900)

    @override_settings(PAYSTACK_SECRET_KEY="test-paystack-secret")
    def test_signed_transfer_webhook_is_durable_deduplicated_and_verified(self):
        payout=self.sent("pending");attempt=payout.attempts.get()
        raw=json.dumps({"event":"transfer.success","data":{"reference":attempt.reference,"id":123}}).encode()
        signature=hmac.new(settings.PAYSTACK_SECRET_KEY.encode(),raw,hashlib.sha512).hexdigest()
        client=APIClient()
        for _ in range(2):
            self.assertEqual(client.post("/api/v1/payments/webhook/paystack/",raw,content_type="application/json",HTTP_X_PAYSTACK_SIGNATURE=signature).status_code,200)
        self.assertEqual(PaymentEvent.objects.count(),1)
        with patch("apps.payments.payouts.Paystack.verify_transfer",return_value=self.transfer_data(payout)) as verify:
            process_event(PaymentEvent.objects.get().pk)
        verify.assert_called_once_with(attempt.reference)
        payout.refresh_from_db();self.assertEqual(payout.status,"PAID")

    def test_otp_submission_uses_existing_transfer_and_keeps_code_out_of_records(self):
        payout=self.sent("otp");attempt=payout.attempts.get()
        with patch("apps.payments.payouts.Paystack.finalize_transfer") as finish,patch("apps.payments.payouts.Paystack.verify_transfer",return_value=self.transfer_data(payout)):
            payouts.finalize(payout.pk,self.staff,"928783")
        finish.assert_called_once_with(attempt.transfer_code,"928783")
        payout.refresh_from_db();self.assertEqual(payout.status,"PAID")
        self.assertEqual(payout.attempts.count(),1)
        from apps.common.models import AuditLog
        self.assertNotIn("928783",str(list(AuditLog.objects.values())))
    
    @override_settings(PAYSTACK_SECRET_KEY="test-paystack-secret")
    def test_transfer_webhook_retries_when_verification_is_unavailable(self):
        payout=self.sent("pending")
        event=PaymentEvent.objects.create(digest="d"*64,event_type="transfer.success",reference=payout.attempts.get().reference)
        with patch("apps.payments.payouts.Paystack.verify_transfer",side_effect=ServiceUnavailable()):process_event(event.pk)
        event.refresh_from_db()
        self.assertIsNone(event.processed_at)
        self.assertEqual(event.last_error,"provider_unavailable")

    def test_event_cannot_complete_early_and_completion_records_timestamp(self):
        Booking.objects.filter(pk=self.booking.pk).update(fulfillment_status="IN_PROGRESS",completed_at=None)
        with self.assertRaises(Conflict):fulfill(self.booking.pk,self.owner,"COMPLETED")
        self.event.start_datetime=timezone.now()-timedelta(hours=2)
        self.event.end_datetime=timezone.now()-timedelta(hours=1);self.event.save()
        completed=fulfill(self.booking.pk,self.owner,"COMPLETED")
        self.assertIsNotNone(completed.completed_at)
