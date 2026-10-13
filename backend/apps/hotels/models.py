import uuid
from datetime import time
from django.core.validators import MaxValueValidator
from django.conf import settings
from django.db import models
from apps.common.models import Stock

class HotelProvider(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='hotel_provider')
    name = models.CharField(max_length=200)
    registration_number = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    logo = models.ImageField(upload_to='hotels/logos/', blank=True)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=30)
    address = models.TextField()
    commission_bps = models.PositiveSmallIntegerField(null=True, blank=True, validators=[MaxValueValidator(10000)])
    status = models.CharField(max_length=20, default='PENDING', choices=[(s, s.title()) for s in ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED']])
    review_note = models.TextField(blank=True)
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.PROTECT, related_name='hotel_provider_reviews')
    reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        constraints = [models.CheckConstraint(condition=models.Q(commission_bps__isnull=True) | models.Q(commission_bps__lte=10000), name='hotel_commission_valid')]
    def __str__(self): return self.name

class HotelStaff(models.Model):
    provider = models.ForeignKey(HotelProvider, on_delete=models.CASCADE, related_name='staff')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    role = models.CharField(max_length=20, choices=[('MANAGER', 'Manager'), ('RECEPTION', 'Reception'), ('HOUSEKEEPING', 'Housekeeping')])
    is_active = models.BooleanField(default=True)
    class Meta:
        constraints = [models.UniqueConstraint(fields=['provider', 'user'], name='hotel_unique_staff')]

class Hotel(models.Model):
    provider = models.ForeignKey(HotelProvider, null=True, blank=True, on_delete=models.PROTECT, related_name='properties')
    property_type = models.CharField(max_length=20, default='HOTEL', choices=[(s, s.replace('_', ' ').title()) for s in ['HOTEL', 'GUESTHOUSE', 'APARTMENT', 'RESORT', 'HOLIDAY_HOME']])
    review_status = models.CharField(max_length=20, default='APPROVED', choices=[(s, s.title()) for s in ['PENDING', 'APPROVED', 'REJECTED']])
    review_note = models.TextField(blank=True)
    contact_phone = models.CharField(max_length=30, blank=True)
    contact_email = models.EmailField(blank=True)
    house_rules = models.TextField(blank=True)
    check_in_time = models.TimeField(default=time(14, 0))
    check_out_time = models.TimeField(default=time(12, 0))
    cancellation_hours = models.PositiveSmallIntegerField(default=24, validators=[MaxValueValidator(720)])
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
    description = models.TextField(blank=True)
    beds = models.CharField(max_length=200, blank=True)
    amenities = models.JSONField(default=list)
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

class HotelImage(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='hotels/properties/')
    caption = models.CharField(max_length=255, blank=True)
    is_primary = models.BooleanField(default=False)

class RoomUnit(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    hotel = models.ForeignKey(Hotel, on_delete=models.PROTECT, related_name='units')
    room_type = models.ForeignKey(RoomType, on_delete=models.PROTECT, related_name='units')
    name = models.CharField(max_length=100)
    state = models.CharField(max_length=20, default='READY', choices=[('READY', 'Ready'), ('DIRTY', 'Needs cleaning'), ('MAINTENANCE', 'Maintenance')])
    is_active = models.BooleanField(default=True)
    class Meta:
        constraints = [models.UniqueConstraint(fields=['hotel', 'name'], name='hotel_unique_unit')]
    def __str__(self): return self.name

class RoomAssignment(models.Model):
    booking = models.ForeignKey('bookings.Booking', on_delete=models.PROTECT, related_name='room_assignments')
    unit = models.ForeignKey(RoomUnit, on_delete=models.PROTECT, related_name='assignments')
    class Meta:
        constraints = [models.UniqueConstraint(fields=['booking', 'unit'], name='hotel_unique_assignment')]

class HotelRequest(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    provider = models.ForeignKey(HotelProvider, on_delete=models.PROTECT, related_name='requests')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    booking = models.ForeignKey('bookings.Booking', null=True, blank=True, on_delete=models.PROTECT)
    message = models.TextField(max_length=3000)
    response = models.TextField(max_length=3000, blank=True)
    status = models.CharField(max_length=20, default='OPEN', choices=[('OPEN', 'Open'), ('RESOLVED', 'Resolved')])
    created_at = models.DateTimeField(auto_now_add=True)
