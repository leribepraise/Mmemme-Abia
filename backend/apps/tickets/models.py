import uuid

from django.conf import settings
from django.db import models


class Ticket(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        USED = "USED", "Used"
        CANCELLED = "CANCELLED", "Cancelled"
        REFUNDED = "REFUNDED", "Refunded"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    booking = models.ForeignKey(
        "bookings.Booking",
        on_delete=models.PROTECT,
        related_name="tickets",
    )

    booking_item = models.ForeignKey(
        "bookings.BookingItem",
        on_delete=models.PROTECT,
        related_name="tickets",
    )

    ticket_type = models.ForeignKey(
        "events.TicketType",
        on_delete=models.PROTECT,
        related_name="tickets",
    )

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="tickets",
    )

    ticket_number = models.CharField(
        max_length=100,
        unique=True,
        db_index=True,
    )

    qr_code = models.CharField(
        max_length=255,
        unique=True,
        db_index=True,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
        db_index=True,
    )

    checked_in_at = models.DateTimeField(
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["booking", "status"]),
            models.Index(fields=["owner", "status"]),
            models.Index(fields=["ticket_type", "status"]),
        ]

    def __str__(self):
        return self.ticket_number