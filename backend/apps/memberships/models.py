import uuid
from django.conf import settings
from django.db import models


class Plan(models.Model):
    code = models.SlugField(primary_key=True)
    name = models.CharField(max_length=60)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    features = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [models.CheckConstraint(condition=models.Q(price__gte=0), name='plan_price_nonnegative')]

    def __str__(self):
        return self.name


class Membership(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='membership')
    plan = models.ForeignKey(Plan, on_delete=models.PROTECT)
    expires_at = models.DateTimeField()
    updated_at = models.DateTimeField(auto_now=True)


class PlanPayment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    plan = models.ForeignKey(Plan, on_delete=models.PROTECT)
    reference = models.CharField(max_length=60, unique=True)
    idempotency_key = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='NGN')
    status = models.CharField(max_length=20, default='PROCESSING', choices=[(s, s.title()) for s in ['PROCESSING', 'SUCCESS', 'FAILED', 'REVIEW']])
    authorization_url = models.URLField(max_length=500, blank=True)
    provider_reference = models.CharField(max_length=100, null=True, unique=True)
    last_checked_at = models.DateTimeField(null=True)
    paid_at = models.DateTimeField(null=True)
    expires_at = models.DateTimeField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at', '-pk']
        constraints = [models.UniqueConstraint(fields=['user', 'idempotency_key'], name='membership_payment_request'),
                       models.CheckConstraint(condition=models.Q(amount__gt=0), name='membership_payment_positive')]
