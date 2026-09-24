from django.db.models import Q, Exists, OuterRef, Subquery
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.bookings.models import Booking
from .models import Conversation, Message

class ConversationSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    provider_name = serializers.SerializerMethodField()
    booking_reference = serializers.CharField(source='booking.booking_reference', read_only=True)
    title = serializers.SerializerMethodField()
    unread = serializers.BooleanField(read_only=True)
    last_message = serializers.CharField(read_only=True, allow_null=True)
    def get_customer_name(self, obj):
        return obj.customer.get_full_name() or obj.customer.username
    def get_provider_name(self, obj):
        return obj.provider.get_full_name() or obj.provider.username
    def get_title(self, obj):
        return obj.booking.details.get('title', obj.booking.kind)
    class Meta:
        model=Conversation
        fields=["id","booking","customer","provider","created_at","customer_name","provider_name","booking_reference","title","unread","last_message"]
        read_only_fields=fields

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model=Message
        fields=["id","sender","body","created_at","read_at"]
        read_only_fields=fields

class ConversationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class=ConversationSerializer
    def get_queryset(self):
        messages = Message.objects.filter(conversation_id=OuterRef('pk'))
        return Conversation.objects.filter(Q(customer=self.request.user)|Q(provider=self.request.user)).select_related('customer', 'provider', 'booking').annotate(unread=Exists(messages.exclude(sender=self.request.user).filter(read_at__isnull=True)), last_message=Subquery(messages.order_by('-created_at', '-id').values('body')[:1])).order_by("-created_at","id")
    def create(self,request):
        booking_id=serializers.UUIDField().run_validation(request.data.get("booking"))
        booking=get_object_or_404(Booking.objects.filter(Q(user=request.user)|Q(supplier=request.user)),pk=booking_id)
        if not booking.supplier_id: raise serializers.ValidationError("No provider is available.")
        conversation,_=Conversation.objects.get_or_create(booking=booking,defaults={"customer":booking.user,"provider":booking.supplier})
        return Response(self.get_serializer(conversation).data,status=201)
    @action(detail=True,methods=["get","post"])
    def messages(self,request,pk=None):
        conversation=self.get_object()
        if request.method=="POST":
            body=serializers.CharField(max_length=4000).run_validation(request.data.get("body"))
            message=Message.objects.create(conversation=conversation,sender=request.user,body=body)
            return Response(MessageSerializer(message).data,status=201)
        qs=conversation.messages.order_by("-created_at","-id")
        page=self.paginate_queryset(qs)
        return self.get_paginated_response(MessageSerializer(page,many=True).data)
    @action(detail=True,methods=["post"])
    def read(self,request,pk=None):
        self.get_object().messages.exclude(sender=request.user).filter(read_at__isnull=True).update(read_at=timezone.now())
        return Response({"read":True})
