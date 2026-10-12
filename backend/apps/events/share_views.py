from uuid import UUID
from urllib.parse import urlencode, urlsplit

from django.conf import settings
from django.http import Http404, HttpResponseRedirect
from django.shortcuts import render
from django.utils import timezone
from django.utils.html import strip_tags
from django.views.decorators.http import require_safe
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Event
from .serializers import EventSerializer


def public_shared_event(slug):
    events = Event.objects.select_related('organizer', 'organizer__organizer_profile').prefetch_related('ticket_types').filter(
        status=Event.Status.PUBLISHED, is_suspended=False, is_archived=False,
        deletion_requested_at__isnull=True, organizer__is_active=True,
        organizer__is_verified=True, end_datetime__gt=timezone.now(),
    )
    event = events.filter(share_slug=slug).first()
    if event is None:
        # Preserve links copied before readable event names were introduced.
        try:
            event = events.filter(pk=UUID(slug)).first()
        except (ValueError, TypeError):
            pass
    if event is None:
        raise Http404('This event is no longer available.')
    return event


@require_safe
def event_share(request, slug):
    event = public_shared_event(slug)
    origin = settings.FRONTEND_URL.rstrip('/')
    path = f'/share/events/{event.share_slug}'
    if slug != event.share_slug:
        return HttpResponseRedirect(origin + path)
    image = origin + f'/share/event-images/{event.share_slug}'
    response = render(request, 'events/share.html', {
        'event': event, 'canonical': origin + path, 'image': image,
        'description': ' '.join(strip_tags(event.description).split())[:200],
        'signup_url': '/signup?' + urlencode({'next': f'/events/{event.pk}'}),
    })
    response['Cache-Control'] = 'no-cache, max-age=0, must-revalidate'
    return response


@require_safe
def event_share_image(request, slug):
    event = public_shared_event(slug)
    picture = event.image or event.image_detail or event.image_card
    target = picture.url if picture else event.image_url
    origin = settings.FRONTEND_URL.rstrip('/')
    if target.startswith('/') and not target.startswith('//') and '\\' not in target:
        target = origin + target
    parsed = urlsplit(target)
    if parsed.scheme != 'https' or not parsed.hostname or parsed.username or parsed.password or '\\' in target:
        target = origin + '/logo.png'
    response = HttpResponseRedirect(target)
    # Resolve a fresh storage URL for every preview fetch, including private S3.
    response['Cache-Control'] = 'no-store'
    return response


class SharedEventView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    action = 'retrieve'

    def get(self, request, slug):
        event = public_shared_event(slug)
        return Response(EventSerializer(event, context={'request': request, 'view': self}).data)
