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
from apps.notifications.services import deliver_one,notify
from apps.common.api import ServiceUnavailable
from apps.payments.payouts import submit as submit_payout, reconcile as reconcile_payout

logger=logging.getLogger(__name__)

class Command(BaseCommand):
    help="Process durable payment events, reservation expiry, refunds, reminders, and email."
    def add_arguments(self,parser):
        parser.add_argument("--once",action="store_true")
        parser.add_argument("--interval",type=int,default=10)
    def run_job(self,label,function,*args):
        try: return function(*args)
        except Exception: logger.exception("Background job failed: %s",label)
        finally: cache.set("worker:heartbeat",True,180)
    def tick(self):
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
        tomorrow=now+timedelta(days=1)
        for payout in Payout.objects.filter(status="APPROVED").order_by("approved_at")[:20]:
            self.run_job("payout submission",submit_payout,payout.pk)
        # Revisit successful transfers daily because a bank may subsequently reverse them.
        attempts=PayoutAttempt.objects.filter(
            Q(status__in=["unknown","pending","received","otp"],payout__status__in=["UNKNOWN","PROCESSING","OTP_REQUIRED"]) |
            Q(status="success",payout__status="PAID",checked_at__lt=now-timedelta(days=1))
        ).filter(Q(checked_at__isnull=True)|Q(checked_at__lt=now-timedelta(minutes=5))).order_by("checked_at","id")[:25]
        for attempt in attempts:
            self.run_job("payout reconciliation",reconcile_payout,attempt.pk)
        bookings=Booking.objects.filter(status="CONFIRMED",kind="EVENT",items__ticket_type__event__start_datetime__gt=now,items__ticket_type__event__start_datetime__lte=tomorrow,user__email_notifications=True).select_related("user").distinct()[:1000]
        for booking in bookings:
            notify(booking.user,f"reminder:{booking.pk}","Your event is coming up",f"Your event is within the next 24 hours. Booking reference: {booking.booking_reference}.")
        for _ in range(50):
            if not self.run_job("email delivery",deliver_one): break
        # Security links expire after one day; clear undelivered token bodies too.
        from apps.notifications.models import Notification
        Notification.objects.filter(is_private=True,created_at__lt=now-timedelta(days=1)).update(body="Security notification expired.",failed=True)
        cache.set("worker:heartbeat",True,180)
    def handle(self,*args,**options):
        while True:
            try: self.tick()
            except Exception:
                logger.exception("Background processing failed")
                if options["once"]: raise
            if options["once"]: return
            time.sleep(max(1,options["interval"]))
