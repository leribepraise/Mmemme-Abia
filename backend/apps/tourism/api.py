from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import Q, Sum
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from apps.common.api import Conflict, validate_image
from apps.common.models import audit
from apps.bookings.models import Booking
from apps.bookings.serializers import BookingSerializer
from apps.notifications.services import notify
from .models import TourismOperator, TourismStaff, TourismExperience, TourismImage, TourPackage, TourDeparture, TourismRequest
from .services import authorize, operator_role, available, check_in, departure_action


class OperatorSerializer(serializers.ModelSerializer):
    my_role = serializers.SerializerMethodField()
    def get_my_role(self, obj): return operator_role(self.context['request'].user, obj)
    def validate_logo(self, value):
        if value: validate_image(value)
        return value
    class Meta:
        model = TourismOperator
        fields = ['id', 'owner', 'name', 'registration_number', 'description', 'logo', 'contact_email', 'contact_phone', 'address', 'visitor_instructions', 'cancellation_hours', 'commission_bps', 'status', 'review_note', 'my_role']
        read_only_fields = ['id', 'owner', 'commission_bps', 'status', 'review_note', 'my_role']
    def to_representation(self, obj):
        data = super().to_representation(obj)
        user = self.context['request'].user
        if data['my_role'] not in {'OWNER', 'MANAGER'} and not (user.is_staff and user.has_perm('tourism.view_tourismoperator')):
            for key in ['owner', 'registration_number', 'commission_bps', 'review_note']: data.pop(key, None)
        return data


class ExperienceSerializer(serializers.ModelSerializer):
    latitude = serializers.DecimalField(max_digits=9, decimal_places=6, min_value=-90, max_value=90, required=False, allow_null=True)
    longitude = serializers.DecimalField(max_digits=9, decimal_places=6, min_value=-180, max_value=180, required=False, allow_null=True)
    class Meta:
        model = TourismExperience
        fields = ['id', 'name', 'description', 'category', 'location_name', 'address', 'latitude', 'longitude', 'contact_phone', 'contact_email', 'is_active', 'review_status', 'review_note']
        read_only_fields = ['id', 'review_status', 'review_note']
    def validate(self, attrs):
        if attrs.get('is_active') and (not self.instance or self.instance.review_status != 'APPROVED'):
            raise serializers.ValidationError('Admin approval is required before publishing this listing.')
        return attrs


class PackageSerializer(serializers.ModelSerializer):
    price = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0)
    duration_hours = serializers.IntegerField(min_value=1, max_value=720)
    class Meta:
        model = TourPackage
        fields = ['id', 'experience', 'name', 'description', 'price', 'duration_hours', 'itinerary', 'inclusions', 'exclusions', 'meeting_point', 'is_active']
        read_only_fields = ['id']
    def validate(self, attrs):
        experience = attrs.get('experience', getattr(self.instance, 'experience', None))
        if not experience or experience.operator_id != self.context['operator'].pk: raise serializers.ValidationError('Choose your own experience.')
        if self.instance and experience.pk != self.instance.experience_id: raise serializers.ValidationError('Packages cannot move between experiences.')
        if self.instance and self.instance.departures.filter(Q(quantity_reserved__gt=0) | Q(quantity_sold__gt=0)).exists():
            if any(k != 'is_active' and v != getattr(self.instance, k) for k, v in attrs.items()):
                raise serializers.ValidationError('This package has bookings. Add a new package to change its terms.')
        return attrs


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourismImage
        fields = ['id', 'experience', 'image', 'caption', 'is_primary']
        read_only_fields = ['id']
    def validate_image(self, value): validate_image(value); return value
    def validate(self, attrs):
        experience = attrs.get('experience', getattr(self.instance, 'experience', None))
        if not experience or experience.operator_id != self.context['operator'].pk: raise serializers.ValidationError('Choose your own experience.')
        if self.instance and experience.pk != self.instance.experience_id: raise serializers.ValidationError('Images cannot move between experiences.')
        return attrs


