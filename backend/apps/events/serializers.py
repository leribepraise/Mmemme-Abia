from django.db.models import Sum
from django.utils import timezone
from rest_framework import serializers
from apps.common.api import validate_image
from .models import Event, TicketType

class TicketTypeSerializer(serializers.ModelSerializer):
    quantity_available = serializers.ReadOnlyField()
    class Meta:
        model = TicketType
        fields = ["id","name","description","price","quantity","quantity_sold","quantity_reserved","quantity_available","sales_start","sales_end","is_active"]
        read_only_fields = ["id","quantity_sold","quantity_reserved","quantity_available"]
    def validate(self,attrs):
        price = attrs.get("price",getattr(self.instance,"price",0))
        quantity = attrs.get("quantity",getattr(self.instance,"quantity",0))
        if price < 0 or quantity < 1: raise serializers.ValidationError("Price must be nonnegative and stock must be positive.")
        if self.instance:
            if quantity < self.instance.quantity_sold+self.instance.quantity_reserved:
                raise serializers.ValidationError("Stock cannot be less than existing sales and reservations.")
            if (self.instance.quantity_sold or self.instance.quantity_reserved) and price != self.instance.price:
                raise serializers.ValidationError("Create a new ticket type to change a price after reservations begin.")
        start = attrs.get("sales_start",getattr(self.instance,"sales_start",None))
        end = attrs.get("sales_end",getattr(self.instance,"sales_end",None))
        if start and end and end <= start: raise serializers.ValidationError("Sales must end after they start.")
        return attrs

class EventSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        if not data.get('image') and instance.image_url:
            data['image'] = instance.image_url
        return data

    def validate_image_url(self, value):
        from urllib.parse import urlsplit
        if not value:
            return value
        parsed = urlsplit(value)
        if value.startswith('/') and not value.startswith('//') and '\\' not in value:
            return value
        if parsed.scheme == 'https' and parsed.hostname and not parsed.username and not parsed.password:
            return value
        raise serializers.ValidationError('Use a site-relative image path or an HTTPS image URL.')
    organizer = serializers.SerializerMethodField()
    ticket_types = serializers.SerializerMethodField()
    slug = serializers.SlugField(required=False)
    class Meta:
        model = Event
        fields = ["id","organizer","title","slug","description","category","venue","address","city","state","start_datetime","end_datetime","capacity","status","image","image_url","ticket_types","created_at","updated_at"]
        read_only_fields = ["id","organizer","status","created_at","updated_at"]
    def get_organizer(self,obj):
        profile = getattr(obj.organizer,"organizer_profile",None)
        return {"id":obj.organizer_id,"name":profile.business_name if profile else obj.organizer.get_full_name(),"verified":obj.organizer.is_verified}
    def get_ticket_types(self,obj):
        rows=list(obj.ticket_types.all())
        view=self.context.get("view")
        if view and view.action in {"list","retrieve"}: rows=[row for row in rows if row.is_active]
        return TicketTypeSerializer(rows,many=True).data
    def validate_image(self,value): return validate_image(value) if value else value
    def validate(self,attrs):
        start = attrs.get("start_datetime",getattr(self.instance,"start_datetime",None))
        end = attrs.get("end_datetime",getattr(self.instance,"end_datetime",None))
        if start and end and end <= start: raise serializers.ValidationError("Event end must follow its start.")
        if not self.instance and start and start <= timezone.now(): raise serializers.ValidationError("New events must start in the future.")
        if attrs.get("capacity",getattr(self.instance,"capacity",1)) < 1: raise serializers.ValidationError("Capacity must be positive.")
        if self.instance and self.instance.status not in {"DRAFT","REJECTED"}:
            raise serializers.ValidationError("Only draft or rejected events can be edited. Contact support for changes to a published event.")
        return attrs
