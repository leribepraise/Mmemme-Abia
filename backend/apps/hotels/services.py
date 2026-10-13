"""Property operations use the same property-first inventory locks as bookings."""
from datetime import datetime, timedelta
from django.core import signing
from django.db import transaction
from django.db.models import Q
from django.utils import timezone
from rest_framework.exceptions import PermissionDenied, ValidationError
from apps.common.api import Conflict
from apps.common.models import audit
from apps.notifications.services import notify
from .models import HotelStaff, RoomUnit, RoomAssignment

def provider_role(user, provider):
    if not user.is_authenticated or not user.is_active: return None
    if provider.owner_id == user.pk: return 'OWNER'
    return HotelStaff.objects.filter(provider=provider, user=user, is_active=True).values_list('role', flat=True).first()

def authorize(user, provider, access='manage', owner=False):
    permission = 'hotels.view_hotelprovider' if access in {'read', 'reception', 'housekeeping'} else 'hotels.change_hotelprovider'
    if user.is_staff and user.has_perm(permission): return
    roles = {'OWNER'} if owner else {
        'manage': {'OWNER', 'MANAGER'}, 'read': {'OWNER', 'MANAGER', 'RECEPTION', 'HOUSEKEEPING'},
        'reception': {'OWNER', 'MANAGER', 'RECEPTION'}, 'housekeeping': {'OWNER', 'MANAGER', 'HOUSEKEEPING'},
    }[access]
    if provider_role(user, provider) not in roles: raise PermissionDenied('You do not have access to this hotel operation.')

def available(provider):
    return provider.status == 'APPROVED' and provider.owner.is_active and provider.owner.is_verified and provider.owner.email_verified

def property_available(hotel):
    return hotel.is_active and hotel.review_status == 'APPROVED' and (not hotel.provider_id or available(hotel.provider))

def stay_token(booking): return signing.dumps(str(booking.pk), salt='hotels.checkin', compress=True)

def stay_start(booking):
    return datetime.fromisoformat(booking.details['check_in_at']) if booking.details.get('check_in_at') else timezone.make_aware(datetime.combine(datetime.fromisoformat(booking.details['check_in']).date(), datetime.min.time()))

def stay_end(booking):
    return datetime.fromisoformat(booking.details['check_out_at']) if booking.details.get('check_out_at') else timezone.make_aware(datetime.combine(datetime.fromisoformat(booking.details['check_out']).date(), datetime.min.time()))

