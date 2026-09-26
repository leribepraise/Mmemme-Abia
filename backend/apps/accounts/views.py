from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core import signing
from django.db import transaction
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
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, OrganizerSerializer
from .models import OrganizerProfile
from .services import send_verification, send_reset, revoke_tokens

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
        refresh = RefreshToken.for_user(user)
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

class VerifyEmailView(PublicAuthView):
    def post(self,request):
        try:
            data = signing.loads(request.data.get("token",""),salt="verify-email",max_age=86400)
            user = User.objects.get(pk=data["user"],email=data["email"],is_active=True)
        except (signing.BadSignature,KeyError,TypeError,ValueError,User.DoesNotExist):
            raise serializers.ValidationError("This verification link is invalid or expired.")
        User.objects.filter(pk=user.pk).update(email_verified=True)
        return Response({"detail":"Email verified."})

class ResendVerificationView(APIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "auth"
    def post(self,request):
        if not request.user.email_verified: send_verification(request.user)
        return Response({"detail":"Verification email requested."})

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
        return Response(OrganizerSerializer(profile).data if profile else None)
    @transaction.atomic
    def post(self,request):
        if not request.user.email_verified:
            raise serializers.ValidationError("Verify your email before applying.")
        User.objects.select_for_update().get(pk=request.user.pk)
        profile = OrganizerProfile.objects.filter(user=request.user).first()
        if profile and profile.status == "APPROVED":
            raise serializers.ValidationError("Your organizer account is already approved.")
        serializer = OrganizerSerializer(profile,data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user,status="PENDING")
        audit(request.user,"organizer.applied",request.user.pk)
        return Response(serializer.data,status=201)
