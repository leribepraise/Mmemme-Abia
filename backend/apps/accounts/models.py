from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        USER = "USER", "User"
        ORGANIZER = "ORGANIZER", "Organizer"
        ADMIN = "ADMIN", "Admin"

    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.USER,
    )
    phone = models.CharField(max_length=20, blank=True)
    whatsapp = models.CharField(max_length=20, blank=True)
    lga = models.CharField(max_length=100, blank=True)
    address = models.CharField(max_length=500, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=30, blank=True)
    bio = models.TextField(max_length=2000, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True)

    is_verified = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)
    interests = models.JSONField(default=list, blank=True)
    email_notifications = models.BooleanField(default=True)

    class Meta:
        constraints = [models.UniqueConstraint(models.functions.Lower("email"), name="user_email_case_insensitive")]

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.email


class OrganizerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="organizer_profile")
    business_name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    contact_phone = models.CharField(max_length=20)
    verification_reference = models.CharField(max_length=200)
    status = models.CharField(max_length=20, default="PENDING", choices=[(x,x.title()) for x in ["PENDING","APPROVED","REJECTED"]])
    reviewed_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="organizer_reviews")
    reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
