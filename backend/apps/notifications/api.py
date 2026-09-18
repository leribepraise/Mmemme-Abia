from django.utils import timezone
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model=Notification
        fields=["id","subject","body","is_read","created_at"]
        read_only_fields=fields

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class=NotificationSerializer
    def get_queryset(self): return Notification.objects.filter(user=self.request.user,is_private=False)
    @action(detail=True,methods=["post"])
    def read(self,request,pk=None):
        notification=self.get_object()
        notification.is_read=True;notification.save(update_fields=["is_read"])
        return Response(self.get_serializer(notification).data)
