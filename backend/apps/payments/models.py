import uuid

from django.conf import settings
from django.db import models
from django.utils import timezone


class Payment(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        PROCESSING = "PROCESSING", "Processing"
        SUCCESS = "SUCCESS", "Success"
        FAILED = "FAILED", "Failed"
        REFUNDED = "REFUNDED", "Refunded"
        REFUND_PENDING = "REFUND_PENDING", "Refund pending"
        REVIEW = "REVIEW", "Needs review"

    class Provider(models.TextChoices):
        PAYSTACK = "PAYSTACK", "Paystack"
        FLUTTERWAVE = "FLUTTERWAVE", "Flutterwave"
        STRIPE = "STRIPE", "Stripe"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    booking = models.ForeignKey(
        "bookings.Booking",
        on_delete=models.PROTECT,
        related_name="payments",
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="payments",
    )

    reference = models.CharField(
        max_length=100,
        unique=True,
        db_index=True,
    )

    idempotency_key = models.CharField(
        max_length=100,
        unique=True,
        db_index=True,
    )

    provider = models.CharField(
        max_length=20,
        choices=Provider.choices,
    )

    provider_reference = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        db_index=True,
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    currency = models.CharField(
        max_length=3,
        default="NGN",
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True,
    )

    paid_at = models.DateTimeField(
        blank=True,
        null=True,
    )
    authorization_url = models.URLField(max_length=500, blank=True)
    initialized_at = models.DateTimeField(null=True, blank=True)
    last_checked_at = models.DateTimeField(null=True, blank=True, db_index=True)

    metadata = models.JSONField(
        default=dict,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.CheckConstraint(condition=models.Q(amount__gte=0), name="payment_amount_nonnegative"),
            models.UniqueConstraint(
                fields=["provider", "provider_reference"],
                name="unique_provider_reference",
            ),
        ]
        indexes = [
            models.Index(fields=["booking", "status"]),
            models.Index(fields=["user", "created_at"]),
            models.Index(fields=["provider", "status"]),
        ]

    def __str__(self):
        return self.reference


class PaymentEvent(models.Model):
    digest = models.CharField(max_length=64, unique=True)
    event_type = models.CharField(max_length=100)
    reference = models.CharField(max_length=255, blank=True)
    resource_id = models.CharField(max_length=100, blank=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    claimed_at = models.DateTimeField(null=True, blank=True)
    attempts = models.PositiveIntegerField(default=0)
    available_at = models.DateTimeField(default=timezone.now)
    last_error = models.CharField(max_length=80, blank=True)
    received_at = models.DateTimeField(auto_now_add=True)


class Refund(models.Model):
    payment = models.OneToOneField(Payment, on_delete=models.PROTECT, related_name="refund")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, default="QUEUED", choices=[(x,x.title()) for x in ["QUEUED","PROCESSING","UNKNOWN","PROCESSED","FAILED","REVIEW"]])
    provider_id = models.CharField(max_length=100, blank=True)
    reason = models.CharField(max_length=200)
    claimed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        constraints = [models.CheckConstraint(condition=models.Q(amount__gt=0), name="refund_amount_positive")]


class LedgerEntry(models.Model):
    booking = models.ForeignKey("bookings.Booking", on_delete=models.PROTECT)
    payment = models.ForeignKey(Payment, on_delete=models.PROTECT)
    kind = models.CharField(max_length=10, choices=[("SALE","Sale"),("REFUND","Refund")])
    gross = models.DecimalField(max_digits=12, decimal_places=2)
    platform_fee = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    provider_amount = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        constraints = [models.UniqueConstraint(fields=["payment","kind"], name="ledger_payment_kind")]


class PayoutAccount(models.Model):
    """Versioned bank details. Never persist the complete bank account number."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    provider = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    recipient_code = models.CharField(max_length=100)
    recipient_id = models.CharField(max_length=100)
    bank_code = models.CharField(max_length=20)
    bank_name = models.CharField(max_length=200)
    account_name = models.CharField(max_length=200)
    account_last4 = models.CharField(max_length=4)
    is_current = models.BooleanField(default=True)
    status = models.CharField(max_length=20, default="PENDING", choices=[(x,x.title()) for x in ["PENDING","APPROVED","REJECTED","SUSPENDED"]])
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.PROTECT, related_name="bank_reviews")
    reviewed_at = models.DateTimeField(null=True)
    review_note = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ["-created_at","id"]
        permissions = [("review_payoutaccount", "Review provider bank accounts")]
        constraints = [models.UniqueConstraint(fields=["provider"], condition=models.Q(is_current=True), name="one_current_payout_account")]


class Payout(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    provider = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    account = models.ForeignKey(PayoutAccount, on_delete=models.PROTECT)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default="NGN")
    idempotency_key = models.CharField(max_length=100)
    status = models.CharField(max_length=20, default="REQUESTED", db_index=True, choices=[(x,x.replace('_',' ').title()) for x in ["REQUESTED","APPROVED","PROCESSING","OTP_REQUIRED","UNKNOWN","PAID","FAILED","REVERSED","REVIEW","CANCELLED"]])
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.PROTECT, related_name="payout_approvals")
    approved_at = models.DateTimeField(null=True)
    review_note = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        ordering = ["-created_at","id"]
        permissions = [("release_payout", "Approve, finalize and reconcile provider payouts")]
        constraints = [models.UniqueConstraint(fields=["provider","idempotency_key"], name="payout_request_key"), models.CheckConstraint(condition=models.Q(amount__gt=0), name="payout_positive")]


class PayoutItem(models.Model):
    payout = models.ForeignKey(Payout, on_delete=models.PROTECT, related_name="items")
    sale = models.ForeignKey(LedgerEntry, on_delete=models.PROTECT, related_name="payout_items")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    active = models.BooleanField(default=True)
    class Meta:
        constraints = [models.UniqueConstraint(fields=["sale"], condition=models.Q(active=True), name="sale_paid_out_once"), models.CheckConstraint(condition=models.Q(amount__gt=0), name="payout_item_positive")]


class PayoutAttempt(models.Model):
    payout = models.ForeignKey(Payout, on_delete=models.PROTECT, related_name="attempts")
    reference = models.CharField(max_length=50, unique=True)
    transfer_code = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, default="unknown")
    claimed_at = models.DateTimeField(default=timezone.now)
    checked_at = models.DateTimeField(null=True, db_index=True)
    finalized_at = models.DateTimeField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ["-created_at","-id"]
