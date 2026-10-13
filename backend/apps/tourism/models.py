from django.conf import settings
from django.db import models
from django.db.models import Avg
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.common.models import Stock
import uuid


class TourismOperator(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='tourism_operator')
    name = models.CharField(max_length=200)
    registration_number = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    logo = models.ImageField(upload_to='tourism/logos/', blank=True)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=30)
    address = models.TextField()
    visitor_instructions = models.TextField(blank=True)
    cancellation_hours = models.PositiveSmallIntegerField(default=24, validators=[MaxValueValidator(720)])
    commission_bps = models.PositiveSmallIntegerField(null=True, blank=True, validators=[MaxValueValidator(10000)])
    status = models.CharField(max_length=20, default='PENDING', choices=[(s, s.title()) for s in ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED']])
    review_note = models.TextField(blank=True)
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.PROTECT, related_name='tourism_operator_reviews')
    reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        constraints = [models.CheckConstraint(condition=models.Q(commission_bps__isnull=True) | models.Q(commission_bps__lte=10000), name='tourism_commission_valid')]
    def __str__(self): return self.name


class TourismStaff(models.Model):
    operator = models.ForeignKey(TourismOperator, on_delete=models.CASCADE, related_name='staff')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    role = models.CharField(max_length=20, choices=[('MANAGER', 'Manager'), ('GUIDE', 'Guide / check-in')])
    is_active = models.BooleanField(default=True)
    class Meta:
        constraints = [models.UniqueConstraint(fields=['operator', 'user'], name='tourism_unique_staff')]


class TourismExperience(models.Model):
    operator = models.ForeignKey(TourismOperator, null=True, blank=True, on_delete=models.PROTECT, related_name='experiences')
    review_status = models.CharField(max_length=20, default='APPROVED', choices=[(s, s.title()) for s in ['PENDING', 'APPROVED', 'REJECTED']])
    review_note = models.TextField(blank=True)

    class Category(models.TextChoices):
        ATTRACTION = "ATTRACTION", "Tourist Attraction"
        CULTURAL_SITE = "CULTURAL_SITE", "Cultural Site"
        ACTIVITY = "ACTIVITY", "Activity"
        LOCAL_EXPERIENCE = "LOCAL_EXPERIENCE", "Local Experience"

    name = models.CharField(max_length=200)

    description = models.TextField()

    category = models.CharField(
        max_length=30,
        choices=Category.choices,
    )

    location_name = models.CharField(max_length=200)

    address = models.TextField(blank=True)

    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
    )

    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
    )

    contact_phone = models.CharField(
        max_length=20,
        blank=True,
    )

    contact_email = models.EmailField(
        blank=True,
    )

    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0.00,
    )

    is_active = models.BooleanField(default=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="tourism_experiences",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def update_rating(self):
        average_rating = self.reviews.filter(
            is_approved=True
        ).aggregate(
            average=Avg("rating")
        )["average"]

        self.rating = average_rating or 0.00
        self.save(update_fields=["rating"])


class TourismImage(models.Model):
    experience = models.ForeignKey(
        TourismExperience,
        on_delete=models.CASCADE,
        related_name="images",
    )

    image = models.ImageField(
        upload_to="tourism/experiences/",
    )

    caption = models.CharField(
        max_length=255,
        blank=True,
    )

    is_primary = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.experience.name} - Image"


class TourismReview(models.Model):
    experience = models.ForeignKey(
        TourismExperience,
        on_delete=models.CASCADE,
        related_name="reviews",
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tourism_reviews",
    )

    rating = models.PositiveSmallIntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5),
        ]
    )

    comment = models.TextField(blank=True)

    is_approved = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["experience", "user"],
                name="unique_tourism_review_per_user",
            ),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.experience.name} ({self.rating}/5)"


class TourPackage(models.Model):
    itinerary = models.TextField(blank=True)
    inclusions = models.TextField(blank=True)
    exclusions = models.TextField(blank=True)
    meeting_point = models.TextField(blank=True)

    experience = models.ForeignKey(
        TourismExperience,
        on_delete=models.CASCADE,
        related_name="packages",
    )

    name = models.CharField(max_length=200)

    description = models.TextField(blank=True)

    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    duration_hours = models.PositiveIntegerField(
        default=1,
    )

    is_active = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return f"{self.experience.name} - {self.name}"


class TourDeparture(Stock):
    status = models.CharField(max_length=20, default='SCHEDULED', choices=[(s, s.title()) for s in ['SCHEDULED', 'CANCELLED', 'COMPLETED']])
    cancellation_reason = models.TextField(blank=True)
    guide = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.PROTECT, related_name='guided_tours')
    package = models.ForeignKey(TourPackage, on_delete=models.PROTECT, related_name="departures")
    starts_at = models.DateTimeField(db_index=True)
    ends_at = models.DateTimeField()
    class Meta(Stock.Meta):
        ordering = ["starts_at", "id"]
        constraints = Stock.Meta.constraints + [models.CheckConstraint(condition=models.Q(ends_at__gt=models.F("starts_at")), name="tour_departure_dates")]


class TourismRequest(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    operator = models.ForeignKey(TourismOperator, on_delete=models.PROTECT, related_name='requests')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    booking = models.ForeignKey('bookings.Booking', null=True, blank=True, on_delete=models.PROTECT)
    message = models.TextField(max_length=3000)
    response = models.TextField(max_length=3000, blank=True)
    status = models.CharField(max_length=20, default='OPEN', choices=[('OPEN', 'Open'), ('RESOLVED', 'Resolved')])
    created_at = models.DateTimeField(auto_now_add=True)
