from django.db import transaction
from rest_framework import serializers, viewsets, permissions
from apps.bookings.models import Booking
from apps.common.api import Conflict
from .models import ServiceReview


class ServiceReviewSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    kind = serializers.CharField(source='booking.kind', read_only=True)
    listing = serializers.CharField(source='booking.parent_id', read_only=True)
    def get_author(self, obj):
        return obj.booking.user.get_full_name() or obj.booking.user.username
    class Meta:
        model = ServiceReview
        fields = ['id', 'booking', 'rating', 'comment', 'author', 'kind', 'listing', 'created_at']
        read_only_fields = ['id', 'created_at']
        extra_kwargs = {'booking': {'write_only': True}, 'rating': {'min_value': 1, 'max_value': 5}}
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        user = getattr(self.context.get('request'), 'user', None)
        self.fields['booking'].queryset = Booking.objects.filter(user=user) if user and user.is_authenticated else Booking.objects.none()


class ServiceReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceReviewSerializer
    http_method_names = ['get', 'post', 'head', 'options']
    def get_permissions(self):
        return [permissions.AllowAny()] if self.action in {'list', 'retrieve'} else [permissions.IsAuthenticated()]
    def get_queryset(self):
        qs = ServiceReview.objects.filter(is_approved=True, booking__user__is_active=True).select_related('booking__user').order_by('-created_at', '-pk')
        for param, field in [('kind', 'booking__kind'), ('listing', 'booking__parent_id')]:
            if self.request.query_params.get(param):
                qs = qs.filter(**{field: self.request.query_params[param]})
        return qs
    @transaction.atomic
    def perform_create(self, serializer):
        booking = Booking.objects.select_for_update().get(pk=serializer.validated_data['booking'].pk)
        if booking.status != 'CONFIRMED' or booking.fulfillment_status != 'COMPLETED':
            raise Conflict('You can review a service after your booking is completed.')
        if ServiceReview.objects.filter(booking=booking).exists():
            raise Conflict('This booking already has a review.')
        serializer.save()
