"""Moderation keeps publication, inventory availability and review history consistent."""
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import PermissionDenied, ValidationError
from apps.accounts.administration import require_staff_permission
from apps.accounts.models import User
from apps.common.api import Conflict
from apps.common.models import audit
from apps.notifications.services import notify
from .models import Event, EventAnnouncement


@transaction.atomic
def moderate_event(actor, event_id, decision, reason=''):
    require_staff_permission(actor, 'events.change_event')
    original = Event.objects.get(pk=event_id)
    organizer = User.objects.select_for_update().get(pk=original.organizer_id)
    event = Event.objects.select_for_update().get(pk=event_id)
    if actor.pk == organizer.pk:
        raise PermissionDenied('You cannot review your own event.')
    if decision not in {'approve', 'reject', 'request-changes', 'suspend', 'activate'}:
        raise ValidationError('Invalid moderation action.')
    if decision in {'reject', 'request-changes', 'suspend'} and not reason.strip():
        raise ValidationError({'reason': 'Explain this decision to the organizer.'})
    if decision in {'approve', 'reject', 'request-changes'}:
        if event.status != 'IN_REVIEW':
            raise Conflict('Only submitted events can be reviewed.')
        if decision == 'approve':
            if not organizer.is_active or not organizer.is_verified or not organizer.email_verified:
                raise Conflict('The organizer must be active, approved and email verified.')
            if event.start_datetime <= timezone.now() or not event.ticket_types.filter(is_active=True).exists():
                raise Conflict('The event needs future dates and an active ticket type.')
            event.status = 'PUBLISHED'
        else:
            event.status = 'REJECTED'
    else:
        if event.status != 'PUBLISHED':
            raise Conflict('Only published events can be suspended or reactivated.')
        if decision == 'activate' and (not organizer.is_active or not organizer.is_verified or event.end_datetime <= timezone.now()):
            raise Conflict('An active organizer and valid event dates are required.')
        if event.is_suspended == (decision == 'suspend'):
            return event
        event.is_suspended = decision == 'suspend'
    event.review_note = reason
    event.review_decision = decision
    event.reviewed_by = actor
    event.reviewed_at = timezone.now()
    event.save(update_fields=['status', 'is_suspended', 'review_note', 'review_decision', 'reviewed_by', 'reviewed_at', 'updated_at'])
    audit(actor, 'event.' + decision, event.pk, reason=reason)
    message = (f'It is happening! Your event, {event.title}, is approved and live on Mmemme Abia. '
               'Share it with your community and get ready to welcome your guests.'
               if decision == 'approve' else f'{event.title}: {decision.replace("-", " ")}.')
    notify(organizer, f'event-review:{event.pk}:{event.reviewed_at.isoformat()}', 'Event review update',
           message + (f'\n\n{reason}' if reason else ''))
    if decision == 'approve':
        EventAnnouncement.objects.get_or_create(event=event)
    return event


@transaction.atomic
def review_event_deletion(actor, event_id, approve, reason=''):
    from apps.bookings.models import Booking
    from apps.bookings.services import cancel
    from apps.payments.models import Payment, PayoutItem
    require_staff_permission(actor, 'events.change_event')
    event = Event.objects.select_for_update().get(pk=event_id)
    if actor.pk == event.organizer_id:
        raise PermissionDenied('You cannot review your own event.')
    if not event.deletion_requested_at or event.is_archived:
        raise Conflict('There is no pending deletion request.')
    bookings = Booking.objects.filter(kind='EVENT', parent_id=str(event.pk)).order_by('id')
    if approve:
        if event.status in {Event.Status.CANCELLED, Event.Status.COMPLETED}:
            raise Conflict('Completed or already cancelled events need support review.')
        if event.start_datetime <= timezone.now():
            raise Conflict('An event that has started needs support review before removal.')
        if bookings.filter(fulfillment_status__in=['IN_PROGRESS', 'COMPLETED']).exists():
            raise Conflict('A booking has been fulfilled. Contact support before removing this event.')
        if bookings.filter(tickets__status='USED').exists():
            raise Conflict('A ticket has already been used. Contact support before removing this event.')
        if PayoutItem.objects.filter(sale__booking__in=bookings, active=True).exists():
            raise Conflict('An organizer payout is allocated to this event. Contact finance before removing it.')
        for booking in bookings.filter(status='CONFIRMED', total_amount__gt=0):
            if not Payment.objects.filter(booking=booking, status='SUCCESS', provider='PAYSTACK').exists():
                raise Conflict('A paid booking needs payment reconciliation before this event can be removed.')
    if not approve and not reason.strip():
        raise ValidationError({'reason': 'Explain why deletion was declined.'})
    event.deletion_requested_at = None
    event.deletion_reviewed_at = timezone.now()
    event.deletion_reviewed_by = actor
    if approve:
        # Keep the row and artwork for audit/history, but remove it from all public and organizer lists.
        event.status = Event.Status.CANCELLED
        event.is_archived = True
    event.save(update_fields=['deletion_requested_at', 'deletion_reviewed_at', 'deletion_reviewed_by', 'status', 'is_archived', 'updated_at'])
    if approve:
        for booking in bookings.filter(status__in=['PENDING', 'CONFIRMED']).order_by('id'):
            cancel(booking.pk, actor, force=True)
    audit(actor, 'event.deletion_approved' if approve else 'event.deletion_declined', event.pk, reason=reason)
    message = (f'Your request to remove {event.title} has been approved. The event is no longer visible. Eligible attendee refunds have been queued.' if approve
               else f'Your request to remove {event.title} was declined. {reason}')
    notify(event.organizer, f'event-deletion:{event.pk}:{event.deletion_reviewed_at.isoformat()}',
           'Event deletion request', message)
    return event
