"""Platform-controlled provider payouts.

Lock order: provider (NO KEY UPDATE), payout, attempt. Earnings allocations have
a database uniqueness constraint. Financial intent is persisted before HTTP;
unknown outcomes are reconciled and never automatically sent a second time.
"""
import uuid
from datetime import timedelta
from decimal import Decimal
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.db import transaction
from django.db.models import Sum
from django.utils import timezone
from rest_framework.exceptions import PermissionDenied
from apps.common.api import Conflict, ServiceUnavailable
from apps.common.models import audit
from apps.notifications.services import notify
from .models import LedgerEntry, PayoutAccount, Payout, PayoutItem, PayoutAttempt
from .provider import Paystack

FAILURES = {"failed", "reversed", "abandoned", "blocked", "rejected"}
STATUS = {"success":"PAID", "reversed":"REVERSED", "failed":"FAILED",
          "abandoned":"FAILED", "blocked":"FAILED", "rejected":"FAILED",
          "otp":"OTP_REQUIRED", "pending":"PROCESSING", "received":"PROCESSING"}


def finance(user, permission="release_payout", provider_id=None):
    if not user.is_active or not user.is_staff or not user.has_perm("payments."+permission) or user.pk == provider_id:
        raise PermissionDenied("A different authorized finance staff member must review this request.")


def _provider(provider_id):
    return get_user_model().objects.select_for_update(no_key=True).get(pk=provider_id)


def _verified(user):
    if not user.is_active or not user.is_verified or not user.email_verified:
        raise Conflict("An active, verified provider account is required.")


def bank_list():
    result = cache.get("paystack:nigeria:banks")
    if result is None:
        result = Paystack().banks()
        cache.set("paystack:nigeria:banks", result, 3600)
    return result


@transaction.atomic
def register_account(user, number, bank_code):
    user = _provider(user.pk)
    _verified(user)
    if Payout.objects.filter(provider=user).exclude(status__in=["PAID","CANCELLED"]).exists():
        raise Conflict("Resolve outstanding payouts before changing bank details.")
    bank = next((row for row in bank_list() if row["code"] == bank_code), None)
    if not bank: raise Conflict("Choose a supported Nigerian bank.")
    resolved = Paystack().resolve_account(number, bank_code)
    if not isinstance(resolved, dict) or resolved.get("account_number") != number or not resolved.get("account_name"):
        raise ServiceUnavailable("Bank account verification did not match.")
    name = str(resolved["account_name"])
    recipient = Paystack().create_recipient(number, bank_code, name)
    details = recipient.get("details", {}) if isinstance(recipient, dict) else {}
    if (not isinstance(details, dict) or details.get("account_number") != number
            or details.get("bank_code") != bank_code or recipient.get("currency") != "NGN"
            or recipient.get("active") is not True or not recipient.get("recipient_code") or not recipient.get("id")):
        raise ServiceUnavailable("The verified payout recipient did not match.")
    PayoutAccount.objects.filter(provider=user, is_current=True).update(is_current=False)
    account = PayoutAccount.objects.create(provider=user, recipient_code=recipient["recipient_code"],
        recipient_id=str(recipient["id"]), bank_code=bank_code, bank_name=bank["name"],
        account_name=name, account_last4=number[-4:])
    audit(user, "payout_account.submitted", account.pk)
    notify(user, f"payout-account:{account.pk}", "Bank details submitted",
           f"Your payout account ending {account.account_last4} is awaiting staff review.")
    return account


@transaction.atomic
def review_account(account_id, actor, decision, note):
    original = PayoutAccount.objects.get(pk=account_id)
    finance(actor, "review_payoutaccount", original.provider_id)
    provider = _provider(original.provider_id)
    account = PayoutAccount.objects.select_for_update().get(pk=account_id)
    if not account.is_current: raise Conflict("This bank account has been replaced.")
    if decision not in {"APPROVED","REJECTED","SUSPENDED"}: raise Conflict("Invalid bank review decision.")
    if decision == "APPROVED": _verified(provider)
    account.status, account.review_note = decision, note
    account.reviewed_by, account.reviewed_at = actor, timezone.now()
    account.save(update_fields=["status","review_note","reviewed_by","reviewed_at"])
    audit(actor, "payout_account."+decision.lower(), account.pk)
    notify(provider, f"bank-review:{account.pk}:{account.reviewed_at}", "Payout account review",
           f"Your payout account ending {account.account_last4} is {decision.lower()}. {note}")
    return account


def eligible_sales(provider):
    allocated = PayoutItem.objects.filter(active=True).values("sale_id")
    return LedgerEntry.objects.filter(kind="SALE", provider_amount__gt=0,
        booking__supplier=provider, booking__status="CONFIRMED", booking__fulfillment_status="COMPLETED",
        booking__completed_at__lte=timezone.now()-timedelta(days=settings.PAYOUT_HOLD_DAYS),
        payment__status="SUCCESS", payment__currency="NGN", payment__refund__isnull=True).exclude(pk__in=allocated)


