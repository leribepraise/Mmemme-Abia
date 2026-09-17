from datetime import timedelta
from decimal import Decimal
from unittest.mock import patch
from django.core.cache import cache
from django.test import override_settings
from django.utils import timezone
from rest_framework.test import APIClient
from apps.bookings.models import Booking
from apps.bookings.services import cancel, fulfill
from apps.common.api import Conflict
from apps.hotels.models import Hotel, RoomType, RoomNight
from apps.notifications.models import Notification
from apps.notifications.services import notify, deliver_one
from apps.payments.models import Refund
from apps.payments.models import LedgerEntry
from apps.payments.services import settle, initialize, apply_refund
from apps.tickets.models import Ticket
from apps.tourism.models import TourismExperience, TourPackage, TourDeparture
from .test_workflows import Fixture

class RegressionTests(Fixture):
    def test_fractional_prices_are_exact(self):
        self.stock.price=Decimal("0.10");self.stock.save()
        booking=self.reserve(quantity=3)
        self.assertEqual(booking.total_amount,Decimal("0.30"))
        self.assertEqual(booking.items.get().subtotal,Decimal("0.30"))

    def test_payment_after_event_starts_is_refunded(self):
        booking=self.reserve();payment=self.payment(booking)
        self.event.start_datetime=timezone.now()-timedelta(seconds=1);self.event.save()
        settle(payment.pk,self.verified(payment))
        booking.refresh_from_db();self.stock.refresh_from_db()
        self.assertEqual(booking.status,"REFUND_PENDING")
        self.assertEqual(self.stock.quantity_reserved,0)
        self.assertEqual(Ticket.objects.count(),0)
        self.assertEqual(Refund.objects.count(),1)
        refund=Refund.objects.get()
        apply_refund(refund.pk,{"id":987,"transaction":12345,"amount":int(payment.amount*100),"currency":"NGN","status":"processed"})
        self.assertEqual(LedgerEntry.objects.get(kind="REFUND").provider_amount,0)

    def test_disabled_provider_cannot_receive_confirmation(self):
        booking=self.reserve();payment=self.payment(booking)
        self.owner.is_active=False;self.owner.save()
        settle(payment.pk,self.verified(payment))
        booking.refresh_from_db()
        self.assertEqual(booking.status,"REFUND_PENDING")

    def test_provider_decline_is_owned_and_refunds(self):
        booking=self.reserve();payment=self.payment(booking)
        settle(payment.pk,self.verified(payment))
        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.post(f"/api/v1/bookings/{booking.pk}/decline/",{}).status_code,404)
        self.client.force_authenticate(self.owner)
        response=self.client.post(f"/api/v1/bookings/{booking.pk}/decline/",{})
        self.assertEqual(response.status_code,200,response.data)
        self.assertEqual(response.data["status"],"REFUND_PENDING")

    def test_completed_bookings_cannot_be_force_cancelled(self):
        booking=self.reserve();payment=self.payment(booking);settle(payment.pk,self.verified(payment))
        Booking.objects.filter(pk=booking.pk).update(fulfillment_status="COMPLETED")
        with self.assertRaises(Conflict):cancel(booking.pk,self.owner,force=True)

    def test_bulk_room_availability_preserves_existing_and_blocks_other_provider(self):
        hotel=Hotel.objects.create(owner=self.owner,name="Hotel",city="Aba",address="Aba")
        room=RoomType.objects.create(hotel=hotel,name="Double")
        start=timezone.localdate()+timedelta(days=1)
        body={"room_type":str(room.pk),"date_from":str(start),"date_to":str(start+timedelta(days=3)),"price":"15000.00","quantity":2}
        self.client.force_authenticate(self.owner)
        response=self.client.post("/api/v1/room-nights/availability/",body,format="json")
        self.assertEqual(response.status_code,201,response.data)
        self.assertEqual(response.data["created"],3)
        body["price"]="30000.00"
        repeat=self.client.post("/api/v1/room-nights/availability/",body,format="json")
        self.assertEqual(repeat.data["existing"],3)
        self.assertEqual(RoomNight.objects.first().price,15000)
        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.post("/api/v1/room-nights/availability/",body,format="json").status_code,403)

    def test_tour_departure_has_own_capacity_and_server_price(self):
        experience=TourismExperience.objects.create(name="Abia tour",description="Guided visit",category="ACTIVITY",location_name="Aba",created_by=self.owner)
        package=TourPackage.objects.create(experience=experience,name="Guided",price=999)
        departure=TourDeparture.objects.create(package=package,starts_at=timezone.now()+timedelta(days=2),ends_at=timezone.now()+timedelta(days=2,hours=3),price=7000,quantity=2)
        booking=self.reserve(kind="TOURISM",entries=[{"id":departure.pk,"quantity":2}])
        self.assertEqual(booking.total_amount,14000)
        payment=self.payment(booking);settle(payment.pk,self.verified(payment))
        self.assertFalse(Ticket.objects.filter(booking=booking).exists())
        with self.assertRaises(Conflict):fulfill(booking.pk,self.owner,"IN_PROGRESS")

    @patch("apps.notifications.services.send_mail",side_effect=OSError("SMTP down"))
    def test_email_failure_is_retried_and_private_content_is_not_public(self,mocked):
        job,_=notify(self.buyer,"security-test","Reset password","secret-token",private=True)
        self.assertTrue(deliver_one())
        job.refresh_from_db()
        self.assertEqual(job.attempts,1);self.assertIsNone(job.sent_at);self.assertFalse(job.failed)
        self.assertGreater(job.available_at,timezone.now())
        self.assertEqual(self.client.get("/api/v1/notifications/").data["count"],0)

    @override_settings(REQUIRE_WORKER_HEARTBEAT=True)
    def test_readiness_requires_worker_when_enabled(self):
        cache.delete("worker:heartbeat")
        self.assertEqual(APIClient().get("/health/ready/").status_code,503)
        cache.set("worker:heartbeat",True,30)
        self.assertEqual(APIClient().get("/health/ready/").status_code,200)
        cache.delete("worker:heartbeat")

    @patch("apps.payments.services.Paystack.initialize")
    def test_checkout_retry_reuses_one_payment(self,mocked):
        mocked.side_effect=lambda payment:{"reference":payment.reference,"authorization_url":"https://checkout.paystack.com/example"}
        booking=self.reserve()
        first=initialize(booking.pk,self.buyer);second=initialize(booking.pk,self.buyer)
        self.assertEqual(first.pk,second.pk)
        self.assertEqual(mocked.call_count,1)
