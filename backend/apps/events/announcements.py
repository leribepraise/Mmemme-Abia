from django.db import transaction
from django.utils import timezone

from apps.accounts.models import User
from apps.notifications.services import notify, notify_in_app
from .models import Event, EventAnnouncement


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
