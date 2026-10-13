from datetime import timedelta
from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import Q, F, Sum
from django.db.models import Count
from rest_framework.views import APIView
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
from .models import HotelProvider, HotelStaff, Hotel, RoomType, RoomNight, RoomUnit, HotelImage, HotelRequest
from .services import authorize, provider_role, available, reception_action

class StaySearchView(APIView):
    permission_classes=[AllowAny]
    def get(self,request):
        class Search(serializers.Serializer):
            check_in=serializers.DateField()
            check_out=serializers.DateField()
            rooms=serializers.IntegerField(min_value=1,max_value=20,default=1)
            guests=serializers.IntegerField(min_value=1,max_value=100,default=1)
        data=Search(data=request.query_params);data.is_valid(raise_exception=True);v=data.validated_data
        length=(v['check_out']-v['check_in']).days
        if not 1<=length<=30 or v['check_in']<timezone.localdate():raise serializers.ValidationError('Choose 1 to 30 future nights.')
        qs=RoomNight.objects.filter(date__gte=v['check_in'],date__lt=v['check_out'],is_active=True,
            quantity__gte=F('quantity_reserved')+F('quantity_sold')+v['rooms'],room_type__is_active=True,
            room_type__max_guests__gte=(v['guests']+v['rooms']-1)//v['rooms'],room_type__hotel__is_active=True,
            room_type__hotel__review_status='APPROVED',room_type__hotel__owner__is_active=True,room_type__hotel__owner__is_verified=True)
        qs=qs.filter(Q(room_type__hotel__provider__isnull=True)|Q(room_type__hotel__provider__status='APPROVED',room_type__hotel__provider__owner__email_verified=True))
        qs=qs.values('room_type_id','room_type__hotel_id','room_type__name').annotate(nights=Count('id'),subtotal=Sum('price')).filter(nights=length).order_by('room_type_id')
        from apps.common.api import Pagination
        pagination=Pagination();page=pagination.paginate_queryset(qs,request)
        return pagination.get_paginated_response([{'hotel':str(r['room_type__hotel_id']),'room_type':str(r['room_type_id']),
            'room_name':r['room_type__name'],'nights':r['nights'],'total':str(r['subtotal']*v['rooms'])} for r in page])

class ProviderSerializer(serializers.ModelSerializer):
    my_role = serializers.SerializerMethodField()
    def get_my_role(self, obj): return provider_role(self.context['request'].user, obj)
    def validate_logo(self, value):
        if value: validate_image(value)
        return value
    class Meta:
        model = HotelProvider
        fields = ['id', 'owner', 'name', 'registration_number', 'description', 'logo', 'contact_email', 'contact_phone', 'address', 'commission_bps', 'status', 'review_note', 'my_role']
        read_only_fields = ['id', 'owner', 'commission_bps', 'status', 'review_note', 'my_role']
    def to_representation(self, obj):
        data = super().to_representation(obj)
        user=self.context['request'].user
        if data['my_role'] not in {'OWNER', 'MANAGER'} and not (user.is_staff and user.has_perm('hotels.view_hotelprovider')):
            for key in ['owner','registration_number','commission_bps','review_note']: data.pop(key,None)
        return data

class PropertySerializer(serializers.ModelSerializer):
    amenities = serializers.ListField(child=serializers.CharField(max_length=100), max_length=100, required=False)
    class Meta:
        model=Hotel
        fields=['id','name','description','property_type','city','address','amenities','contact_email','contact_phone','house_rules','check_in_time','check_out_time','cancellation_hours','is_active','review_status','review_note']
        read_only_fields=['id','review_status','review_note']
    def validate(self,attrs):
        if attrs.get('is_active') and (not self.instance or self.instance.review_status!='APPROVED'):
            raise serializers.ValidationError('Property approval is required before accepting bookings.')
        return attrs

