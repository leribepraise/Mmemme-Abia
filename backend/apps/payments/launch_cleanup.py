"""One-off live launch cleanup. Provider reads only; never sends refunds or transfers."""
import json
from pathlib import Path
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core import serializers
from django.core.management.base import CommandError
from django.db import transaction
from django.utils import timezone
from django.test.utils import override_settings
from apps.bookings.models import Booking
from apps.bookings.services import _locked_booking, _change_stock, resource_model, SOURCES
from apps.common.models import audit
from apps.memberships.models import Membership, PlanPayment
from apps.notifications.models import Notification, PushDelivery
from .models import Payment, PaymentEvent, Refund, LedgerEntry, PayoutItem
from .provider import Paystack, PaystackUnavailable


def inspect_launch(test_key):
    if not settings.PAYSTACK_SECRET_KEY.startswith('sk_live_') or not test_key.startswith('sk_test_'):
        raise CommandError('Both live and test keys are needed to identify transactions safely.')
    report = {'test': [], 'live': [], 'unknown': [], 'memberships': list(Membership.objects.exclude(plan_id='bronze').values('pk', 'user_id', 'plan_id', 'expires_at'))}
    for model in [Payment, PlanPayment]:
        for payment in model.objects.order_by('pk'):
            item = {'model': model._meta.label_lower, 'id': str(payment.pk), 'reference': payment.reference,
                    'status': payment.status, 'amount': str(payment.amount), 'user_id': payment.user_id}
            domain = 'unknown'
            for key, expected in [(settings.PAYSTACK_SECRET_KEY, 'live'), (test_key, 'test')]:
                try:
                    with override_settings(PAYSTACK_SECRET_KEY=key):
                        data = Paystack().verify(payment.reference)
                except PaystackUnavailable as exc:
                    # An absent reference is not proof of a test payment.
                    if exc.http_status in {400, 404}: continue
                    raise CommandError('Provider verification failed; no cleanup was performed.') from None
                if isinstance(data, dict) and data.get('domain') == expected and data.get('reference') == payment.reference and data.get('currency') == payment.currency and data.get('amount') == int(payment.amount * 100):
                    domain = expected
                    break
            report[domain].append(item)
    return report


@transaction.atomic
def apply_launch(report, backup_path):
    """Apply only a provider-verified report. Abort if records changed since inspection."""
    if report['unknown']:
        raise CommandError('Unclassified transactions remain. Resolve these before applying cleanup.')
    member_rows = report['memberships']
    paid_users = {row['user_id'] for row in member_rows}
    if any(row['model'] == 'memberships.planpayment' and row['user_id'] in paid_users and row['status'] in {'SUCCESS', 'PROCESSING', 'REVIEW'} for row in report['live']):
        raise CommandError('A paid account has a live membership payment. Review it before resetting its plan.')
    user_ids = {row['user_id'] for row in member_rows} | {row['user_id'] for row in report['test']}
    list(get_user_model().objects.select_for_update().filter(pk__in=user_ids).order_by('pk'))
    memberships = list(Membership.objects.select_for_update().exclude(plan_id='bronze').order_by('pk'))
    expected = {row['pk']: (row['user_id'], row['plan_id'], row['expires_at']) for row in member_rows}
    if {row.pk: (row.user_id, row.plan_id, row.expires_at) for row in memberships} != expected:
        raise CommandError('Memberships changed during inspection. Run the preview again.')
    payment_ids = [row['id'] for row in report['test'] if row['model'] == 'payments.payment']
    plan_ids = [row['id'] for row in report['test'] if row['model'] == 'memberships.planpayment']
    booking_ids = list(Payment.objects.filter(pk__in=payment_ids).values_list('booking_id', flat=True).distinct())
    bookings = [_locked_booking(pk)[1] for pk in sorted(booking_ids)]
    payments = list(Payment.objects.select_for_update().filter(pk__in=payment_ids).order_by('pk'))
    plans = list(PlanPayment.objects.select_for_update().filter(pk__in=plan_ids).order_by('pk'))
    actual = {(row._meta.label_lower, str(row.pk)): (row.reference, row.status, str(row.amount), row.user_id) for row in [*payments, *plans]}
    wanted = {(row['model'], row['id']): (row['reference'], row['status'], row['amount'], row['user_id']) for row in report['test']}
    if actual != wanted or Payment.objects.exclude(pk__in=payment_ids).filter(booking_id__in=booking_ids).exists():
        raise CommandError('Payment records changed or a booking has another payment. No cleanup applied.')
    if PayoutItem.objects.filter(sale__payment_id__in=payment_ids).exists():
        raise CommandError('A test sale is linked to a payout. Reconcile that payout before cleanup.')
    if any(row.fulfillment_status == 'COMPLETED' for row in bookings):
        raise CommandError('A test-paid booking is already completed. Review its stock before cleanup.')
    references = [row['reference'] for row in report['test']]
    refunds = list(Refund.objects.select_for_update().filter(payment_id__in=payment_ids))
    ledger = list(LedgerEntry.objects.select_for_update().filter(payment_id__in=payment_ids))
    events = list(PaymentEvent.objects.select_for_update().filter(reference__in=references))
    notices = list(Notification.objects.filter(key__in=[f'membership:{pk}' for pk in plan_ids]))
    stock = {}
    tickets = []
    for booking in bookings:
        notices.extend(Notification.objects.filter(key__startswith=f'booking:{booking.pk}:'))
        tickets.extend(booking.tickets.all())
        for item in booking.items.all():
            model = resource_model(booking.kind)
            row = model.objects.select_for_update().get(pk=getattr(item, SOURCES[booking.kind]+'_id'))
            stock[(row._meta.label_lower, row.pk)] = row
    deliveries = list(PushDelivery.objects.filter(notification__in=notices))
    backup = [*memberships, *bookings, *stock.values(), *tickets, *payments, *plans, *refunds, *ledger, *events, *notices, *deliveries]
    # Exclusive creation prevents an earlier backup from being overwritten.
    target = Path(backup_path)
    with target.open('x', encoding='utf-8') as stream:
        stream.write(serializers.serialize('json', backup, indent=2))
        stream.flush()
        import os
        os.fsync(stream.fileno())
    now = timezone.now()
    for booking in bookings:
        if booking.status == 'PENDING': _change_stock(booking, reserved=-1)
        elif booking.status == 'CONFIRMED': _change_stock(booking, sold=-1)
        booking.status = 'CANCELLED'
        booking.save(update_fields=['status', 'updated_at'])
        booking.tickets.update(status='CANCELLED')
    Refund.objects.filter(pk__in=[r.pk for r in refunds]).delete()
    LedgerEntry.objects.filter(pk__in=[r.pk for r in ledger]).delete()
    PaymentEvent.objects.filter(pk__in=[r.pk for r in events]).delete()
    Notification.objects.filter(pk__in=[r.pk for r in notices]).delete()
    Payment.objects.filter(pk__in=payment_ids).delete()
    PlanPayment.objects.filter(pk__in=plan_ids).delete()
    Membership.objects.filter(pk__in=[r.pk for r in memberships]).update(plan_id='bronze', expires_at=now, updated_at=now)
    counts = {'deleted_booking_payments': len(payments), 'deleted_plan_payments': len(plans), 'reset_memberships': len(memberships), 'cancelled_test_bookings': len(bookings)}
    audit(None, 'launch.test_payments_removed', 'launch', **counts)
    return counts
