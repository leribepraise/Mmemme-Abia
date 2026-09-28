import uuid
from django.conf import settings
from django.db import models

class Conversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="customer_conversations")
    provider = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="provider_conversations")
    booking = models.OneToOneField("bookings.Booking", on_delete=models.PROTECT, null=True, blank=True)
    direct_key = models.CharField(max_length=100, null=True, blank=True, unique=True)
    is_support = models.BooleanField(default=False)
    customer_archived = models.BooleanField(default=False)
    provider_archived = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        permissions = [('reply_support', 'Receive and reply to support conversations')]

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    body = models.CharField(max_length=4000)
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    client_id = models.UUIDField(null=True, blank=True)
    image_data = models.BinaryField(null=True, editable=False)
    image_type = models.CharField(max_length=30, blank=True)
    class Meta:
        ordering = ["created_at", "id"]
        constraints = [models.UniqueConstraint(fields=['conversation', 'sender', 'client_id'], name='message_send_once')]


class ChatBlock(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chat_blocks')
    blocked = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='blocked_by')
    class Meta:
        constraints = [models.UniqueConstraint(fields=['user', 'blocked'], name='chat_block_once')]
