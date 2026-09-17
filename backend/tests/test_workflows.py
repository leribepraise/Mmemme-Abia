import hashlib
import hmac
import json
from datetime import timedelta
from decimal import Decimal
from unittest.mock import patch
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.test import TestCase, override_settings
from django.utils import timezone
from rest_framework.test import APIClient
from apps.bookings.models import Booking
from apps.bookings.services import reserve, cancel, expire, fulfill
from apps.common.api import Conflict, ServiceUnavailable
from apps.events.models import Event, TicketType
from apps.hotels.models import Hotel, RoomType, RoomNight
from apps.restaurants.models import Restaurant, MenuItem
from apps.transport.models import Route, Departure
from apps.payments.models import Payment, PaymentEvent, Refund, LedgerEntry
from apps.payments.services import initialize,settle,submit_refund,apply_refund
from apps.tickets.models import Ticket
from apps.tickets.services import check_in

User=get_user_model()

class Fixture(TestCase):
    def setUp(self):
        self.owner=User.objects.create_user(username="provider",email="provider@example.com",password="NotAPassword123!",role="ORGANIZER",is_verified=True,email_verified=True)
        self.buyer=User.objects.create_user(username="buyer",email="buyer@example.com",password="NotAPassword123!",email_verified=True)
        self.other=User.objects.create_user(username="other",email="other@example.com",password="NotAPassword123!",email_verified=True)
        self.event=Event.objects.create(organizer=self.owner,title="Music night",slug="music-night",description="Live music",category="Music",venue="Town hall",city="Aba",start_datetime=timezone.now()+timedelta(days=5),end_datetime=timezone.now()+timedelta(days=5,hours=3),capacity=10,status="PUBLISHED")
        self.stock=TicketType.objects.create(event=self.event,name="General",price="1000.00",quantity=10)
        self.client=APIClient()
        self.client.force_authenticate(self.buyer)
    def reserve(self,key="request-0001",quantity=2,kind="EVENT",entries=None,details=None,user=None):
        return reserve(user or self.buyer,key,kind,entries or [{"id":self.stock.pk,"quantity":quantity}],details or {},customer_name="Customer",customer_phone="+2348000000000")[0]
    def payment(self,booking):
        return Payment.objects.create(booking=booking,user=booking.user,reference="PAY-"+str(booking.pk),idempotency_key="booking:"+str(booking.pk),provider="PAYSTACK",amount=booking.total_amount,currency="NGN")
    def verified(self,payment,**changes):
        return {"id":12345,"reference":payment.reference,"status":"success","amount":int(payment.amount*100),"currency":"NGN","metadata":{"booking_id":str(payment.booking_id)},"customer":{"email":payment.user.email},**changes}

