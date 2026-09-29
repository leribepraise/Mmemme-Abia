import uuid
from django.db import transaction
from django.db.models import Q
from django.utils import timezone
from django.utils.text import slugify
from django.utils.dateparse import parse_date
from rest_framework import viewsets, serializers
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from apps.common.api import Conflict
from apps.common.models import audit
from .models import Event, TicketType, SavedEvent, EventReview
from .permissions import IsOrganizerOrReadOnly
from .serializers import EventSerializer, TicketTypeSerializer

class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [IsOrganizerOrReadOnly]
    def get_queryset(self):
        qs = Event.objects.select_related("organizer","organizer__organizer_profile").prefetch_related("ticket_types")
        if self.action in {"list","retrieve"}:
            qs = qs.filter(status="PUBLISHED",is_suspended=False,is_archived=False,deletion_requested_at__isnull=True,organizer__is_active=True,organizer__is_verified=True)
            if self.action=="list": qs=qs.filter(end_datetime__gt=timezone.now())
        elif not self.request.user.is_staff:
            qs = qs.filter(organizer=self.request.user,is_archived=False)
        for field in ["category","city"]:
            if self.request.query_params.get(field): qs=qs.filter(**{field+"__iexact":self.request.query_params[field]})
        search = self.request.query_params.get("search")
        if search:
            qs=qs.filter(Q(title__icontains=search)|Q(category__icontains=search)|Q(city__icontains=search)|Q(organizer__organizer_profile__business_name__icontains=search))
        for parameter,lookup in [("date_from","start_datetime__date__gte"),("date_to","start_datetime__date__lte")]:
            if self.request.query_params.get(parameter):
                date = parse_date(self.request.query_params[parameter])
                if not date: raise serializers.ValidationError("Dates must use YYYY-MM-DD.")
                qs=qs.filter(**{lookup:date})
        return qs.order_by("start_datetime","id")
    def perform_create(self,serializer):
        slug = serializer.validated_data.get("slug") or (slugify(serializer.validated_data["title"])[:240]+"-"+uuid.uuid4().hex[:12])
        serializer.save(organizer=self.request.user,slug=slug,status="DRAFT")
    @transaction.atomic
    def update(self,request,*args,**kwargs):
        instance=self.get_object()
        Event.objects.select_for_update().get(pk=instance.pk)
        before = {field: getattr(instance, field) for field in ['title', 'venue', 'address', 'city', 'start_datetime', 'end_datetime']}
        response = super().update(request,*args,**kwargs)
        event = Event.objects.get(pk=instance.pk)
        changed = [field for field, old in before.items() if getattr(event, field) != old]
        if changed and event.status == Event.Status.PUBLISHED:
            from apps.bookings.models import Booking
            from apps.notifications.services import notify
            bookings = Booking.objects.filter(kind='EVENT', parent_id=str(event.pk), status__in=['PENDING', 'CONFIRMED'])
            for booking in bookings.iterator():
                details = dict(booking.details)
                details.update(title=event.title, start_datetime=event.start_datetime.isoformat(),
                               end_datetime=event.end_datetime.isoformat(),
                               location=event.venue + (', ' + event.address if event.address else ''))
                Booking.objects.filter(pk=booking.pk).update(details=details)
                notify(booking.user, f'event-updated:{event.pk}:{event.updated_at.isoformat()}:{booking.pk}',
                       'Your event details changed',
                       f'{event.title} has updated its event details. Please review the new date, time and venue in your bookings before attending.')
            audit(request.user, 'event.details_updated', event.pk, fields=changed)
        return response
    def perform_destroy(self,instance):
        raise Conflict("Request event deletion for staff review instead.")
    @action(detail=False,methods=["get"])
    def mine(self,request):
        page=self.paginate_queryset(self.get_queryset())
        return self.get_paginated_response(self.get_serializer(page,many=True).data)
    @action(detail=True, methods=['get'])
    def manage(self, request, pk=None):
        return Response(self.get_serializer(self.get_object()).data)
    @action(detail=True, methods=['post'], url_path='request-deletion')
    @transaction.atomic
    def request_deletion(self, request, pk=None):
        event = Event.objects.select_for_update().get(pk=self.get_object().pk)
        if request.user.pk != event.organizer_id:
            raise PermissionDenied('Only the organizer can request deletion.')
        if event.deletion_requested_at:
            raise Conflict('This event already has a deletion request awaiting staff review.')
        if event.status in {Event.Status.CANCELLED, Event.Status.COMPLETED}:
            raise Conflict('Cancelled or completed events cannot be removed from this page.')
        if event.start_datetime <= timezone.now():
            raise Conflict('An event that has started needs support review before removal.')
        event.deletion_requested_at = timezone.now()
        event.save(update_fields=['deletion_requested_at', 'updated_at'])
        audit(request.user, 'event.deletion_requested', event.pk)
        return Response(self.get_serializer(event).data)
    @action(detail=True, methods=['get'])
    def attendees(self, request, pk=None):
        from apps.tickets.models import Ticket
        event = self.get_object()
        tickets = Ticket.objects.filter(ticket_type__event=event).select_related('booking', 'ticket_type').order_by('created_at', 'id')
        page = self.paginate_queryset(tickets)
        rows = [{'id': str(ticket.id), 'name': ticket.booking.customer_name,
                 'email': ticket.booking.details.get('attendee_email', ''),
                 'ticket': ticket.ticket_type.name, 'orderId': ticket.booking.booking_reference,
                 'purchaseDate': ticket.created_at.isoformat(), 'checkedIn': ticket.status == 'USED',
                 'status': ticket.status} for ticket in page]
        return self.get_paginated_response(rows)
    @action(detail=True,methods=["post"])
    @transaction.atomic
    def submit(self,request,pk=None):
        event=Event.objects.select_for_update().get(pk=self.get_object().pk)
        if event.status not in {"DRAFT","REJECTED"} or not event.ticket_types.filter(is_active=True).exists() or event.start_datetime <= timezone.now():
            raise Conflict("Add ticket types and valid dates to a draft before submitting.")
        event.status="IN_REVIEW"; event.save(update_fields=["status","updated_at"])
        audit(request.user,"event.submitted",event.pk)
        return Response(self.get_serializer(event).data)
    @action(detail=True,methods=["post"])
    def approve(self,request,pk=None):
        from .moderation import moderate_event
        from apps.accounts.admin_api import reason_from
        event = moderate_event(request.user, self.get_object().pk, 'approve', reason_from(request))
        return Response(self.get_serializer(event).data)
    @action(detail=True,methods=["post"])
    def reject(self,request,pk=None):
        from .moderation import moderate_event
        from apps.accounts.admin_api import reason_from
        event = moderate_event(request.user, self.get_object().pk, 'reject', reason_from(request))
        return Response(self.get_serializer(event).data)
    @action(detail=True,methods=["post"])
    @transaction.atomic
    def cancel(self,request,pk=None):
        from apps.bookings.models import Booking
        from apps.bookings.services import cancel
        event=Event.objects.select_for_update().get(pk=self.get_object().pk)
        if event.end_datetime <= timezone.now(): raise Conflict("Completed events require support review.")
        event.status="CANCELLED";event.save(update_fields=["status","updated_at"])
        for booking in Booking.objects.filter(kind="EVENT",parent_id=str(event.pk),status__in=["PENDING","CONFIRMED"]).order_by("id"):
            cancel(booking.pk,request.user,force=True)
        audit(request.user,"event.cancelled",event.pk)
        return Response(self.get_serializer(event).data)
    @action(detail=True,methods=["post","patch"],url_path="ticket-types")
    @transaction.atomic
    def ticket_types(self,request,pk=None):
        event=Event.objects.select_for_update().get(pk=self.get_object().pk)
        if event.status == "PUBLISHED":
            if event.start_datetime <= timezone.now() or event.deletion_requested_at:
                raise Conflict("Ticket types cannot change after the event has started or while cancellation is pending.")
        elif event.status not in {"DRAFT", "REJECTED"}:
            raise Conflict("Ticket types cannot be edited for this event.")
        instance=None
        if request.method=="PATCH":
            from django.shortcuts import get_object_or_404
            instance=get_object_or_404(TicketType.objects.select_for_update(),pk=request.data.get("id"),event=event)
        serializer=TicketTypeSerializer(instance,data=request.data,partial=request.method=="PATCH")
        serializer.is_valid(raise_exception=True)
        if TicketType.objects.filter(event=event,name=serializer.validated_data.get("name",getattr(instance,"name",""))).exclude(pk=getattr(instance,"pk",None)).exists():
            raise serializers.ValidationError("This ticket type name already exists.")
        serializer.save(event=event)
        return Response(serializer.data,status=201 if instance is None else 200)
