from django.db import transaction
from django.conf import settings
from django.utils import timezone

from apps.accounts.models import User
from apps.notifications.services import notify, notify_in_app
from .models import Event, EventAnnouncement, MajorEventPromotion, MajorEventAnnouncement


def queue_major_event_announcement(promotion):
    return MajorEventAnnouncement.objects.get_or_create(
        promotion_updated_at=promotion.updated_at,
        defaults={
            'event': promotion.event,
            'title': promotion.event.title if promotion.event_id else promotion.title,
            'destination_url': (settings.FRONTEND_URL.rstrip('/') + f'/events/{promotion.event_id}')
                               if promotion.event_id else promotion.registration_url,
            'image_path': promotion.image.name if promotion.image else '',
        },
    )[0]


@transaction.atomic
def announce_new_event_batch(batch_size=100):
    """Fan out one publication in resumable batches; approval stays fast."""
    job = (EventAnnouncement.objects.select_for_update(skip_locked=True)
           .select_related('event').filter(completed_at__isnull=True)
           .order_by('created_at', 'pk').first())
    if not job:
        return False
    event = job.event
    now = timezone.now()
    if (event.status != Event.Status.PUBLISHED or event.is_suspended or event.is_archived
            or event.deletion_requested_at or event.end_datetime <= now):
        job.completed_at = now
        job.save(update_fields=['completed_at'])
        return True

    users = list(User.objects.filter(pk__gt=job.last_user_id, role=User.Role.USER,
                    is_active=True, email_verified=True).order_by('pk')[:batch_size])
    for user in users:
        create_notice = notify if user.email_notifications else notify_in_app
        create_notice(user, f'event-new:{event.pk}:{user.pk}', 'New event in Abia',
                      f'{event.title} is now live on Mmemme Abia. See the details and get your ticket.')
    if users:
        job.last_user_id = users[-1].pk
    if len(users) < batch_size:
        job.completed_at = timezone.now()
    job.save(update_fields=['last_user_id', 'completed_at'])
    return True


@transaction.atomic
def announce_major_event_batch(batch_size=100):
    """Fan out the current major event in resumable, idempotent batches."""
    job = (MajorEventAnnouncement.objects.select_for_update(skip_locked=True)
           .select_related('event').filter(completed_at__isnull=True)
           .order_by('created_at', 'pk').first())
    if not job:
        promotion = MajorEventPromotion.objects.select_related('event', 'event__organizer').first()
        if promotion and not MajorEventAnnouncement.objects.filter(promotion_updated_at=promotion.updated_at).exists():
            from .major_api import promotion_is_active
            if promotion_is_active(promotion):
                queue_major_event_announcement(promotion)
                return True
        return False
    promotion = MajorEventPromotion.objects.select_related('event', 'event__organizer').first()
    if not promotion or promotion.updated_at != job.promotion_updated_at:
        job.completed_at = timezone.now()
        job.save(update_fields=['completed_at'])
        return True
    from .major_api import promotion_is_active
    if not promotion_is_active(promotion):
        job.completed_at = timezone.now()
        job.save(update_fields=['completed_at'])
        return True
    users = list(User.objects.filter(pk__gt=job.last_user_id, role__in=[User.Role.USER, User.Role.ORGANIZER],
                    is_active=True, email_verified=True).order_by('pk')[:batch_size])
    for user in users:
        create_notice = notify if user.email_notifications else notify_in_app
        action = 'Get tickets' if job.event_id else 'Register now'
        create_notice(user, f'major-event:{job.pk}:{user.pk}', f'Major event: {job.title}',
                      f'{job.title} is featured on Mmemme Abia. {action}: {job.destination_url}')
    if users:
        job.last_user_id = users[-1].pk
    if len(users) < batch_size:
        job.completed_at = timezone.now()
    job.save(update_fields=['last_user_id', 'completed_at'])
    return True
