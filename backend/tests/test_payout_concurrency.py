from concurrent.futures import ThreadPoolExecutor
from datetime import timedelta
from threading import Barrier
from unittest.mock import patch
from django.contrib.auth import get_user_model
from django.db import close_old_connections
from django.test import TransactionTestCase, override_settings, skipUnlessDBFeature
from django.utils import timezone
from apps.bookings.models import Booking
from apps.payments.models import Payment, LedgerEntry, PayoutAccount, Payout, PayoutItem, PayoutAttempt
from apps.payments import payouts
from apps.common.api import Conflict


@skipUnlessDBFeature("has_select_for_update")
@override_settings(PAYSTACK_TRANSFERS_ENABLED=True)
class PayoutConcurrencyTests(TransactionTestCase):
    def setUp(self):
        User=get_user_model()
        self.owner=User.objects.create(username="provider",email="provider@example.test",is_verified=True,email_verified=True)
        buyer=User.objects.create(username="buyer",email="buyer@example.test")
        self.staff=User.objects.create(username="finance",email="finance@example.test",is_staff=True,is_superuser=True)
        booking=Booking.objects.create(user=buyer,supplier=self.owner,kind="FOOD",booking_reference="PAYOUT-RACE",status="CONFIRMED",fulfillment_status="COMPLETED",completed_at=timezone.now()-timedelta(days=8),total_amount=1000)
        payment=Payment.objects.create(booking=booking,user=buyer,reference="payment-race",idempotency_key="payment-race",provider="PAYSTACK",amount=1000,status="SUCCESS")
        LedgerEntry.objects.create(booking=booking,payment=payment,kind="SALE",gross=1000,platform_fee=50,provider_amount=950)
        PayoutAccount.objects.create(provider=self.owner,recipient_code="RCP_test",recipient_id="123",bank_code="058",bank_name="Test Bank",account_name="Provider",account_last4="6789",status="APPROVED")

    def race(self,*operations):
        gate=Barrier(len(operations))
        def attempt(operation):
            close_old_connections()
            try:
                gate.wait(timeout=10)
                try:return operation()
                except Conflict:return "conflict"
            finally:close_old_connections()
        with ThreadPoolExecutor(max_workers=len(operations)) as executor:
            return list(executor.map(attempt,operations))

    def verified(self,reference):
        attempt=PayoutAttempt.objects.get(reference=reference)
        return {"status":"success","reference":reference,"amount":95000,"currency":"NGN","recipient":123,"transfer_code":"TRF_"+str(attempt.pk)}

    def approved(self):
        payout=payouts.request_payout(self.owner,"request-001")[0]
        return payouts.approve(payout.pk,self.staff,"Finance review complete")

    def test_concurrent_same_key_returns_one_payout(self):
        results=self.race(lambda:payouts.request_payout(self.owner,"request-001"),lambda:payouts.request_payout(self.owner,"request-001"))
        self.assertEqual(sum(created for _,created in results),1)
        self.assertEqual(Payout.objects.count(),1)
        self.assertEqual(PayoutItem.objects.filter(active=True).count(),1)

    def test_different_keys_cannot_allocate_same_sale_twice(self):
        results=self.race(lambda:payouts.request_payout(self.owner,"request-001"),lambda:payouts.request_payout(self.owner,"request-002"))
        self.assertEqual(results.count("conflict"),1)
        self.assertEqual(Payout.objects.count(),1)

    def test_two_workers_send_one_transfer(self):
        payout=self.approved()
        with patch("apps.payments.payouts.Paystack.transfer") as transfer,patch("apps.payments.payouts.Paystack.verify_transfer",side_effect=self.verified):
            self.race(lambda:payouts.submit(payout.pk),lambda:payouts.submit(payout.pk))
        self.assertEqual(transfer.call_count,1)
        self.assertEqual(PayoutAttempt.objects.count(),1)
        payout.refresh_from_db();self.assertEqual(payout.status,"PAID")

    def test_cancel_and_submit_never_release_paid_earnings(self):
        payout=self.approved()
        with patch("apps.payments.payouts.Paystack.transfer") as transfer,patch("apps.payments.payouts.Paystack.verify_transfer",side_effect=self.verified):
            self.race(lambda:payouts.submit(payout.pk),lambda:payouts.cancel(payout.pk,self.staff,"Cancel before release"))
        payout.refresh_from_db()
        self.assertIn(payout.status,{"PAID","CANCELLED"})
        self.assertEqual(transfer.call_count,1 if payout.status=="PAID" else 0)
        self.assertEqual(payout.items.get().active,payout.status=="PAID")
