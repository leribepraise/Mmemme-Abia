import uuid
from datetime import timedelta
from urllib.parse import urlsplit
from dateutil.relativedelta import relativedelta
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from apps.common.api import Conflict, ServiceUnavailable
from apps.common.models import audit
from apps.payments.provider import Paystack, PaystackUnavailable
from .models import Membership, PlanPayment


def current_membership(user):
    membership = Membership.objects.select_related('plan').filter(user=user, expires_at__gt=timezone.now()).first()
    return {'plan': membership.plan_id if membership else 'bronze',
            'expires_at': membership.expires_at if membership else None, 'auto_renew': False}


def initialize(user, plan, key):
    if not settings.PAYSTACK_SECRET_KEY:
        raise ServiceUnavailable('Payment processing has not been configured.')
    with transaction.atomic():
        get_user_model().objects.select_for_update().get(pk=user.pk)
        payment = PlanPayment.objects.filter(user=user, idempotency_key=key).first()
        if payment:
            if payment.plan_id != plan.pk:
                raise Conflict('This checkout key belongs to a different plan.')
            if payment.authorization_url or payment.status == 'SUCCESS':
                return payment
            raise Conflict('This payment is awaiting confirmation. Check payment history before retrying.')
        membership = current_membership(user)
        if membership['plan'] != 'bronze' and membership['plan'] != plan.pk:
            raise Conflict('Your paid plan stays active until expiry. Change plans after that date.')
        if PlanPayment.objects.filter(user=user, status__in=['PROCESSING', 'REVIEW']).exists():
            raise Conflict('An earlier payment needs confirmation. Check payment history before paying again.')
        payment = PlanPayment.objects.create(user=user, plan=plan, amount=plan.price,
                                            reference='PLAN-' + uuid.uuid4().hex, idempotency_key=key)
    # Do not repeat an uncertain provider write; reconciliation checks the same reference.
    try:
        data = Paystack().request('/transaction/initialize', {
            'email': user.email, 'amount': int(payment.amount * 100), 'currency': 'NGN',
            'reference': payment.reference, 'callback_url': settings.FRONTEND_URL + '/plans/return',
            'metadata': {'plan_payment_id': str(payment.pk), 'plan': payment.plan_id},
        })
    except PaystackUnavailable as exc:
        if exc.http_status in {400, 401, 403, 404, 422}:
            PlanPayment.objects.filter(pk=payment.pk, status='PROCESSING').update(status='FAILED')
        raise
    url = data.get('authorization_url', '') if isinstance(data, dict) else ''
    parsed = urlsplit(url)
    if not isinstance(data, dict) or data.get('reference') != payment.reference or parsed.scheme != 'https' or parsed.hostname != 'checkout.paystack.com' or parsed.username:
        raise ServiceUnavailable('Paystack returned an invalid checkout response.')
    PlanPayment.objects.filter(pk=payment.pk).update(authorization_url=url)
    payment.authorization_url = url
    return payment


def verify(payment):
    if payment.status == 'SUCCESS':
        return payment
    return settle(payment.pk, Paystack().verify(payment.reference))


@transaction.atomic
def settle(payment_id, data):
    if not isinstance(data, dict):
        raise ServiceUnavailable('Invalid payment verification response.')
    original = PlanPayment.objects.get(pk=payment_id)
    get_user_model().objects.select_for_update().get(pk=original.user_id)
    payment = PlanPayment.objects.select_for_update().select_related('user', 'plan').get(pk=payment_id)
    payment.last_checked_at = timezone.now()
    if payment.status == 'SUCCESS':
        return payment
    if data.get('status') != 'success':
        if data.get('status') in {'failed', 'abandoned', 'reversed'}:
            payment.status = 'FAILED'
        payment.save(update_fields=['status', 'last_checked_at'])
        return payment
    metadata, customer = data.get('metadata'), data.get('customer')
    valid = (isinstance(metadata, dict) and isinstance(customer, dict)
             and data.get('reference') == payment.reference and data.get('currency') == 'NGN'
             and data.get('amount') == int(payment.amount * 100)
             and str(metadata.get('plan_payment_id')) == str(payment.pk)
             and str(customer.get('email', '')).casefold() == payment.user.email.casefold()
             and data.get('id'))
    if not valid or PlanPayment.objects.filter(provider_reference=str(data.get('id'))).exclude(pk=payment.pk).exists():
        payment.status = 'REVIEW'
        payment.save(update_fields=['status', 'last_checked_at'])
        audit(None, 'membership.payment_mismatch', payment.pk)
        return payment
    membership = Membership.objects.select_for_update().filter(user=payment.user).first()
    now = timezone.now()
    if membership and membership.expires_at > now and membership.plan_id != payment.plan_id:
        payment.status = 'REVIEW'
        payment.save(update_fields=['status', 'last_checked_at'])
        return payment
    start = max(now, membership.expires_at) if membership else now
    expiry = start + relativedelta(months=1)
    Membership.objects.update_or_create(user=payment.user, defaults={'plan': payment.plan, 'expires_at': expiry})
    payment.status = 'SUCCESS'
    payment.provider_reference = str(data['id'])
    payment.paid_at = now
    payment.expires_at = expiry
    payment.save()
    from apps.notifications.services import notify
    notify(payment.user, f'membership:{payment.pk}', 'Membership payment confirmed',
           f'Your {payment.plan.name} plan is active until {expiry.date()}. Renewal is manual; no automatic charges.')
    audit(payment.user, 'membership.activated', payment.pk, plan=payment.plan_id)
    return payment


def reconcile_pending():
    from django.db.models import Q
    now = timezone.now()
    rows = PlanPayment.objects.filter(status='PROCESSING', created_at__gt=now-timedelta(days=7)).filter(
        Q(last_checked_at__isnull=True) | Q(last_checked_at__lt=now-timedelta(minutes=5))).order_by('created_at')[:20]
    for payment in rows:
        PlanPayment.objects.filter(pk=payment.pk).update(last_checked_at=now)
        verify(payment)
