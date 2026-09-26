import hashlib
import json
import uuid
from datetime import datetime, time, timedelta
from decimal import Decimal
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import Sum
from django.utils import timezone
from rest_framework.exceptions import PermissionDenied, ValidationError
from apps.common.api import Conflict
from apps.common.models import audit
from .models import Booking, BookingItem

SOURCES = {"EVENT": "ticket_type", "HOTEL": "room_night", "FOOD": "menu_item", "TRANSPORT": "departure", "TOURISM": "tour_departure"}

def resource_model(kind):
    from apps.events.models import TicketType
    from apps.hotels.models import RoomNight
    from apps.restaurants.models import MenuItem
    from apps.transport.models import Departure
    from apps.tourism.models import TourDeparture
    return {"EVENT": TicketType, "HOTEL": RoomNight, "FOOD": MenuItem, "TRANSPORT": Departure, "TOURISM": TourDeparture}[kind]

def parent_model(kind):
    from apps.events.models import Event
    from apps.hotels.models import Hotel
    from apps.restaurants.models import Restaurant
    from apps.transport.models import Route
    from apps.tourism.models import TourismExperience
    return {"EVENT": Event, "HOTEL": Hotel, "FOOD": Restaurant, "TRANSPORT": Route, "TOURISM": TourismExperience}[kind]

def parent_of(kind, resource):
    if kind == "EVENT": return resource.event
    if kind == "HOTEL": return resource.room_type.hotel
    if kind == "FOOD": return resource.restaurant
    if kind == "TRANSPORT": return resource.route
    return resource.package.experience

def supplier_of(kind, parent):
    if kind == "EVENT": return parent.organizer
    if kind == "TOURISM": return parent.created_by
    return parent.owner

def _locked_booking(booking_id):
    original = Booking.objects.get(pk=booking_id)
    parent = parent_model(original.kind).objects.select_for_update().get(pk=original.parent_id)
    return parent, Booking.objects.select_for_update().get(pk=booking_id)

def _change_stock(booking, reserved=0, sold=0):
    source = SOURCES[booking.kind]
    for item in booking.items.order_by(source + "_id"):
        resource = resource_model(booking.kind).objects.select_for_update().get(pk=getattr(item, source + "_id"))
        resource.quantity_reserved += reserved * item.quantity
        resource.quantity_sold += sold * item.quantity
        resource.save(update_fields=["quantity_reserved", "quantity_sold"])

def _expire_locked(booking):
    if booking.status == Booking.Status.PENDING and booking.expires_at and booking.expires_at <= timezone.now():
        _change_stock(booking, reserved=-1)
        booking.status = Booking.Status.EXPIRED
        booking.save(update_fields=["status", "updated_at"])
        audit(None, "booking.expired", booking.pk)
        return True
    return False

