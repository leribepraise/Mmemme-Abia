from datetime import timedelta
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
from .models import TransportCompany, CompanyStaff, Terminal, Vehicle, Route, Departure, TransportRequest
from .services import authorize, company_role, available, check_in, cancel_departure, complete_departure


class CompanySerializer(serializers.ModelSerializer):
    my_role = serializers.SerializerMethodField()
    def get_my_role(self, obj): return company_role(self.context['request'].user, obj)
    def validate_logo(self, value):
        if value: validate_image(value)
        return value
    class Meta:
        model = TransportCompany
        fields = ['id', 'owner', 'name', 'registration_number', 'description', 'logo', 'contact_email', 'contact_phone', 'address', 'boarding_instructions', 'cancellation_hours', 'commission_bps', 'status', 'review_note', 'my_role']
        read_only_fields = ['id', 'owner', 'commission_bps', 'status', 'review_note', 'my_role']
    def to_representation(self, obj):
        data = super().to_representation(obj)
        user = self.context['request'].user
        if data['my_role'] not in {'OWNER', 'MANAGER'} and not (user.is_staff and user.has_perm('transport.view_transportcompany')):
            for key in ['owner', 'registration_number', 'commission_bps', 'review_note']: data.pop(key, None)
        return data


class TerminalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Terminal
        fields = ['id', 'name', 'city', 'address', 'is_active']


class VehicleSerializer(serializers.ModelSerializer):
    capacity = serializers.IntegerField(min_value=1, max_value=100)
    class Meta:
        model = Vehicle
        fields = ['id', 'name', 'registration_number', 'capacity', 'amenities', 'is_active']
    def validate(self, attrs):
        company = self.context['company']
        registration = attrs.get('registration_number', getattr(self.instance, 'registration_number', None))
        qs = Vehicle.objects.filter(company=company, registration_number=registration)
        if self.instance: qs = qs.exclude(pk=self.instance.pk)
        if qs.exists(): raise serializers.ValidationError('This registration number is already in your fleet.')
        if self.instance and 'capacity' in attrs and self.instance.departures.filter(status='SCHEDULED', quantity__gt=attrs['capacity']).exists():
            raise serializers.ValidationError('Capacity cannot be less than the seats allocated to a scheduled departure.')
        return attrs


class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = ['id', 'name', 'origin_terminal', 'destination_terminal', 'origin', 'destination', 'pickup_address', 'service_type', 'event', 'is_active']
        read_only_fields = ['origin', 'destination', 'pickup_address']
    def validate(self, attrs):
        company = self.context['company']
        value = lambda key: attrs.get(key, getattr(self.instance, key, None))
        for key in ['origin_terminal', 'destination_terminal']:
            terminal = value(key)
            if not terminal or terminal.company_id != company.pk or not terminal.is_active:
                raise serializers.ValidationError({key: 'Choose an active terminal belonging to your company.'})
        if value('origin_terminal') == value('destination_terminal'):
            raise serializers.ValidationError('Choose different pickup and destination terminals.')
        event = value('event')
        if value('service_type') == 'EVENT_SHUTTLE':
            if not event or event.status != 'PUBLISHED' or event.is_suspended or event.is_archived or event.deletion_requested_at or event.end_datetime <= timezone.now():
                raise serializers.ValidationError('Choose an upcoming published event for the shuttle.')
        elif event: raise serializers.ValidationError('Only event shuttles can be linked to an event.')
        if self.instance and self.instance.departures.filter(Q(quantity_reserved__gt=0) | Q(quantity_sold__gt=0)).exists():
            if any(k in attrs and attrs[k] != getattr(self.instance, k) for k in ['origin_terminal', 'destination_terminal', 'service_type', 'event']):
                raise serializers.ValidationError('Routes with bookings cannot change terminals or event. Create a new route.')
        origin, destination = value('origin_terminal'), value('destination_terminal')
        attrs.update(origin=origin.city, destination=destination.city, pickup_address=origin.address)
        return attrs


