from rest_framework import viewsets

from .models import Booking
from .permissions import IsBookingOwner
from .serializers import BookingSerializer


class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [IsBookingOwner]

    def get_queryset(self):
        return (
            Booking.objects.filter(user=self.request.user)
            .prefetch_related("items__ticket_type")
        )