from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import serializers, viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Event, SavedEvent, EventReview
from .serializers import EventSerializer

class SavedEventsView(APIView):
    def get(self,request):
        from apps.common.api import Pagination
        qs=Event.objects.filter(savedevent__user=request.user,status="PUBLISHED").select_related("organizer","organizer__organizer_profile").prefetch_related("ticket_types").order_by("start_datetime","id")
        pager=Pagination();page=pager.paginate_queryset(qs,request)
        return pager.get_paginated_response(EventSerializer(page,many=True).data)
    def post(self,request):
        event_id=serializers.UUIDField().run_validation(request.data.get("event"))
        event=get_object_or_404(Event,pk=event_id,status="PUBLISHED")
        SavedEvent.objects.get_or_create(user=request.user,event=event)
        return Response({"saved":True})
    def delete(self,request):
        event_id=serializers.UUIDField().run_validation(request.data.get("event"))
        SavedEvent.objects.filter(user=request.user,event_id=event_id).delete()
        return Response(status=204)

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model=EventReview
        fields=["id","event","rating","comment","created_at"]
        read_only_fields=["id","created_at"]
    def validate_rating(self,value):
        if not 1<=value<=5: raise serializers.ValidationError("Use a rating from 1 to 5.")
        return value
    def validate_event(self,event):
        from apps.tickets.models import Ticket
        if event.end_datetime > timezone.now() or not Ticket.objects.filter(owner=self.context["request"].user,ticket_type__event=event,status="USED").exists():
            raise serializers.ValidationError("Reviews are available after attending the event.")
        if EventReview.objects.filter(user=self.context["request"].user,event=event).exists():
            raise serializers.ValidationError("You already reviewed this event.")
        return event

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class=ReviewSerializer
    http_method_names=["get","post","head","options"]
    def get_permissions(self):
        return [permissions.AllowAny()] if self.action in {"list","retrieve"} else [permissions.IsAuthenticated()]
    def get_queryset(self):
        qs=EventReview.objects.filter(is_approved=True).order_by("-created_at","-id")
        if self.request.query_params.get("event"):
            event_id=serializers.UUIDField().run_validation(self.request.query_params["event"])
            qs=qs.filter(event_id=event_id)
        return qs
    @transaction.atomic
    def perform_create(self,serializer):
        from django.contrib.auth import get_user_model
        get_user_model().objects.select_for_update(no_key=True).get(pk=self.request.user.pk)
        if EventReview.objects.filter(user=self.request.user,event=serializer.validated_data["event"]).exists():
            raise serializers.ValidationError("You already reviewed this event.")
        serializer.save(user=self.request.user,is_approved=False)
