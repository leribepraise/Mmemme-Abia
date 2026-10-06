import logging
import time
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.core.cache import cache
from django.db.models import Q
from django.utils import timezone
from apps.bookings.models import Booking
from apps.bookings.services import expire
from apps.payments.models import Payment,PaymentEvent,Refund,Payout,PayoutAttempt
from apps.payments.services import process_event,verify_payment,submit_refund,reconcile_refund
from apps.notifications.services import deliver_one,queue_event_reminders
from apps.notifications.push import deliver_push_one
from apps.common.api import ServiceUnavailable
from apps.payments.payouts import submit as submit_payout, reconcile as reconcile_payout

logger=logging.getLogger(__name__)

class Command(BaseCommand):
    help="Process durable payment events, reservation expiry, refunds, reminders, email and push notifications."
    def add_arguments(self,parser):
        parser.add_argument("--once",action="store_true")
        parser.add_argument("--interval",type=int,default=10)
    def run_job(self,label,function,*args):
        try: return function(*args)
        except ServiceUnavailable as exc:
            logger.warning("Background job deferred: %s (provider HTTP status: %s)",label,getattr(exc,"http_status",None) or "unavailable")
        except Exception: logger.exception("Background job failed: %s",label)
        finally: cache.set("worker:heartbeat",True,180)
    def tick(self):
        from apps.community.blog_api import publish_due_articles
        self.run_job('scheduled blog posts', publish_due_articles)
        from apps.memberships.services import reconcile_pending
        self.run_job('membership reconciliation', reconcile_pending)
        now=timezone.now()
        for event in PaymentEvent.objects.filter(processed_at__isnull=True,available_at__lte=now,attempts__lt=20).order_by("received_at")[:50]:
            self.run_job("payment event",process_event,event.pk)
        for booking in Booking.objects.filter(status="PENDING",expires_at__lte=now).order_by("expires_at")[:100]:
            self.run_job("reservation expiry",expire,booking.pk)
        pending=Payment.objects.filter(status__in=["PENDING","PROCESSING"],initialized_at__isnull=False).filter(Q(last_checked_at__isnull=True)|Q(last_checked_at__lt=now-timedelta(minutes=5))).filter(created_at__gt=now-timedelta(days=7)).order_by("last_checked_at","created_at")[:25]
        for payment in pending:
            Payment.objects.filter(pk=payment.pk).update(last_checked_at=now)
            self.run_job("payment reconciliation",verify_payment,payment)
        Refund.objects.filter(status="PROCESSING",provider_id="",claimed_at__lt=now-timedelta(minutes=5)).update(status="UNKNOWN")
        for refund in Refund.objects.filter(status="QUEUED").order_by("created_at")[:20]:
            self.run_job("refund submission",submit_refund,refund.pk)
        for refund in Refund.objects.filter(status__in=["UNKNOWN","PROCESSING"]).order_by("updated_at")[:20]:
            self.run_job("refund reconciliation",reconcile_refund,refund.pk)
            Refund.objects.filter(pk=refund.pk).update(updated_at=timezone.now())
        for payout in Payout.objects.filter(status="APPROVED").order_by("approved_at")[:20]:
            self.run_job("payout submission",submit_payout,payout.pk)
        # Revisit successful transfers daily because a bank may subsequently reverse them.
        attempts=PayoutAttempt.objects.filter(
            Q(status__in=["unknown","pending","received","otp"],payout__status__in=["UNKNOWN","PROCESSING","OTP_REQUIRED"]) |
            Q(status="success",payout__status="PAID",checked_at__lt=now-timedelta(days=1))
        ).filter(Q(checked_at__isnull=True)|Q(checked_at__lt=now-timedelta(minutes=5))).order_by("checked_at","id")[:25]
        for attempt in attempts:
            self.run_job("payout reconciliation",reconcile_payout,attempt.pk)
        self.run_job('event reminders', queue_event_reminders)
        from apps.events.announcements import announce_new_event_batch
        self.run_job('new event announcement', announce_new_event_batch)
        for _ in range(50):
            if not self.run_job("email delivery",deliver_one): break
        for _ in range(50):
            if not self.run_job('push delivery',deliver_push_one): break
        from apps.events.models import Event
        from apps.events.images import process_event_image
        for event_id in Event.objects.exclude(image='').filter(
            Q(image_card__isnull=True) | Q(image_card='') | Q(image_detail__isnull=True) | Q(image_detail='')
        ).filter(Q(image_processing_last_attempt_at__isnull=True) | Q(image_processing_last_attempt_at__lt=now-timedelta(minutes=30))).order_by('image_processing_last_attempt_at', 'pk').values_list('pk', flat=True)[:4]:
            Event.objects.filter(pk=event_id).update(image_processing_last_attempt_at=now)
            self.run_job('event image optimization', process_event_image, event_id)
        from apps.notifications.models import PushDelivery, PushSubscription
        PushDelivery.objects.filter(notification__created_at__lt=now-timedelta(days=30)).delete()
        PushSubscription.objects.filter(is_active=False,updated_at__lt=now-timedelta(days=30)).delete()
        # Security links expire after one day; clear undelivered token bodies too.
        from apps.notifications.models import Notification
        Notification.objects.filter(is_private=True,created_at__lt=now-timedelta(days=1)).update(body="Security notification expired.",failed=True)
        # Retain abandoned signup challenges only briefly, beyond the rate-limit window.
        from apps.accounts.models import EmailVerificationCode
        EmailVerificationCode.objects.filter(expires_at__lt=now-timedelta(days=1)).delete()
        cache.set("worker:heartbeat",True,180)
    def handle(self,*args,**options):
        while True:
            try: self.tick()
            except Exception:
                logger.exception("Background processing failed")
                if options["once"]: raise
            if options["once"]: return
            time.sleep(max(1,options["interval"]))