def _validate_resources(kind, parent, resources, entries, details):
    now = timezone.now()
    owner = supplier_of(kind, parent)
    if not owner or not owner.is_active or not owner.is_verified:
        raise Conflict("This provider is not available for bookings.")
    if (kind == "EVENT" and (parent.status != "PUBLISHED" or parent.start_datetime <= now)) or (kind != "EVENT" and not parent.is_active):
        raise Conflict("This listing is not available for bookings.")
    for entry in entries:
        r = resources[str(entry["id"])]
        if not r.is_active or entry["quantity"] > r.quantity_available:
            raise Conflict("The requested quantity is no longer available.")
        if r.price < 0:
            raise Conflict("This listing has invalid pricing.")
        if kind == "EVENT" and ((r.sales_start and now < r.sales_start) or (r.sales_end and now >= r.sales_end)):
            raise Conflict("Ticket sales are closed.")
        if kind == "TRANSPORT" and r.departs_at <= now:
            raise Conflict("This departure is closed.")
        if kind == "TOURISM" and (r.starts_at <= now or not r.package.is_active):
            raise Conflict("This tour is closed.")
    if kind == "EVENT":
        totals = parent.ticket_types.aggregate(sold=Sum("quantity_sold"), held=Sum("quantity_reserved"))
        if sum(e["quantity"] for e in entries) + (totals["sold"] or 0) + (totals["held"] or 0) > parent.capacity:
            raise Conflict("The event has insufficient capacity.")
    if kind in {"TRANSPORT", "TOURISM"} and len(entries) != 1:
        raise ValidationError("Book one departure at a time.")
    if kind == "HOTEL":
        ordered = sorted(resources.values(), key=lambda r:r.date)
        if len({r.room_type_id for r in ordered}) != 1 or len({e["quantity"] for e in entries}) != 1:
            raise ValidationError("A stay must use one room type and the same room count each night.")
        if not ordered[0].room_type.is_active or ordered[0].date < timezone.localdate():
            raise Conflict("These rooms are unavailable.")
        if len(ordered) > 30 or any(b.date != a.date + timedelta(days=1) for a,b in zip(ordered, ordered[1:])):
            raise ValidationError("A stay must contain consecutive nights, up to 30 nights.")
        guests = details.get("guests", 1)
        if guests > ordered[0].room_type.max_guests * entries[0]["quantity"]:
            raise ValidationError("The room selection cannot accommodate this many guests.")
        details.update(check_in=str(ordered[0].date), check_out=str(ordered[-1].date + timedelta(days=1)), rooms=entries[0]["quantity"], room_type=ordered[0].room_type.name)
    if kind == "FOOD":
        if not parent.accepts_orders:
            raise Conflict("This restaurant is not accepting orders.")
        if details.get("delivery_method") == "DELIVERY":
            if not parent.offers_delivery or not details.get("delivery_address"):
                raise ValidationError("Delivery is unavailable or the delivery address is missing.")
            if details.get("delivery_city", "").casefold() not in [str(c).casefold() for c in parent.delivery_cities]:
                raise ValidationError("The restaurant does not deliver to this city.")
            details["delivery_fee"] = str(parent.delivery_fee)
        else:
            details["delivery_method"] = "PICKUP"
            details["delivery_fee"] = "0.00"
    details["title"] = getattr(parent, "title", None) or parent.name
    details["location"] = getattr(parent, "address", "") or getattr(parent, "pickup_address", "")
    if kind == "EVENT":
        details["event_id"] = str(parent.pk)
        details["start_datetime"] = parent.start_datetime.isoformat()
        details["end_datetime"] = parent.end_datetime.isoformat()
        details["location"] = parent.venue + (", " + parent.address if parent.address else "")
    if kind == "HOTEL":
        details["hotel_id"] = str(parent.pk)
    details["cancellation_policy"] = "Full refund before the service starts; food orders may only be cancelled before provider acceptance."

