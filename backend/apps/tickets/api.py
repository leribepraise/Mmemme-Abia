import io
from django.http import HttpResponse
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Ticket
from .services import check_in

class TicketSerializer(serializers.ModelSerializer):
    event = serializers.UUIDField(source='ticket_type.event_id', read_only=True)
    event_image = serializers.SerializerMethodField()
    def get_event_image(self, obj):
        event = obj.ticket_type.event
        picture = event.image_card or event.image
        url = picture.url if picture else event.image_url or None
        request = self.context.get('request')
        return request.build_absolute_uri(url) if request and url and url.startswith('/') else url
    class Meta:
        model=Ticket
        fields=["id","booking","booking_item","ticket_type","ticket_number","qr_code","status","checked_in_at","event","event_image"]
        read_only_fields=fields

class TicketViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class=TicketSerializer
    def get_queryset(self): return Ticket.objects.filter(owner=self.request.user).select_related('ticket_type__event').order_by("-created_at","id")
    @action(detail=True,methods=["get"])
    def qr(self,request,pk=None):
        import qrcode
        ticket=self.get_object()
        output=io.BytesIO()
        qrcode.make(ticket.qr_code).save(output,format="PNG")
        response=HttpResponse(output.getvalue(),content_type="image/png")
        response["Cache-Control"]="private, no-store"
        return response
    @action(detail=False,methods=["post"],url_path="check-in")
    def checkin(self,request):
        token=serializers.CharField(max_length=255).run_validation(request.data.get("token"))
        return Response(TicketSerializer(check_in(token,request.user)).data)