class RoomSerializer(serializers.ModelSerializer):
    max_guests=serializers.IntegerField(min_value=1,max_value=100)
    amenities=serializers.ListField(child=serializers.CharField(max_length=100),max_length=100,required=False)
    class Meta:
        model=RoomType
        fields=['id','hotel','name','description','beds','amenities','max_guests','is_active']
        read_only_fields=['id']
    def validate(self,attrs):
        hotel=attrs.get('hotel',getattr(self.instance,'hotel',None))
        if not hotel or hotel.provider_id!=self.context['provider'].pk: raise serializers.ValidationError('Choose your own property.')
        if self.instance and hotel.pk!=self.instance.hotel_id: raise serializers.ValidationError('Room types cannot move between properties.')
        if self.instance and self.instance.nights.filter(date__gte=timezone.localdate()).filter(Q(quantity_reserved__gt=0)|Q(quantity_sold__gt=0)).exists():
            if any(k!='is_active' and v!=getattr(self.instance,k) for k,v in attrs.items()): raise serializers.ValidationError('This room type has upcoming reservations. Create a new type to change its terms.')
        return attrs

class UnitSerializer(serializers.ModelSerializer):
    occupied=serializers.SerializerMethodField()
    def get_occupied(self,obj): return obj.assignments.filter(booking__status='CONFIRMED',booking__fulfillment_status='IN_PROGRESS').exists()
    class Meta:
        model=RoomUnit
        fields=['id','hotel','room_type','name','state','is_active','occupied']
        read_only_fields=['id','occupied']
        validators=[]
    def validate(self,attrs):
        value=lambda key: attrs.get(key,getattr(self.instance,key,None))
        hotel,room=value('hotel'),value('room_type')
        if not hotel or hotel.provider_id!=self.context['provider'].pk or not room or room.hotel_id!=hotel.pk: raise serializers.ValidationError('Choose a room type in your own property.')
        qs=RoomUnit.objects.filter(hotel=hotel,name=value('name'))
        if self.instance: qs=qs.exclude(pk=self.instance.pk)
        if qs.exists(): raise serializers.ValidationError('This unit name is already used in the property.')
        if self.instance and (hotel.pk!=self.instance.hotel_id or room.pk!=self.instance.room_type_id): raise serializers.ValidationError('Units cannot move between room types or properties.')
        if self.instance and self.instance.assignments.filter(booking__status='CONFIRMED',booking__fulfillment_status='IN_PROGRESS').exists():
            if any(k in attrs and attrs[k]!=getattr(self.instance,k) for k in ['name','state','is_active']): raise Conflict('This unit is occupied. Check the guest out before changing its readiness.')
        return attrs

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model=HotelImage
        fields=['id','hotel','image','caption','is_primary']
        read_only_fields=['id']
    def validate_image(self,value): validate_image(value); return value
    def validate(self,attrs):
        hotel=attrs.get('hotel',getattr(self.instance,'hotel',None))
        if not hotel or hotel.provider_id!=self.context['provider'].pk: raise serializers.ValidationError('Choose your own property.')
        if self.instance and hotel.pk!=self.instance.hotel_id: raise serializers.ValidationError('Images cannot move between properties.')
        return attrs

class NightSerializer(serializers.ModelSerializer):
    class Meta:
        model=RoomNight
        fields=['id','room_type','date','price','quantity','quantity_reserved','quantity_sold','quantity_available','is_active']
        read_only_fields=fields