class DepartureSerializer(serializers.ModelSerializer):
    quantity = serializers.IntegerField(min_value=1, max_value=100)
    price = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0)
    class Meta:
        model = Departure
        fields = ['id', 'route', 'fleet_vehicle', 'vehicle', 'departs_at', 'arrives_at', 'price', 'quantity', 'quantity_reserved', 'quantity_sold', 'quantity_available', 'status', 'cancellation_reason', 'is_active']
        read_only_fields = ['vehicle', 'quantity_reserved', 'quantity_sold', 'quantity_available', 'status', 'cancellation_reason']
    def validate(self, attrs):
        value = lambda key: attrs.get(key, getattr(self.instance, key, None))
        route, vehicle = value('route'), value('fleet_vehicle')
        company = self.context['company']
        if not route or route.company_id != company.pk: raise serializers.ValidationError('Choose your company route.')
        if not vehicle or vehicle.company_id != company.pk or not vehicle.is_active: raise serializers.ValidationError('Choose an active company vehicle.')
        if value('quantity') > vehicle.capacity: raise serializers.ValidationError('Allocated seats cannot exceed vehicle capacity.')
        if value('arrives_at') <= value('departs_at'): raise serializers.ValidationError('Arrival must follow departure.')
        if (not self.instance or 'departs_at' in attrs) and value('departs_at') <= timezone.now(): raise serializers.ValidationError('Departure must be in the future.')
        if route.event_id and route.event.end_datetime < value('departs_at') - timedelta(days=1):
            raise serializers.ValidationError('The event has already ended before this shuttle journey.')
        if self.instance:
            if self.instance.status != 'SCHEDULED': raise serializers.ValidationError('Closed departures cannot be edited.')
            if route.pk != self.instance.route_id: raise serializers.ValidationError('A departure cannot be moved to another route.')
            held = self.instance.quantity_reserved + self.instance.quantity_sold
            if value('quantity') < held: raise serializers.ValidationError('Allocated seats cannot be less than existing sales and holds.')
            if held and any(k in attrs and attrs[k] != getattr(self.instance, k) for k in ['fleet_vehicle', 'departs_at', 'arrives_at', 'price']):
                raise serializers.ValidationError('Booked journeys cannot be repriced, rescheduled or assigned a different vehicle. Cancel and refund first.')
        # Serialize fleet scheduling through the company row lock in the action.
        clash = Departure.objects.filter(fleet_vehicle=vehicle, status='SCHEDULED', departs_at__lt=value('arrives_at'), arrives_at__gt=value('departs_at'))
        if self.instance: clash = clash.exclude(pk=self.instance.pk)
        if clash.exists(): raise serializers.ValidationError('This vehicle already has a journey during these times.')
        attrs['vehicle'] = vehicle.name
        return attrs