@transaction.atomic
def reserve(user, key, kind, entries, details, customer_name="", customer_phone="", customer_note=""):
    if not user.email_verified:
        raise PermissionDenied("Verify your email before making a booking.")
    if not entries or len(entries) > 30:
        raise ValidationError("Provide between 1 and 30 booking items.")
    if len({str(e["id"]) for e in entries}) != len(entries):
        raise ValidationError("Each inventory item may appear only once.")
    if any(not 1 <= e["quantity"] <= settings.MAX_BOOKING_QUANTITY for e in entries):
        raise ValidationError("Each quantity must be between 1 and 20.")
    payload = {"kind":kind, "entries":sorted(entries,key=lambda x:str(x["id"])), "details":details, "name":customer_name, "phone":customer_phone, "note":customer_note}
    fingerprint = hashlib.sha256(json.dumps(payload,sort_keys=True,default=str).encode()).hexdigest()
    # The user lock serializes competing retries, including retries for different suppliers.
    get_user_model().objects.select_for_update(no_key=True).get(pk=user.pk)
    existing = Booking.objects.filter(user=user, idempotency_key=key).first()
    if existing:
        if existing.request_hash != fingerprint:
            raise Conflict("This Idempotency-Key was already used with different booking details.")
        return existing, False
    model = resource_model(kind)
    preliminary = list(model.objects.filter(pk__in=[e["id"] for e in entries]))
    if len(preliminary) != len(entries):
        raise ValidationError("One or more inventory items do not exist.")
    parents = {str(parent_of(kind,r).pk) for r in preliminary}
    if len(parents) != 1:
        raise ValidationError("Each booking must belong to one event or provider listing.")
    parent = parent_model(kind).objects.select_for_update().get(pk=parents.pop())
    for old in Booking.objects.select_for_update().filter(kind=kind,parent_id=str(parent.pk),status="PENDING",expires_at__lte=timezone.now()).order_by("id"):
        _expire_locked(old)
    resources = {str(r.pk):r for r in model.objects.select_for_update().filter(pk__in=[e["id"] for e in entries]).order_by("pk")}
    if any(str(parent_of(kind,r).pk) != str(parent.pk) for r in resources.values()):
        raise Conflict("The inventory changed; refresh and try again.")
    details = dict(details)
    _validate_resources(kind,parent,resources,entries,details)
    total = sum((resources[str(e["id"])].price * e["quantity"] for e in entries), Decimal("0.00"))
    total += Decimal(details.get("delivery_fee", "0.00"))
    if total > Decimal("9999999999.99"):
        raise ValidationError("The booking total is too large.")
    booking = Booking.objects.create(user=user,supplier=supplier_of(kind,parent),kind=kind,parent_id=str(parent.pk),booking_reference="MM-"+uuid.uuid4().hex.upper(),idempotency_key=key,request_hash=fingerprint,total_amount=total,expires_at=timezone.now()+timedelta(minutes=settings.RESERVATION_MINUTES),details=details,customer_name=customer_name,customer_phone=customer_phone,customer_note=customer_note)
    for entry in entries:
        resource = resources[str(entry["id"])]
        BookingItem.objects.create(booking=booking,**{SOURCES[kind]:resource},quantity=entry["quantity"],unit_price=resource.price,subtotal=resource.price*entry["quantity"],description=str(resource)[:500])
        resource.quantity_reserved += entry["quantity"]
        resource.save(update_fields=["quantity_reserved"])
    audit(user,"booking.reserved",booking.pk,kind=kind)
    if total == 0:
        confirm_locked(booking)
    return booking, True

def confirm_locked(booking):
    """Caller holds parent then booking locks and has verified payment (or zero price)."""
    if booking.status == "CONFIRMED":
        return
    if booking.status != "PENDING":
        raise Conflict("This reservation can no longer be confirmed.")
    _change_stock(booking,reserved=-1,sold=1)
    booking.status = "CONFIRMED"
    booking.save(update_fields=["status","updated_at"])
    from apps.tickets.services import issue_tickets
    from apps.notifications.services import notify
    issue_tickets(booking)
    notify(booking.user, f"booking:{booking.pk}:confirmed", "Booking confirmed", f"Your booking {booking.booking_reference} is confirmed. View it in your account.")
    audit(None,"booking.confirmed",booking.pk)

def still_deliverable(booking,parent):
    """A hold guarantees stock, but cannot authorize a cancelled or elapsed service."""
    owner=supplier_of(booking.kind,parent)
    if not owner or not owner.is_active or not owner.is_verified: return False
    now=timezone.now()
    if booking.kind=="EVENT": return parent.status=="PUBLISHED" and parent.start_datetime>now
    if not parent.is_active: return False
    if booking.kind=="HOTEL": return booking.details["check_in"]>=str(timezone.localdate())
    if booking.kind=="TRANSPORT": return booking.items.first().departure.departs_at>now
    if booking.kind=="TOURISM": return booking.items.first().tour_departure.starts_at>now
    return parent.accepts_orders

@transaction.atomic
def expire(booking_id):
    _, booking = _locked_booking(booking_id)
    return _expire_locked(booking)

