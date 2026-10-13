"""Tour operations; always lock the experience before departure/booking stock."""
from datetime import timedelta
from django.core import signing
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import PermissionDenied, ValidationError
from apps.common.api import Conflict
from apps.common.models import audit
from apps.notifications.services import notify
from .models import TourismStaff, TourismExperience, TourDeparture


def operator_role(user, operator):
    if not user.is_authenticated or not user.is_active: return None
    if user.pk == operator.owner_id: return 'OWNER'
    return TourismStaff.objects.filter(operator=operator, user=user, is_active=True).values_list('role', flat=True).first()


def authorize(user, operator, guide=False, owner=False):
    permission = 'tourism.view_tourismoperator' if guide else 'tourism.change_tourismoperator'
    if user.is_staff and user.has_perm(permission): return
    roles = {'OWNER'} if owner else {'OWNER', 'MANAGER', 'GUIDE'} if guide else {'OWNER', 'MANAGER'}
    if operator_role(user, operator) not in roles: raise PermissionDenied('You do not have access to this tour operation.')


def available(operator):
    return operator.status == 'APPROVED' and operator.owner.is_active and operator.owner.is_verified and operator.owner.email_verified


def departure_available(departure):
    experience = departure.package.experience
    return (departure.status == 'SCHEDULED' and departure.is_active and departure.package.is_active
            and experience.is_active and experience.review_status == 'APPROVED'
            and (not experience.operator_id or available(experience.operator)))


def admission_token(booking): return signing.dumps(str(booking.pk), salt='tourism.admission', compress=True)


@transaction.atomic
def check_in(actor, token):
    from apps.bookings.models import Booking
    from apps.bookings.services import _locked_booking
    try:
        booking_id = signing.loads(token, salt='tourism.admission')
        original = Booking.objects.get(pk=booking_id, kind='TOURISM')
    except (signing.BadSignature, Booking.DoesNotExist, ValueError): raise ValidationError('Invalid tour pass.')
    experience, booking = _locked_booking(original.pk)
    if experience.operator_id: authorize(actor, experience.operator, guide=True)
    elif actor.pk != experience.created_by_id and not actor.is_staff: raise PermissionDenied()
    departure = booking.items.get().tour_departure
    if booking.status != 'CONFIRMED' or departure.status != 'SCHEDULED': raise Conflict('This tour pass is not valid.')
    if not departure.starts_at - timedelta(hours=2) <= timezone.now() <= departure.ends_at:
        raise Conflict('Check-in opens two hours before the tour and closes when it ends.')
    if booking.details.get('checked_in_at'): raise Conflict('This booking has already checked in.')
    booking.details['checked_in_at'] = timezone.now().isoformat()
    booking.save(update_fields=['details', 'updated_at'])
    audit(actor, 'tourism.checked_in', booking.pk)
    return booking


@transaction.atomic
def departure_action(actor, departure_id, operation, reason=''):
    from apps.bookings.models import Booking
    from apps.bookings.services import cancel, fulfill
    original = TourDeparture.objects.get(pk=departure_id)
    experience = TourismExperience.objects.select_for_update().get(pk=original.package.experience_id)
    authorize(actor, experience.operator)
    departure = TourDeparture.objects.select_for_update().get(pk=original.pk)
    if operation == 'cancel':
        if departure.status == 'CANCELLED': return departure
        if departure.status != 'SCHEDULED' or departure.starts_at <= timezone.now(): raise Conflict('Started or completed tours require support review.')
        if not reason.strip(): raise ValidationError('Explain the cancellation to participants.')
        departure.status, departure.is_active, departure.cancellation_reason = 'CANCELLED', False, reason
        departure.save(update_fields=['status', 'is_active', 'cancellation_reason'])
        for booking in Booking.objects.filter(items__tour_departure=departure, status__in=['PENDING', 'CONFIRMED']).distinct().order_by('pk'):
            cancel(booking.pk, actor, force=True)
            notify(booking.user, f'tourism-cancel:{booking.pk}', 'Tour cancelled', f'{experience.name}: {reason}. Any captured payment is queued for a full refund. Track it in your tour bookings.')
    elif operation == 'complete':
        if departure.status != 'SCHEDULED' or departure.ends_at > timezone.now(): raise Conflict('Only a finished, scheduled tour can be completed.')
        for booking in Booking.objects.filter(items__tour_departure=departure, status='CONFIRMED').distinct().order_by('pk'):
            if booking.fulfillment_status == 'NEW': fulfill(booking.pk, actor, 'IN_PROGRESS')
            if booking.fulfillment_status in {'NEW', 'IN_PROGRESS'}: fulfill(booking.pk, actor, 'COMPLETED')
        departure.status, departure.is_active = 'COMPLETED', False
        departure.save(update_fields=['status', 'is_active'])
    else: raise ValidationError('Choose cancel or complete.')
    audit(actor, 'tourism.departure_' + operation, departure.pk, reason=reason)
    return departure


def queue_tour_reminders(batch_size=1000):
    from django.db.models import Exists, OuterRef, Value, CharField
    from django.db.models.functions import Cast, Concat, Replace
    from django.conf import settings
    from apps.bookings.models import Booking
    from apps.notifications.models import Notification
    now = timezone.now()
    rows = (Booking.objects.filter(kind='TOURISM', status='CONFIRMED', items__tour_departure__status='SCHEDULED',
        items__tour_departure__starts_at__gt=now, items__tour_departure__starts_at__lte=now+timedelta(days=1),
        user__is_active=True, user__email_verified=True, user__email_notifications=True)
        .annotate(reminder_key=Concat(Value('tourism-reminder:'), Replace(Cast('pk', CharField()), Value('-'), Value(''))))
        .annotate(already_sent=Exists(Notification.objects.filter(key=OuterRef('reminder_key'))))
        .filter(already_sent=False).select_related('user').distinct().order_by('pk')[:batch_size])
    for booking in rows:
        d = booking.details
        notify(booking.user, booking.reminder_key, 'Your tour is coming up',
            f"{d.get('title', 'Your tour')} starts at {d.get('starts_at', '')}. Meeting point: {d.get('meeting_point', d.get('location', ''))}. "
            f"{d.get('visitor_instructions', '')}\nYour tour pass: {settings.FRONTEND_URL}/tourism/bookings")
    return len(rows)
