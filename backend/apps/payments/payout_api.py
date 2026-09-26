from django.shortcuts import get_object_or_404
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from apps.common.api import idempotency_key
from .models import PayoutAccount, Payout, PayoutItem
from . import payouts


class AccountSerializer(serializers.ModelSerializer):
    provider_name = serializers.CharField(source="provider.organizer_profile.business_name", read_only=True, default="")
    class Meta:
        model = PayoutAccount
        fields = ["id","provider","provider_name","bank_code","bank_name","account_name","account_last4","status","is_current","review_note","reviewed_at","created_at"]
        read_only_fields = fields


class ItemSerializer(serializers.ModelSerializer):
    booking_reference = serializers.CharField(source="sale.booking.booking_reference", read_only=True)
    class Meta:
        model = PayoutItem
        fields = ["booking_reference","amount","active"]
        read_only_fields = fields


class PayoutSerializer(serializers.ModelSerializer):
    account = AccountSerializer(read_only=True)
    latest_reference = serializers.SerializerMethodField()
    def get_latest_reference(self, obj):
        attempt = next(iter(obj.attempts.all()),None)
        return attempt.reference if attempt else None
    class Meta:
        model = Payout
        fields = ["id","provider","account","amount","currency","status","review_note","created_at","updated_at","latest_reference"]
        read_only_fields = fields


class BankInput(serializers.Serializer):
    bank_code = serializers.RegexField(r"\A[0-9]{2,20}\Z", max_length=20)
    account_number = serializers.RegexField(r"\A[0-9]{10}\Z", write_only=True)


def review_note(request):
    return serializers.CharField(max_length=500, min_length=5).run_validation(request.data.get("note"))


class PayoutAccountViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AccountSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "finance"
    def get_queryset(self):
        qs = PayoutAccount.objects.select_related("provider__organizer_profile")
        if self.action in {"review","queue"}:
            payouts.finance(self.request.user, "review_payoutaccount")
            return qs.filter(is_current=True)
        return qs.filter(provider=self.request.user, is_current=True)
    def create(self, request):
        form = BankInput(data=request.data)
        form.is_valid(raise_exception=True)
        account = payouts.register_account(request.user, form.validated_data["account_number"], form.validated_data["bank_code"])
        return Response(self.get_serializer(account).data, status=201)
    @action(detail=False, methods=["get"])
    def banks(self, request):
        if not request.user.is_verified:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Provider verification is required.")
        return Response(payouts.bank_list())
    @action(detail=False, methods=["get"])
    def queue(self, request):
        page = self.paginate_queryset(self.get_queryset())
        return self.get_paginated_response(self.get_serializer(page, many=True).data)
    @action(detail=True, methods=["post"])
    def review(self, request, pk=None):
        account = self.get_object()
        decision = serializers.ChoiceField(["APPROVED","REJECTED","SUSPENDED"]).run_validation(request.data.get("decision"))
        return Response(self.get_serializer(payouts.review_account(account.pk, request.user, decision, review_note(request))).data)


class PayoutViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PayoutSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "finance"
    def get_queryset(self):
        qs = Payout.objects.select_related("account__provider__organizer_profile").prefetch_related("attempts")
        if self.action in {"queue","approve","retry","cancel","finalize","reconcile"} or (self.action == "items" and self.request.user.is_staff and self.request.user.has_perm("payments.release_payout")):
            payouts.finance(self.request.user)
            return qs
        return qs.filter(provider=self.request.user)
    def create(self, request):
        payout, created = payouts.request_payout(request.user, idempotency_key(request))
        return Response(self.get_serializer(payout).data, status=201 if created else 200)
    @action(detail=False, methods=["get"])
    def summary(self, request):
        return Response({**payouts.balance(request.user),
            "can_review_banks":request.user.is_staff and request.user.has_perm("payments.review_payoutaccount"),
            "can_release_payouts":request.user.is_staff and request.user.has_perm("payments.release_payout")})
    @action(detail=False, methods=["get"])
    def queue(self, request):
        page = self.paginate_queryset(self.get_queryset())
        return self.get_paginated_response(self.get_serializer(page, many=True).data)
    @action(detail=True, methods=["get"])
    def items(self, request, pk=None):
        rows = self.get_object().items.select_related("sale__booking").order_by("pk")
        return self.get_paginated_response(ItemSerializer(self.paginate_queryset(rows),many=True).data)
    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        return Response(self.get_serializer(payouts.approve(self.get_object().pk, request.user, review_note(request))).data)
    @action(detail=True, methods=["post"])
    def retry(self, request, pk=None):
        return Response(self.get_serializer(payouts.retry(self.get_object().pk, request.user, review_note(request))).data)
    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        return Response(self.get_serializer(payouts.cancel(self.get_object().pk, request.user, review_note(request))).data)
    @action(detail=True, methods=["post"])
    def finalize(self, request, pk=None):
        otp = serializers.RegexField(r"\A[0-9]{4,10}\Z", write_only=True).run_validation(request.data.get("otp"))
        return Response(self.get_serializer(payouts.finalize(self.get_object().pk, request.user, otp)).data)
    @action(detail=True, methods=["post"])
    def reconcile(self, request, pk=None):
        payout = self.get_object()
        payouts.finance(request.user, provider_id=payout.provider_id)
        attempt = get_object_or_404(payout.attempts, pk=payout.attempts.values_list("pk",flat=True).first())
        return Response(self.get_serializer(payouts.reconcile(attempt.pk, require_confirmation=True)).data)
