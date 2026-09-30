from django.conf import settings
from django.db import models
from django.utils import timezone

class Notification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications", null=True, blank=True)
    key = models.CharField(max_length=200, unique=True)
    subject = models.CharField(max_length=200)
    body = models.TextField()
    email = models.EmailField()
    is_read = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True, db_index=True)
    is_private = models.BooleanField(default=False)
    available_at = models.DateTimeField(default=timezone.now, db_index=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    claimed_at = models.DateTimeField(null=True, blank=True)
    attempts = models.PositiveIntegerField(default=0)
    failed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ["-created_at", "-id"]


class PushSubscription(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='push_subscriptions')
    endpoint = models.URLField(max_length=2048, unique=True)
    p256dh = models.CharField(max_length=200)
    auth = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    session_version = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class PushDelivery(models.Model):
    notification = models.ForeignKey(Notification, on_delete=models.CASCADE, related_name='push_deliveries')
    subscription = models.ForeignKey(PushSubscription, on_delete=models.CASCADE)
    available_at = models.DateTimeField(default=timezone.now, db_index=True)
    claimed_at = models.DateTimeField(null=True, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    attempts = models.PositiveSmallIntegerField(default=0)
    failed = models.BooleanField(default=False)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['notification', 'subscription'], name='notification_push_once')]