class AccountTests(Fixture):
    def test_common_numeric_password_rejected(self):
        client=APIClient()
        response=client.post("/api/v1/auth/register/",{"email":"new@example.com","password":"12345678"},format="json")
        self.assertEqual(response.status_code,400)
    def test_registration_normalizes_email_and_queues_email(self):
        client=APIClient()
        response=client.post("/api/v1/auth/register/",{"email":"NEW@EXAMPLE.COM","password":"UniqueS3curePhrase!894"},format="json")
        self.assertEqual(response.status_code,201,response.data)
        user=User.objects.get(email="new@example.com")
        self.assertFalse(user.email_verified)
        self.assertEqual(user.notifications.filter(is_private=True).count(),1)
        duplicate=client.post("/api/v1/auth/register/",{"email":"New@example.com","password":"UniqueS3curePhrase!894"},format="json")
        self.assertEqual(duplicate.status_code,400)
    def test_login_uses_httponly_refresh_cookie(self):
        client=APIClient(enforce_csrf_checks=True)
        csrf=client.get("/api/v1/auth/csrf/").data["csrf_token"]
        response=client.post("/api/v1/auth/login/",{"email":"BUYER@example.com","password":"NotAPassword123!"},format="json",HTTP_X_CSRFTOKEN=csrf)
        self.assertEqual(response.status_code,200,response.data)
        self.assertIn("access",response.data)
        self.assertNotIn("refresh",response.data)
        self.assertTrue(response.cookies[settings.REFRESH_COOKIE_NAME]["httponly"])
        refreshed=client.post("/api/v1/auth/refresh/",{},format="json",HTTP_X_CSRFTOKEN=csrf)
        self.assertEqual(refreshed.status_code,200,refreshed.data)
    def test_login_and_refresh_require_csrf(self):
        client=APIClient(enforce_csrf_checks=True)
        self.assertEqual(client.post("/api/v1/auth/login/",{"email":self.buyer.email,"password":"NotAPassword123!"}).status_code,403)
        self.assertEqual(client.post("/api/v1/auth/refresh/",{}).status_code,403)
    def test_role_fields_cannot_be_changed(self):
        response=self.client.patch("/api/v1/auth/me/",{"role":"ADMIN","is_verified":True,"email_verified":True},format="json")
        self.assertEqual(response.status_code,200)
        self.buyer.refresh_from_db()
        self.assertEqual(self.buyer.role,"USER")
        self.assertFalse(self.buyer.is_verified)
    def test_password_reset_link_is_single_use(self):
        client=APIClient()
        token=default_token_generator.make_token(self.buyer)
        payload={"user":self.buyer.pk,"token":token,"password":"ANewStrongPassword!559"}
        self.assertEqual(client.post("/api/v1/auth/password-reset/confirm/",payload,format="json").status_code,200)
        self.assertEqual(client.post("/api/v1/auth/password-reset/confirm/",payload,format="json").status_code,400)

class EventTests(Fixture):
    def test_drafts_are_private_and_public_profile_has_no_email(self):
        self.event.status="DRAFT";self.event.save()
        public=APIClient()
        self.assertEqual(public.get("/api/v1/events/").data["count"],0)
        self.assertEqual(public.get(f"/api/v1/events/{self.event.pk}/").status_code,404)
        self.event.status="PUBLISHED";self.event.save()
        data=public.get(f"/api/v1/events/{self.event.pk}/").data
        self.assertNotIn("email",data["organizer"])
    def test_unverified_organizer_cannot_publish(self):
        self.owner.is_verified=False;self.owner.save()
        self.client.force_authenticate(self.owner)
        response=self.client.post(f"/api/v1/events/{self.event.pk}/submit/",{},format="json")
        self.assertEqual(response.status_code,403)
    def test_organizer_cannot_self_approve(self):
        self.event.status="IN_REVIEW";self.event.save()
        self.client.force_authenticate(self.owner)
        self.assertEqual(self.client.post(f"/api/v1/events/{self.event.pk}/approve/",{}).status_code,403)
    def test_published_events_cannot_be_edited(self):
        self.client.force_authenticate(self.owner)
        self.assertEqual(self.client.patch(f"/api/v1/events/{self.event.pk}/",{"capacity":1},format="json").status_code,400)

