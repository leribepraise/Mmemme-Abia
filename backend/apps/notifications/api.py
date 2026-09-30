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
        return Notification.objects.filter(user=self.request.user,is_private=False,deleted_at__isnull=True).filter(Q(expires_at__isnull=True)|Q(expires_at__gt=timezone.now()))
    def destroy(self, request, *args, **kwargs):
        notification = self.get_object()
        notification.deleted_at = timezone.now()
        notification.save(update_fields=['deleted_at'])
        return Response(status=204)
    @action(detail=False, methods=['get'])
    def live(self, request):
        since = request.query_params.get('after')
        if since is not None and (not since.isdecimal() or len(since) > 20):
            raise serializers.ValidationError({'after': 'Use a notification ID.'})
        notices = self.get_queryset()
        updates = list(notices.filter(pk__gt=int(since)).order_by('pk')[:10]) if since is not None else []
        latest_id = notices.order_by('-pk').values_list('pk', flat=True).first() or 0
        return Response({'unread_count': notices.filter(is_read=False).count(), 'latest_id': latest_id,
                         'updates': self.get_serializer(updates, many=True).data,
                         'has_more': bool(updates and updates[-1].pk < latest_id)})
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
