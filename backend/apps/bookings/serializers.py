from rest_framework import serializers
from .models import Booking, BookingItem

class BookingItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingItem
        fields = ["id","ticket_type","room_night","menu_item","departure","tour_departure","quantity","unit_price","subtotal","description"]
        read_only_fields = fields

class BookingSerializer(serializers.ModelSerializer):
    items = BookingItemSerializer(many=True,read_only=True)
    class Meta:
        model = Booking
        fields = ["id","booking_reference","kind","status","fulfillment_status","total_amount","currency","expires_at","details","customer_name","customer_phone","customer_note","items","created_at"]
        read_only_fields = fields

class EntrySerializer(serializers.Serializer):
    id = serializers.UUIDField()
    quantity = serializers.IntegerField(min_value=1,max_value=20)

class DetailsSerializer(serializers.Serializer):
    guests = serializers.IntegerField(min_value=1,max_value=100,required=False)
    delivery_method = serializers.ChoiceField(choices=["PICKUP","DELIVERY"],required=False)
    delivery_address = serializers.CharField(max_length=500,required=False)
    delivery_city = serializers.CharField(max_length=100,required=False)

class CreateBookingSerializer(serializers.Serializer):
    kind = serializers.ChoiceField(choices=Booking.Kind.choices)
    items = EntrySerializer(many=True,min_length=1,max_length=30)
    details = DetailsSerializer(required=False,default=dict)
    customer_name = serializers.CharField(max_length=200)
    customer_phone = serializers.RegexField(r"^\+?[0-9 ()-]{7,20}$",max_length=20)
    customer_note = serializers.CharField(max_length=500,required=False,allow_blank=True)
