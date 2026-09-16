from rest_framework import viewsets

from .models import Event
from .permissions import IsOrganizerOrReadOnly
from .serializers import EventSerializer


class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer

    queryset = Event.objects.select_related(
        "organizer"
    ).prefetch_related(
        "ticket_types"
    )

    permission_classes = [IsOrganizerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)