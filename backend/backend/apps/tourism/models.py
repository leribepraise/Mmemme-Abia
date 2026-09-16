from django.conf import settings
from django.db import models
from django.db.models import Avg
from django.core.validators import MinValueValidator, MaxValueValidator


class TourismExperience(models.Model):

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