from concurrent.futures import ThreadPoolExecutor
from datetime import timedelta
from threading import Barrier
from django.contrib.auth import get_user_model
from django.db import close_old_connections
from django.test import TransactionTestCase, skipUnlessDBFeature
from django.utils import timezone
from apps.events.models import Event, TicketType
from apps.bookings.services import reserve
from apps.common.api import Conflict
from apps.bookings.models import Booking
from apps.bookings.services import cancel,expire
from apps.payments.models import Payment,Refund,LedgerEntry
from apps.payments.services import settle
from apps.tickets.models import Ticket
from django.conf import settings
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

@skipUnlessDBFeature("has_select_for_update")
class InventoryConcurrencyTests(TransactionTestCase):
    def make_payment(self):
        User=get_user_model()
        owner=User.objects.create(username="owner",email="owner@example.com",is_verified=True)
        buyer=User.objects.create(username="buyer",email="buyer@example.com",email_verified=True)
        event=Event.objects.create(organizer=owner,title="Race",slug="race",description="Test",category="Test",venue="Hall",city="Aba",start_datetime=timezone.now()+timedelta(days=1),end_datetime=timezone.now()+timedelta(days=1,hours=1),capacity=2,status="PUBLISHED")
        stock=TicketType.objects.create(event=event,name="General",price=100,quantity=2)
        booking,_=reserve(buyer,"payment-race","EVENT",[{"id":stock.pk,"quantity":1}],{})
        payment=Payment.objects.create(booking=booking,user=buyer,reference="race-reference",idempotency_key="race-reference",provider="PAYSTACK",amount=100,currency="NGN")
        data={"id":345,"status":"success","reference":payment.reference,"amount":10000,"currency":"NGN","metadata":{"booking_id":str(booking.pk)},"customer":{"email":buyer.email}}
        return buyer,stock,booking,payment,data

    def race(self,*operations):
        gate=Barrier(len(operations))
        def attempt(operation):
            close_old_connections()
            try:gate.wait(timeout=10);return operation()
            finally:close_old_connections()
        with ThreadPoolExecutor(max_workers=len(operations)) as executor:
            return list(executor.map(attempt,operations))

    def test_duplicate_callbacks_issue_once(self):
        _,stock,booking,payment,data=self.make_payment()
        self.race(lambda:settle(payment.pk,data),lambda:settle(payment.pk,data))
        stock.refresh_from_db()
        self.assertEqual((stock.quantity_reserved,stock.quantity_sold),(0,1))
        self.assertEqual(Ticket.objects.filter(booking=booking).count(),1)
        self.assertEqual(LedgerEntry.objects.filter(kind="SALE").count(),1)

    def test_payment_and_cancellation_race_release_stock_once(self):
        buyer,stock,booking,payment,data=self.make_payment()
        self.race(lambda:settle(payment.pk,data),lambda:cancel(booking.pk,buyer))
        stock.refresh_from_db();booking.refresh_from_db()
        self.assertEqual((stock.quantity_reserved,stock.quantity_sold),(0,0))
        self.assertEqual(booking.status,"REFUND_PENDING")
        self.assertEqual(Refund.objects.count(),1)
        self.assertFalse(Ticket.objects.filter(status="ACTIVE").exists())

    def test_expiry_and_payment_race_never_confirms_late_payment(self):
        _,stock,booking,payment,data=self.make_payment()
        Booking.objects.filter(pk=booking.pk).update(expires_at=timezone.now()-timedelta(seconds=1))
        self.race(lambda:settle(payment.pk,data),lambda:expire(booking.pk))
        stock.refresh_from_db();booking.refresh_from_db()
        self.assertEqual((stock.quantity_reserved,stock.quantity_sold),(0,0))
        self.assertEqual(booking.status,"REFUND_PENDING")
        self.assertFalse(Ticket.objects.exists())

    def test_simultaneous_identical_requests_reserve_once(self):
        buyer,stock,_,_,_=self.make_payment()
        def book():return reserve(buyer,"same-key-twice","EVENT",[{"id":stock.pk,"quantity":1}],{})[0].pk
        results=self.race(book,book)
        self.assertEqual(results[0],results[1])
        stock.refresh_from_db()
        self.assertEqual(stock.quantity_reserved,2)

    def test_a_refresh_cookie_can_only_be_rotated_once_concurrently(self):
        buyer,_,_,_,_=self.make_payment()
        token=str(RefreshToken.for_user(buyer))
        def refresh():
            client=APIClient()
            client.cookies[settings.REFRESH_COOKIE_NAME]=token
            return client.post("/api/v1/auth/refresh/",{},format="json").status_code
        self.assertEqual(sorted(self.race(refresh,refresh)),[200,401])

    def test_competing_buyers_cannot_oversell(self):
        User=get_user_model()
        owner=User.objects.create(username="owner",email="owner@example.com",is_verified=True)
        buyers=[User.objects.create(username=f"buyer{i}",email=f"buyer{i}@example.com",email_verified=True) for i in range(2)]
        event=Event.objects.create(organizer=owner,title="Last seat",slug="last-seat",description="Test",category="Test",venue="Hall",city="Aba",start_datetime=timezone.now()+timedelta(days=1),end_datetime=timezone.now()+timedelta(days=1,hours=1),capacity=1,status="PUBLISHED")
        stock=TicketType.objects.create(event=event,name="General",price=100,quantity=1)
        gate=Barrier(2)
        def attempt(user):
            close_old_connections()
            try:
                gate.wait(timeout=10)
                reserve(user,"concurrent-request","EVENT",[{"id":stock.pk,"quantity":1}],{})
                return True
            except Conflict:return False
            finally:close_old_connections()
        with ThreadPoolExecutor(max_workers=2) as executor:
            results=list(executor.map(attempt,buyers))
        stock.refresh_from_db()
        self.assertEqual(sorted(results),[False,True])
        self.assertEqual(stock.quantity_reserved,1)
        self.assertEqual(stock.quantity_sold,0)
