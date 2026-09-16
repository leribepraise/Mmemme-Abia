from decimal import Decimal

from django.db import transaction
from rest_framework import serializers

from apps.events.models import TicketType

from .models import Booking, BookingItem


class BookingItemSerializer(serializers.ModelSerializer):
    ticket_type_name = serializers.CharField(
        source="ticket_type.name",
        read_only=True,
    )

    class Meta:
        model = BookingItem
        fields = [
            "id",
            "ticket_type",
            "ticket_type_name",
            "quantity",
            "unit_price",
            "subtotal",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "ticket_type_name",
            "unit_price",
            "subtotal",
            "created_at",
        ]


class BookingSerializer(serializers.ModelSerializer):
    items = BookingItemSerializer(many=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "booking_reference",
            "status",
            "total_amount",
            "currency",
            "expires_at",
            "items",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "booking_reference",
            "status",
            "total_amount",
            "currency",
            "expires_at",
            "created_at",
            "updated_at",
        ]

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError(
                "A booking must contain at least one item."
            )
        return items

    def validate(self, attrs):
        items = attrs.get("items", [])

        for item in items:
            ticket_type = item["ticket_type"]
            quantity = item["quantity"]

            if not ticket_type.is_active:
                raise serializers.ValidationError(
                    f"Ticket type '{ticket_type.name}' is not active."
                )

            if quantity > ticket_type.quantity_available:
                raise serializers.ValidationError(
                    f"Only {ticket_type.quantity_available} "
                    f"tickets are available for '{ticket_type.name}'."
                )

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop("items")

        # Lock the ticket rows while checking and updating inventory.
        locked_ticket_types = {}

        for item_data in items_data:
            ticket_type_id = item_data["ticket_type"].id

            if ticket_type_id not in locked_ticket_types:
                locked_ticket_types[ticket_type_id] = (
                    TicketType.objects
                    .select_for_update()
                    .get(id=ticket_type_id)
                )

        total_amount = Decimal("0.00")

        # Re-check inventory after acquiring the locks.
        for item_data in items_data:
            ticket_type = locked_ticket_types[item_data["ticket_type"].id]
            quantity = item_data["quantity"]

            if not ticket_type.is_active:
                raise serializers.ValidationError(
                    f"Ticket type '{ticket_type.name}' is not active."
                )

            if quantity > ticket_type.quantity_available:
                raise serializers.ValidationError(
                    f"Only {ticket_type.quantity_available} "
                    f"tickets are available for '{ticket_type.name}'."
                )

        booking = Booking.objects.create(
            user=self.context["request"].user,
            booking_reference=self._generate_booking_reference(),
            total_amount=Decimal("0.00"),
        )

        for item_data in items_data:
            ticket_type = locked_ticket_types[item_data["ticket_type"].id]
            quantity = item_data["quantity"]

            unit_price = ticket_type.price
            subtotal = unit_price * quantity

            BookingItem.objects.create(
                booking=booking,
                ticket_type=ticket_type,
                quantity=quantity,
                unit_price=unit_price,
                subtotal=subtotal,
            )

            ticket_type.quantity_sold += quantity
            ticket_type.save(
                update_fields=["quantity_sold"]
            )

            total_amount += subtotal

        booking.total_amount = total_amount
        booking.save(update_fields=["total_amount", "updated_at"])

        return booking

    def _generate_booking_reference(self):
        import uuid

        return f"MM-{uuid.uuid4().hex[:10].upper()}"