class DepartureSerializer(serializers.ModelSerializer):
    quantity = serializers.IntegerField(min_value=1, max_value=10000)
    price = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0)
    class Meta:
        model = TourDeparture
        fields = ['id', 'package', 'guide', 'starts_at', 'ends_at', 'price', 'quantity', 'quantity_reserved', 'quantity_sold', 'quantity_available', 'status', 'cancellation_reason', 'is_active']
        read_only_fields = ['id', 'quantity_reserved', 'quantity_sold', 'quantity_available', 'status', 'cancellation_reason']
    def validate(self, attrs):
        value = lambda key: attrs.get(key, getattr(self.instance, key, None))
        operator = self.context['operator']
        package = value('package')
        if not package or package.experience.operator_id != operator.pk: raise serializers.ValidationError('Choose your own package.')
        if self.instance and package.pk != self.instance.package_id: raise serializers.ValidationError('Departures cannot move to another package.')
        if value('ends_at') <= value('starts_at') or value('starts_at') <= timezone.now(): raise serializers.ValidationError('Choose a future start and a later end.')
        if self.instance and self.instance.status != 'SCHEDULED': raise serializers.ValidationError('Cancelled or completed tours cannot be edited.')
        held = self.instance.quantity_reserved + self.instance.quantity_sold if self.instance else 0
        if value('quantity') < held: raise serializers.ValidationError('Capacity cannot be less than held and sold places.')
        if held and any(k in attrs and attrs[k] != getattr(self.instance, k) for k in ['starts_at', 'ends_at', 'price', 'guide']): raise serializers.ValidationError('Booked tours cannot be repriced or rescheduled. Cancel and refund instead.')
        guide = value('guide')
        if guide:
            if not guide.is_active or not guide.email_verified or (guide.pk != operator.owner_id and not operator.staff.filter(user=guide, is_active=True).exists()):
                raise serializers.ValidationError('Choose an active, verified member of your team.')
            overlaps = TourDeparture.objects.filter(guide=guide, status='SCHEDULED', starts_at__lt=value('ends_at'), ends_at__gt=value('starts_at'))
            if self.instance: overlaps = overlaps.exclude(pk=self.instance.pk)
            if overlaps.exists(): raise serializers.ValidationError('This guide is already assigned to an overlapping tour.')
        return attrs


