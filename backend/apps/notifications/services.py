import logging
from datetime import timedelta
from django.core.mail import send_mail
from django.db import transaction
from django.db.models import Q
from django.utils import timezone
from .models import Notification

logger = logging.getLogger(__name__)

def notify(user,key,subject,body,private=False):
    return Notification.objects.get_or_create(key=key,defaults={"user":user,"subject":subject,"body":body,"email":user.email,"is_private":private})

def deliver_one():
    now = timezone.now()
    with transaction.atomic():
        job = Notification.objects.select_for_update(skip_locked=True).filter(sent_at__isnull=True,failed=False,available_at__lte=now).filter(Q(claimed_at__isnull=True)|Q(claimed_at__lt=now-timedelta(minutes=5))).order_by("available_at","id").first()
        if not job: return False
        job.claimed_at = now
        job.attempts += 1
        job.save(update_fields=["claimed_at","attempts"])
    try:
        # Confirmation and security emails are transactional; preferences affect reminders.
        send_mail(job.subject,job.body,None,[job.email],fail_silently=False)
    except Exception:
        logger.warning("Notification delivery failed: notification_id=%s",job.pk)
        Notification.objects.filter(pk=job.pk,claimed_at=now).update(claimed_at=None,available_at=now+timedelta(seconds=min(3600,30*2**min(job.attempts,7))),failed=job.attempts>=8)
    else:
        values = {"sent_at":timezone.now(),"claimed_at":None}
        if job.is_private: values["body"] = "Security email delivered."
        Notification.objects.filter(pk=job.pk,claimed_at=now).update(**values)
    return True
