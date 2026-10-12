"""Company access and departure operations. Inventory locks follow booking lock order."""
from datetime import timedelta
from django.core import signing
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import PermissionDenied, ValidationError
from apps.common.api import Conflict
from apps.common.models import audit
from apps.notifications.services import notify
from .models import CompanyStaff, Route, Departure


def company_role(user, company):
    if not user.is_authenticated or not user.is_active: return None
    if user.pk == company.owner_id: return 'OWNER'
    return CompanyStaff.objects.filter(company=company, user=user, is_active=True).values_list('role', flat=True).first()


def authorize(user, company, boarding=False, owner=False):
    permission = 'transport.view_transportcompany' if boarding else 'transport.change_transportcompany'
    if user.is_staff and user.has_perm(permission): return
    role = company_role(user, company)
    if role not in ({'OWNER'} if owner else {'OWNER', 'MANAGER', 'BOARDING'} if boarding else {'OWNER', 'MANAGER'}):
        raise PermissionDenied('You do not have access to this company operation.')


def available(company):
    return company.status == 'APPROVED' and company.owner.is_active and company.owner.is_verified and company.owner.email_verified


def departure_available(departure):
    route = departure.route
    if departure.status != 'SCHEDULED' or not departure.is_active or not route.is_active: return False
    if not route.company_id: return True
    return (available(route.company) and departure.fleet_vehicle_id and departure.fleet_vehicle.is_active
            and route.origin_terminal_id and route.origin_terminal.is_active
            and route.destination_terminal_id and route.destination_terminal.is_active)


def boarding_token(booking):
    return signing.dumps(str(booking.pk), salt='transport.boarding', compress=True)


@transaction.atomic
def check_in(actor, token):
    from apps.bookings.services import _locked_booking
    from apps.bookings.models import Booking
    try:
        booking_id = signing.loads(token, salt='transport.boarding')
        original = Booking.objects.get(pk=booking_id, kind='TRANSPORT')
    except (signing.BadSignature, Booking.DoesNotExist, ValueError):
        raise ValidationError('Invalid boarding pass.')
    route, booking = _locked_booking(original.pk)
    if route.company_id: authorize(actor, route.company, boarding=True)
    elif actor.pk != route.owner_id and not actor.is_staff: raise PermissionDenied()
    departure = booking.items.get().departure
    now = timezone.now()
    if booking.status != 'CONFIRMED' or departure.status != 'SCHEDULED': raise Conflict('This boarding pass is not valid.')
    if not departure.departs_at - timedelta(hours=4) <= now <= departure.arrives_at:
        raise Conflict('Boarding opens four hours before departure and closes at arrival.')
    if booking.details.get('boarded_at'): raise Conflict('This booking has already checked in.')
    booking.details['boarded_at'] = now.isoformat()
    booking.save(update_fields=['details', 'updated_at'])
    audit(actor, 'transport.boarded', booking.pk)
    return booking


@transaction.atomic
def cancel_departure(actor, departure_id, reason):
    from apps.bookings.models import Booking
    from apps.bookings.services import cancel
    original = Departure.objects.get(pk=departure_id)
    route = Route.objects.select_for_update().get(pk=original.route_id)
    authorize(actor, route.company)
    departure = Departure.objects.select_for_update().get(pk=original.pk)
    if departure.status == 'CANCELLED': return departure
    if departure.status == 'COMPLETED' or departure.departs_at <= timezone.now():
        raise Conflict('A departed or completed journey requires support review.')
    if not reason.strip(): raise ValidationError('Explain the cancellation to passengers.')
    departure.status, departure.is_active, departure.cancellation_reason = 'CANCELLED', False, reason
    departure.save(update_fields=['status', 'is_active', 'cancellation_reason'])
    for booking in Booking.objects.filter(items__departure=departure, status__in=['PENDING', 'CONFIRMED']).distinct().order_by('pk'):
        # Access is checked on the company above; cancellation follows the existing refund ledger.
        cancel(booking.pk, actor, force=True)
        notify(booking.user, f'transport-cancel:{booking.pk}', 'Journey cancelled',
               f'{route.name} has been cancelled. {reason} Any captured payment is queued for a full Paystack refund. Track your booking in your account.')
    audit(actor, 'transport.departure_cancelled', departure.pk, reason=reason)
    return departure


@transaction.atomic
def complete_departure(actor, departure_id):
    from apps.bookings.services import fulfill
    from apps.bookings.models import Booking
    original = Departure.objects.get(pk=departure_id)
    route = Route.objects.select_for_update().get(pk=original.route_id)
    authorize(actor, route.company)
    departure = Departure.objects.select_for_update().get(pk=original.pk)
    if departure.status != 'SCHEDULED' or departure.arrives_at > timezone.now():
        raise Conflict('Only an arrived, scheduled journey can be completed.')
    for booking in Booking.objects.filter(items__departure=departure, status='CONFIRMED').distinct().order_by('pk'):
        if booking.fulfillment_status == 'NEW': fulfill(booking.pk, actor, 'IN_PROGRESS')
        if booking.fulfillment_status in {'NEW', 'IN_PROGRESS'}: fulfill(booking.pk, actor, 'COMPLETED')
    departure.status, departure.is_active = 'COMPLETED', False
    departure.save(update_fields=['status', 'is_active'])
    audit(actor, 'transport.departure_completed', departure.pk)
    return departure


def queue_journey_reminders(batch_size=1000):
    from django.db.models import Exists, OuterRef, Value, CharField
    from django.db.models.functions import Cast, Concat, Replace
    from django.conf import settings
    from apps.bookings.models import Booking
    from apps.notifications.models import Notification
    now = timezone.now()
    rows = (Booking.objects.filter(kind='TRANSPORT', status='CONFIRMED',
        items__departure__status='SCHEDULED', items__departure__departs_at__gt=now,
        items__departure__departs_at__lte=now+timedelta(days=1), user__is_active=True,
        user__email_verified=True, user__email_notifications=True)
        .annotate(reminder_key=Concat(Value('transport-reminder:'), Replace(Cast('pk', CharField()), Value('-'), Value(''))))
        .annotate(already_sent=Exists(Notification.objects.filter(key=OuterRef('reminder_key'))))
        .filter(already_sent=False).select_related('user').distinct().order_by('pk')[:batch_size])
    for booking in rows:
        notify(booking.user, booking.reminder_key, 'Your journey is coming up',
            f"Your journey with {booking.details.get('company_name', 'your provider')} departs at {booking.details.get('departs_at', '')}. "
            f"Pickup: {booking.details.get('location', '')}. {booking.details.get('boarding_instructions', '')}\n"
            f"Show your boarding pass: {settings.FRONTEND_URL}/transport/bookings")
    return len(rows)