class OperatorViewSet(viewsets.GenericViewSet):
    serializer_class = OperatorSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'patch', 'head', 'options']
    def get_permissions(self):
        return [AllowAny()] if self.action in {'list', 'retrieve'} else super().get_permissions()
    def get_queryset(self):
        qs = TourismOperator.objects.select_related('owner').order_by('name', 'pk')
        user = self.request.user
        if user.is_authenticated and user.is_staff and user.has_perm('tourism.view_tourismoperator'): return qs
        owned = Q(owner=user) | Q(staff__user=user, staff__is_active=True) if user.is_authenticated else Q(pk__isnull=True)
        if self.action in {'list', 'retrieve'}:
            return qs.filter(Q(status='APPROVED', owner__is_active=True, owner__email_verified=True) | owned).distinct()
        return qs.filter(owned).distinct()
    def list(self, request):
        page = self.paginate_queryset(self.get_queryset())
        return self.get_paginated_response(self.get_serializer(page, many=True).data)
    def retrieve(self, request, pk=None): return Response(self.get_serializer(self.get_object()).data)
    @action(detail=False, methods=['get'])
    def mine(self, request): return self.list(request)
    @transaction.atomic
    def create(self, request):
        user = get_user_model().objects.select_for_update().get(pk=request.user.pk)
        if not user.email_verified: raise PermissionDenied('Verify your email before applying.')
        if TourismOperator.objects.filter(owner=user).exists(): raise Conflict('You already have an operator application.')
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        operator = serializer.save(owner=user)
        audit(user, 'tourism.operator_applied', operator.pk)
        return Response(self.get_serializer(operator).data, status=201)
    @transaction.atomic
    def partial_update(self, request, pk=None):
        operator = TourismOperator.objects.select_for_update().get(pk=self.get_object().pk)
        authorize(request.user, operator, owner=True)
        serializer = self.get_serializer(operator, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        # Legal identity changes require fresh approval; preserve existing bookings.
        identity_changed = any(k in serializer.validated_data and serializer.validated_data[k] != getattr(operator, k) for k in ['name', 'registration_number'])
        serializer.save(**({'status': 'PENDING'} if identity_changed or operator.status == 'REJECTED' else {}))
        audit(request.user, 'tourism.operator_updated', operator.pk)
        return Response(serializer.data)
    @action(detail=True, methods=['post'])
    @transaction.atomic
    def review(self, request, pk=None):
        from apps.accounts.administration import require_staff_permission
        require_staff_permission(request.user, 'tourism.change_tourismoperator')
        original = self.get_object()
        get_user_model().objects.select_for_update(no_key=True).get(pk=original.owner_id)
        operator = TourismOperator.objects.select_for_update().get(pk=self.get_object().pk)
        if operator.owner_id == request.user.pk: raise PermissionDenied('A different admin must review your application.')
        class ReviewSerializer(serializers.Serializer):
            status = serializers.ChoiceField(choices=['APPROVED', 'REJECTED', 'SUSPENDED'])
            commission_bps = serializers.IntegerField(min_value=0, max_value=10000, required=False)
            note = serializers.CharField(max_length=3000, required=False, allow_blank=True)
        data = ReviewSerializer(data=request.data); data.is_valid(raise_exception=True)
        values = data.validated_data
        if values['status'] == 'APPROVED':
            if not operator.owner.is_active or not operator.owner.email_verified: raise Conflict('The owner must have an active, email-verified account.')
            if values.get('commission_bps', operator.commission_bps) is None: raise serializers.ValidationError('Set the agreed tourism commission; 500 means 5%.')
            operator.commission_bps = values.get('commission_bps', operator.commission_bps)
            get_user_model().objects.filter(pk=operator.owner_id).update(is_verified=True)
        elif not values.get('note', '').strip(): raise serializers.ValidationError('Explain the review decision.')
        operator.status, operator.review_note = values['status'], values.get('note', '')
        operator.reviewed_by, operator.reviewed_at = request.user, timezone.now()
        operator.save()
        audit(request.user, 'tourism.operator_reviewed', operator.pk, status=operator.status, commission_bps=operator.commission_bps)
        notify(operator.owner, f'tourism-review:{operator.pk}:{operator.reviewed_at}', 'Tourism partnership update', f'Your operator {operator.name} is {operator.status.lower()}. {operator.review_note}')
        return Response(self.get_serializer(operator).data)
    @action(detail=True, methods=['get', 'post'])
    @transaction.atomic
    def staff(self, request, pk=None):
        operator = TourismOperator.objects.select_for_update().get(pk=self.get_object().pk)
        authorize(request.user, operator, owner=True)
        if request.method == 'POST':
            class StaffSerializer(serializers.Serializer):
                email = serializers.EmailField()
                role = serializers.ChoiceField(choices=['MANAGER', 'GUIDE'])
                is_active = serializers.BooleanField(default=True)
            data = StaffSerializer(data=request.data); data.is_valid(raise_exception=True)
            user = get_object_or_404(get_user_model(), email__iexact=data.validated_data['email'], is_active=True, email_verified=True)
            if user.pk == operator.owner_id: raise serializers.ValidationError('The operator owner already has full access.')
            TourismStaff.objects.update_or_create(operator=operator, user=user, defaults={k: data.validated_data[k] for k in ['role', 'is_active']})
            audit(request.user, 'tourism.staff_updated', operator.pk, user=user.pk, role=data.validated_data['role'], active=data.validated_data['is_active'])
        return Response([{'id': row.user_id, 'email': row.user.email, 'role': row.role, 'is_active': row.is_active} for row in operator.staff.select_related('user')])
    @action(detail=True, methods=['get'])
    def team(self, request, pk=None):
        operator = self.get_object(); authorize(request.user, operator)
        return Response([{'id': operator.owner_id, 'email': operator.contact_email}] + [
            {'id': row.user_id, 'email': row.user.email} for row in operator.staff.filter(is_active=True, user__is_active=True, user__email_verified=True).select_related('user')])
    def inventory(self, request, model, serializer_class):
        original = self.get_object()
        authorize(request.user, original, guide=request.method == 'GET')
        if request.method == 'POST' and model is TourDeparture:
            # User locks precede experience locks, matching reservations and
            # serializing guide scheduling across different operators.
            guide_id = request.data.get('guide') if 'guide' in request.data else TourDeparture.objects.filter(
                pk=request.data.get('id'), package__experience__operator=original).values_list('guide_id', flat=True).first()
            if guide_id:
                guide_id = serializers.IntegerField(min_value=1).run_validation(guide_id)
                get_object_or_404(get_user_model().objects.select_for_update(no_key=True), pk=guide_id)
        operator = TourismOperator.objects.select_for_update().get(pk=original.pk)
        path = {TourismExperience: 'operator', TourPackage: 'experience__operator', TourDeparture: 'package__experience__operator', TourismImage: 'experience__operator'}[model]
        qs = model.objects.filter(**{path: operator}).order_by('pk')
        if request.method == 'POST':
            if not available(operator): raise Conflict('Your operator needs approval before publishing tours.')
            list(TourismExperience.objects.select_for_update().filter(operator=operator).order_by('pk'))
            instance = get_object_or_404(qs.select_for_update(), pk=request.data['id']) if request.data.get('id') else None
            serializer = serializer_class(instance, data=request.data, partial=bool(instance), context={'operator': operator, 'request': request})
            serializer.is_valid(raise_exception=True)
            kwargs = {'operator': operator, 'created_by': operator.owner, 'review_status': 'PENDING', 'is_active': False} if model is TourismExperience and not instance else {}
            if model is TourismExperience and instance:
                # Content changes require review again; pausing alone does not.
                if any(k != 'is_active' and v != getattr(instance, k) for k, v in serializer.validated_data.items()):
                    kwargs.update(review_status='PENDING', is_active=False)
            if model is TourismImage:
                experience = serializer.validated_data.get('experience', getattr(instance, 'experience', None))
                if not instance and experience.images.count() >= 12: raise serializers.ValidationError('Use at most 12 images per experience.')
                if serializer.validated_data.get('is_primary'): experience.images.exclude(pk=getattr(instance, 'pk', None)).update(is_primary=False)
                # Changing gallery content requires the same listing review as text.
                experience.review_status, experience.is_active = 'PENDING', False
                experience.save(update_fields=['review_status', 'is_active'])
            obj = serializer.save(**kwargs)
            audit(request.user, 'tourism.inventory_updated', obj.pk, model=model._meta.label)
        page = self.paginate_queryset(qs)
        return self.get_paginated_response(serializer_class(page, many=True, context={'request': request}).data)
    @action(detail=True, methods=['get', 'post'])
    @transaction.atomic
    def experiences(self, request, pk=None): return self.inventory(request, TourismExperience, ExperienceSerializer)
    @action(detail=True, methods=['get', 'post'])
    @transaction.atomic
    def packages(self, request, pk=None): return self.inventory(request, TourPackage, PackageSerializer)
    @action(detail=True, methods=['get', 'post'])
    @transaction.atomic
    def departures(self, request, pk=None): return self.inventory(request, TourDeparture, DepartureSerializer)
    @action(detail=True, methods=['get', 'post'])
    @transaction.atomic
    def images(self, request, pk=None): return self.inventory(request, TourismImage, ImageSerializer)
    @action(detail=True, methods=['post'], url_path='review-experience')
    @transaction.atomic
    def review_experience(self, request, pk=None):
        from apps.accounts.administration import require_staff_permission
        require_staff_permission(request.user, 'tourism.change_tourismexperience')
        operator = self.get_object()
        if operator.owner_id == request.user.pk: raise PermissionDenied('A different admin must review your listing.')
        experience = get_object_or_404(TourismExperience.objects.select_for_update(), pk=request.data.get('experience'), operator=operator)
        decision = serializers.ChoiceField(choices=['APPROVED', 'REJECTED']).run_validation(request.data.get('status'))
        note = serializers.CharField(max_length=3000, allow_blank=True).run_validation(request.data.get('note', ''))
        if decision == 'APPROVED' and not available(operator): raise Conflict('Approve the operator first.')
        if decision == 'REJECTED' and not note.strip(): raise serializers.ValidationError('Explain the rejection.')
        experience.review_status, experience.review_note, experience.is_active = decision, note, decision == 'APPROVED'
        experience.save(update_fields=['review_status', 'review_note', 'is_active'])
        audit(request.user, 'tourism.experience_reviewed', experience.pk, status=decision)
        notify(operator.owner, f'tourism-review:{experience.pk}:{timezone.now()}', 'Tour listing review', f'{experience.name} is {decision.lower()}. {note}')
        return Response(ExperienceSerializer(experience).data)
    @action(detail=True, methods=['post'], url_path='adopt-experience')
    @transaction.atomic
    def adopt_experience(self, request, pk=None):
        from apps.accounts.administration import require_staff_permission
        require_staff_permission(request.user, 'tourism.change_tourismexperience')
        operator = TourismOperator.objects.select_for_update().get(pk=self.get_object().pk)
        if not available(operator): raise Conflict('Approve the operator first.')
        experience = get_object_or_404(TourismExperience.objects.select_for_update(), pk=request.data.get('experience'), operator__isnull=True, created_by=operator.owner)
        if Booking.objects.filter(kind='TOURISM', parent_id=str(experience.pk), status__in=['PENDING', 'CONFIRMED']).exclude(fulfillment_status='COMPLETED').exists():
            raise Conflict('Resolve ongoing bookings before moving this legacy listing into an operator dashboard.')
        experience.operator, experience.review_status, experience.is_active = operator, 'PENDING', False
        experience.save(update_fields=['operator', 'review_status', 'is_active'])
        audit(request.user, 'tourism.legacy_adopted', experience.pk, operator=str(operator.pk))
        return Response(ExperienceSerializer(experience).data)
    @action(detail=True, methods=['get'])
    def bookings(self, request, pk=None):
        operator = self.get_object(); authorize(request.user, operator, guide=True)
        qs = Booking.objects.filter(kind='TOURISM', items__tour_departure__package__experience__operator=operator).distinct().prefetch_related('items').order_by('-created_at')
        if request.query_params.get('departure'):
            departure = get_object_or_404(TourDeparture, pk=request.query_params['departure'], package__experience__operator=operator)
            qs = qs.filter(items__tour_departure=departure)
        page = self.paginate_queryset(qs)
        return self.get_paginated_response(BookingSerializer(page, many=True).data)
    @action(detail=True, methods=['get'])
    def earnings(self, request, pk=None):
        from apps.payments.models import LedgerEntry
        operator = self.get_object(); authorize(request.user, operator)
        rows = LedgerEntry.objects.filter(booking__kind='TOURISM', booking__items__tour_departure__package__experience__operator=operator)
        return Response({kind.lower(): rows.filter(kind=kind).aggregate(gross=Sum('gross'), platform_fee=Sum('platform_fee'), provider_amount=Sum('provider_amount')) for kind in ['SALE', 'REFUND']})
    @action(detail=True, methods=['post'], url_path='departure-action')
    def departure_action(self, request, pk=None):
        operator = self.get_object(); authorize(request.user, operator)
        departure = get_object_or_404(TourDeparture, pk=request.data.get('departure'), package__experience__operator=operator)
        operation = request.data.get('action')
        if operation == 'cancel': result = departure_action(request.user, departure.pk, 'cancel', serializers.CharField(max_length=3000).run_validation(request.data.get('reason')))
        elif operation == 'complete': result = departure_action(request.user, departure.pk, 'complete')
        else: raise serializers.ValidationError('Choose cancel or complete.')
        return Response(DepartureSerializer(result).data)
    @action(detail=False, methods=['post'], url_path='check-in')
    def checkin(self, request):
        token = serializers.CharField(max_length=300).run_validation(request.data.get('token'))
        return Response(BookingSerializer(check_in(request.user, token)).data)


class TourismRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourismRequest
        fields = ['id', 'operator', 'booking', 'message', 'response', 'status', 'created_at']
        read_only_fields = ['id', 'response', 'status', 'created_at']
    def validate(self, attrs):
        booking = attrs.get('booking')
        if booking and (booking.user_id != self.context['request'].user.pk or booking.kind != 'TOURISM' or not booking.items.filter(tour_departure__package__experience__operator=attrs['operator']).exists()):
            raise serializers.ValidationError('Select your booking with this tourism operator.')
        return attrs


class TourismRequestViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TourismRequestSerializer
    http_method_names = ['get', 'post', 'head', 'options']
    def get_queryset(self):
        user = self.request.user
        qs = TourismRequest.objects.select_related('operator').order_by('-created_at', 'pk')
        if not (user.is_staff and user.has_perm('tourism.view_tourismrequest')):
            qs = qs.filter(Q(user=user) | Q(operator__owner=user) | Q(operator__staff__user=user, operator__staff__is_active=True, operator__staff__role='MANAGER')).distinct()
        if self.request.query_params.get('operator'): qs = qs.filter(operator_id=self.request.query_params['operator'])
        return qs
    def perform_create(self, serializer):
        if not self.request.user.email_verified: raise PermissionDenied('Verify your email first.')
        obj = serializer.save(user=self.request.user)
        notify(obj.operator.owner, f'tourism-request:{obj.pk}', 'Tourism support request', obj.message)
        audit(self.request.user, 'tourism.support_requested', obj.pk)
    @action(detail=True, methods=['post'])
    @transaction.atomic
    def respond(self, request, pk=None):
        obj = TourismRequest.objects.select_for_update().get(pk=self.get_object().pk)
        if request.user.is_staff:
            from apps.accounts.administration import require_staff_permission
            require_staff_permission(request.user, 'tourism.change_tourismrequest')
        else: authorize(request.user, obj.operator)
        obj.response = serializers.CharField(max_length=3000).run_validation(request.data.get('response'))
        obj.status = 'RESOLVED'
        obj.save(update_fields=['response', 'status'])
        notify(obj.user, f'tourism-response:{obj.pk}:{timezone.now()}', 'Tourism support reply', obj.response)
        audit(request.user, 'tourism.support_responded', obj.pk)
        return Response(self.get_serializer(obj).data)
