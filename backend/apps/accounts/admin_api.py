from datetime import timedelta
from django.db.models import Q, Count, Sum
from django.db.models.functions import TruncDate
from django.utils import timezone
from rest_framework import permissions, serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.common.models import AuditLog
from apps.events.models import Event
from apps.bookings.models import Booking
from apps.payments.models import Payment
from .models import User, OrganizerProfile
from .administration import require_staff_permission, review_organizer, set_account_active


class StaffModelPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(user.is_authenticated and user.is_active and user.is_staff and user.has_perm(view.required_permission))


class ReviewInput(serializers.Serializer):
    reason = serializers.CharField(max_length=2000, required=False, allow_blank=True, default='')


def reason_from(request):
    serializer = ReviewInput(data=request.data)
    serializer.is_valid(raise_exception=True)
    return serializer.validated_data['reason']


class AdminUserSerializer(serializers.ModelSerializer):
    organizer_status = serializers.CharField(source='organizer_profile.status', read_only=True, default=None)
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'phone', 'whatsapp', 'lga', 'address',
                  'date_of_birth', 'gender', 'bio', 'avatar', 'role', 'is_active', 'is_verified',
                  'email_verified', 'is_staff', 'date_joined', 'last_login', 'organizer_status']
        read_only_fields = fields


class AdminOrganizerSerializer(serializers.ModelSerializer):
    user = AdminUserSerializer(read_only=True)
    event_count = serializers.IntegerField(read_only=True)
    class Meta:
        model = OrganizerProfile
        fields = ['id', 'user', 'business_name', 'description', 'contact_phone', 'verification_reference',
                  'status', 'review_note', 'reviewed_by', 'reviewed_at', 'created_at', 'event_count',
                  'event_type', 'coverage_region', 'terms_accepted_at', 'terms_version']
        read_only_fields = fields


class AdminUserViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AdminUserSerializer
    permission_classes = [StaffModelPermission]
    required_permission = 'accounts.view_user'
    def get_queryset(self):
        qs = User.objects.select_related('organizer_profile').order_by('-date_joined', '-pk')
        params = self.request.query_params
        if params.get('hotel_hosts') == 'true':
            from apps.hotels.models import Hotel
            qs = qs.filter(pk__in=Hotel.objects.values('owner_id'))
        if params.get('search'):
            term = params['search']
            qs = qs.filter(Q(email__icontains=term) | Q(first_name__icontains=term) | Q(last_name__icontains=term) | Q(phone__icontains=term))
        if params.get('role'):
            qs = qs.filter(role=params['role'])
        if params.get('lga'):
            qs = qs.filter(lga=params['lga'])
        if params.get('status') == 'active':
            qs = qs.filter(is_active=True)
        elif params.get('status') == 'suspended':
            qs = qs.filter(is_active=False)
        return qs

    @action(detail=True, methods=['post'])
    def suspend(self, request, pk=None):
        user = set_account_active(request.user, self.get_object().pk, False, reason_from(request))
        return Response(self.get_serializer(user).data)

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        user = set_account_active(request.user, self.get_object().pk, True, reason_from(request))
        return Response(self.get_serializer(user).data)


class AdminOrganizerViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AdminOrganizerSerializer
    permission_classes = [StaffModelPermission]
    required_permission = 'accounts.view_organizerprofile'

    def get_queryset(self):
        qs = OrganizerProfile.objects.select_related('user', 'user__organizer_profile').annotate(event_count=Count('user__events')).order_by('-created_at', '-pk')
        params = self.request.query_params
        if params.get('search'):
            term = params['search']
            qs = qs.filter(Q(business_name__icontains=term) | Q(user__email__icontains=term))
        if params.get('status') == 'SUSPENDED':
            qs = qs.filter(user__is_active=False)
        elif params.get('status'):
            qs = qs.filter(status=params['status'], user__is_active=True)
        if params.get('category'):
            qs = qs.filter(event_type=params['category'])
        return qs

    def review(self, request, decision):
        profile = review_organizer(request.user, self.get_object().pk, decision, reason_from(request))
        profile.event_count = profile.user.events.count()
        return Response(self.get_serializer(profile).data)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        return self.review(request, 'APPROVED')

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        return self.review(request, 'REJECTED')

    @action(detail=True, methods=['post'])
    def reopen(self, request, pk=None):
        return self.review(request, 'PENDING')

    @action(detail=True, methods=['post'], url_path='request-info')
    def request_info(self, request, pk=None):
        return self.review(request, 'NEEDS_INFO')

    @action(detail=True, methods=['post'])
    def suspend(self, request, pk=None):
        profile = self.get_object()
        set_account_active(request.user, profile.user_id, False, reason_from(request))
        return Response({'detail': 'Account suspended.'})

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        profile = self.get_object()
        set_account_active(request.user, profile.user_id, True, reason_from(request))
        return Response({'detail': 'Account reactivated.'})


class AdminOverview(APIView):
    permission_classes = [StaffModelPermission]
    required_permission = 'accounts.view_user'

    def get(self, request):
        require_staff_permission(request.user, 'accounts.view_organizerprofile')
        require_staff_permission(request.user, 'events.view_event')
        days = serializers.IntegerField(min_value=7, max_value=90).run_validation(request.query_params.get('days', 30))
        now = timezone.now()
        start = timezone.localdate() - timedelta(days=days - 1)
        can_book = request.user.has_perm('bookings.view_booking')
        can_pay = request.user.has_perm('payments.view_payment')
        payments = Payment.objects.filter(status='SUCCESS')
        def daily(qs, field, total=False):
            rows = qs.filter(**{field+'__date__gte': start}).annotate(day=TruncDate(field)).values('day').annotate(value=Sum('amount') if total else Count('pk'))
            lookup = {row['day']: row['value'] for row in rows}
            return [lookup.get(start + timedelta(days=i), 0) for i in range(days)]
        result = {
            'users': User.objects.count(),
            'active_users': User.objects.filter(is_active=True).count(),
            'suspended_users': User.objects.filter(is_active=False).count(),
            'new_users': User.objects.filter(date_joined__gte=now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)).count(),
            'organizers': OrganizerProfile.objects.count(),
            'pending_organizers': OrganizerProfile.objects.filter(status='PENDING').count(),
            'approved_organizers': OrganizerProfile.objects.filter(status='APPROVED').count(),
            'active_organizers': OrganizerProfile.objects.filter(status='APPROVED', user__is_active=True).count(),
            'suspended_organizers': OrganizerProfile.objects.filter(user__is_active=False).count(),
            'events': Event.objects.count(),
            'pending_events': Event.objects.filter(status='IN_REVIEW').count(),
            'published_events': Event.objects.filter(status='PUBLISHED').count(),
            'rejected_events': Event.objects.filter(status='REJECTED').count(),
            'bookings': Booking.objects.count() if can_book else None,
            'gross_payments': payments.aggregate(value=Sum('amount'))['value'] or 0 if can_pay else None,
            'labels': [(start+timedelta(days=i)).isoformat() for i in range(days)],
            'activity': {'users': daily(User.objects.all(), 'date_joined'),
                         'bookings': daily(Booking.objects.all(), 'created_at') if can_book else None,
                         'revenue': daily(payments, 'paid_at', True) if can_pay else None},
            'categories': list(Event.objects.values('category').annotate(value=Count('pk')).order_by('-value')[:7]),
            'event_categories': list(Event.objects.order_by('category').values_list('category', flat=True).distinct()),
            'organizer_categories': list(OrganizerProfile.objects.exclude(event_type='').order_by('event_type').values_list('event_type', flat=True).distinct()),
            'recent_activity': list(AuditLog.objects.values('id', 'action', 'target', 'created_at')[:10]) if request.user.has_perm('common.view_auditlog') else [],
        }
        return Response(result)
