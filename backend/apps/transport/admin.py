from django.contrib import admin
from .models import TransportCompany, CompanyStaff, Terminal, Vehicle, Route, Departure, TransportRequest

# Use the dashboard's audited review and inventory operations for all writes.
class TransportReadOnlyAdmin(admin.ModelAdmin):
    def has_add_permission(self, request): return False
    def has_change_permission(self, request, obj=None): return False
    def has_delete_permission(self, request, obj=None): return False

for model in [TransportCompany, CompanyStaff, Terminal, Vehicle, Route, Departure, TransportRequest]:
    admin.site.register(model, TransportReadOnlyAdmin)
