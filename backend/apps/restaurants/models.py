import uuid
from django.conf import settings
from django.db import models
from apps.common.models import Stock

class Restaurant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    city = models.CharField(max_length=100, db_index=True)
    address = models.TextField()
    is_active = models.BooleanField(default=False)
    accepts_orders = models.BooleanField(default=False)
    offers_delivery = models.BooleanField(default=False)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    delivery_cities = models.JSONField(default=list)
    class Meta:
        constraints = [models.CheckConstraint(condition=models.Q(delivery_fee__gte=0), name="delivery_fee_nonnegative")]
    def __str__(self):
        return self.name

class MenuItem(Stock):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.PROTECT, related_name="menu")
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    allergens = models.CharField(max_length=500, blank=True)
    class Meta(Stock.Meta):
        ordering = ["name", "id"]
    def __str__(self):
        return self.name
