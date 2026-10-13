from django.contrib import admin

from .models import HotelProvider, HotelStaff, Hotel, RoomType, RoomNight, RoomUnit, RoomAssignment, HotelImage, HotelRequest
class HotelReadOnlyAdmin(admin.ModelAdmin):
    def has_add_permission(self,request): return False
    def has_delete_permission(self,request,obj=None): return False
    def has_change_permission(self,request,obj=None): return False
for model in [HotelProvider,HotelStaff,Hotel,RoomType,RoomNight,RoomUnit,RoomAssignment,HotelImage,HotelRequest]:
    admin.site.register(model,HotelReadOnlyAdmin)
