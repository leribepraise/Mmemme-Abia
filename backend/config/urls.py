from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from apps.events.views import EventViewSet
from apps.events.admin_api import AdminEventViewSet
from apps.events.community import SavedEventsView, ReviewViewSet
from apps.bookings.views import BookingViewSet
from apps.payments.api import PaymentViewSet, WebhookView
from apps.payments.payout_api import PayoutViewSet, PayoutAccountViewSet
from apps.tickets.api import TicketViewSet
from apps.notifications.api import NotificationViewSet
from apps.notifications.push_api import PushConfigView, PushSubscriptionView
from apps.messaging.api import ConversationViewSet
from apps.memberships.api import PlanViewSet, MembershipViewSet
from apps.community.api import PostViewSet, GroupViewSet, PeopleViewSet
from apps.common.catalog import CONFIG, viewset_for
from apps.common.views import live, ready
from apps.common.management_api import ManageResource, ManageAction
from apps.common.reviews import ServiceReviewViewSet
from apps.accounts.admin_api import AdminUserViewSet, AdminOrganizerViewSet, AdminOverview

router=DefaultRouter()
router.register('service-reviews', ServiceReviewViewSet, basename='service-review')
router.register('plans', PlanViewSet, basename='plan')
router.register('memberships', MembershipViewSet, basename='membership')
router.register('community/posts', PostViewSet, basename='community-post')
router.register('community/groups', GroupViewSet, basename='community-group')
router.register('community/people', PeopleViewSet, basename='community-person')
router.register('admin/events', AdminEventViewSet, basename='admin-event')
router.register('admin/users', AdminUserViewSet, basename='admin-user')
router.register('admin/organizers', AdminOrganizerViewSet, basename='admin-organizer')
router.register("events",EventViewSet,basename="event")
router.register("bookings",BookingViewSet,basename="booking")
router.register("payments",PaymentViewSet,basename="payment")
router.register("payout-accounts",PayoutAccountViewSet,basename="payout-account")
router.register("payouts",PayoutViewSet,basename="payout")
router.register("tickets",TicketViewSet,basename="ticket")
router.register("reviews",ReviewViewSet,basename="review")
router.register("notifications",NotificationViewSet,basename="notification")
router.register("conversations",ConversationViewSet,basename="conversation")
for model,(prefix,*_) in CONFIG.items():
    router.register("hotels" if prefix=="hotel" else prefix,viewset_for(model),basename=model._meta.model_name)
urlpatterns=[
    path('api/v1/admin/manage/<slug:resource>/<str:pk>/action/', ManageAction.as_view()),
    path('api/v1/admin/manage/<slug:resource>/', ManageResource.as_view()),
    path('api/v1/admin/manage/<slug:resource>/<str:pk>/', ManageResource.as_view()),
    path('api/v1/push/config/', PushConfigView.as_view()),
    path('api/v1/push/subscription/', PushSubscriptionView.as_view()),
    path("admin/",admin.site.urls),
    path("health/live/",live),
    path("health/ready/",ready),
    path("api/v1/auth/",include("apps.accounts.urls")),
    path('api/v1/admin/overview/', AdminOverview.as_view()),
    path("api/v1/saved-events/",SavedEventsView.as_view()),
    path("api/v1/payments/webhook/paystack/",WebhookView.as_view()),
    path("api/v1/",include(router.urls)),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
