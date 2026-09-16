from rest_framework import serializers

from .models import Event, TicketType


class TicketTypeSerializer(serializers.ModelSerializer):
    quantity_available = serializers.ReadOnlyField()

    class Meta:
        model = TicketType
        fields = [
            "id",
            "name",
            "description",
            "price",
            "quantity",
            "quantity_sold",
            "quantity_available",
            "sales_start",
            "sales_end",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "quantity_sold",
            "quantity_available",
            "created_at",
            "updated_at",
        ]


class EventSerializer(serializers.ModelSerializer):
    organizer = serializers.ReadOnlyField(source="organizer.email")
    ticket_types = TicketTypeSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = [
            "id",
            "organizer",
            "title",
            "slug",
            "description",
            "category",
            "venue",
            "address",
            "city",
            "state",
            "start_datetime",
            "end_datetime",
            "capacity",
            "status",
            "image",
            "ticket_types",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "organizer",
            "ticket_types",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):
        start = attrs.get(
            "start_datetime",
            getattr(self.instance, "start_datetime", None),
        )
        end = attrs.get(
            "end_datetime",
            getattr(self.instance, "end_datetime", None),
        )

        if start and end and end <= start:
            raise serializers.ValidationError(
                "Event end time must be after the start time."
            )

        return attrs