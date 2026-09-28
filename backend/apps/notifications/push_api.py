import base64
import re
from cryptography.hazmat.primitives.asymmetric import ec
from django.conf import settings
from django.db import transaction, IntegrityError
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.common.api import Conflict, ServiceUnavailable
from apps.accounts.models import User
from .models import PushSubscription
from .push import allowed_endpoint, push_enabled


class SubscriptionInput(serializers.Serializer):
    endpoint = serializers.URLField(max_length=2048)
    keys = serializers.DictField(child=serializers.CharField(max_length=200))

    def validate_endpoint(self, value):
        if not allowed_endpoint(value):
            raise serializers.ValidationError('This browser push service is not supported.')
        return value

    def validate_keys(self, value):
        try:
            values = {}
            for name in ('p256dh','auth'):
                encoded = value[name]
                if not re.fullmatch(r'[A-Za-z0-9_-]+={0,2}', encoded):
                    raise ValueError()
                values[name] = base64.urlsafe_b64decode(encoded + '='*(-len(encoded)%4))
            if len(values['auth']) != 16:
                raise ValueError()
            ec.EllipticCurvePublicKey.from_encoded_point(ec.SECP256R1(), values['p256dh'])
        except (KeyError, ValueError):
            raise serializers.ValidationError('Invalid browser subscription keys.')
        return {name:value[name] for name in ('p256dh','auth')}


class PushConfigView(APIView):
    def get(self, request):
        enabled = push_enabled()
        return Response({'enabled': enabled, 'public_key': settings.VAPID_PUBLIC_KEY if enabled else ''})


class PushSubscriptionView(APIView):
    def patch(self, request):
        endpoint = serializers.CharField(max_length=2048).run_validation(request.data.get('endpoint'))
        enabled = PushSubscription.objects.filter(user=request.user, endpoint=endpoint, is_active=True, session_version=request.user.session_version).exists()
        return Response({'enabled': enabled})

    @transaction.atomic
    def post(self, request):
        if not push_enabled():
            raise ServiceUnavailable('Push notifications are not configured yet.')
        serializer = SubscriptionInput(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.select_for_update().get(pk=request.user.pk)
        data = serializer.validated_data
        existing = PushSubscription.objects.select_for_update().filter(endpoint=data['endpoint']).first()
        if existing and existing.user_id != user.pk:
            raise Conflict('This browser subscription belongs to another account. Disable browser notifications and enable them again.')
        if (not existing or not existing.is_active) and user.push_subscriptions.filter(is_active=True).count() >= 10:
            raise Conflict('Too many devices. Disable notifications on an old device first.')
        values = {**data['keys'], 'is_active':True, 'session_version':user.session_version}
        if existing:
            for field, value in values.items():
                setattr(existing, field, value)
            existing.save(update_fields=[*values, 'updated_at'])
            subscription = existing
        else:
            # Two accounts can register concurrently. Never update the winner's owner.
            try:
                with transaction.atomic():
                    subscription = PushSubscription.objects.create(endpoint=data['endpoint'], user=user, **values)
            except IntegrityError:
                raise Conflict('This browser subscription was registered by another request. Disable browser notifications and enable them again.')
        return Response({'enabled':True, 'id':subscription.pk})

    def delete(self, request):
        endpoint = serializers.CharField(max_length=2048).run_validation(request.data.get('endpoint'))
        PushSubscription.objects.filter(user=request.user, endpoint=endpoint).update(is_active=False)
        return Response(status=204)
