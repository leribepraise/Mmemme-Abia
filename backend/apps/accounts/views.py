from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.db import transaction
from django.utils import timezone
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from rest_framework import generics, permissions, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.throttling import ScopedRateThrottle
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from rest_framework_simplejwt.utils import get_md5_hash_password
from apps.common.models import audit
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, OrganizerSerializer, EmailCodeRequestSerializer, EmailCodeVerifySerializer
from .email_codes import request_email_code, complete_email_code
from .models import OrganizerProfile
from .services import send_reset, revoke_tokens

User = get_user_model()

def set_refresh(response,token):
    response.set_cookie(settings.REFRESH_COOKIE_NAME,str(token),max_age=7*24*3600,httponly=True,secure=settings.REFRESH_COOKIE_SECURE,samesite=settings.REFRESH_COOKIE_SAMESITE,path="/api/v1/auth/")
    return response

class PublicAuthView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth"
    def get_authenticate_header(self,request): return "Bearer"

class CSRFView(PublicAuthView):
    throttle_scope = "session"
    def get(self,request):
        return Response({"csrf_token":get_token(request)})

@method_decorator(csrf_protect,name="dispatch")
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth"

@method_decorator(csrf_protect,name="dispatch")
class LoginView(PublicAuthView):
    def post(self,request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        User.objects.filter(pk=user.pk).update(last_login=timezone.now())
        refresh = RefreshToken.for_user(user)
        refresh['session_version'] = user.session_version
        audit(user,"account.login",user.pk)
        return set_refresh(Response({"access":str(refresh.access_token),"user":UserSerializer(user).data,"csrf_token":get_token(request)}),refresh)

@method_decorator(csrf_protect,name="dispatch")
class RefreshView(PublicAuthView):
    throttle_scope = "session"
    @transaction.atomic
    def post(self,request):
        token = request.COOKIES.get(settings.REFRESH_COOKIE_NAME)
        if not token: raise InvalidToken("No refresh session.")
        try:
            parsed=RefreshToken(token)
            # Serialize refreshes with password changes, then with token consumption.
            user=User.objects.select_for_update(no_key=True).get(pk=parsed["user_id"],is_active=True)
            if not user.email_verified:
                raise InvalidToken("Verify your email before continuing.")
            if parsed.get('session_version', 0) != user.session_version:
                raise InvalidToken('This refresh session has been revoked.')
            outstanding=OutstandingToken.objects.select_for_update().get(jti=parsed["jti"],user=user)
            if BlacklistedToken.objects.filter(token=outstanding).exists() or parsed.get("hash_password")!=get_md5_hash_password(user.password):
                raise InvalidToken("This refresh session has been revoked.")
            serializer = TokenRefreshSerializer(data={"refresh":token})
            serializer.is_valid(raise_exception=True)
        except (TokenError,User.DoesNotExist,OutstandingToken.DoesNotExist,KeyError) as exc:
            raise InvalidToken() from exc
        return set_refresh(Response({"access":serializer.validated_data["access"]}),serializer.validated_data["refresh"])

@method_decorator(csrf_protect,name="dispatch")
class LogoutView(PublicAuthView):
    throttle_scope = "session"
    def post(self,request):
        token = request.COOKIES.get(settings.REFRESH_COOKIE_NAME)
        if token:
            try: RefreshToken(token).blacklist()
            except TokenError: pass
        response = Response({"detail":"Logged out."})
        response.delete_cookie(settings.REFRESH_COOKIE_NAME,path="/api/v1/auth/",samesite=settings.REFRESH_COOKIE_SAMESITE)
        return response

class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    http_method_names = ["get","patch","head","options"]
    def get_object(self): return self.request.user

class CompleteOnboardingView(APIView):
    @transaction.atomic
    def post(self, request):
        user = User.objects.select_for_update().get(pk=request.user.pk)
        missing = {field: 'Complete this field before continuing.' for field in ['phone', 'lga', 'address', 'gender'] if not getattr(user, field).strip()}
        if missing:
            raise serializers.ValidationError(missing)
        if not user.onboarding_completed_at:
            user.onboarding_completed_at = timezone.now()
            user.save(update_fields=['onboarding_completed_at', 'updated_at'])
            audit(user, 'account.onboarded', user.pk)
        return Response(UserSerializer(user).data)

@method_decorator(csrf_protect,name="dispatch")
class VerifyEmailView(PublicAuthView):
    def post(self,request):
        serializer = EmailCodeVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        complete_email_code(serializer.validated_data["email"], serializer.validated_data["otp_code"])
        return Response({"detail":"Email verified. You can now log in."})

@method_decorator(csrf_protect,name="dispatch")
class ResendVerificationView(PublicAuthView):
    def post(self,request):
        serializer = EmailCodeRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        if User.objects.filter(email__iexact=email,email_verified=True).exists():
            raise serializers.ValidationError("This email is already verified. Please log in.")
        request_email_code(email)
        return Response({"detail":"Verification code queued. Check your email.", "expires_in":600, "resend_after":60}, status=202)

class PasswordResetView(PublicAuthView):
    def post(self,request):
        email = serializers.EmailField().run_validation(request.data.get("email"))
        user = User.objects.filter(email__iexact=email,is_active=True).first()
        if user: send_reset(user)
        return Response({"detail":"If this account exists, a password reset email will be sent."})

class PasswordResetConfirmView(PublicAuthView):
    @transaction.atomic
    def post(self,request):
        try: user = User.objects.select_for_update().get(pk=int(request.data.get("user",0)),is_active=True)
        except (ValueError,TypeError,User.DoesNotExist): raise serializers.ValidationError("Invalid reset link.")
        if not default_token_generator.check_token(user,request.data.get("token","")):
            raise serializers.ValidationError("This reset link is invalid or expired.")
        password = serializers.CharField(max_length=128,trim_whitespace=False).run_validation(request.data.get("password"))
        validate_password(password,user)
        user.set_password(password)
        user.save(update_fields=["password"])
        revoke_tokens(user)
        audit(user,"account.password_reset",user.pk)
        return Response({"detail":"Password reset. Please log in."})

class PasswordChangeView(APIView):
    @transaction.atomic
    def post(self,request):
        user = User.objects.select_for_update().get(pk=request.user.pk)
        if not user.check_password(request.data.get("current_password","")):
            raise serializers.ValidationError("Current password is incorrect.")
        password = serializers.CharField(max_length=128,trim_whitespace=False).run_validation(request.data.get("password"))
        validate_password(password,user)
        user.set_password(password)
        user.save(update_fields=["password"])
        revoke_tokens(user)
        audit(user,"account.password_changed",user.pk)
        return Response({"detail":"Password changed. Please log in again."})

class OrganizerApplicationView(APIView):
    def get(self,request):
        profile = OrganizerProfile.objects.filter(user=request.user).first()
        if not profile:
            return Response(status=204)
        return Response(OrganizerSerializer(profile).data)
    @transaction.atomic
    def post(self,request):
        if not request.user.email_verified:
            raise serializers.ValidationError("Verify your email before applying.")
        User.objects.select_for_update().get(pk=request.user.pk)
        profile = OrganizerProfile.objects.filter(user=request.user).first()
        if profile and profile.status == "APPROVED":
            raise serializers.ValidationError("Your organizer account is already approved.")
        if profile and profile.status == 'PENDING':
            raise serializers.ValidationError('Your application is already awaiting review.')
        serializer = OrganizerSerializer(profile,data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data.pop('accept_terms')
        serializer.save(user=request.user,status="PENDING",review_note='',reviewed_by=None,reviewed_at=None,
                        terms_accepted_at=timezone.now(), terms_version='2026-09')
        audit(request.user,"organizer.applied",request.user.pk)
        return Response(serializer.data,status=201)
