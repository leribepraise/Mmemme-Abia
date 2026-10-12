import uuid
from django.conf import settings
from django.db import models
from apps.common.models import Stock
from django.core.validators import MaxValueValidator


class TransportCompany(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="transport_company")
    name = models.CharField(max_length=200)
    registration_number = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    logo = models.ImageField(upload_to="transport/logos/", blank=True)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=30)
    address = models.TextField()
    boarding_instructions = models.TextField(blank=True)
    cancellation_hours = models.PositiveSmallIntegerField(default=24, validators=[MaxValueValidator(720)])
    commission_bps = models.PositiveSmallIntegerField(null=True, blank=True, validators=[MaxValueValidator(10000)])
    status = models.CharField(max_length=20, default="PENDING", choices=[(s, s.title()) for s in ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"]])
    review_note = models.TextField(blank=True)
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.PROTECT, related_name="transport_reviews")
    reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        constraints = [models.CheckConstraint(condition=models.Q(commission_bps__isnull=True) | models.Q(commission_bps__lte=10000), name="transport_commission_valid")]
    def __str__(self): return self.name


class CompanyStaff(models.Model):
    company = models.ForeignKey(TransportCompany, on_delete=models.CASCADE, related_name="staff")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    role = models.CharField(max_length=20, choices=[("MANAGER", "Manager"), ("BOARDING", "Boarding staff")])
    is_active = models.BooleanField(default=True)
    class Meta:
        constraints = [models.UniqueConstraint(fields=["company", "user"], name="transport_unique_staff")]


class Terminal(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(TransportCompany, on_delete=models.PROTECT, related_name="terminals")
    name = models.CharField(max_length=200)
    city = models.CharField(max_length=120)
    address = models.TextField()
    is_active = models.BooleanField(default=True)
    def __str__(self): return f"{self.company.name}: {self.name}"


class Vehicle(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(TransportCompany, on_delete=models.PROTECT, related_name="vehicles")
    name = models.CharField(max_length=100)
    registration_number = models.CharField(max_length=40)
    capacity = models.PositiveSmallIntegerField(validators=[MaxValueValidator(100)])
    amenities = models.CharField(max_length=500, blank=True)
    is_active = models.BooleanField(default=True)
    class Meta:
        constraints = [models.CheckConstraint(condition=models.Q(capacity__gte=1, capacity__lte=100), name="transport_vehicle_capacity"), models.UniqueConstraint(fields=["company", "registration_number"], name="transport_vehicle_registration")]
    def __str__(self): return self.name

class Route(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    name = models.CharField(max_length=200)
    origin = models.CharField(max_length=200, db_index=True)
    destination = models.CharField(max_length=200, db_index=True)
    pickup_address = models.TextField()
    is_active = models.BooleanField(default=False)
    company = models.ForeignKey(TransportCompany, null=True, blank=True, on_delete=models.PROTECT, related_name="routes")
    origin_terminal = models.ForeignKey(Terminal, null=True, blank=True, on_delete=models.PROTECT, related_name="outbound_routes")
    destination_terminal = models.ForeignKey(Terminal, null=True, blank=True, on_delete=models.PROTECT, related_name="inbound_routes")
    service_type = models.CharField(max_length=20, default="BUS", choices=[("BUS", "Scheduled bus"), ("EVENT_SHUTTLE", "Event shuttle")])
    event = models.ForeignKey("events.Event", null=True, blank=True, on_delete=models.PROTECT, related_name="transport_routes")
    def __str__(self):
        return self.name

class Departure(Stock):
    route = models.ForeignKey(Route, on_delete=models.PROTECT, related_name="departures")
    departs_at = models.DateTimeField(db_index=True)
    arrives_at = models.DateTimeField()
    vehicle = models.CharField(max_length=100)
    fleet_vehicle = models.ForeignKey(Vehicle, null=True, blank=True, on_delete=models.PROTECT, related_name="departures")
    status = models.CharField(max_length=20, default="SCHEDULED", choices=[(s, s.title()) for s in ["SCHEDULED", "CANCELLED", "COMPLETED"]])
    cancellation_reason = models.TextField(blank=True)
    class Meta(Stock.Meta):
        ordering = ["departs_at", "id"]
        constraints = Stock.Meta.constraints + [models.CheckConstraint(condition=models.Q(arrives_at__gt=models.F("departs_at")), name="departure_dates_valid")]
    def __str__(self):
        return f"{self.route.name} {self.departs_at}"


class TransportRequest(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(TransportCompany, on_delete=models.PROTECT, related_name='requests')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    booking = models.ForeignKey('bookings.Booking', null=True, blank=True, on_delete=models.PROTECT)
    message = models.TextField(max_length=3000)
    response = models.TextField(max_length=3000, blank=True)
    status = models.CharField(max_length=20, default='OPEN', choices=[('OPEN', 'Open'), ('RESOLVED', 'Resolved')])
    created_at = models.DateTimeField(auto_now_add=True)
