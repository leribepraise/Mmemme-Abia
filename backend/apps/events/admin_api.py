from django.db.models import Q
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.accounts.admin_api import StaffModelPermission, reason_from
from .models import Event
from .serializers import EventSerializer
from .moderation import moderate_event


class AdminEventSerializer(EventSerializer):
    class Meta(EventSerializer.Meta):
        fields = EventSerializer.Meta.fields + ['review_note', 'review_decision', 'reviewed_at', 'reviewed_by', 'is_suspended']
        read_only_fields = fields


class AdminEventViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [StaffModelPermission]
    required_permission = 'events.view_event'
    serializer_class = AdminEventSerializer

    def get_queryset(self):
        qs = Event.objects.select_related('organizer', 'organizer__organizer_profile').prefetch_related('ticket_types').order_by('-created_at', '-pk')
        params = self.request.query_params
        if params.get('search'):
            term = params['search']
            qs = qs.filter(Q(title__icontains=term) | Q(organizer__organizer_profile__business_name__icontains=term) | Q(city__icontains=term))
        if params.get('status') == 'SUSPENDED':
            qs = qs.filter(is_suspended=True)
        elif params.get('status'):
            qs = qs.filter(status=params['status'], is_suspended=False)
        if params.get('category'):
            qs = qs.filter(category=params['category'])
        for name, lookup in [('date_from', 'start_datetime__date__gte'), ('date_to', 'start_datetime__date__lte')]:
            if params.get(name):
                qs = qs.filter(**{lookup: serializers.DateField().run_validation(params[name])})
        return qs

    def review(self, request, decision):
        event = moderate_event(request.user, self.get_object().pk, decision, reason_from(request))
        return Response(self.get_serializer(event).data)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None): return self.review(request, 'approve')
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None): return self.review(request, 'reject')
    @action(detail=True, methods=['post'], url_path='request-changes')
    def request_changes(self, request, pk=None): return self.review(request, 'request-changes')
    @action(detail=True, methods=['post'])
    def suspend(self, request, pk=None): return self.review(request, 'suspend')
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None): return self.review(request, 'activate')
