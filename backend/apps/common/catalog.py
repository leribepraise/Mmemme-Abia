from datetime import timedelta
from django.db import transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.utils.dateparse import parse_date
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from apps.common.api import Conflict
from apps.common.models import audit
from apps.hotels.models import Hotel, RoomType, RoomNight
from apps.restaurants.models import Restaurant, MenuItem
from apps.transport.models import Route, Departure
from apps.tourism.models import TourismExperience, TourPackage, TourDeparture

def root_of(obj):
    if isinstance(obj,RoomNight): return obj.room_type.hotel
    if isinstance(obj,RoomType): return obj.hotel
    if isinstance(obj,MenuItem): return obj.restaurant
    if isinstance(obj,Departure): return obj.route
    if isinstance(obj,TourDeparture): return obj.package.experience
    if isinstance(obj,TourPackage): return obj.experience
    return obj

def owner_of(obj):
    obj=root_of(obj)
    return obj.created_by if isinstance(obj,TourismExperience) else obj.owner

CONFIG = {
    Hotel: ("hotel",["id","name","description","city","address","amenities","is_active"],None,"owner"),
    RoomType: ("room-types",["id","hotel","name","max_guests","is_active"],"hotel","hotel__owner"),
    RoomNight: ("room-nights",["id","room_type","date","price","quantity","quantity_available","is_active"],"room_type","room_type__hotel__owner"),
    Restaurant: ("restaurants",["id","name","description","city","address","is_active","accepts_orders","offers_delivery","delivery_fee","delivery_cities"],None,"owner"),
    MenuItem: ("menu-items",["id","restaurant","name","description","allergens","price","quantity","quantity_available","is_active"],"restaurant","restaurant__owner"),
    Route: ("transport-routes",["id","name","origin","destination","pickup_address","is_active"],None,"owner"),
    Departure: ("departures",["id","route","departs_at","arrives_at","vehicle","price","quantity","quantity_available","is_active"],"route","route__owner"),
    TourismExperience: ("tourism",["id","name","description","category","location_name","address","latitude","longitude","contact_phone","contact_email","rating","is_active"],None,"created_by"),
    TourPackage: ("tour-packages",["id","experience","name","description","price","duration_hours","is_active"],"experience","experience__created_by"),
    TourDeparture: ("tour-departures",["id","package","starts_at","ends_at","price","quantity","quantity_available","is_active"],"package","package__experience__created_by"),
}

def serializer_for(model):
    config=CONFIG[model]
    class CatalogSerializer(serializers.ModelSerializer):
        class Meta:
            fields=config[1]
            read_only_fields=["id"]+(["is_active"] if config[2] is None else [])+(["rating"] if model is TourismExperience else [])
        def validate(self,attrs):
            instance=self.instance
            if instance and config[2] and config[2] in attrs and getattr(instance,config[2]+"_id") != attrs[config[2]].pk:
                raise serializers.ValidationError("A listing cannot be moved to another provider.")
            if "price" in attrs and attrs["price"]<0: raise serializers.ValidationError("Price must be nonnegative.")
            if model in {RoomNight,MenuItem,Departure,TourDeparture}:
                held=(instance.quantity_reserved+instance.quantity_sold) if instance else 0
                if attrs.get("quantity",getattr(instance,"quantity",0))<held:
                    raise serializers.ValidationError("Stock cannot be less than existing reservations and sales.")
                protected=["price","date","departs_at","arrives_at","starts_at","ends_at"]
                if instance and held and any(k in attrs and attrs[k]!=getattr(instance,k) for k in protected):
                    raise serializers.ValidationError("Inventory with reservations or sales cannot be repriced or rescheduled.")
            for start,end in [("departs_at","arrives_at"),("starts_at","ends_at")]:
                a=attrs.get(start,getattr(instance,start,None));b=attrs.get(end,getattr(instance,end,None))
                if a and b and b<=a: raise serializers.ValidationError("End must follow start.")
            if model is RoomType and attrs.get("max_guests",1)<1: raise serializers.ValidationError("Guest capacity must be positive.")
            if model is TourPackage and attrs.get("duration_hours",1)<1: raise serializers.ValidationError("Tour duration must be positive.")
            if model is Restaurant:
                if attrs.get("delivery_fee",0)<0: raise serializers.ValidationError("Delivery fee must be nonnegative.")
                cities=attrs.get("delivery_cities",[])
                if not isinstance(cities,list) or len(cities)>100 or any(not isinstance(c,str) or len(c)>100 for c in cities):
                    raise serializers.ValidationError("Provide a list of delivery cities.")
            if model is Hotel:
                amenities=attrs.get("amenities",[])
                if not isinstance(amenities,list) or len(amenities)>100 or any(not isinstance(a,str) or len(a)>100 for a in amenities):
                    raise serializers.ValidationError("Provide a list of amenities.")
            return attrs
    CatalogSerializer.Meta.model=model
    CatalogSerializer.__name__=model.__name__+"Serializer"
    return CatalogSerializer

