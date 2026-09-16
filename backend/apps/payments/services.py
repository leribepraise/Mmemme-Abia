import uuid
from datetime import timedelta
from decimal import Decimal, ROUND_HALF_UP
from urllib.parse import urlparse
from django.conf import settings
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import PermissionDenied
from apps.common.api import Conflict, ServiceUnavailable
from apps.common.models import audit
from apps.bookings.services import _locked_booking, _expire_locked, _change_stock, confirm_locked, still_deliverable
from .models import Payment, PaymentEvent, Refund, LedgerEntry
from .provider import Paystack

def initialize(booking_id,user):
    with transaction.atomic():
        _,booking = _locked_booking(booking_id)
        if booking.user_id != user.pk:
            raise PermissionDenied()
        if booking.status != "PENDING" or not booking.expires_at or booking.expires_at <= timezone.now():
            raise Conflict("This booking is no longer awaiting payment.")
        payment = Payment.objects.filter(booking=booking,provider="PAYSTACK").order_by("created_at").first()
        if not payment:
            payment = Payment.objects.create(booking=booking,user=user,reference="PAY-"+uuid.uuid4().hex,idempotency_key="booking:"+str(booking.pk),provider="PAYSTACK",amount=booking.total_amount,currency=booking.currency,status="PENDING")
        if payment.authorization_url:
            return payment
        if payment.status in {"SUCCESS","REFUNDED","REFUND_PENDING","REVIEW"}:
            raise Conflict("This payment cannot be initialized again.")
        if payment.initialized_at:
            # A previous request may have reached the provider. Reconciliation uses the same reference.
            raise Conflict("Payment initialization is already in progress or requires reconciliation.")
        payment.initialized_at = timezone.now()
        payment.status = "PROCESSING"
        payment.save(update_fields=["initialized_at","status","updated_at"])
    data = Paystack().initialize(payment)
    if not isinstance(data,dict): raise ServiceUnavailable("Invalid provider response.")
    url = data.get("authorization_url","")
    parsed = urlparse(url)
    if data.get("reference") != payment.reference or parsed.scheme != "https" or parsed.hostname != "checkout.paystack.com":
        raise ServiceUnavailable("The provider returned an invalid checkout response.")
    Payment.objects.filter(pk=payment.pk).update(authorization_url=url)
    payment.authorization_url = url
    return payment

def verify_payment(payment):
    data = Paystack().verify(payment.reference)
    return settle(payment.pk,data)

@transaction.atomic
def settle(payment_id,data):
    if not isinstance(data,dict): raise ServiceUnavailable("Invalid provider response.")
    original = Payment.objects.get(pk=payment_id)
    parent,booking = _locked_booking(original.booking_id)
    payment = Payment.objects.select_for_update().get(pk=payment_id)
    payment.last_checked_at = timezone.now()
    if payment.status in {"SUCCESS","REFUND_PENDING","REFUNDED"}:
        payment.save(update_fields=["last_checked_at"])
        return payment
    if data.get("status") != "success":
        payment.save(update_fields=["last_checked_at"])
        return payment
    metadata = data.get("metadata") or {}
    if not isinstance(metadata,dict): metadata = {}
    customer = data.get("customer") or {}
    if not isinstance(customer,dict): customer={}
    valid = data.get("reference")==payment.reference and data.get("amount")==int(payment.amount*100) and data.get("currency")==payment.currency and str(metadata.get("booking_id"))==str(booking.pk) and str(customer.get("email","")).casefold()==payment.user.email.casefold()
    if not valid or not data.get("id"):
        payment.status = "REVIEW"
        payment.save(update_fields=["status","last_checked_at"])
        audit(None,"payment.mismatch",payment.pk)
        return payment
    payment.provider_reference = str(data["id"])
    payment.paid_at = timezone.now()
    payment.status = "SUCCESS"
    _expire_locked(booking)
    if booking.status=="PENDING" and not still_deliverable(booking,parent):
        _change_stock(booking,reserved=-1)
        booking.status="CANCELLED"
        booking.save(update_fields=["status","updated_at"])
    if booking.status != "PENDING":
        payment.status = "REFUND_PENDING"
        payment.save(update_fields=["provider_reference","paid_at","status","last_checked_at","updated_at"])
        Refund.objects.get_or_create(payment=payment,defaults={"amount":payment.amount,"reason":"Payment received after reservation closed"})
        booking.status="REFUND_PENDING"
        booking.save(update_fields=["status","updated_at"])
        audit(None,"payment.late",payment.pk)
        return payment
    payment.save(update_fields=["provider_reference","paid_at","status","last_checked_at","updated_at"])
    confirm_locked(booking)
    fee = (payment.amount*Decimal(settings.PLATFORM_COMMISSION_BPS)/10000).quantize(Decimal("0.01"),rounding=ROUND_HALF_UP)
    LedgerEntry.objects.get_or_create(payment=payment,kind="SALE",defaults={"booking":booking,"gross":payment.amount,"platform_fee":fee,"provider_amount":payment.amount-fee})
    audit(None,"payment.verified",payment.pk)
    return payment