def balance(provider):
    payouts = Payout.objects.filter(provider=provider)
    def total(qs): return qs.aggregate(total=Sum("amount"))["total"] or Decimal("0.00")
    return {"available_for_payout": eligible_sales(provider).aggregate(total=Sum("provider_amount"))["total"] or Decimal("0.00"),
            "payouts_reserved": total(payouts.exclude(status__in=["PAID","CANCELLED"])),
            "paid_out": total(payouts.filter(status="PAID")), "hold_days":settings.PAYOUT_HOLD_DAYS,
            "transfers_enabled":settings.PAYSTACK_TRANSFERS_ENABLED}


@transaction.atomic
def request_payout(user, key):
    user = _provider(user.pk)
    existing = Payout.objects.filter(provider=user, idempotency_key=key).first()
    if existing: return existing, False
    _verified(user)
    account = PayoutAccount.objects.filter(provider=user, is_current=True, status="APPROVED").first()
    if not account: raise Conflict("Your bank account needs approval before requesting a payout.")
    sales = list(eligible_sales(user).order_by("id")[:1000])
    amount = sum((sale.provider_amount for sale in sales), Decimal("0.00"))
    if not amount: raise Conflict("There are no completed earnings available for payout yet.")
    if amount > Decimal("9999999999.99"): raise Conflict("Contact finance to arrange this payout.")
    payout = Payout.objects.create(provider=user, account=account, amount=amount, idempotency_key=key)
    PayoutItem.objects.bulk_create([PayoutItem(payout=payout, sale=sale, amount=sale.provider_amount) for sale in sales])
    audit(user, "payout.requested", payout.pk, amount=str(amount), bookings=len(sales))
    return payout, True


def _locked(payout_id):
    original = Payout.objects.only("provider_id").get(pk=payout_id)
    provider = _provider(original.provider_id)
    return provider, Payout.objects.select_for_update().get(pk=payout_id)


def _validate(provider, payout):
    _verified(provider)
    account = PayoutAccount.objects.get(pk=payout.account_id)
    if not account.is_current or account.status != "APPROVED" or account.provider_id != provider.pk:
        raise Conflict("The payout bank account is not approved.")
    items = list(payout.items.filter(active=True).select_related("sale__booking","sale__payment"))
    cutoff = timezone.now()-timedelta(days=settings.PAYOUT_HOLD_DAYS)
    for item in items:
        sale, booking, payment = item.sale, item.sale.booking, item.sale.payment
        if (sale.kind != "SALE" or sale.provider_amount != item.amount or booking.supplier_id != provider.pk
                or booking.status != "CONFIRMED" or booking.fulfillment_status != "COMPLETED"
                or not booking.completed_at or booking.completed_at > cutoff or payment.status != "SUCCESS"
                or payment.currency != payout.currency or hasattr(payment,"refund")):
            raise Conflict("These earnings require finance review before payout.")
    if not items or sum((i.amount for i in items),Decimal("0")) != payout.amount:
        raise Conflict("The payout amount does not match its earnings records.")


@transaction.atomic
def approve(payout_id, actor, note):
    provider, payout = _locked(payout_id)
    finance(actor, provider_id=provider.pk)
    if payout.status not in {"REQUESTED","REVIEW"} or payout.attempts.exists():
        raise Conflict("This payout cannot be approved again.")
    _validate(provider, payout)
    payout.status, payout.review_note = "APPROVED", note
    payout.approved_by, payout.approved_at = actor, timezone.now()
    payout.save(update_fields=["status","review_note","approved_by","approved_at","updated_at"])
    audit(actor, "payout.approved", payout.pk, amount=str(payout.amount))
    return payout


def submit(payout_id):
    if not settings.PAYSTACK_TRANSFERS_ENABLED: return
    with transaction.atomic():
        provider, payout = _locked(payout_id)
        if payout.status != "APPROVED": return
        try: _validate(provider, payout)
        except Conflict:
            payout.status = "REVIEW"
            payout.save(update_fields=["status","updated_at"])
            audit(None, "payout.blocked", payout.pk)
            return
        previous = payout.attempts.first()
        if previous and previous.status not in FAILURES:
            raise Conflict("The previous transfer has not conclusively failed.")
        attempt = PayoutAttempt.objects.create(payout=payout, reference="payout_"+uuid.uuid4().hex)
        payout.status = "UNKNOWN"
        payout.save(update_fields=["status","updated_at"])
    try: Paystack().transfer(payout, attempt)
    except ServiceUnavailable: return
    # Do not trust the initiation response alone to mark a payout as paid.
    reconcile(attempt.pk)