@transaction.atomic
def reception_action(actor, booking_id, operation, units=None, reason='', token=None):
    from apps.bookings.models import Booking
    from apps.bookings.services import _locked_booking, cancel, fulfill
    hotel, booking = _locked_booking(booking_id)
    if booking.kind != 'HOTEL' or not hotel.provider_id: raise ValidationError('Choose a hotel-provider reservation.')
    authorize(actor, hotel.provider, access='reception')
    if operation == 'cancel':
        authorize(actor, hotel.provider)
        if booking.fulfillment_status != 'NEW': raise Conflict('An occupied or completed stay requires admin support review.')
        if not reason.strip(): raise ValidationError('Explain the cancellation to the guest.')
        result = cancel(booking.pk, actor, force=True)
        notify(booking.user, f'hotel-cancel:{booking.pk}', 'Your stay was cancelled', f'{hotel.name}: {reason}. Any captured payment is queued for a full refund. Contact support if you need help finding another stay.')
        return result
    if booking.status != 'CONFIRMED': raise Conflict('Only confirmed reservations can be processed.')
    now = timezone.now()
    if operation == 'check-in':
        if token:
            try: valid = signing.loads(token, salt='hotels.checkin') == str(booking.pk)
            except signing.BadSignature: valid = False
            if not valid: raise ValidationError('Invalid check-in pass.')
        if booking.fulfillment_status != 'NEW' or booking.details.get('checked_in_at'): raise Conflict('This reservation has already been checked in.')
        if booking.details.get('no_show_at'): raise Conflict('Resolve the recorded no-show through support before checking in.')
        if not stay_start(booking) <= now < stay_end(booking): raise Conflict('Check-in is only available within the booked stay and check-in hours.')
        selected = list(RoomUnit.objects.select_for_update().filter(pk__in=units or [], hotel=hotel, is_active=True, state='READY').order_by('pk'))
        room_type = booking.items.first().room_night.room_type_id
        if len(selected) != booking.details['rooms'] or len(set(units or [])) != len(selected) or any(u.room_type_id != room_type for u in selected):
            raise ValidationError('Select one ready unit of the booked room type for each reserved room.')
        overlaps = RoomAssignment.objects.filter(unit__in=selected, booking__status='CONFIRMED').exclude(booking=booking).filter(
            Q(booking__fulfillment_status='IN_PROGRESS') | Q(booking__fulfillment_status='NEW',
                booking__details__check_in__lt=booking.details['check_out'], booking__details__check_out__gt=booking.details['check_in']))
        if overlaps.exists(): raise Conflict('One of these units is already assigned to an overlapping stay.')
        for unit in selected: RoomAssignment.objects.get_or_create(booking=booking, unit=unit)
        booking.details.update(checked_in_at=now.isoformat(), assigned_units=[u.name for u in selected])
        booking.save(update_fields=['details', 'updated_at'])
        fulfill(booking.pk, actor, 'IN_PROGRESS', hotel_reception=True)
    elif operation == 'check-out':
        if not booking.details.get('checked_in_at') or booking.fulfillment_status != 'IN_PROGRESS': raise Conflict('Check in the guest before checking out.')
        if now < stay_end(booking): raise Conflict('Early checkout requires support review; the booked checkout time has not passed.')
        fulfill(booking.pk, actor, 'COMPLETED', hotel_reception=True)
        RoomUnit.objects.filter(assignments__booking=booking).update(state='DIRTY')
        booking.details['checked_out_at'] = now.isoformat(); booking.save(update_fields=['details', 'updated_at'])
    elif operation == 'no-show':
        if booking.fulfillment_status != 'NEW' or now < stay_start(booking): raise Conflict('Only an unarrived guest after check-in time can be marked as a no-show.')
        booking.details['no_show_at'] = now.isoformat(); booking.save(update_fields=['details', 'updated_at'])
        notify(booking.user, f'hotel-no-show:{booking.pk}', 'Please contact your accommodation', f'{hotel.name} recorded a no-show for your reservation. Contact the property or MMEMME ABIA support to resolve it. No payout is released by this action.')
    elif operation == 'clear-no-show':
        authorize(actor,hotel.provider)
        if booking.fulfillment_status!='NEW' or not booking.details.get('no_show_at'): raise Conflict('Choose an unresolved no-show reservation.')
        if not reason.strip(): raise ValidationError('Explain why the no-show is being corrected.')
        booking.details['previous_no_show_at']=booking.details.pop('no_show_at')
        booking.details['no_show_resolution']={'at':now.isoformat(),'reason':reason}
        booking.save(update_fields=['details','updated_at'])
        notify(booking.user,f'hotel-no-show:{booking.pk}:resolved','Your arrival record was updated',f'{hotel.name} corrected the no-show record. Contact reception to arrange arrival within your booked stay.')
    else: raise ValidationError('Choose check-in, check-out, no-show or cancel.')
    audit(actor, 'hotels.'+operation, booking.pk)
    booking.refresh_from_db()
    return booking

def queue_stay_reminders(batch_size=1000):
    from django.db.models import Exists, OuterRef, Value, CharField
    from django.db.models.functions import Cast, Concat, Replace
    from django.conf import settings
    from apps.bookings.models import Booking
    from apps.notifications.models import Notification
    now = timezone.now()
    rows = (Booking.objects.filter(kind='HOTEL', status='CONFIRMED', fulfillment_status='NEW',
        details__check_in__gte=str(timezone.localdate()), details__check_in__lte=str(timezone.localdate()+timedelta(days=1)),
        user__is_active=True, user__email_verified=True, user__email_notifications=True)
        .annotate(reminder_key=Concat(Value('hotel-reminder:'), Replace(Cast('pk', CharField()), Value('-'), Value(''))))
        .annotate(already_sent=Exists(Notification.objects.filter(key=OuterRef('reminder_key'))))
        .filter(already_sent=False).select_related('user').order_by('pk')[:batch_size])
    sent = 0
    for booking in rows:
        if now <= stay_start(booking) <= now+timedelta(days=1):
            notify(booking.user, booking.reminder_key, 'Your stay is coming up',
                f"{booking.details.get('title', 'Your stay')}: check-in {booking.details.get('check_in_at', booking.details['check_in'])}. "
                f"Address: {booking.details.get('location', '')}. {booking.details.get('house_rules', '')}\nYour pass: {settings.FRONTEND_URL}/stays/bookings")
            sent += 1
    return sent
