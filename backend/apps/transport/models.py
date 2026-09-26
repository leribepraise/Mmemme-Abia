import uuid
from django.conf import settings
from django.db import models
from apps.common.models import Stock

class Route(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    name = models.CharField(max_length=200)
    origin = models.CharField(max_length=200, db_index=True)
    destination = models.CharField(max_length=200, db_index=True)
    pickup_address = models.TextField()
    is_active = models.BooleanField(default=False)
    def __str__(self):
        return self.name

class Departure(Stock):
    route = models.ForeignKey(Route, on_delete=models.PROTECT, related_name="departures")
    departs_at = models.DateTimeField(db_index=True)
    arrives_at = models.DateTimeField()
    vehicle = models.CharField(max_length=100)
    class Meta(Stock.Meta):
        ordering = ["departs_at", "id"]
        constraints = Stock.Meta.constraints + [models.CheckConstraint(condition=models.Q(arrives_at__gt=models.F("departs_at")), name="departure_dates_valid")]
    def __str__(self):
        return f"{self.route.name} {self.departs_at}"
