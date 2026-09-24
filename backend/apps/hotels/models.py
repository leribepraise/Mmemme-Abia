import uuid
from django.conf import settings
from django.db import models
from apps.common.models import Stock

class Hotel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    city = models.CharField(max_length=100, db_index=True)
    address = models.TextField()
    amenities = models.JSONField(default=list)
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name

class RoomType(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    hotel = models.ForeignKey(Hotel, on_delete=models.PROTECT, related_name="room_types")
    name = models.CharField(max_length=100)
    max_guests = models.PositiveSmallIntegerField(default=2)
    is_active = models.BooleanField(default=True)
    class Meta:
        constraints = [models.CheckConstraint(condition=models.Q(max_guests__gte=1), name="room_guests_positive")]
    def __str__(self):
        return f"{self.hotel.name} - {self.name}"

class RoomNight(Stock):
    room_type = models.ForeignKey(RoomType, on_delete=models.PROTECT, related_name="nights")
    date = models.DateField(db_index=True)
    class Meta(Stock.Meta):
        ordering = ["date", "id"]
        constraints = Stock.Meta.constraints + [models.UniqueConstraint(fields=["room_type", "date"], name="unique_room_night")]
    def __str__(self):
        return f"{self.room_type.name} {self.date}"
