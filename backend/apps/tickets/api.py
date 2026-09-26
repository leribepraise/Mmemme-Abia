import io
from django.http import HttpResponse
from rest_framework import serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Ticket
from .services import check_in

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model=Ticket
        fields=["id","booking","booking_item","ticket_type","ticket_number","qr_code","status","checked_in_at"]
        read_only_fields=fields

class TicketViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class=TicketSerializer
    def get_queryset(self): return Ticket.objects.filter(owner=self.request.user).order_by("-created_at","id")
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
