import json
import logging
import uuid
from datetime import timedelta
from urllib.parse import urlsplit
from django.conf import settings
from django.db import transaction
from django.db.models import Q, F
from django.utils import timezone
from pywebpush import webpush, WebPushException
from requests import Session
from .models import PushSubscription, PushDelivery

logger = logging.getLogger(__name__)


def push_enabled():
    return bool(settings.WEB_PUSH_ENABLED and settings.VAPID_PUBLIC_KEY and settings.VAPID_PRIVATE_KEY and settings.VAPID_SUBJECT)


def allowed_endpoint(endpoint):
    try:
        parsed = urlsplit(endpoint)
        host = parsed.hostname or ''
        allowed = host in {'fcm.googleapis.com', 'updates.push.services.mozilla.com', 'web.push.apple.com'} or host.endswith('.push.apple.com')
        return bool(allowed and parsed.scheme == 'https' and parsed.port in (None, 443) and not parsed.username and not parsed.password and not parsed.fragment and parsed.path.startswith('/') and not any(c.isspace() for c in endpoint))
    except ValueError:
        return False


def queue_push(notification):
    if not push_enabled() or notification.is_private or not notification.user_id:
        return
    subscriptions = PushSubscription.objects.filter(user_id=notification.user_id, is_active=True, user__is_active=True, user__email_verified=True, session_version=F('user__session_version'))
    PushDelivery.objects.bulk_create([PushDelivery(notification=notification, subscription=sub) for sub in subscriptions], ignore_conflicts=True)


class NoRedirectSession(Session):
    def request(self, *args, **kwargs):
        kwargs['allow_redirects'] = False
        return super().request(*args, **kwargs)


def deliver_push_one():
    if not push_enabled():
        return False
    now = timezone.now()
    with transaction.atomic():
        job = PushDelivery.objects.select_for_update(skip_locked=True).filter(sent_at__isnull=True, failed=False, available_at__lte=now).filter(Q(claimed_at__isnull=True)|Q(claimed_at__lt=now-timedelta(minutes=5))).order_by('available_at','id').first()
        if not job:
            return False
        job.claimed_at = now
        job.attempts += 1
        job.save(update_fields=['claimed_at','attempts'])
    sub = PushSubscription.objects.select_related('user').get(pk=job.subscription_id)
    notification = job.notification
    if (not sub.is_active or not sub.user.is_active or not sub.user.email_verified or sub.session_version != sub.user.session_version
            or sub.user_id != notification.user_id or notification.is_private or notification.is_read or notification.deleted_at
            or notification.created_at < now-timedelta(days=1) or (notification.expires_at and notification.expires_at <= now)
            or not allowed_endpoint(sub.endpoint)):
        PushDelivery.objects.filter(pk=job.pk, claimed_at=now).update(failed=True, claimed_at=None)
        return True
    # Keep account details and OTPs off the lock screen.
    payload_data = {'title':'Mmemme Abia', 'body':'You have a new notification. Open the app to view it.',
                    'url':f'/notifications?notification={notification.pk}', 'tag':f'notification-{notification.pk}'}
    if notification.key.startswith('event-new:'):
        from apps.events.models import Event
        try:
            event_id = uuid.UUID(notification.key.split(':')[1])
        except (ValueError, IndexError):
            event_id = None
        event = Event.objects.filter(pk=event_id, status=Event.Status.PUBLISHED,
                is_suspended=False, is_archived=False, deletion_requested_at__isnull=True,
                end_datetime__gt=now).first() if event_id else None
        if not event:
            PushDelivery.objects.filter(pk=job.pk, claimed_at=now).update(failed=True, claimed_at=None)
            return True
        payload_data.update(kind='event', body=f'{event.title[:90]} is now live. Tap to view it.',
                            url=f'/events/{event.pk}', tag=f'event-{event.pk}')
    payload = json.dumps(payload_data)
    try:
        with NoRedirectSession() as session:
            response = webpush(subscription_info={'endpoint':sub.endpoint,'keys':{'p256dh':sub.p256dh,'auth':sub.auth}}, data=payload,
                               vapid_private_key=settings.VAPID_PRIVATE_KEY, vapid_claims={'sub':settings.VAPID_SUBJECT},
                               ttl=86400 if payload_data.get('kind') == 'event' else 3600,
                               timeout=10, requests_session=session)
        if not 200 <= response.status_code < 300:
            raise WebPushException('Push service rejected delivery.', response=response)
    except Exception as error:
        response = getattr(error, 'response', None)
        status = response.status_code if response is not None else None
        if status in (404,410):
            PushSubscription.objects.filter(pk=sub.pk).update(is_active=False)
        terminal = status is not None and 400 <= status < 500 and status not in (408,429)
        PushDelivery.objects.filter(pk=job.pk, claimed_at=now).update(claimed_at=None, failed=terminal or job.attempts>=5,
            available_at=now+timedelta(seconds=min(3600,30*2**job.attempts)))
        logger.warning('Push delivery failed: delivery_id=%s; status=%s', job.pk, status or 'unavailable')
    else:
        PushDelivery.objects.filter(pk=job.pk, claimed_at=now).update(sent_at=timezone.now(), claimed_at=None)
    return True
