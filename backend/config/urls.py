from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from apps.events.views import EventViewSet
from apps.events.community import SavedEventsView, ReviewViewSet
from apps.bookings.views import BookingViewSet
from apps.payments.api import PaymentViewSet, WebhookView
from apps.payments.payout_api import PayoutViewSet, PayoutAccountViewSet
from apps.tickets.api import TicketViewSet
from apps.notifications.api import NotificationViewSet
from apps.messaging.api import ConversationViewSet
from apps.common.catalog import CONFIG, viewset_for
from apps.common.views import live, ready

router=DefaultRouter()
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
    path("admin/",admin.site.urls),
    path("health/live/",live),
    path("health/ready/",ready),
    path("api/v1/auth/",include("apps.accounts.urls")),
    path("api/v1/saved-events/",SavedEventsView.as_view()),
    path("api/v1/payments/webhook/paystack/",WebhookView.as_view()),
    path("api/v1/",include(router.urls)),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
