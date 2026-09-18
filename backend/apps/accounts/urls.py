from django.urls import path
from .views import (
    CSRFView,RegisterView,LoginView,RefreshView,LogoutView,MeView,
    VerifyEmailView,ResendVerificationView,PasswordResetView,
    PasswordResetConfirmView,PasswordChangeView,OrganizerApplicationView,
)
urlpatterns = [
    path("csrf/",CSRFView.as_view()),
    path("register/",RegisterView.as_view(),name="register"),
    path("login/",LoginView.as_view(),name="login"),
    path("refresh/",RefreshView.as_view(),name="token_refresh"),
    path("logout/",LogoutView.as_view(),name="logout"),
    path("me/",MeView.as_view(),name="me"),
    path("verify-email/",VerifyEmailView.as_view()),
    path("resend-verification/",ResendVerificationView.as_view()),
    path("password-reset/",PasswordResetView.as_view()),
    path("password-reset/confirm/",PasswordResetConfirmView.as_view()),
    path("password-change/",PasswordChangeView.as_view()),
    path("organizer-application/",OrganizerApplicationView.as_view()),
]