def _apply(payout, attempt, data):
    account = payout.account
    recipient = data.get("recipient") if isinstance(data,dict) else None
    recipient_matches = (isinstance(recipient,dict) and recipient.get("recipient_code") == account.recipient_code
                         and str(recipient.get("id")) == account.recipient_id)
    if not isinstance(recipient,dict): recipient_matches = str(recipient) == account.recipient_id
    valid = (isinstance(data,dict) and data.get("reference") == attempt.reference
             and data.get("amount") == int(payout.amount*100) and data.get("currency") == payout.currency
             and recipient_matches and data.get("transfer_code")
             and (not attempt.transfer_code or attempt.transfer_code == data["transfer_code"]))
    raw_status = data.get("status") if isinstance(data,dict) else None
    next_status = STATUS.get(raw_status, "REVIEW") if valid else "REVIEW"
    if attempt.status == "success" and raw_status not in {"success","reversed"}: next_status = "REVIEW"
    if attempt.status in FAILURES and raw_status != attempt.status: next_status = "REVIEW"
    if payout.status == "REVIEW": next_status = "REVIEW"
    latest = payout.attempts.first()
    if latest.pk != attempt.pk:
        if next_status in {"FAILED","REVERSED"}: return
        next_status = "REVIEW"
    # Replayed failure events cannot cancel a staff-approved retry or reopen a cancelled payout.
    if payout.status in {"CANCELLED","APPROVED"} and attempt.status in FAILURES and next_status in {"FAILED","REVERSED"}:
        return
    changed = payout.status != next_status
    if valid and next_status != "REVIEW":
        attempt.status, attempt.transfer_code = raw_status, data["transfer_code"]
        attempt.save(update_fields=["status","transfer_code"])
    payout.status = next_status
    payout.save(update_fields=["status","updated_at"])
    if changed:
        audit(None, "payout."+next_status.lower(), payout.pk, reference=attempt.reference)
        notify(payout.provider, f"payout:{attempt.pk}:{next_status}", "Payout update",
               f"Your payout of NGN {payout.amount} is {next_status.lower().replace('_',' ')}. Reference: {attempt.reference}.")


def _reconcile_locked(payout, attempt):
    attempt.checked_at = timezone.now()
    attempt.save(update_fields=["checked_at"])
    try: data = Paystack().verify_transfer(attempt.reference)
    except ServiceUnavailable: return False
    _apply(payout, attempt, data)
    return True


def reconcile(attempt_id, require_confirmation=False):
    with transaction.atomic():
        original = PayoutAttempt.objects.get(pk=attempt_id)
        _, payout = _locked(original.payout_id)
        attempt = PayoutAttempt.objects.select_for_update().get(pk=attempt_id)
        confirmed = _reconcile_locked(payout, attempt)
    if require_confirmation and not confirmed:
        raise ServiceUnavailable("Paystack has not confirmed this transfer yet.")
    return payout


@transaction.atomic
def retry(payout_id, actor, note):
    provider, payout = _locked(payout_id)
    finance(actor, provider_id=provider.pk)
    if payout.status not in {"FAILED","REVERSED"}: raise Conflict("Only conclusively failed transfers can be retried.")
    attempt = payout.attempts.first()
    if not attempt or not _reconcile_locked(payout, attempt) or payout.status not in {"FAILED","REVERSED"} or attempt.status not in FAILURES:
        raise Conflict("Paystack must confirm the failure before another transfer is allowed.")
    _validate(provider, payout)
    payout.status, payout.review_note = "APPROVED", note
    payout.approved_by, payout.approved_at = actor, timezone.now()
    payout.save(update_fields=["status","review_note","approved_by","approved_at","updated_at"])
    audit(actor, "payout.retry_approved", payout.pk, previous=attempt.reference)
    return payout


@transaction.atomic
def cancel(payout_id, actor, note):
    provider, payout = _locked(payout_id)
    finance(actor, provider_id=provider.pk)
    if payout.status not in {"REQUESTED","APPROVED","FAILED","REVERSED","REVIEW"}:
        raise Conflict("A pending or successful transfer cannot be cancelled.")
    attempt = payout.attempts.first()
    if attempt and (not _reconcile_locked(payout, attempt) or payout.status not in {"FAILED","REVERSED","APPROVED"} or attempt.status not in FAILURES):
        raise Conflict("Paystack must conclusively confirm no funds were paid before cancellation.")
    payout.status, payout.review_note = "CANCELLED", note
    payout.save(update_fields=["status","review_note","updated_at"])
    payout.items.update(active=False)
    audit(actor, "payout.cancelled", payout.pk)
    return payout


def finalize(payout_id, actor, otp):
    if not settings.PAYSTACK_TRANSFERS_ENABLED: raise Conflict("Transfers are not enabled.")
    with transaction.atomic():
        provider, payout = _locked(payout_id)
        finance(actor, provider_id=provider.pk)
        _validate(provider, payout)
        attempt = payout.attempts.first()
        if payout.status != "OTP_REQUIRED" or not attempt or not attempt.transfer_code:
            raise Conflict("This transfer is not awaiting an OTP.")
        if attempt.finalized_at and attempt.finalized_at > timezone.now()-timedelta(minutes=1):
            raise Conflict("Wait for the previous OTP submission to be checked.")
        attempt.finalized_at = timezone.now()
        attempt.save(update_fields=["finalized_at"])
        payout.status = "UNKNOWN"
        payout.save(update_fields=["status","updated_at"])
        audit(actor, "payout.otp_submitted", payout.pk)
    # OTP is absent from database fields, audit data and notifications.
    try: Paystack().finalize_transfer(attempt.transfer_code, otp)
    except ServiceUnavailable: return payout
    return reconcile(attempt.pk)
