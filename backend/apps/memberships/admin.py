from django.contrib import admin
from .models import Plan, Membership, PlanPayment

@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'price', 'is_active']
    readonly_fields = ['code']
    def has_add_permission(self, request):
        return False

@admin.register(Membership, PlanPayment)
class MembershipHistoryAdmin(admin.ModelAdmin):
    def get_readonly_fields(self, request, obj=None):
        return [field.name for field in self.model._meta.fields]
    def has_add_permission(self, request):
        return False
    def has_delete_permission(self, request, obj=None):
        return False