def viewset_for(model):
    _,_,parent_field,owner_path=CONFIG[model]
    class CatalogViewSet(viewsets.ModelViewSet):
        serializer_class=serializer_for(model)
        http_method_names=["get","post","patch","head","options"]
        def get_permissions(self):
            return [AllowAny()] if self.action in {"list","retrieve"} else [IsAuthenticated()]
        def get_queryset(self):
            qs=model.objects.all().order_by("pk")
            if self.action in {"list","retrieve"}:
                qs=qs.filter(is_active=True,**{owner_path+"__is_verified":True,owner_path+"__is_active":True})
                roots={RoomType:"hotel",RoomNight:"room_type__hotel",MenuItem:"restaurant",Departure:"route",TourPackage:"experience",TourDeparture:"package__experience"}
                if model in roots: qs=qs.filter(**{roots[model]+"__is_active":True})
                if model is RoomNight: qs=qs.filter(room_type__is_active=True,date__gte=timezone.localdate())
                if model is Departure: qs=qs.filter(departs_at__gt=timezone.now())
                if model is TourDeparture: qs=qs.filter(package__is_active=True,starts_at__gt=timezone.now())
            elif not self.request.user.is_staff:
                qs=qs.filter(**{owner_path:self.request.user})
            for field in ["city","origin","destination","hotel","room_type","restaurant","route","experience","package"]:
                if field in CONFIG[model][1] and self.request.query_params.get(field):
                    try: qs=qs.filter(**{field:self.request.query_params[field]})
                    except (ValueError,TypeError): raise serializers.ValidationError("Invalid filter.")
            for field in ["date_from","date_to"]:
                value=self.request.query_params.get(field)
                if value and model is RoomNight:
                    day=parse_date(value)
                    if not day: raise serializers.ValidationError("Dates must use YYYY-MM-DD.")
                    qs=qs.filter(**{"date__gte" if field=="date_from" else "date__lt":day})
            return qs
        def check_owner(self,root):
            user=self.request.user
            if not user.is_staff and (not user.is_verified or owner_of(root).pk!=user.pk): raise PermissionDenied()
        @transaction.atomic
        def perform_create(self,serializer):
            user=self.request.user
            if not user.is_verified and not user.is_staff: raise PermissionDenied("Provider approval is required.")
            if parent_field:
                parent=serializer.validated_data[parent_field]
                root=root_of(parent)
                type(root).objects.select_for_update().get(pk=root.pk)
                self.check_owner(root)
                serializer.save()
            else:
                serializer.save(**{owner_path:user,"is_active":False})
            audit(user,"catalog.created",serializer.instance.pk,model=model._meta.label)
        @transaction.atomic
        def update(self,request,*args,**kwargs):
            instance=self.get_object()
            root=root_of(instance)
            type(root).objects.select_for_update().get(pk=root.pk)
            instance=model.objects.select_for_update().get(pk=instance.pk)
            self.check_owner(instance)
            serializer=self.get_serializer(instance,data=request.data,partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            audit(request.user,"catalog.updated",instance.pk,model=model._meta.label)
            return Response(serializer.data)
        @action(detail=False,methods=["get"])
        def mine(self,request):
            page=self.paginate_queryset(self.get_queryset())
            return self.get_paginated_response(self.get_serializer(page,many=True).data)
        @action(detail=True,methods=["post"])
        @transaction.atomic
        def approve(self,request,pk=None):
            if parent_field or not request.user.has_perm(model._meta.app_label+".change_"+model._meta.model_name):
                raise PermissionDenied()
            obj=model.objects.select_for_update().get(pk=self.get_object().pk)
            if not owner_of(obj).is_verified: raise Conflict("Approve the provider first.")
            obj.is_active=True;obj.save(update_fields=["is_active"])
            audit(request.user,"catalog.approved",obj.pk,model=model._meta.label)
            return Response(self.get_serializer(obj).data)
        @action(detail=False,methods=["post"])
        @transaction.atomic
        def availability(self,request):
            if model is not RoomNight: raise serializers.ValidationError("Only room availability supports date ranges.")
            class AvailabilitySerializer(serializers.Serializer):
                room_type=serializers.PrimaryKeyRelatedField(queryset=RoomType.objects.all())
                date_from=serializers.DateField()
                date_to=serializers.DateField()
                price=serializers.DecimalField(max_digits=12,decimal_places=2,min_value=0)
                quantity=serializers.IntegerField(min_value=1,max_value=10000)
            data=AvailabilitySerializer(data=request.data)
            data.is_valid(raise_exception=True)
            values=data.validated_data
            room=values["room_type"]
            Hotel.objects.select_for_update().get(pk=room.hotel_id)
            self.check_owner(room)
            days=(values["date_to"]-values["date_from"]).days
            if not 1<=days<=366 or values["date_from"]<timezone.localdate():
                raise serializers.ValidationError("Select between 1 and 366 future nights.")
            created=0
            for offset in range(days):
                _,new=RoomNight.objects.get_or_create(room_type=room,date=values["date_from"]+timedelta(days=offset),defaults={"price":values["price"],"quantity":values["quantity"]})
                created+=int(new)
            audit(request.user,"catalog.availability_created",room.pk,nights=created)
            return Response({"created":created,"existing":days-created},status=201)
    CatalogViewSet.__name__=model.__name__+"ViewSet"
    return CatalogViewSet
