"""Moderation keeps publication, inventory availability and review history consistent."""
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import PermissionDenied, ValidationError
from apps.accounts.administration import require_staff_permission
from apps.accounts.models import User
from apps.common.api import Conflict
from apps.common.models import audit
from apps.notifications.services import notify
from .models import Event


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
    return event
