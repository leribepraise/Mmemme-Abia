import secrets
import uuid
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import PermissionDenied
from apps.common.api import Conflict
from apps.common.models import audit
from .models import Ticket

def issue_tickets(booking):
    if booking.kind != "EVENT":
        return
    for item in booking.items.select_related("ticket_type"):
        for sequence in range(1,item.quantity+1):
            Ticket.objects.get_or_create(booking_item=item,sequence=sequence,defaults={"booking":booking,"ticket_type":item.ticket_type,"owner":booking.user,"ticket_number":"TK-"+uuid.uuid4().hex.upper(),"qr_code":secrets.token_urlsafe(32)})

@transaction.atomic
def check_in(token,actor):
    # Match the lock order used by cancellations: parent -> booking -> ticket.
    original = Ticket.objects.select_related("ticket_type__event").filter(qr_code=token).first()
    if not original:
        raise Conflict("Ticket not found.")
    from apps.bookings.services import _locked_booking
    event,booking = _locked_booking(original.booking_id)
    if actor.pk != event.organizer_id and not actor.is_staff:
        raise PermissionDenied()
    ticket = Ticket.objects.select_for_update().get(pk=original.pk)
    now = timezone.now()
    if booking.status != "CONFIRMED" or event.status != "PUBLISHED":
        raise Conflict("This ticket is not valid.")
    if now < event.start_datetime - timezone.timedelta(hours=4) or now > event.end_datetime:
        raise Conflict("Check-in is outside the event admission window.")
    if ticket.status != "ACTIVE":
        raise Conflict("This ticket has already been used or cancelled.")
    ticket.status = "USED"
    ticket.checked_in_at = now
    ticket.save(update_fields=["status","checked_in_at","updated_at"])
    audit(actor,"ticket.checked_in",ticket.pk)
    return ticket