def queue_refund(booking,actor):
    payment = Payment.objects.select_for_update().filter(booking=booking,status="SUCCESS").first()
    if not payment:
        raise Conflict("The payment must be reconciled before a refund can be requested.")
    Refund.objects.get_or_create(payment=payment,defaults={"amount":payment.amount,"reason":"Booking cancellation"})
    payment.status = "REFUND_PENDING"
    payment.save(update_fields=["status","updated_at"])
    audit(actor,"refund.queued",payment.pk)

def submit_refund(refund_id):
    with transaction.atomic():
        refund = Refund.objects.select_for_update().select_related("payment").get(pk=refund_id)
        if refund.status != "QUEUED": return
        refund.status = "PROCESSING"
        refund.claimed_at = timezone.now()
        refund.save(update_fields=["status","claimed_at","updated_at"])
    try:
        data = Paystack().refund(refund)
    except ServiceUnavailable:
        # Never resend an uncertain financial write automatically.
        Refund.objects.filter(pk=refund.pk,status="PROCESSING").update(status="UNKNOWN")
        return
    apply_refund(refund.pk,data)

@transaction.atomic
def apply_refund(refund_id,data):
    if not isinstance(data,dict): raise ServiceUnavailable("Invalid provider response.")
    original = Refund.objects.select_related("payment").get(pk=refund_id)
    _,booking = _locked_booking(original.payment.booking_id)
    payment = Payment.objects.select_for_update().get(pk=original.payment_id)
    refund = Refund.objects.select_for_update().get(pk=refund_id)
    if refund.status == "PROCESSED": return
    tx = data.get("transaction")
    tx_id = str(tx.get("id")) if isinstance(tx,dict) else str(tx)
    if tx_id != payment.provider_reference or data.get("amount") != int(refund.amount*100) or data.get("currency") != payment.currency or not data.get("id"):
        refund.status = "REVIEW"
    else:
        refund.provider_id = str(data["id"])
        provider_status = data.get("status")
        refund.status = "PROCESSED" if provider_status == "processed" else "FAILED" if provider_status in {"failed","needs-attention"} else "PROCESSING"
    refund.save(update_fields=["status","provider_id","updated_at"])
    if refund.status == "PROCESSED":
        payment.status = "REFUNDED"
        payment.save(update_fields=["status","updated_at"])
        if booking.status == "REFUND_PENDING":
            booking.status = "REFUNDED"
            booking.save(update_fields=["status","updated_at"])
            booking.tickets.update(status="REFUNDED")
        sale = LedgerEntry.objects.filter(payment=payment,kind="SALE").first()
        LedgerEntry.objects.get_or_create(payment=payment,kind="REFUND",defaults={"booking":booking,"gross":refund.amount,"platform_fee":sale.platform_fee if sale else 0,"provider_amount":sale.provider_amount if sale else 0})
        from apps.notifications.services import notify
        notify(booking.user,f"refund:{refund.pk}","Refund completed",f"Your refund for {booking.booking_reference} has been processed.")
        audit(None,"refund.completed",refund.pk)

def reconcile_refund(refund_id):
    refund = Refund.objects.select_related("payment").get(pk=refund_id)
    if refund.provider_id:
        apply_refund(refund.pk,Paystack().get_refund(refund.provider_id))
    elif refund.payment.provider_reference:
        matches = Paystack().list_refunds(refund.payment.provider_reference)
        if len(matches) == 1:
            apply_refund(refund.pk,matches[0])
        elif len(matches) > 1:
            Refund.objects.filter(pk=refund.pk).update(status="REVIEW")

def process_event(event_id):
    with transaction.atomic():
        event = PaymentEvent.objects.select_for_update().get(pk=event_id)
        if event.processed_at or (event.claimed_at and event.claimed_at > timezone.now()-timedelta(minutes=5)):
            return
        event.claimed_at = timezone.now()
        event.attempts += 1
        event.save(update_fields=["claimed_at","attempts"])
    try:
        if event.event_type == "charge.success":
            payment = Payment.objects.filter(reference=event.reference,provider="PAYSTACK").first()
            if payment: verify_payment(payment)
        elif event.event_type.startswith("transfer."):
            from .models import PayoutAttempt
            from .payouts import reconcile
            attempt = PayoutAttempt.objects.filter(reference=event.reference).first()
            if attempt:
                reconcile(attempt.pk, require_confirmation=True)
        elif event.event_type.startswith("refund."):
            refund = Refund.objects.filter(provider_id=event.resource_id).first()
            if refund:
                reconcile_refund(refund.pk)
            else:
                data = Paystack().get_refund(event.resource_id)
                tx = data.get("transaction")
                transaction_id = str(tx.get("id")) if isinstance(tx,dict) else str(tx)
                refund = Refund.objects.filter(payment__provider_reference=transaction_id).first()
                if refund: apply_refund(refund.pk,data)
    except ServiceUnavailable:
        PaymentEvent.objects.filter(pk=event.pk).update(claimed_at=None,last_error="provider_unavailable",available_at=timezone.now()+timedelta(seconds=min(3600,30*2**min(event.attempts,7))))
        return
    PaymentEvent.objects.filter(pk=event.pk).update(processed_at=timezone.now(),claimed_at=None,last_error="")
