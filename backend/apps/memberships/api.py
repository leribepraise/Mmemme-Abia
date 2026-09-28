from django.shortcuts import get_object_or_404
from rest_framework import permissions, serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.common.api import idempotency_key
from .models import Plan, PlanPayment
from .services import initialize, verify, current_membership


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ['code', 'name', 'price', 'features']


class PlanViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = PlanSerializer
    queryset = Plan.objects.filter(is_active=True).order_by('price')


class PlanPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanPayment
        fields = ['id', 'plan', 'reference', 'amount', 'currency', 'status', 'authorization_url', 'created_at', 'paid_at', 'expires_at']
        read_only_fields = fields


class MembershipViewSet(viewsets.GenericViewSet):
    serializer_class = PlanPaymentSerializer
    def get_queryset(self):
        return PlanPayment.objects.filter(user=self.request.user)

    def list(self, request):
        return Response(current_membership(request.user))

    @action(detail=False, methods=['get'])
    def payments(self, request):
        return self.get_paginated_response(self.get_serializer(self.paginate_queryset(self.get_queryset()), many=True).data)

    @action(detail=False, methods=['post'])
    def checkout(self, request):
        code = serializers.SlugField(max_length=50).run_validation(request.data.get('plan'))
        plan = get_object_or_404(Plan, pk=code, is_active=True, price__gt=0)
        return Response(self.get_serializer(initialize(request.user, plan, idempotency_key(request))).data)

    @action(detail=False, methods=['post'], url_path='verify-reference')
    def verify_reference(self, request):
        reference = serializers.CharField(max_length=60).run_validation(request.data.get('reference'))
        payment = get_object_or_404(self.get_queryset(), reference=reference)
        return Response(self.get_serializer(verify(payment)).data)
