from django.utils import timezone
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Notification
from django.db.models import Q
from .routing import notification_destination

class NotificationSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    def get_url(self, obj): return notification_destination(obj)[0]
    def get_category(self, obj): return notification_destination(obj)[1]
    class Meta:
        model=Notification
        fields=["id","subject","body","is_read","created_at","url","category"]
        read_only_fields=fields

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class=NotificationSerializer
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user,is_private=False).filter(Q(expires_at__isnull=True)|Q(expires_at__gt=timezone.now()))
    @action(detail=True,methods=["post"])
    def read(self,request,pk=None):
        notification=self.get_object()
        notification.is_read=True;notification.save(update_fields=["is_read"])
        return Response(self.get_serializer(notification).data)

    @action(detail=False, methods=['post'], url_path='read-all')
    def read_all(self, request):
        count = self.get_queryset().filter(is_read=False).update(is_read=True)
        return Response({'updated': count})

    @action(detail=False, methods=['get'], url_path='unread-count')
    def unread_count(self, request):
        return Response({'count': self.get_queryset().filter(is_read=False).count()})
