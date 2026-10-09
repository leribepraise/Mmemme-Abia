from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid
from .validators import validate_date_of_birth


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
    date_of_birth = models.DateField(null=True, blank=True, validators=[validate_date_of_birth])
    gender = models.CharField(max_length=30, blank=True)
    bio = models.TextField(max_length=2000, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True)

    is_verified = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)
    session_version = models.PositiveIntegerField(default=0, editable=False)
    onboarding_completed_at = models.DateTimeField(null=True, blank=True, editable=False)
    major_event_popup_pending = models.BooleanField(default=False, editable=False)
    interests = models.JSONField(default=list, blank=True)
    email_notifications = models.BooleanField(default=True)

    class Meta:
        constraints = [models.UniqueConstraint(models.functions.Lower("email"), name="user_email_case_insensitive")]

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.email


class EmailVerificationCode(models.Model):
    """A short-lived email challenge; never an account or a stored signup password."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    code_hash = models.CharField(max_length=128, blank=True)
    expires_at = models.DateTimeField()
    sent_at = models.DateTimeField()
    window_started_at = models.DateTimeField()
    send_count = models.PositiveSmallIntegerField(default=0)
    attempts = models.PositiveSmallIntegerField(default=0)
    consumed_at = models.DateTimeField(null=True, blank=True)


class SocialIdentity(models.Model):
    class Provider(models.TextChoices):
        GOOGLE = 'google', 'Google'
        APPLE = 'apple', 'Apple'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='social_identities')
    provider = models.CharField(max_length=20, choices=Provider.choices)
    subject = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['provider', 'subject'], name='social_identity_provider_subject')]


class OrganizerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="organizer_profile")
    business_name = models.CharField(max_length=200)
    logo = models.ImageField(upload_to='organizer-logos/', blank=True)
    description = models.TextField(blank=True)
    contact_phone = models.CharField(max_length=20)
    verification_reference = models.CharField(max_length=200, blank=True)
    event_type = models.CharField(max_length=100, blank=True)
    coverage_region = models.CharField(max_length=200, blank=True)
    terms_accepted_at = models.DateTimeField(null=True, blank=True, editable=False)
    terms_version = models.CharField(max_length=30, blank=True, editable=False)
    status = models.CharField(max_length=20, default="PENDING", choices=[(x,x.replace('_',' ').title()) for x in ["PENDING","APPROVED","REJECTED","NEEDS_INFO"]])
    reviewed_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="organizer_reviews")
    reviewed_at = models.DateTimeField(null=True, blank=True)
    review_note = models.CharField(max_length=2000, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
