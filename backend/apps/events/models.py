import uuid

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models



class Event(models.Model):
    class Status(models.TextChoices):
        IN_REVIEW = "IN_REVIEW", "In review"
        REJECTED = "REJECTED", "Rejected"
        DRAFT = "DRAFT", "Draft"
        PUBLISHED = "PUBLISHED", "Published"
        CANCELLED = "CANCELLED", "Cancelled"
        COMPLETED = "COMPLETED", "Completed"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    organizer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="events",
    )

    title = models.CharField(max_length=255)

    slug = models.SlugField(
        max_length=280,
        unique=True,
    )

    description = models.TextField()

    category = models.CharField(
        max_length=100,
        db_index=True,
    )

    venue = models.CharField(max_length=255)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100, default="Abia")

    start_datetime = models.DateTimeField()
    image_url = models.CharField(max_length=1000, blank=True)
    end_datetime = models.DateTimeField()

    capacity = models.PositiveIntegerField()

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
        db_index=True,
    )

    image = models.ImageField(
        upload_to="events/",
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def clean(self):
        if self.end_datetime <= self.start_datetime:
            raise ValidationError(
                "Event end time must be after the start time."
            )

    class Meta:
        ordering = ["-start_datetime"]
        constraints = [
            models.CheckConstraint(condition=models.Q(end_datetime__gt=models.F("start_datetime")), name="event_dates_valid"),
            models.CheckConstraint(condition=models.Q(capacity__gte=1), name="event_capacity_positive"),
        ]
        indexes = [
            models.Index(fields=["status", "start_datetime"]),
            models.Index(fields=["organizer", "created_at"]),
            models.Index(fields=["city", "state"]),
        ]

    def __str__(self):
        return self.title


class TicketType(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="ticket_types",
    )

    name = models.CharField(max_length=100)

    description = models.TextField(blank=True)

    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    quantity = models.PositiveIntegerField()

    quantity_sold = models.PositiveIntegerField(default=0)
    quantity_reserved = models.PositiveIntegerField(default=0)

    sales_start = models.DateTimeField(
        blank=True,
        null=True,
    )

    sales_end = models.DateTimeField(
        blank=True,
        null=True,
    )

    is_active = models.BooleanField(
        default=True,
        db_index=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["price"]
        constraints = [
            models.CheckConstraint(condition=models.Q(price__gte=0), name="ticket_price_nonnegative"),
            models.CheckConstraint(condition=models.Q(quantity__gte=models.F("quantity_sold") + models.F("quantity_reserved")), name="ticket_stock_valid"),
            models.CheckConstraint(condition=models.Q(sales_start__isnull=True) | models.Q(sales_end__isnull=True) | models.Q(sales_end__gt=models.F("sales_start")), name="ticket_sales_dates_valid"),
            models.UniqueConstraint(
                fields=["event", "name"],
                name="unique_ticket_type_per_event",
            ),
        ]
        indexes = [
            models.Index(fields=["event", "is_active"]),
        ]

    def __str__(self):
        return f"{self.event.title} - {self.name}"

    @property
    def quantity_available(self):
        return self.quantity - self.quantity_sold - self.quantity_reserved


class SavedEvent(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        constraints = [models.UniqueConstraint(fields=["user","event"], name="unique_saved_event")]


class EventReview(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.PROTECT, related_name="reviews")
    rating = models.PositiveSmallIntegerField()
    comment = models.CharField(max_length=3000, blank=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user","event"], name="unique_event_review"),
            models.CheckConstraint(condition=models.Q(rating__gte=1,rating__lte=5), name="event_review_rating"),
        ]