class BookingTests(Fixture):
    def test_reservation_is_not_a_sale_and_has_expiry(self):
        booking=self.reserve()
        self.stock.refresh_from_db()
        self.assertEqual(self.stock.quantity_reserved,2)
        self.assertEqual(self.stock.quantity_sold,0)
        self.assertEqual(booking.status,"PENDING")
        self.assertIsNotNone(booking.expires_at)
    def test_same_request_is_idempotent_and_changed_payload_conflicts(self):
        original=self.reserve()
        repeat=self.reserve()
        self.assertEqual(original.pk,repeat.pk)
        with self.assertRaises(Conflict): self.reserve(quantity=3)
    def test_capacity_shared_between_ticket_types(self):
        self.event.capacity=2;self.event.save()
        self.reserve()
        other=TicketType.objects.create(event=self.event,name="VIP",price=10,quantity=10)
        with self.assertRaises(Conflict):
            self.reserve(key="request-0002",entries=[{"id":other.pk,"quantity":1}])
    def test_expiry_releases_inventory(self):
        booking=self.reserve()
        Booking.objects.filter(pk=booking.pk).update(expires_at=timezone.now()-timedelta(seconds=1))
        self.assertTrue(expire(booking.pk))
        self.assertFalse(expire(booking.pk))
        self.stock.refresh_from_db()
        self.assertEqual(self.stock.quantity_reserved,0)
    def test_cancel_is_idempotent_and_preserves_history(self):
        booking=self.reserve()
        cancel(booking.pk,self.buyer);cancel(booking.pk,self.buyer)
        self.stock.refresh_from_db()
        self.assertEqual(self.stock.quantity_available,10)
        self.assertTrue(Booking.objects.filter(pk=booking.pk,status="CANCELLED").exists())
    def test_ineligible_events_and_sales_windows(self):
        self.event.status="DRAFT";self.event.save()
        with self.assertRaises(Conflict): self.reserve()
        self.event.status="PUBLISHED";self.event.save()
        self.stock.sales_end=timezone.now()-timedelta(hours=1);self.stock.save()
        with self.assertRaises(Conflict): self.reserve()
    def test_duplicates_are_validation_errors(self):
        response=self.client.post("/api/v1/bookings/",{"kind":"EVENT","items":[{"id":str(self.stock.pk),"quantity":1},{"id":str(self.stock.pk),"quantity":1}],"customer_name":"Buyer","customer_phone":"08000000000"},format="json",HTTP_IDEMPOTENCY_KEY="request-api-0001")
        self.assertEqual(response.status_code,400,response.data)
    def test_api_requires_idempotency_and_blocks_edit_delete(self):
        payload={"kind":"EVENT","items":[{"id":str(self.stock.pk),"quantity":1}],"customer_name":"Buyer","customer_phone":"08000000000"}
        self.assertEqual(self.client.post("/api/v1/bookings/",payload,format="json").status_code,400)
        response=self.client.post("/api/v1/bookings/",payload,format="json",HTTP_IDEMPOTENCY_KEY="request-api-0001")
        self.assertEqual(response.status_code,201,response.data)
        again=self.client.post("/api/v1/bookings/",payload,format="json",HTTP_IDEMPOTENCY_KEY="request-api-0001")
        self.assertEqual(again.status_code,200)
        url=f"/api/v1/bookings/{response.data['id']}/"
        self.assertEqual(self.client.delete(url).status_code,405)
        self.assertEqual(self.client.patch(url,{},format="json").status_code,405)
    def test_other_users_cannot_read_or_cancel_booking(self):
        booking=self.reserve()
        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.get(f"/api/v1/bookings/{booking.pk}/").status_code,404)
        self.assertEqual(self.client.post(f"/api/v1/bookings/{booking.pk}/cancel/",{}).status_code,404)