class CompanyViewSet(viewsets.GenericViewSet):
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'patch', 'head', 'options']
    def get_permissions(self):
        return [AllowAny()] if self.action in {'list', 'retrieve'} else super().get_permissions()
    def get_queryset(self):
        qs = TransportCompany.objects.select_related('owner').order_by('name', 'pk')
        user = self.request.user
        if user.is_authenticated and user.is_staff and user.has_perm('transport.view_transportcompany'): return qs
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
        if TransportCompany.objects.filter(owner=user).exists(): raise Conflict('You already have a company application.')
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        company = serializer.save(owner=user)
        audit(user, 'transport.company_applied', company.pk)
        return Response(self.get_serializer(company).data, status=201)
    @transaction.atomic
    def partial_update(self, request, pk=None):
        company = TransportCompany.objects.select_for_update().get(pk=self.get_object().pk)
        authorize(request.user, company, owner=True)
        serializer = self.get_serializer(company, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        # Legal identity changes require fresh approval; preserve existing bookings.
        identity_changed = any(k in serializer.validated_data and serializer.validated_data[k] != getattr(company, k) for k in ['name', 'registration_number'])
        serializer.save(**({'status': 'PENDING'} if identity_changed or company.status == 'REJECTED' else {}))
        audit(request.user, 'transport.company_updated', company.pk)
        return Response(serializer.data)
    @action(detail=True, methods=['post'])
    @transaction.atomic
    def review(self, request, pk=None):
        from apps.accounts.administration import require_staff_permission
        require_staff_permission(request.user, 'transport.change_transportcompany')
        company = TransportCompany.objects.select_for_update().get(pk=self.get_object().pk)
        if company.owner_id == request.user.pk: raise PermissionDenied('A different admin must review your application.')
        class ReviewSerializer(serializers.Serializer):
            status = serializers.ChoiceField(choices=['APPROVED', 'REJECTED', 'SUSPENDED'])
            commission_bps = serializers.IntegerField(min_value=0, max_value=10000, required=False)
            note = serializers.CharField(max_length=3000, required=False, allow_blank=True)
        data = ReviewSerializer(data=request.data); data.is_valid(raise_exception=True)
        values = data.validated_data
        if values['status'] == 'APPROVED':
            if not company.owner.is_active or not company.owner.email_verified: raise Conflict('The owner must have an active, email-verified account.')
            if values.get('commission_bps', company.commission_bps) is None: raise serializers.ValidationError('Set the agreed transport commission; 500 means 5%.')
            company.commission_bps = values.get('commission_bps', company.commission_bps)
            get_user_model().objects.filter(pk=company.owner_id).update(is_verified=True)
        elif not values.get('note', '').strip(): raise serializers.ValidationError('Explain the review decision.')
        company.status, company.review_note = values['status'], values.get('note', '')
        company.reviewed_by, company.reviewed_at = request.user, timezone.now()
        company.save()
        audit(request.user, 'transport.company_reviewed', company.pk, status=company.status, commission_bps=company.commission_bps)
        notify(company.owner, f'transport-review:{company.pk}:{company.reviewed_at}', 'Transport partnership update', f'Your company {company.name} is {company.status.lower()}. {company.review_note}')
        return Response(self.get_serializer(company).data)
    @action(detail=True, methods=['get', 'post'])
    @transaction.atomic
    def staff(self, request, pk=None):
        company = TransportCompany.objects.select_for_update().get(pk=self.get_object().pk)
        authorize(request.user, company, owner=True)
        if request.method == 'POST':
            class StaffSerializer(serializers.Serializer):
                email = serializers.EmailField()
                role = serializers.ChoiceField(choices=['MANAGER', 'BOARDING'])
                is_active = serializers.BooleanField(default=True)
            data = StaffSerializer(data=request.data); data.is_valid(raise_exception=True)
            user = get_object_or_404(get_user_model(), email__iexact=data.validated_data['email'], is_active=True, email_verified=True)
            if user.pk == company.owner_id: raise serializers.ValidationError('The company owner already has full access.')
            CompanyStaff.objects.update_or_create(company=company, user=user, defaults={k: data.validated_data[k] for k in ['role', 'is_active']})
            audit(request.user, 'transport.staff_updated', company.pk, user=user.pk, role=data.validated_data['role'], active=data.validated_data['is_active'])
        return Response([{'email': row.user.email, 'role': row.role, 'is_active': row.is_active} for row in company.staff.select_related('user')])
    def inventory(self, request, model, serializer_class):
        company = TransportCompany.objects.select_for_update().get(pk=self.get_object().pk)
        authorize(request.user, company, boarding=request.method == 'GET')
        qs = model.objects.filter(**({'route__company': company} if model is Departure else {'company': company})).order_by('pk')
        if request.method == 'POST':
            if not available(company): raise Conflict('Your company needs approval before publishing services.')
            # Bookings lock the route before changing departure inventory.
            list(Route.objects.select_for_update().filter(company=company).order_by('pk'))
            instance = get_object_or_404(qs.select_for_update(), pk=request.data['id']) if request.data.get('id') else None
            serializer = serializer_class(instance, data=request.data, partial=bool(instance), context={'company': company})
            serializer.is_valid(raise_exception=True)
            kwargs = {} if model is Departure else {'company': company}
            if model is Route: kwargs['owner'] = company.owner
            # Terminal locations and vehicle capacities must stay stable for booked journeys.
            if instance and model in {Terminal, Vehicle}:
                departures = Departure.objects.filter(route__company=company).filter(Q(quantity_reserved__gt=0) | Q(quantity_sold__gt=0))
                if model is Terminal: departures = departures.filter(Q(route__origin_terminal=instance) | Q(route__destination_terminal=instance))
                else: departures = departures.filter(fleet_vehicle=instance)
                protected = ['name', 'city', 'address'] if model is Terminal else ['capacity', 'registration_number', 'name']
                linked = Route.objects.filter(Q(origin_terminal=instance) | Q(destination_terminal=instance)).exists() if model is Terminal else departures.exists()
                if linked and any(k in serializer.validated_data and serializer.validated_data[k] != getattr(instance, k) for k in protected):
                    raise Conflict('This resource has bookings. Add a new terminal or vehicle instead.')
            obj = serializer.save(**kwargs)
            audit(request.user, 'transport.inventory_updated', obj.pk, model=model._meta.label)
        page = self.paginate_queryset(qs)
        return self.get_paginated_response(serializer_class(page, many=True).data)
    @action(detail=True, methods=['get', 'post'])
    @transaction.atomic
    def terminals(self, request, pk=None): return self.inventory(request, Terminal, TerminalSerializer)
    @action(detail=True, methods=['get', 'post'])
    @transaction.atomic
    def vehicles(self, request, pk=None): return self.inventory(request, Vehicle, VehicleSerializer)
    @action(detail=True, methods=['get', 'post'])
    @transaction.atomic
    def routes(self, request, pk=None): return self.inventory(request, Route, RouteSerializer)
    @action(detail=True, methods=['get', 'post'])
    @transaction.atomic
    def departures(self, request, pk=None): return self.inventory(request, Departure, DepartureSerializer)
    @action(detail=True, methods=['get'])
    def bookings(self, request, pk=None):
        company = self.get_object(); authorize(request.user, company, boarding=True)
        qs = Booking.objects.filter(kind='TRANSPORT', items__departure__route__company=company).distinct().prefetch_related('items').order_by('-created_at')
        if request.query_params.get('departure'):
            departure = get_object_or_404(Departure, pk=request.query_params['departure'], route__company=company)
            qs = qs.filter(items__departure=departure)
        page = self.paginate_queryset(qs)
        return self.get_paginated_response(BookingSerializer(page, many=True).data)
    @action(detail=True, methods=['get'])
    def earnings(self, request, pk=None):
        from apps.payments.models import LedgerEntry
        company = self.get_object(); authorize(request.user, company)
        rows = LedgerEntry.objects.filter(booking__kind='TRANSPORT', booking__items__departure__route__company=company)
        return Response({kind.lower(): rows.filter(kind=kind).aggregate(gross=Sum('gross'), platform_fee=Sum('platform_fee'), provider_amount=Sum('provider_amount')) for kind in ['SALE', 'REFUND']})
    @action(detail=True, methods=['post'], url_path='departure-action')
    def departure_action(self, request, pk=None):
        company = self.get_object(); authorize(request.user, company)
        departure = get_object_or_404(Departure, pk=request.data.get('departure'), route__company=company)
        operation = request.data.get('action')
        if operation == 'cancel': result = cancel_departure(request.user, departure.pk, serializers.CharField(max_length=3000).run_validation(request.data.get('reason')))
        elif operation == 'complete': result = complete_departure(request.user, departure.pk)
        else: raise serializers.ValidationError('Choose cancel or complete.')
        return Response(DepartureSerializer(result).data)
    @action(detail=False, methods=['post'], url_path='check-in')
    def checkin(self, request):
        token = serializers.CharField(max_length=300).run_validation(request.data.get('token'))
        return Response(BookingSerializer(check_in(request.user, token)).data)


class TransportRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransportRequest
        fields = ['id', 'company', 'booking', 'message', 'response', 'status', 'created_at']
        read_only_fields = ['id', 'response', 'status', 'created_at']
    def validate(self, attrs):
        booking = attrs.get('booking')
        if booking and (booking.user_id != self.context['request'].user.pk or booking.kind != 'TRANSPORT' or not booking.items.filter(departure__route__company=attrs['company']).exists()):
            raise serializers.ValidationError('Select your booking with this transport company.')
        return attrs


class TransportRequestViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TransportRequestSerializer
    http_method_names = ['get', 'post', 'head', 'options']
    def get_queryset(self):
        user = self.request.user
        qs = TransportRequest.objects.select_related('company').order_by('-created_at', 'pk')
        if not (user.is_staff and user.has_perm('transport.view_transportrequest')):
            qs = qs.filter(Q(user=user) | Q(company__owner=user) | Q(company__staff__user=user, company__staff__is_active=True, company__staff__role='MANAGER')).distinct()
        if self.request.query_params.get('company'): qs = qs.filter(company_id=self.request.query_params['company'])
        return qs
    def perform_create(self, serializer):
        if not self.request.user.email_verified: raise PermissionDenied('Verify your email first.')
        obj = serializer.save(user=self.request.user)
        notify(obj.company.owner, f'transport-request:{obj.pk}', 'Transport support request', obj.message)
        audit(self.request.user, 'transport.support_requested', obj.pk)
    @action(detail=True, methods=['post'])
    @transaction.atomic
    def respond(self, request, pk=None):
        obj = TransportRequest.objects.select_for_update().get(pk=self.get_object().pk)
        if request.user.is_staff:
            from apps.accounts.administration import require_staff_permission
            require_staff_permission(request.user, 'transport.change_transportrequest')
        else: authorize(request.user, obj.company)
        obj.response = serializers.CharField(max_length=3000).run_validation(request.data.get('response'))
        obj.status = 'RESOLVED'
        obj.save(update_fields=['response', 'status'])
        notify(obj.user, f'transport-response:{obj.pk}:{timezone.now()}', 'Transport support reply', obj.response)
        audit(request.user, 'transport.support_responded', obj.pk)
        return Response(self.get_serializer(obj).data)
