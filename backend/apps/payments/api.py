import hashlib
import hmac
import json
from django.conf import settings
from django.utils import timezone
from rest_framework import permissions, serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.common.api import ServiceUnavailable
from .models import Payment, PaymentEvent, Refund
from .services import initialize, verify_payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model=Payment
        fields=["id","booking","reference","amount","currency","status","authorization_url","paid_at"]
        read_only_fields=fields

class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class=PaymentSerializer
    def get_queryset(self): return Payment.objects.filter(user=self.request.user).order_by("-created_at","id")
    @action(detail=False,methods=["post"])
    def initialize(self,request):
        from django.shortcuts import get_object_or_404
        from apps.bookings.models import Booking
        booking_id=serializers.UUIDField().run_validation(request.data.get("booking"))
        booking=get_object_or_404(Booking,user=request.user,pk=booking_id)
        return Response(PaymentSerializer(initialize(booking.pk,request.user)).data)
    @action(detail=True,methods=["post"])
    def verify(self,request,pk=None):
        return Response(PaymentSerializer(verify_payment(self.get_object())).data)
    @action(detail=False,methods=["post"],url_path="verify-reference")
    def verify_reference(self,request):
        from django.shortcuts import get_object_or_404
        reference=serializers.CharField(max_length=100).run_validation(request.data.get("reference"))
        payment=get_object_or_404(self.get_queryset(),reference=reference)
        return Response(PaymentSerializer(verify_payment(payment)).data)

class WebhookView(APIView):
    authentication_classes=[]
    permission_classes=[permissions.AllowAny]
    throttle_classes=[]
    def post(self,request):
        if not settings.PAYSTACK_SECRET_KEY: raise ServiceUnavailable()
        raw=request.body
        if len(raw)>1024*1024: return Response(status=413)
        expected=hmac.new(settings.PAYSTACK_SECRET_KEY.encode(),raw,hashlib.sha512).hexdigest()
        if not hmac.compare_digest(expected,request.headers.get("X-Paystack-Signature","")):
            return Response(status=401)
        try:
            payload=json.loads(raw)
            event_type=payload["event"]; data=payload["data"]
            if not isinstance(event_type,str) or not isinstance(data,dict): raise ValueError()
        except (ValueError,KeyError,TypeError): return Response(status=400)
        # Retain only identifiers, not card authorization data or raw personal data.
        if event_type=="charge.success" or event_type.startswith("refund.") or event_type in {"transfer.success","transfer.failed","transfer.reversed"}:
            PaymentEvent.objects.get_or_create(digest=hashlib.sha256(raw).hexdigest(),defaults={"event_type":event_type[:100],"reference":str(data.get("reference",""))[:255],"resource_id":str(data.get("id",""))[:100]})
        return Response({"received":True})