class PaymentTests(Fixture):
    def test_verified_payment_confirms_and_issues_once(self):
        booking=self.reserve();payment=self.payment(booking)
        settle(payment.pk,self.verified(payment))
        settle(payment.pk,self.verified(payment))
        booking.refresh_from_db();self.stock.refresh_from_db()
        self.assertEqual(booking.status,"CONFIRMED")
        self.assertEqual((self.stock.quantity_reserved,self.stock.quantity_sold),(0,2))
        self.assertEqual(Ticket.objects.filter(booking=booking).count(),2)
        self.assertEqual(LedgerEntry.objects.filter(payment=payment,kind="SALE").count(),1)
    def test_amount_mismatch_does_not_issue_tickets(self):
        booking=self.reserve();payment=self.payment(booking)
        settle(payment.pk,self.verified(payment,amount=1))
        booking.refresh_from_db();payment.refresh_from_db()
        self.assertEqual(payment.status,"REVIEW")
        self.assertEqual(booking.status,"PENDING")
        self.assertFalse(Ticket.objects.exists())
    def test_late_payment_is_refunded_not_fulfilled(self):
        booking=self.reserve();payment=self.payment(booking)
        Booking.objects.filter(pk=booking.pk).update(expires_at=timezone.now()-timedelta(seconds=1))
        settle(payment.pk,self.verified(payment))
        payment.refresh_from_db();self.stock.refresh_from_db()
        self.assertEqual(payment.status,"REFUND_PENDING")
        self.assertEqual(self.stock.quantity_available,10)
        self.assertTrue(Refund.objects.filter(payment=payment,status="QUEUED").exists())
        self.assertFalse(Ticket.objects.exists())
    def test_paid_cancellation_and_refund_completion(self):
        booking=self.reserve();payment=self.payment(booking)
        settle(payment.pk,self.verified(payment))
        cancel(booking.pk,self.buyer)
        refund=Refund.objects.get(payment=payment)
        data={"id":987,"transaction":12345,"amount":int(payment.amount*100),"currency":"NGN","status":"processed"}
        apply_refund(refund.pk,data);apply_refund(refund.pk,data)
        booking.refresh_from_db();self.stock.refresh_from_db()
        self.assertEqual(booking.status,"REFUNDED")
        self.assertEqual(self.stock.quantity_sold,0)
        self.assertEqual(LedgerEntry.objects.filter(payment=payment,kind="REFUND").count(),1)
        self.assertFalse(Ticket.objects.exclude(status="REFUNDED").exists())
    @patch("apps.payments.services.Paystack.refund",side_effect=ServiceUnavailable())
    def test_uncertain_refund_is_not_resubmitted(self,mocked):
        booking=self.reserve();payment=self.payment(booking)
        settle(payment.pk,self.verified(payment));cancel(booking.pk,self.buyer)
        refund=Refund.objects.get(payment=payment)
        submit_refund(refund.pk);submit_refund(refund.pk)
        refund.refresh_from_db()
        self.assertEqual(refund.status,"UNKNOWN")
        self.assertEqual(mocked.call_count,1)
    @override_settings(PAYSTACK_SECRET_KEY="test-paystack-secret")
    def test_signed_webhook_is_deduplicated(self):
        payload=json.dumps({"event":"charge.success","data":{"reference":"test","id":1}}).encode()
        client=APIClient()
        self.assertEqual(client.post("/api/v1/payments/webhook/paystack/",payload,content_type="application/json").status_code,401)
        signature=hmac.new(settings.PAYSTACK_SECRET_KEY.encode(),payload,hashlib.sha512).hexdigest()
        for _ in range(2):
            self.assertEqual(client.post("/api/v1/payments/webhook/paystack/",payload,content_type="application/json",HTTP_X_PAYSTACK_SIGNATURE=signature).status_code,200)
        self.assertEqual(PaymentEvent.objects.count(),1)
    def test_ticket_checkin_is_once_and_owner_scoped(self):
        booking=self.reserve();payment=self.payment(booking);settle(payment.pk,self.verified(payment))
        ticket=Ticket.objects.first()
        self.event.start_datetime=timezone.now()-timedelta(hours=1);self.event.end_datetime=timezone.now()+timedelta(hours=2);self.event.save()
        from rest_framework.exceptions import PermissionDenied
        with self.assertRaises(PermissionDenied):check_in(ticket.qr_code,self.other)
        check_in(ticket.qr_code,self.owner)
        with self.assertRaises(Conflict):check_in(ticket.qr_code,self.owner)
    def test_ticket_qr_private(self):
        booking=self.reserve();payment=self.payment(booking);settle(payment.pk,self.verified(payment))
        ticket=Ticket.objects.first()
        response=self.client.get(f"/api/v1/tickets/{ticket.pk}/qr/")
        self.assertEqual(response.status_code,200)
        self.assertEqual(response["Content-Type"],"image/png")
        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.get(f"/api/v1/tickets/{ticket.pk}/qr/").status_code,404)

