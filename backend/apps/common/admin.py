from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.db import transaction
from django.utils import timezone
from apps.accounts.models import User,OrganizerProfile
from apps.common.models import AuditLog,audit
from apps.common.catalog import CONFIG
from apps.events.models import Event,TicketType,SavedEvent,EventReview
from apps.bookings.models import Booking,BookingItem
from apps.payments.models import Payment,PaymentEvent,Refund,LedgerEntry,PayoutAccount,Payout,PayoutItem,PayoutAttempt
from apps.tickets.models import Ticket
from apps.notifications.models import Notification
from apps.messaging.models import Conversation,Message

class ReadOnlyAdmin(admin.ModelAdmin):
    list_per_page=50
    def has_add_permission(self,request): return False
    def has_delete_permission(self,request,obj=None): return False
    def get_readonly_fields(self,request,obj=None):
        return [f.name for f in self.model._meta.fields]
    def has_change_permission(self,request,obj=None): return False

@admin.register(User)
class AccountAdmin(UserAdmin):
    fieldsets=UserAdmin.fieldsets+(("Mmemme Abia",{"fields":("phone","role","is_verified","email_verified")}),)
    readonly_fields=("role","is_verified","email_verified")
    list_display=("email","role","is_active","is_verified","email_verified")
    def has_change_permission(self,request,obj=None): return request.user.is_superuser
    def has_add_permission(self,request): return request.user.is_superuser
    def has_delete_permission(self,request,obj=None): return False

@admin.register(OrganizerProfile)
class OrganizerAdmin(admin.ModelAdmin):
    list_display=("business_name","user","status","reviewed_at")
    readonly_fields=("user","business_name","description","contact_phone","verification_reference","status","reviewed_by","reviewed_at","created_at")
    actions=["approve","reject"]
    def has_add_permission(self,request): return False
    def has_delete_permission(self,request,obj=None): return False
    @admin.action(description="Approve selected organizer applications",permissions=["change"])
    def approve(self,request,queryset): self.review(request,queryset,"APPROVED")
    @admin.action(description="Reject selected organizer applications",permissions=["change"])
    def reject(self,request,queryset): self.review(request,queryset,"REJECTED")
    def review(self,request,queryset,status):
        for pk in queryset.values_list("pk",flat=True):
            with transaction.atomic():
                original=OrganizerProfile.objects.get(pk=pk)
                user=User.objects.select_for_update().get(pk=original.user_id)
                profile=OrganizerProfile.objects.select_for_update().get(pk=pk)
                if profile.status!="PENDING": continue
                if status=="APPROVED" and not user.email_verified: continue
                profile.status=status;profile.reviewed_by=request.user;profile.reviewed_at=timezone.now()
                profile.save(update_fields=["status","reviewed_by","reviewed_at"])
                if status=="APPROVED":
                    user.role="ORGANIZER";user.is_verified=True;user.save(update_fields=["role","is_verified"])
                audit(request.user,"organizer."+status.lower(),user.pk)
                from apps.notifications.services import notify
                notify(user,f"organizer:{profile.pk}:{profile.reviewed_at}","Organizer application update",f"Your organizer application is {status.lower()}.")

@admin.register(EventReview)
class ReviewAdmin(admin.ModelAdmin):
    list_display=("event","user","rating","is_approved")
    readonly_fields=("event","user","rating","comment","created_at")
    def has_add_permission(self,request): return False

for model in [AuditLog,Event,TicketType,SavedEvent,Booking,BookingItem,Payment,PaymentEvent,Refund,LedgerEntry,PayoutAccount,Payout,PayoutItem,PayoutAttempt,Ticket,Notification,Conversation,Message,*CONFIG]:
    if not admin.site.is_registered(model): admin.site.register(model,ReadOnlyAdmin)
admin.site.site_header="Mmemme Abia administration"
