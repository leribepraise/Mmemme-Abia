import uuid

from django.conf import settings
from django.db import models


class Payment(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        PROCESSING = "PROCESSING", "Processing"
        SUCCESS = "SUCCESS", "Success"
        FAILED = "FAILED", "Failed"
        REFUNDED = "REFUNDED", "Refunded"

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

    metadata = models.JSONField(
        default=dict,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
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