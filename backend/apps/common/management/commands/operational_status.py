import json
from datetime import timedelta
from django.core.cache import cache
from django.core.management.base import BaseCommand,CommandError
from django.utils import timezone
from apps.bookings.models import Booking
from apps.payments.models import Payment,PaymentEvent,Refund,Payout
from apps.notifications.models import Notification

class Command(BaseCommand):
    help="Print aggregate queue health, failing for conditions that need operator attention."
    def handle(self,*args,**options):
        now=timezone.now()
        counts={
            "worker_missing":int(not bool(cache.get("worker:heartbeat"))),
            "payment_reviews":Payment.objects.filter(status="REVIEW").count(),
            "payouts_needing_review":Payout.objects.filter(status__in=["UNKNOWN","OTP_REQUIRED","FAILED","REVERSED","REVIEW"]).count(),
            "stale_payouts":Payout.objects.filter(status__in=["APPROVED","PROCESSING"],updated_at__lt=now-timedelta(days=1)).count(),
            "stale_payments":Payment.objects.filter(status__in=["PROCESSING","PENDING"],initialized_at__isnull=False,created_at__lt=now-timedelta(days=1)).count(),
            "refunds_needing_review":Refund.objects.filter(status__in=["UNKNOWN","REVIEW","FAILED"]).count(),
            "stale_refunds":Refund.objects.filter(status__in=["QUEUED","PROCESSING"],created_at__lt=now-timedelta(days=1)).count(),
            "overdue_reservations":Booking.objects.filter(status="PENDING",expires_at__lt=now-timedelta(minutes=5)).count(),
            "webhook_backlog":PaymentEvent.objects.filter(processed_at__isnull=True,received_at__lt=now-timedelta(minutes=15)).count(),
            "failed_emails":Notification.objects.filter(failed=True,is_private=False).count(),
            "email_backlog":Notification.objects.filter(failed=False,sent_at__isnull=True,created_at__lt=now-timedelta(minutes=15)).count(),
        }
        self.stdout.write(json.dumps(counts,sort_keys=True))
        if any(counts.values()):raise CommandError("Operational attention required. See docs/DEPLOYMENT.md.")
