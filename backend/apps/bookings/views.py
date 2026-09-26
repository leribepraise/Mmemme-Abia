from django.db.models import Q, Sum
from rest_framework import mixins, viewsets, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.common.api import idempotency_key
from .models import Booking
from .serializers import BookingSerializer, CreateBookingSerializer
from . import services

class BookingViewSet(mixins.ListModelMixin,mixins.RetrieveModelMixin,viewsets.GenericViewSet):
    serializer_class = BookingSerializer
    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated: return Booking.objects.none()
        qs = Booking.objects.filter(user=user)
        if self.action in {"received","fulfill","analytics","decline"}:
            qs = Booking.objects.filter(supplier=user)
        return qs.prefetch_related("items")
    def create(self,request):
        data = CreateBookingSerializer(data=request.data)
        data.is_valid(raise_exception=True)
        values = dict(data.validated_data)
        values["entries"] = values.pop("items")
        booking,created = services.reserve(request.user,idempotency_key(request),**values)
        return Response(BookingSerializer(booking).data,status=201 if created else 200)
    @action(detail=True,methods=["post"])
    def cancel(self,request,pk=None):
        booking = self.get_object()
        return Response(BookingSerializer(services.cancel(booking.pk,request.user)).data)
    @action(detail=False,methods=["get"])
    def received(self,request):
        qs = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(qs)
        return self.get_paginated_response(BookingSerializer(page,many=True).data)
    @action(detail=True,methods=["post"])
    def decline(self,request,pk=None):
        booking=self.get_object()
        if booking.fulfillment_status=="COMPLETED":
            raise serializers.ValidationError("Completed services require support review.")
        return Response(BookingSerializer(services.cancel(booking.pk,request.user,force=True)).data)
    @action(detail=True,methods=["post"])
    def fulfill(self,request,pk=None):
        booking = self.get_object()
        return Response(BookingSerializer(services.fulfill(booking.pk,request.user,request.data.get("status"))).data)
    @action(detail=False,methods=["get"])
    def analytics(self,request):
        from apps.payments.models import LedgerEntry
        entries = LedgerEntry.objects.filter(booking__supplier=request.user)
        sales = entries.filter(kind="SALE").aggregate(gross=Sum("gross"),net=Sum("provider_amount"))
        refunds = entries.filter(kind="REFUND").aggregate(gross=Sum("gross"),net=Sum("provider_amount"))
        return Response({"confirmed_bookings":self.get_queryset().filter(status="CONFIRMED").count(),"gross_sales":sales["gross"] or 0,"refunds":refunds["gross"] or 0,"provider_balance_before_payouts":(sales["net"] or 0)-(refunds["net"] or 0)})