def can_cancel(booking, parent):
    now = timezone.now()
    if booking.fulfillment_status != "NEW":
        return False
    if booking.kind == "EVENT": return parent.start_datetime > now
    if booking.kind == "HOTEL": return booking.details.get("check_in","") > str(timezone.localdate())
    if booking.kind == "TRANSPORT": return booking.items.first().departure.departs_at > now
    if booking.kind == "TOURISM": return booking.items.first().tour_departure.starts_at > now
    return True

@transaction.atomic
def cancel(booking_id, actor, force=False):
    parent, booking = _locked_booking(booking_id)
    if not actor.is_staff and actor.pk != booking.user_id and actor.pk != booking.supplier_id:
        raise PermissionDenied()
    if booking.status in {"CANCELLED","EXPIRED","REFUNDED","REFUND_PENDING"}:
        return booking
    if booking.fulfillment_status=="COMPLETED":
        raise Conflict("Completed services require support review.")
    if not force and not can_cancel(booking,parent):
        raise Conflict("Cancellation is no longer available. Contact support.")
    if booking.status == "PENDING":
        _change_stock(booking,reserved=-1)
        booking.status = "CANCELLED"
    elif booking.status == "CONFIRMED":
        _change_stock(booking,sold=-1)
        booking.tickets.filter(status="ACTIVE").update(status="CANCELLED")
        if booking.total_amount:
            from apps.payments.services import queue_refund
            queue_refund(booking,actor)
            booking.status = "REFUND_PENDING"
        else:
            booking.status = "CANCELLED"
    booking.save(update_fields=["status","updated_at"])
    audit(actor,"booking.cancelled",booking.pk)
    return booking

@transaction.atomic
def fulfill(booking_id,actor,new_status):
    _,booking = _locked_booking(booking_id)
    if actor.pk != booking.supplier_id and not actor.is_staff:
        raise PermissionDenied()
    if booking.status != "CONFIRMED":
        raise Conflict("Only confirmed bookings can be fulfilled.")
    transitions = {"NEW":"ACCEPTED","ACCEPTED":"READY","READY":"IN_PROGRESS","IN_PROGRESS":"COMPLETED"} if booking.kind == "FOOD" else {"NEW":"IN_PROGRESS","IN_PROGRESS":"COMPLETED"}
    if transitions.get(booking.fulfillment_status) != new_status:
        raise Conflict("Invalid fulfillment transition.")
    if new_status == "IN_PROGRESS":
        if booking.kind == "EVENT" and parent_model("EVENT").objects.get(pk=booking.parent_id).start_datetime > timezone.now():
            raise Conflict("This event has not started.")
        if booking.kind == "HOTEL" and booking.details["check_in"] > str(timezone.localdate()):
            raise Conflict("Check-in is not available yet.")
        if booking.kind == "TRANSPORT" and booking.items.first().departure.departs_at > timezone.now():
            raise Conflict("This journey has not started.")
        if booking.kind == "TOURISM" and booking.items.first().tour_departure.starts_at > timezone.now():
            raise Conflict("This tour has not started.")
    if new_status == "COMPLETED":
        now = timezone.now()
        if booking.kind == "EVENT" and parent_model("EVENT").objects.get(pk=booking.parent_id).end_datetime > now:
            raise Conflict("This event has not ended.")
        if booking.kind == "HOTEL" and booking.details["check_out"] > str(timezone.localdate()):
            raise Conflict("The reservation has not reached its checkout date.")
        if booking.kind == "TRANSPORT" and booking.items.first().departure.arrives_at > now:
            raise Conflict("The scheduled arrival time has not passed.")
        if booking.kind == "TOURISM" and booking.items.first().tour_departure.ends_at > now:
            raise Conflict("This tour has not ended.")
        booking.completed_at = now
    booking.fulfillment_status = new_status
    booking.save(update_fields=["fulfillment_status","completed_at","updated_at"])
    audit(actor,"booking.fulfilled",booking.pk,status=new_status)
    from apps.notifications.services import notify
    notify(booking.user,f"booking:{booking.pk}:{new_status}","Booking update",f"Your booking {booking.booking_reference} is now {new_status.lower().replace('_',' ')}.")
    return booking