class ProviderViewSet(viewsets.GenericViewSet):
    serializer_class = ProviderSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'patch', 'head', 'options']
    def get_permissions(self):
        return [AllowAny()] if self.action in {'list', 'retrieve'} else super().get_permissions()
    def get_queryset(self):
        qs = HotelProvider.objects.select_related('owner').order_by('name', 'pk')
        user = self.request.user
        if user.is_authenticated and user.is_staff and user.has_perm('hotels.view_hotelprovider'): return qs
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
        if HotelProvider.objects.filter(owner=user).exists(): raise Conflict('You already have a provider application.')
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        provider = serializer.save(owner=user)
        audit(user, 'hotels.provider_applied', provider.pk)
        return Response(self.get_serializer(provider).data, status=201)
    @transaction.atomic
    def partial_update(self, request, pk=None):
        provider = HotelProvider.objects.select_for_update().get(pk=self.get_object().pk)
        authorize(request.user, provider, owner=True)
        serializer = self.get_serializer(provider, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        # Legal identity changes require fresh approval; preserve existing bookings.
        identity_changed = any(k in serializer.validated_data and serializer.validated_data[k] != getattr(provider, k) for k in ['name', 'registration_number'])
        serializer.save(**({'status': 'PENDING'} if identity_changed or provider.status == 'REJECTED' else {}))
        audit(request.user, 'hotels.provider_updated', provider.pk)
        return Response(serializer.data)
    @action(detail=True, methods=['post'])
    @transaction.atomic
    def review(self, request, pk=None):
        from apps.accounts.administration import require_staff_permission
        require_staff_permission(request.user, 'hotels.change_hotelprovider')
        original = self.get_object()
        get_user_model().objects.select_for_update(no_key=True).get(pk=original.owner_id)
        provider = HotelProvider.objects.select_for_update().get(pk=self.get_object().pk)
        if provider.owner_id == request.user.pk: raise PermissionDenied('A different admin must review your application.')
        class ReviewSerializer(serializers.Serializer):
            status = serializers.ChoiceField(choices=['APPROVED', 'REJECTED', 'SUSPENDED'])
            commission_bps = serializers.IntegerField(min_value=0, max_value=10000, required=False)
            note = serializers.CharField(max_length=3000, required=False, allow_blank=True)
        data = ReviewSerializer(data=request.data); data.is_valid(raise_exception=True)
        values = data.validated_data
        if values['status'] == 'APPROVED':
            if not provider.owner.is_active or not provider.owner.email_verified: raise Conflict('The owner must have an active, email-verified account.')
            if values.get('commission_bps', provider.commission_bps) is None: raise serializers.ValidationError('Set the agreed hotels commission; 500 means 5%.')
            provider.commission_bps = values.get('commission_bps', provider.commission_bps)
            get_user_model().objects.filter(pk=provider.owner_id).update(is_verified=True)
        elif not values.get('note', '').strip(): raise serializers.ValidationError('Explain the review decision.')
        provider.status, provider.review_note = values['status'], values.get('note', '')
        provider.reviewed_by, provider.reviewed_at = request.user, timezone.now()
        provider.save()
        audit(request.user, 'hotels.provider_reviewed', provider.pk, status=provider.status, commission_bps=provider.commission_bps)
        notify(provider.owner, f'hotel-review:{provider.pk}:{provider.reviewed_at}', 'Hotel partnership update', f'Your provider {provider.name} is {provider.status.lower()}. {provider.review_note}')
        return Response(self.get_serializer(provider).data)
    @action(detail=True, methods=['get', 'post'])
    @transaction.atomic
    def staff(self, request, pk=None):
        provider = HotelProvider.objects.select_for_update().get(pk=self.get_object().pk)
        authorize(request.user, provider, owner=True)
        if request.method == 'POST':
            class StaffSerializer(serializers.Serializer):
                email = serializers.EmailField()
                role = serializers.ChoiceField(choices=['MANAGER', 'RECEPTION', 'HOUSEKEEPING'])
                is_active = serializers.BooleanField(default=True)
            data = StaffSerializer(data=request.data); data.is_valid(raise_exception=True)
            user = get_object_or_404(get_user_model(), email__iexact=data.validated_data['email'], is_active=True, email_verified=True)
            if user.pk == provider.owner_id: raise serializers.ValidationError('The provider owner already has full access.')
            HotelStaff.objects.update_or_create(provider=provider, user=user, defaults={k: data.validated_data[k] for k in ['role', 'is_active']})
            audit(request.user, 'hotels.staff_updated', provider.pk, user=user.pk, role=data.validated_data['role'], active=data.validated_data['is_active'])
        return Response([{'id': row.user_id, 'email': row.user.email, 'role': row.role, 'is_active': row.is_active} for row in provider.staff.select_related('user')])
    @action(detail=True, methods=['get'])
    def team(self, request, pk=None):
        provider = self.get_object(); authorize(request.user, provider)
        return Response([{'id': provider.owner_id, 'email': provider.contact_email}] + [
            {'id': row.user_id, 'email': row.user.email} for row in provider.staff.filter(is_active=True, user__is_active=True, user__email_verified=True).select_related('user')])
    def inventory(self,request,model,serializer_class):
        provider=HotelProvider.objects.select_for_update().get(pk=self.get_object().pk)
        role=provider_role(request.user,provider)
        access='housekeeping' if model is RoomUnit and role=='HOUSEKEEPING' else 'read' if request.method=='GET' else 'manage'
        authorize(request.user,provider,access=access)
        path={Hotel:'provider',RoomType:'hotel__provider',RoomUnit:'hotel__provider',HotelImage:'hotel__provider'}[model]
        qs=model.objects.filter(**{path:provider}).order_by('pk')
        if request.method=='POST':
            if not available(provider): raise Conflict('Your accommodation business needs approval first.')
            list(Hotel.objects.select_for_update().filter(provider=provider).order_by('pk'))
            instance=get_object_or_404(qs.select_for_update(),pk=request.data['id']) if request.data.get('id') else None
            if role=='HOUSEKEEPING' and (not instance or set(request.data)-{'id','state'}): raise PermissionDenied('Housekeeping can only update room readiness.')
            serializer=serializer_class(instance,data=request.data,partial=bool(instance),context={'provider':provider,'request':request})
            serializer.is_valid(raise_exception=True)
            extra={'provider':provider,'owner':provider.owner,'review_status':'PENDING','is_active':False} if model is Hotel and not instance else {}
            if model is Hotel and instance and any(k not in {'is_active','check_in_time','check_out_time','cancellation_hours','house_rules'} and v!=getattr(instance,k) for k,v in serializer.validated_data.items()):
                extra.update(review_status='PENDING',is_active=False)
            if model is HotelImage:
                hotel=serializer.validated_data.get('hotel',getattr(instance,'hotel',None))
                if not instance and hotel.images.count()>=20: raise serializers.ValidationError('Use at most 20 property photos.')
                if serializer.validated_data.get('is_primary'): hotel.images.exclude(pk=getattr(instance,'pk',None)).update(is_primary=False)
                hotel.review_status,hotel.is_active='PENDING',False; hotel.save(update_fields=['review_status','is_active'])
            obj=serializer.save(**extra)
            if model is RoomUnit and (not obj.is_active or obj.state=='MAINTENANCE'):
                capacity=RoomUnit.objects.filter(room_type=obj.room_type,is_active=True).exclude(state='MAINTENANCE').count()
                nights=RoomNight.objects.select_for_update().filter(room_type=obj.room_type,date__gte=timezone.localdate())
                if nights.filter(quantity_reserved__gt=capacity-F('quantity_sold')).exists(): raise Conflict('Maintenance would remove rooms needed for existing reservations. Resolve those reservations first.')
                nights.filter(quantity__gt=capacity).update(quantity=capacity)
            audit(request.user,'hotels.inventory_updated',obj.pk,model=model._meta.label)
        page=self.paginate_queryset(qs)
        return self.get_paginated_response(serializer_class(page,many=True,context={'request':request}).data)
    @action(detail=True,methods=['get','post'])
    @transaction.atomic
    def properties(self,request,pk=None): return self.inventory(request,Hotel,PropertySerializer)
    @action(detail=True,methods=['get','post'])
    @transaction.atomic
    def rooms(self,request,pk=None): return self.inventory(request,RoomType,RoomSerializer)
    @action(detail=True,methods=['get','post'])
    @transaction.atomic
    def units(self,request,pk=None): return self.inventory(request,RoomUnit,UnitSerializer)
    @action(detail=True,methods=['get','post'])
    @transaction.atomic
    def images(self,request,pk=None): return self.inventory(request,HotelImage,ImageSerializer)
    @action(detail=True,methods=['get','post'])
    @transaction.atomic
    def calendar(self,request,pk=None):
        provider=self.get_object(); authorize(request.user,provider,access='read' if request.method=='GET' else 'manage')
        if request.method=='POST':
            class Dates(serializers.Serializer):
                room_type=serializers.PrimaryKeyRelatedField(queryset=RoomType.objects.filter(hotel__provider=provider))
                date_from=serializers.DateField()
                date_to=serializers.DateField()
                price=serializers.DecimalField(max_digits=12,decimal_places=2,min_value=0)
                quantity=serializers.IntegerField(min_value=0,max_value=10000)
                is_active=serializers.BooleanField(default=True)
            data=Dates(data=request.data); data.is_valid(raise_exception=True); v=data.validated_data
            room=v['room_type']; Hotel.objects.select_for_update().get(pk=room.hotel_id)
            if not available(provider): raise Conflict('Approve the provider first.')
            length=(v['date_to']-v['date_from']).days
            if not 1<=length<=366 or v['date_from']<timezone.localdate(): raise serializers.ValidationError('Choose 1 to 366 future nights. The end date is excluded.')
            capacity=room.units.filter(is_active=True).exclude(state='MAINTENANCE').count()
            if v['quantity']>capacity: raise serializers.ValidationError('Allocation cannot exceed the active rooms outside maintenance. Add physical units first.')
            for offset in range(length):
                day=v['date_from']+timedelta(days=offset)
                night,_=RoomNight.objects.get_or_create(room_type=room,date=day,defaults={'price':v['price'],'quantity':v['quantity']})
                held=night.quantity_reserved+night.quantity_sold
                if held and (v['price']!=night.price or v['quantity']<held or not v['is_active']): raise Conflict('Booked nights cannot be repriced, blocked or reduced below reservations. No dates were changed.')
                night.price,night.quantity,night.is_active=v['price'],v['quantity'],v['is_active']; night.save(update_fields=['price','quantity','is_active'])
            audit(request.user,'hotels.calendar_updated',room.pk,date_from=str(v['date_from']),date_to=str(v['date_to']))
        qs=RoomNight.objects.filter(room_type__hotel__provider=provider).order_by('date','pk')
        for key in ['room_type','date_from','date_to']:
            if request.query_params.get(key):
                if key=='room_type': qs=qs.filter(room_type_id=serializers.UUIDField().run_validation(request.query_params[key]))
                else: qs=qs.filter(**{'date__gte' if key=='date_from' else 'date__lt':serializers.DateField().run_validation(request.query_params[key])})
        page=self.paginate_queryset(qs); return self.get_paginated_response(NightSerializer(page,many=True).data)
    @action(detail=True,methods=['post'],url_path='review-property')
    @transaction.atomic
    def review_property(self,request,pk=None):
        from apps.accounts.administration import require_staff_permission
        require_staff_permission(request.user,'hotels.change_hotel')
        provider=self.get_object()
        if provider.owner_id==request.user.pk: raise PermissionDenied('A different admin must review your property.')
        hotel=get_object_or_404(Hotel.objects.select_for_update(),pk=request.data.get('hotel'),provider=provider)
        status=serializers.ChoiceField(choices=['APPROVED','REJECTED']).run_validation(request.data.get('status'))
        note=serializers.CharField(max_length=3000,allow_blank=True).run_validation(request.data.get('note',''))
        if status=='APPROVED' and not available(provider): raise Conflict('Approve the provider first.')
        if status=='REJECTED' and not note.strip(): raise serializers.ValidationError('Explain the rejection.')
        hotel.review_status,hotel.review_note,hotel.is_active=status,note,status=='APPROVED'; hotel.save(update_fields=['review_status','review_note','is_active'])
        audit(request.user,'hotels.property_reviewed',hotel.pk,status=status)
        notify(provider.owner,f'hotel-review:{hotel.pk}:{timezone.now()}','Property review',f'{hotel.name} is {status.lower()}. {note}')
        return Response(PropertySerializer(hotel).data)
    @action(detail=True,methods=['post'],url_path='adopt-property')
    @transaction.atomic
    def adopt_property(self,request,pk=None):
        from apps.accounts.administration import require_staff_permission
        require_staff_permission(request.user,'hotels.change_hotel')
        provider=HotelProvider.objects.select_for_update().get(pk=self.get_object().pk)
        if not available(provider): raise Conflict('Approve the provider first.')
        hotel=get_object_or_404(Hotel.objects.select_for_update(),pk=request.data.get('hotel'),provider__isnull=True,owner=provider.owner)
        if Booking.objects.filter(kind='HOTEL',parent_id=str(hotel.pk),status__in=['PENDING','CONFIRMED']).exclude(fulfillment_status='COMPLETED').exists(): raise Conflict('Resolve ongoing reservations before moving this legacy property.')
        hotel.provider,hotel.review_status,hotel.is_active=provider,'PENDING',False; hotel.save(update_fields=['provider','review_status','is_active'])
        audit(request.user,'hotels.legacy_adopted',hotel.pk,provider=str(provider.pk))
        return Response(PropertySerializer(hotel).data)
    @action(detail=True,methods=['get'])
    def bookings(self,request,pk=None):
        provider=self.get_object(); authorize(request.user,provider,access='reception')
        qs=Booking.objects.filter(kind='HOTEL',items__room_night__room_type__hotel__provider=provider).distinct().prefetch_related('items').order_by('-created_at')
        if request.query_params.get('hotel'): qs=qs.filter(parent_id=str(serializers.UUIDField().run_validation(request.query_params['hotel'])))
        page=self.paginate_queryset(qs); return self.get_paginated_response(BookingSerializer(page,many=True).data)
    @action(detail=True,methods=['post'])
    def reception(self,request,pk=None):
        provider=self.get_object(); authorize(request.user,provider,access='reception')
        class Reception(serializers.Serializer):
            booking=serializers.UUIDField()
            action=serializers.ChoiceField(choices=['check-in','check-out','no-show','clear-no-show','cancel'])
            units=serializers.ListField(child=serializers.UUIDField(),max_length=20,required=False)
            reason=serializers.CharField(max_length=3000,required=False,allow_blank=True)
            token=serializers.CharField(max_length=300,required=False,allow_blank=True)
        data=Reception(data=request.data); data.is_valid(raise_exception=True); v=dict(data.validated_data)
        booking=get_object_or_404(Booking.objects.filter(kind='HOTEL',items__room_night__room_type__hotel__provider=provider).distinct(),pk=v.pop('booking'))
        result=reception_action(request.user,booking.pk,v.pop('action'),**v)
        return Response(BookingSerializer(result).data)
    @action(detail=True,methods=['get'])
    def earnings(self,request,pk=None):
        from apps.payments.models import LedgerEntry
        provider=self.get_object(); authorize(request.user,provider)
        rows=LedgerEntry.objects.filter(booking__kind='HOTEL',booking__supplier=provider.owner,booking_id__in=Booking.objects.filter(kind='HOTEL',items__room_night__room_type__hotel__provider=provider).values('pk'))
        return Response({kind.lower():rows.filter(kind=kind).aggregate(gross=Sum('gross'),platform_fee=Sum('platform_fee'),provider_amount=Sum('provider_amount')) for kind in ['SALE','REFUND']})


class HotelRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = HotelRequest
        fields = ['id', 'provider', 'booking', 'message', 'response', 'status', 'created_at']
        read_only_fields = ['id', 'response', 'status', 'created_at']
    def validate(self, attrs):
        booking = attrs.get('booking')
        if booking and (booking.user_id != self.context['request'].user.pk or booking.kind != 'HOTEL' or not booking.items.filter(room_night__room_type__hotel__provider=attrs['provider']).exists()):
            raise serializers.ValidationError('Select your booking with this hotels provider.')
        return attrs


class HotelRequestViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = HotelRequestSerializer
    http_method_names = ['get', 'post', 'head', 'options']
    def get_queryset(self):
        user = self.request.user
        qs = HotelRequest.objects.select_related('provider').order_by('-created_at', 'pk')
        if not (user.is_staff and user.has_perm('hotels.view_hotelrequest')):
            qs = qs.filter(Q(user=user) | Q(provider__owner=user) | Q(provider__staff__user=user, provider__staff__is_active=True, provider__staff__role='MANAGER')).distinct()
        if self.request.query_params.get('provider'): qs = qs.filter(provider_id=self.request.query_params['provider'])
        return qs
    def perform_create(self, serializer):
        if not self.request.user.email_verified: raise PermissionDenied('Verify your email first.')
        obj = serializer.save(user=self.request.user)
        notify(obj.provider.owner, f'hotel-request:{obj.pk}', 'Hotel support request', obj.message)
        audit(self.request.user, 'hotels.support_requested', obj.pk)
    @action(detail=True, methods=['post'])
    @transaction.atomic
    def respond(self, request, pk=None):
        obj = HotelRequest.objects.select_for_update().get(pk=self.get_object().pk)
        if request.user.is_staff:
            from apps.accounts.administration import require_staff_permission
            require_staff_permission(request.user, 'hotels.change_hotelrequest')
        else: authorize(request.user, obj.provider)
        obj.response = serializers.CharField(max_length=3000).run_validation(request.data.get('response'))
        obj.status = 'RESOLVED'
        obj.save(update_fields=['response', 'status'])
        notify(obj.user, f'hotel-response:{obj.pk}:{timezone.now()}', 'Hotel support reply', obj.response)
        audit(request.user, 'hotels.support_responded', obj.pk)
        return Response(self.get_serializer(obj).data)
