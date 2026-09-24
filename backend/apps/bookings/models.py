import uuid
from django.conf import settings
from django.db import models
from django.db.models import Q, F

class Booking(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        CONFIRMED = "CONFIRMED", "Confirmed"
        CANCELLED = "CANCELLED", "Cancelled"
        EXPIRED = "EXPIRED", "Expired"
        REFUND_PENDING = "REFUND_PENDING", "Refund pending"
        REFUNDED = "REFUNDED", "Refunded"
    class Kind(models.TextChoices):
        EVENT = "EVENT", "Event"
        HOTEL = "HOTEL", "Hotel"
        FOOD = "FOOD", "Food"
        TRANSPORT = "TRANSPORT", "Transport"
        TOURISM = "TOURISM", "Tourism"
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="bookings")
    supplier = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.PROTECT, related_name="received_bookings")
    kind = models.CharField(max_length=20, choices=Kind.choices, default=Kind.EVENT)
    parent_id = models.CharField(max_length=64, blank=True)
    booking_reference = models.CharField(max_length=50, unique=True)
    idempotency_key = models.CharField(max_length=100, null=True, blank=True)
    request_hash = models.CharField(max_length=64, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING, db_index=True)
    fulfillment_status = models.CharField(max_length=20, default="NEW", choices=[(x,x.title()) for x in ["NEW","ACCEPTED","READY","IN_PROGRESS","COMPLETED"]])
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default="NGN")
    expires_at = models.DateTimeField(null=True, blank=True, db_index=True)
    completed_at = models.DateTimeField(null=True, blank=True, db_index=True)
    details = models.JSONField(default=dict)
    customer_name = models.CharField(max_length=200, blank=True)
    customer_phone = models.CharField(max_length=20, blank=True)
    customer_note = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        ordering = ["-created_at", "-id"]
        indexes = [models.Index(fields=["user","created_at"]), models.Index(fields=["status","created_at"])]
        constraints = [
            models.UniqueConstraint(fields=["user","idempotency_key"], name="unique_booking_request"),
            models.CheckConstraint(condition=Q(total_amount__gte=0), name="booking_total_nonnegative"),
        ]
    def __str__(self):
        return self.booking_reference

class BookingItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name="items")
    ticket_type = models.ForeignKey("events.TicketType", null=True, blank=True, on_delete=models.PROTECT, related_name="booking_items")
    room_night = models.ForeignKey("hotels.RoomNight", null=True, blank=True, on_delete=models.PROTECT, related_name="booking_items")
    menu_item = models.ForeignKey("restaurants.MenuItem", null=True, blank=True, on_delete=models.PROTECT, related_name="booking_items")
    departure = models.ForeignKey("transport.Departure", null=True, blank=True, on_delete=models.PROTECT, related_name="booking_items")
    tour_departure = models.ForeignKey("tourism.TourDeparture", null=True, blank=True, on_delete=models.PROTECT, related_name="booking_items")
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["booking",field], name=f"booking_unique_{field}")
            for field in ["ticket_type","room_night","menu_item","departure","tour_departure"]
        ] + [
            models.CheckConstraint(condition=Q(quantity__gte=1, unit_price__gte=0, subtotal__gte=0), name="booking_item_positive"),
            models.CheckConstraint(condition=Q(subtotal=models.functions.Round(F("unit_price")*F("quantity"),2)), name="booking_item_subtotal"),
            models.CheckConstraint(condition=(
                Q(ticket_type__isnull=False,room_night__isnull=True,menu_item__isnull=True,departure__isnull=True,tour_departure__isnull=True) |
                Q(ticket_type__isnull=True,room_night__isnull=False,menu_item__isnull=True,departure__isnull=True,tour_departure__isnull=True) |
                Q(ticket_type__isnull=True,room_night__isnull=True,menu_item__isnull=False,departure__isnull=True,tour_departure__isnull=True) |
                Q(ticket_type__isnull=True,room_night__isnull=True,menu_item__isnull=True,departure__isnull=False,tour_departure__isnull=True) |
                Q(ticket_type__isnull=True,room_night__isnull=True,menu_item__isnull=True,departure__isnull=True,tour_departure__isnull=False)
            ), name="booking_item_one_source"),
        ]
    def __str__(self):
        return f"{self.booking.booking_reference} - {self.description}"
