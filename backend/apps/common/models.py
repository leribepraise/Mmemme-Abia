import uuid
from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import F, Q

class Stock(models.Model):
    """Inventory mutations hold the supplier and stock row locks."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    price = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    quantity = models.PositiveIntegerField()
    quantity_reserved = models.PositiveIntegerField(default=0)
    quantity_sold = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    class Meta:
        abstract = True
        constraints = [
            models.CheckConstraint(condition=Q(price__gte=0), name="%(app_label)s_%(class)s_price"),
            models.CheckConstraint(condition=Q(quantity__gte=F("quantity_reserved") + F("quantity_sold")), name="%(app_label)s_%(class)s_stock"),
        ]
    @property
    def quantity_available(self):
        return self.quantity - self.quantity_reserved - self.quantity_sold

class AuditLog(models.Model):
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL)
    action = models.CharField(max_length=80, db_index=True)
    target = models.CharField(max_length=160)
    details = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    class Meta:
        ordering = ["-created_at"]

def audit(actor, action, target, **details):
    return AuditLog.objects.create(actor=actor, action=action, target=str(target), details=details)

