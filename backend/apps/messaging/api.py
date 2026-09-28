from io import BytesIO
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.db import transaction
from django.db.models import Q, Exists, OuterRef, Subquery, Count
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from apps.bookings.models import Booking
from apps.common.api import Conflict, validate_image
from .models import Conversation, Message, ChatBlock


class ChatThrottle(UserRateThrottle):
    scope = 'chat'
    rate = '120/min'


class ConversationSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    provider_name = serializers.SerializerMethodField()
    booking_reference = serializers.CharField(source='booking.booking_reference', read_only=True, default='')
    title = serializers.SerializerMethodField()
    unread = serializers.BooleanField(read_only=True)
    unread_count = serializers.IntegerField(read_only=True)
    last_message = serializers.CharField(read_only=True, allow_null=True)
    last_message_at = serializers.DateTimeField(read_only=True, allow_null=True)
    archived = serializers.SerializerMethodField()
    blocked = serializers.SerializerMethodField()
    def get_customer_name(self, obj):
        return obj.customer.get_full_name() or obj.customer.username
    def get_provider_name(self, obj):
        return obj.provider.get_full_name() or obj.provider.username
    def get_title(self, obj):
        return 'Support' if obj.is_support else obj.booking.details.get('title', obj.booking.kind) if obj.booking_id else 'Community chat'
    def get_archived(self, obj):
        return obj.customer_archived if obj.customer_id == self.context['request'].user.pk else obj.provider_archived
    def get_blocked(self, obj):
        user = self.context['request'].user
        other = obj.provider_id if obj.customer_id == user.pk else obj.customer_id
        return ChatBlock.objects.filter(user=user, blocked_id=other).exists()
    class Meta:
        model = Conversation
        fields = ['id', 'booking', 'customer', 'provider', 'created_at', 'customer_name', 'provider_name', 'booking_reference', 'title', 'unread', 'unread_count', 'last_message', 'last_message_at', 'archived', 'blocked', 'is_support']
        read_only_fields = fields


class MessageSerializer(serializers.ModelSerializer):
    has_image = serializers.SerializerMethodField()
    def get_has_image(self, obj):
        return bool(obj.image_type)
    class Meta:
        model = Message
        fields = ['id', 'sender', 'body', 'created_at', 'read_at', 'client_id', 'has_image']
        read_only_fields = fields


class ConversationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ConversationSerializer
    throttle_classes = [ChatThrottle]
    def get_queryset(self):
        messages = Message.objects.filter(conversation_id=OuterRef('pk'))
        return Conversation.objects.filter(Q(customer=self.request.user) | Q(provider=self.request.user)).select_related('customer', 'provider', 'booking').annotate(
            unread=Exists(messages.exclude(sender=self.request.user).filter(read_at__isnull=True)),
            unread_count=Count('messages', filter=~Q(messages__sender=self.request.user) & Q(messages__read_at__isnull=True)),
            last_message=Subquery(messages.order_by('-created_at', '-id').values('body')[:1]),
            last_message_at=Subquery(messages.order_by('-created_at', '-id').values('created_at')[:1]),
        ).order_by('-last_message_at', '-created_at', 'id')

    def other(self, conversation):
        return conversation.provider if conversation.customer_id == self.request.user.pk else conversation.customer

    def can_send(self, conversation):
        other = self.other(conversation)
        if not other.is_active:
            raise PermissionDenied('This account cannot receive messages.')
        if ChatBlock.objects.filter(Q(user=self.request.user, blocked=other) | Q(user=other, blocked=self.request.user)).exists():
            raise PermissionDenied('Messaging is unavailable for this conversation.')

    @transaction.atomic
    def create(self, request):
        user = request.user
        get_user_model().objects.select_for_update().get(pk=user.pk)
        if request.data.get('booking'):
            booking_id = serializers.UUIDField().run_validation(request.data['booking'])
            booking = get_object_or_404(Booking.objects.filter(Q(user=user) | Q(supplier=user)), pk=booking_id)
            if not booking.supplier_id:
                raise serializers.ValidationError('No provider is available.')
            conversation, _ = Conversation.objects.get_or_create(booking=booking, defaults={'customer': booking.user, 'provider': booking.supplier})
        elif request.data.get('support') is True:
            candidates = get_user_model().objects.filter(is_active=True, is_staff=True, email_verified=True).exclude(pk=user.pk).order_by('pk')
            provider = next((staff for staff in candidates if staff.has_perm('messaging.reply_support')), None)
            if not provider:
                raise Conflict('Support is currently unavailable. Please use the contact page.')
            conversation, _ = Conversation.objects.get_or_create(direct_key=f'support:{user.pk}', defaults={'customer': user, 'provider': provider, 'is_support': True})
        else:
            other_id = serializers.IntegerField(min_value=1).run_validation(request.data.get('recipient'))
            other = get_object_or_404(get_user_model(), pk=other_id, is_active=True, email_verified=True,
                                      community_profile__listed=True, community_profile__allow_messages=True)
            if other.pk == user.pk:
                raise serializers.ValidationError('Choose another member.')
            key = 'direct:' + ':'.join(str(pk) for pk in sorted([user.pk, other.pk]))
            conversation, _ = Conversation.objects.get_or_create(direct_key=key, defaults={'customer': user, 'provider': other})
        self.can_send(conversation)
        return Response(self.get_serializer(conversation).data, status=201)

    @action(detail=True, methods=['get', 'post'])
    def messages(self, request, pk=None):
        conversation = self.get_object()
        if request.method == 'POST':
            self.can_send(conversation)
            body = serializers.CharField(max_length=4000, allow_blank=True).run_validation(request.data.get('body', ''))
            client_id = serializers.UUIDField(required=False, allow_null=True).run_validation(request.data.get('client_id'))
            picture = request.FILES.get('image')
            if not body and not picture:
                raise serializers.ValidationError('Write a message or attach a photo.')
            image_data = None
            if picture:
                validate_image(picture)
                from PIL import Image, ImageOps
                image = ImageOps.exif_transpose(Image.open(picture)).convert('RGB')
                image.thumbnail((1600, 1600))
                output = BytesIO()
                image.save(output, format='JPEG', quality=82)
                image_data = output.getvalue()
                if len(image_data) > 2*1024*1024:
                    raise serializers.ValidationError('Choose a smaller photo.')
            with transaction.atomic():
                Conversation.objects.select_for_update().get(pk=conversation.pk)
                existing = Message.objects.filter(conversation=conversation, sender=request.user, client_id=client_id).first() if client_id else None
                if existing:
                    if existing.body != body or bytes(existing.image_data or b'') != (image_data or b''):
                        raise Conflict('This message key was already used.')
                    return Response(MessageSerializer(existing).data)
                message = Message.objects.create(conversation=conversation, sender=request.user, body=body, client_id=client_id, image_data=image_data, image_type='image/jpeg' if image_data else '')
                Conversation.objects.filter(pk=conversation.pk).update(customer_archived=False, provider_archived=False)
                # No private text in email or push; only authenticated participants can fetch photos.
                from apps.notifications.models import Notification
                from apps.notifications.push import queue_push
                recipient = self.other(conversation)
                notification = Notification.objects.create(user=recipient, email=recipient.email,
                    key=f'message:{conversation.pk}:{message.pk}', subject='New message', body='Open Mmemme Abia to read your new message.', sent_at=timezone.now())
                queue_push(notification)
            return Response(MessageSerializer(message).data, status=201)
        qs = conversation.messages.defer('image_data').order_by('-id')
        if request.query_params.get('before'):
            qs = qs.filter(pk__lt=serializers.IntegerField(min_value=1).run_validation(request.query_params['before']))
        return self.get_paginated_response(MessageSerializer(self.paginate_queryset(qs), many=True).data)

    @action(detail=True, methods=['get'], url_path=r'images/(?P<message_id>[0-9]+)')
    def image(self, request, pk=None, message_id=None):
        message = get_object_or_404(self.get_object().messages, pk=message_id)
        if not message.image_data:
            return Response(status=404)
        response = HttpResponse(bytes(message.image_data), content_type=message.image_type)
        response['Cache-Control'] = 'private, no-store'
        response['X-Content-Type-Options'] = 'nosniff'
        return response

    @action(detail=True, methods=['post'])
    def read(self, request, pk=None):
        qs = self.get_object().messages.exclude(sender=request.user).filter(read_at__isnull=True)
        if 'through' in request.data:
            qs = qs.filter(pk__lte=serializers.IntegerField(min_value=1).run_validation(request.data['through']))
        from apps.notifications.models import Notification
        ids = list(qs.values_list('pk', flat=True))
        qs.filter(pk__in=ids).update(read_at=timezone.now())
        for start in range(0, len(ids), 100):
            Notification.objects.filter(user=request.user, key__in=[f'message:{pk}:{i}' for i in ids[start:start+100]]).update(is_read=True)
        return Response({'read': True})

    @action(detail=True, methods=['get', 'post'])
    def typing(self, request, pk=None):
        conversation = self.get_object()
        self.can_send(conversation)
        if request.method == 'POST':
            cache.set(f'typing:{pk}:{request.user.pk}', True, 5)
        return Response({'typing': bool(cache.get(f'typing:{pk}:{self.other(conversation).pk}'))})

    @action(detail=True, methods=['post'])
    def archive(self, request, pk=None):
        conversation = self.get_object()
        enabled = serializers.BooleanField().run_validation(request.data.get('archived'))
        field = 'customer_archived' if conversation.customer_id == request.user.pk else 'provider_archived'
        Conversation.objects.filter(pk=conversation.pk).update(**{field: enabled})
        return Response({'archived': enabled})

    @action(detail=True, methods=['post'])
    def block(self, request, pk=None):
        conversation = self.get_object()
        enabled = serializers.BooleanField().run_validation(request.data.get('blocked'))
        if enabled:
            ChatBlock.objects.get_or_create(user=request.user, blocked=self.other(conversation))
        else:
            ChatBlock.objects.filter(user=request.user, blocked=self.other(conversation)).delete()
        return Response({'blocked': enabled})
