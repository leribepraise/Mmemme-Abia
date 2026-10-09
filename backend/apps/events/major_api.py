from urllib.parse import urlsplit

from django.core.files.storage import default_storage
from django.db import transaction
from django.db.models import F, Q
from django.http import Http404, HttpResponseRedirect
from django.utils import timezone
from rest_framework import permissions, serializers
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.common.api import validate_image
from apps.common.models import audit
from .models import Event, MajorEventPromotion, MajorEventAnnouncement
from .announcements import queue_major_event_announcement


class MajorEventInput(serializers.Serializer):
    event_id = serializers.UUIDField(required=False)
    title = serializers.CharField(max_length=255, required=False)
    description = serializers.CharField(max_length=500, required=False, allow_blank=True)
    image = serializers.ImageField(required=False)
    registration_url = serializers.URLField(max_length=1000, required=False)
    starts_at = serializers.DateTimeField(required=False)
    ends_at = serializers.DateTimeField(required=False)

    def validate_image(self, value):
        return validate_image(value)

    def validate(self, values):
        if values.get('event_id'):
            if any(values.get(key) for key in ('registration_url', 'title', 'image')):
                raise serializers.ValidationError('Choose an MMEMME ABIA event or supply external registration details, not both.')
            now = timezone.now()
            event = Event.objects.filter(
                pk=values['event_id'], status=Event.Status.PUBLISHED,
                is_suspended=False, is_archived=False, deletion_requested_at__isnull=True,
                organizer__is_active=True, organizer__is_verified=True, end_datetime__gt=now,
            ).first()
            if not event:
                raise serializers.ValidationError({'event_id': 'Choose an active, approved event that has not ended.'})
            if not (event.image or event.image_card or event.image_detail or event.image_url):
                raise serializers.ValidationError({'event_id': 'Upload an event poster before promoting this event.'})
            if not event.ticket_types.filter(is_active=True, quantity__gt=F('quantity_sold') + F('quantity_reserved')).filter(
                Q(sales_start__isnull=True) | Q(sales_start__lte=now),
                Q(sales_end__isnull=True) | Q(sales_end__gt=now),
            ).exists():
                raise serializers.ValidationError({'event_id': 'This event has no tickets currently available.'})
            values['event'] = event
        else:
            for key in ('title', 'image', 'registration_url', 'ends_at'):
                if not values.get(key):
                    raise serializers.ValidationError({key: 'This is required for an external registration event.'})
            parsed = urlsplit(values['registration_url'])
            if parsed.scheme != 'https' or not parsed.hostname or parsed.username or parsed.password:
                raise serializers.ValidationError({'registration_url': 'Use a public HTTPS registration link.'})
            if values['ends_at'] <= timezone.now():
                raise serializers.ValidationError({'ends_at': 'Choose a future end time.'})
            if values.get('starts_at') and values['starts_at'] >= values['ends_at']:
                raise serializers.ValidationError({'starts_at': 'The start time must be before the end time.'})
        return values


def promotion_is_active(promotion):
    if not promotion:
        return False
    now = timezone.now()
    if not promotion.event_id:
        return bool(promotion.ends_at and promotion.ends_at > now)
    event = promotion.event
    if not event or event.status != Event.Status.PUBLISHED or event.is_suspended or event.is_archived or event.deletion_requested_at or not event.organizer.is_active or not event.organizer.is_verified or event.end_datetime <= now:
        return False
    return event.ticket_types.filter(is_active=True, quantity__gt=F('quantity_sold') + F('quantity_reserved')).filter(
        Q(sales_start__isnull=True) | Q(sales_start__lte=now),
        Q(sales_end__isnull=True) | Q(sales_end__gt=now),
    ).exists()


def promotion_data(request, promotion, only_active=True):
    if not promotion:
        return None
    active = promotion_is_active(promotion)
    if only_active and not active:
        return None
    if promotion.event_id:
        event = promotion.event
        if not event:
            return None
        image = event.image_detail or event.image_card or event.image
        image_url = request.build_absolute_uri(image.url) if image else (request.build_absolute_uri(event.image_url) if event.image_url.startswith('/') else event.image_url)
        return {'id': promotion.id, 'event_id': event.pk, 'title': event.title,
                'description': event.description[:500], 'image': image_url,
                'starts_at': event.start_datetime, 'ends_at': event.end_datetime,
                'url': f'/events/{event.pk}', 'cta': 'Get tickets', 'kind': 'ticket', 'active': active}
    return {'id': promotion.id, 'event_id': None, 'title': promotion.title,
            'description': promotion.description, 'image': request.build_absolute_uri(promotion.image.url) if promotion.image else None,
            'starts_at': promotion.starts_at, 'ends_at': promotion.ends_at,
            'url': promotion.registration_url, 'cta': 'Register now', 'kind': 'registration', 'active': active}


class PublicMajorEventView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        promotion = MajorEventPromotion.objects.select_related('event', 'event__organizer').first()
        return Response(promotion_data(request, promotion))


class MajorEventEmailImageView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get(self, request, announcement_id):
        job = MajorEventAnnouncement.objects.filter(pk=announcement_id).only('image_path').first()
        if not job or not job.image_path or not default_storage.exists(job.image_path):
            raise Http404
        response = HttpResponseRedirect(default_storage.url(job.image_path))
        response['Cache-Control'] = 'no-store'
        return response


class AdminMajorEventView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def _check_change(self, request):
        if not request.user.has_perm('events.change_event'):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Event management permission is required.')

    def get(self, request):
        if not request.user.has_perm('events.view_event'):
            self._check_change(request)
        promotion = MajorEventPromotion.objects.select_related('event', 'event__organizer').first()
        return Response(promotion_data(request, promotion, only_active=False))

    @transaction.atomic
    def put(self, request):
        self._check_change(request)
        serializer = MajorEventInput(data=request.data)
        serializer.is_valid(raise_exception=True)
        values = serializer.validated_data
        promotion, _ = MajorEventPromotion.objects.select_for_update().get_or_create(pk=1)
        if values.get('event'):
            promotion.event = values['event']
            promotion.title = ''
            promotion.description = ''
            promotion.image = None
            promotion.registration_url = ''
            promotion.starts_at = None
            promotion.ends_at = None
        else:
            promotion.event = None
            for key in ('title', 'description', 'image', 'registration_url', 'starts_at', 'ends_at'):
                setattr(promotion, key, values.get(key, '' if key == 'description' else None))
        promotion.selected_by = request.user
        promotion.save()
        queue_major_event_announcement(promotion)
        audit(request.user, 'event.major_selected', promotion.event_id or promotion.pk, kind='ticket' if promotion.event_id else 'registration')
        return Response(promotion_data(request, promotion))

    @transaction.atomic
    def delete(self, request):
        self._check_change(request)
        MajorEventPromotion.objects.filter(pk=1).delete()
        audit(request.user, 'event.major_cleared', 1)
        return Response(status=204)
