import logging
import hashlib
import uuid
from datetime import timedelta
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.db import transaction
from django.db.models import Q
from django.db.models import CharField, Exists, OuterRef, Value
from django.db.models.functions import Cast, Concat
from django.utils import timezone
from .models import Notification
from .backends import EmailDeliveryError
from .templates import notification_html

logger = logging.getLogger(__name__)

@transaction.atomic
def notify(user,key,subject,body,private=False):
    notification, created = Notification.objects.get_or_create(key=key,defaults={"user":user,"subject":subject,"body":body,"email":user.email,"is_private":private})
    if created and not private:
        from .push import queue_push
        queue_push(notification)
    return notification, created

@transaction.atomic
def notify_in_app(user, key, subject, body):
    """Create an inbox and push alert without adding a broadcast email job."""
    notification, created = Notification.objects.get_or_create(
        key=key,
        defaults={"user": user, "subject": subject, "body": body,
                  "email": user.email, "sent_at": timezone.now()},
    )
    if created:
        from .push import queue_push
        queue_push(notification)
    return notification, created

def event_email_details(key):
    """Use an image URL that stays valid after temporary storage URLs expire."""
    from apps.bookings.models import Booking
    from apps.events.models import Event

    parts = key.split(':')
    try:
        if parts[0] in {'event-new', 'event-updated'}:
            event_id = uuid.UUID(parts[1])
        elif (parts[0] == 'booking' and len(parts) > 2 and parts[2] == 'confirmed') or parts[0] == 'reminder':
            booking = Booking.objects.filter(pk=uuid.UUID(parts[1]), kind=Booking.Kind.EVENT).only('parent_id').first()
            event_id = uuid.UUID(booking.parent_id) if booking else None
        else:
            return None, None
    except (IndexError, ValueError):
        return None, None
    if not event_id:
        return None, None
    event = Event.objects.filter(pk=event_id, status=Event.Status.PUBLISHED, is_suspended=False,
        is_archived=False, deletion_requested_at__isnull=True, organizer__is_active=True,
        organizer__is_verified=True).only('title', 'image', 'image_card', 'image_detail').first()
    if not event or not (event.image or event.image_card or event.image_detail):
        return None, None
    return f'{settings.FRONTEND_URL}/api/v1/events/{event.pk}/email-image/', event.title

def queue_event_reminders(batch_size=1000):
    """Email each verified participant once in the 24 hours before their event."""
    from apps.bookings.models import Booking
    from apps.events.models import Event

    now = timezone.now()
    sent = Notification.objects.filter(key=OuterRef('reminder_key'))
    bookings = (Booking.objects.filter(status=Booking.Status.CONFIRMED, kind=Booking.Kind.EVENT,
        items__ticket_type__event__start_datetime__gt=now,
        items__ticket_type__event__start_datetime__lte=now + timedelta(days=1),
        items__ticket_type__event__status=Event.Status.PUBLISHED,
        user__email_notifications=True, user__email_verified=True)
        .annotate(reminder_key=Concat(Value('reminder:'), Cast('pk', CharField())))
        .annotate(already_notified=Exists(sent)).filter(already_notified=False)
        .select_related('user').prefetch_related('items__ticket_type__event')
        .distinct().order_by('created_at')[:batch_size])
    for booking in bookings:
        event = next((item.ticket_type.event for item in booking.items.all() if item.ticket_type_id), None)
        if not event:
            continue
        local_start = timezone.localtime(event.start_datetime).strftime('%A, %d %B %Y at %I:%M %p')
        notify(booking.user, f'reminder:{booking.pk}', f'Reminder: {event.title} is coming up',
               f'Your event starts on {local_start} at {event.venue}. Booking reference: {booking.booking_reference}. Open your bookings to view your ticket.')

def deliver_one():
    now = timezone.now()
    with transaction.atomic():
        # Expired OTP messages must not sit in the retry queue or get delivered late.
        Notification.objects.filter(expires_at__lte=now, sent_at__isnull=True).delete()
        job = Notification.objects.select_for_update(skip_locked=True).filter(sent_at__isnull=True,deleted_at__isnull=True,failed=False,available_at__lte=now).filter(Q(claimed_at__isnull=True)|Q(claimed_at__lt=now-timedelta(minutes=5))).order_by("available_at","id").first()
        if not job: return False
        job.claimed_at = now
        job.attempts += 1
        job.save(update_fields=["claimed_at","attempts"])
    try:
        # Confirmation and security emails are transactional; preferences affect reminders.
        message=EmailMultiAlternatives(job.subject,job.body,to=[job.email],headers={"X-Mmemme-Notification-Key":hashlib.sha256(job.key.encode()).hexdigest()})
        action_url = None
        if job.key.startswith('event-new:'):
            try:
                action_url = settings.FRONTEND_URL + '/events/' + str(uuid.UUID(job.key.split(':')[1]))
            except (IndexError, ValueError):
                pass
        image_url, image_alt = event_email_details(job.key)
        message.attach_alternative(notification_html(job.subject, job.body, action_url=action_url,
                                                     action_label='View event' if action_url else None,
                                                     image_url=image_url, image_alt=image_alt), "text/html")
        if message.send(fail_silently=False) != 1:
            raise RuntimeError("Email was not accepted for delivery.")
    except Exception as exc:
        # Only this backend's explicitly sanitized errors may enter logs.
        detail = str(exc) if isinstance(exc, EmailDeliveryError) else "Delivery attempt failed."
        logger.warning("Notification delivery failed: notification_id=%s; %s",job.pk,detail)
        Notification.objects.filter(pk=job.pk,claimed_at=now).update(claimed_at=None,available_at=now+timedelta(seconds=min(3600,30*2**min(job.attempts,7))),failed=job.attempts>=8)
    else:
        values = {"sent_at":timezone.now(),"claimed_at":None}
        if job.is_private: values["body"] = "Security email delivered."
        Notification.objects.filter(pk=job.pk,claimed_at=now).update(**values)
    return True
