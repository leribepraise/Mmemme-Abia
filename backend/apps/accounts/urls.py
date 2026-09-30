from django.urls import path
from .views import (
    CSRFView,RegisterView,LoginView,LoginActivityView,RefreshView,LogoutView,MeView,
    VerifyEmailView,ResendVerificationView,PasswordResetView,
    PasswordResetConfirmView,PasswordChangeView,OrganizerApplicationView,OrganizerProfileView,CompleteOnboardingView,
)
from .social_views import SocialConfigView, SocialStartView, SocialCallbackView, SocialPendingView, SocialVerifyView, SocialResendView, SocialPasswordView
urlpatterns = [
    path('social/config/', SocialConfigView.as_view()),
    path('social/pending/', SocialPendingView.as_view()),
    path('social/verify/', SocialVerifyView.as_view()),
    path('social/resend/', SocialResendView.as_view()),
    path('social/password/', SocialPasswordView.as_view()),
    path('social/<slug:provider>/start/', SocialStartView.as_view()),
    path('social/<slug:provider>/callback/', SocialCallbackView.as_view()),
    path("csrf/",CSRFView.as_view()),
    path("register/",RegisterView.as_view(),name="register"),
    path("login/",LoginView.as_view(),name="login"),
    path("login-activity/",LoginActivityView.as_view(),name="login_activity"),
    path("refresh/",RefreshView.as_view(),name="token_refresh"),
    path("logout/",LogoutView.as_view(),name="logout"),
    path("me/",MeView.as_view(),name="me"),
    path("onboarding/complete/",CompleteOnboardingView.as_view()),
    path("verify-email/",VerifyEmailView.as_view()),
    path("resend-verification/",ResendVerificationView.as_view()),
    path("password-reset/",PasswordResetView.as_view()),
    path("password-reset/confirm/",PasswordResetConfirmView.as_view()),
    path("password-change/",PasswordChangeView.as_view()),
    path("organizer-application/",OrganizerApplicationView.as_view()),
    path("organizer-profile/",OrganizerProfileView.as_view()),
]
