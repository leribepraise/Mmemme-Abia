from django.contrib import admin

from .models import TourismOperator, TourismStaff, TourismExperience, TourPackage, TourDeparture, TourismImage, TourismRequest

class TourismReadOnlyAdmin(admin.ModelAdmin):
    def has_add_permission(self, request): return False
    def has_delete_permission(self, request, obj=None): return False
    def has_change_permission(self, request, obj=None): return False

for model in [TourismOperator, TourismStaff, TourismExperience, TourPackage, TourDeparture, TourismImage, TourismRequest]:
    admin.site.register(model, TourismReadOnlyAdmin)