class MarketplaceTests(Fixture):
    def test_hotel_reserves_each_night_and_releases_all(self):
        hotel=Hotel.objects.create(owner=self.owner,name="Hotel",city="Aba",address="Aba",is_active=True)
        room=RoomType.objects.create(hotel=hotel,name="Double",max_guests=2)
        day=timezone.localdate()+timedelta(days=4)
        nights=[RoomNight.objects.create(room_type=room,date=day+timedelta(days=i),price=15000,quantity=2) for i in range(3)]
        entries=[{"id":n.pk,"quantity":1} for n in nights]
        booking=self.reserve(kind="HOTEL",entries=entries,details={"guests":2})
        self.assertEqual(booking.total_amount,45000)
        self.assertEqual(booking.details["check_out"],str(day+timedelta(days=3)))
        cancel(booking.pk,self.buyer)
        self.assertEqual(RoomNight.objects.filter(quantity_reserved=0).count(),3)
    def test_hotel_rejects_nonconsecutive_stay(self):
        from rest_framework.exceptions import ValidationError
        hotel=Hotel.objects.create(owner=self.owner,name="Hotel",city="Aba",address="Aba",is_active=True)
        room=RoomType.objects.create(hotel=hotel,name="Double")
        day=timezone.localdate()+timedelta(days=4)
        nights=[RoomNight.objects.create(room_type=room,date=day+timedelta(days=i),price=100,quantity=2) for i in [0,2]]
        with self.assertRaises(ValidationError):self.reserve(kind="HOTEL",entries=[{"id":n.pk,"quantity":1} for n in nights])
    def test_food_delivery_fee_and_fulfillment(self):
        restaurant=Restaurant.objects.create(owner=self.owner,name="Kitchen",city="Aba",address="Aba",is_active=True,accepts_orders=True,offers_delivery=True,delivery_fee=500,delivery_cities=["Aba"])
        item=MenuItem.objects.create(restaurant=restaurant,name="Rice",price=2000,quantity=20)
        booking=self.reserve(kind="FOOD",entries=[{"id":item.pk,"quantity":2}],details={"delivery_method":"DELIVERY","delivery_city":"Aba","delivery_address":"12 Market Road"})
        self.assertEqual(booking.total_amount,4500)
        payment=self.payment(booking);settle(payment.pk,self.verified(payment))
        fulfill(booking.pk,self.owner,"ACCEPTED")
        with self.assertRaises(Conflict):cancel(booking.pk,self.buyer)
        for status in ["READY","IN_PROGRESS","COMPLETED"]:fulfill(booking.pk,self.owner,status)
        booking.refresh_from_db();self.assertEqual(booking.fulfillment_status,"COMPLETED")
    def test_transport_seat_stock(self):
        route=Route.objects.create(owner=self.owner,name="Aba to Umuahia",origin="Aba",destination="Umuahia",pickup_address="Station",is_active=True)
        departure=Departure.objects.create(route=route,departs_at=timezone.now()+timedelta(days=2),arrives_at=timezone.now()+timedelta(days=2,hours=2),vehicle="Bus",price=5000,quantity=2)
        self.reserve(kind="TRANSPORT",entries=[{"id":departure.pk,"quantity":2}])
        with self.assertRaises(Conflict):self.reserve(key="request-other",kind="TRANSPORT",entries=[{"id":departure.pk,"quantity":1}],user=self.other)
    def test_catalog_listings_require_approval(self):
        Hotel.objects.create(owner=self.owner,name="Pending hotel",city="Aba",address="Aba",is_active=False)
        self.assertEqual(APIClient().get("/api/v1/hotels/").data["count"],0)
    def test_messages_restricted_to_booking_participants(self):
        booking=self.reserve()
        response=self.client.post("/api/v1/conversations/",{"booking":str(booking.pk)},format="json")
        self.assertEqual(response.status_code,201,response.data)
        url=f"/api/v1/conversations/{response.data['id']}/messages/"
        self.assertEqual(self.client.post(url,{"body":"Hello"},format="json").status_code,201)
        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.get(url).status_code,404)
