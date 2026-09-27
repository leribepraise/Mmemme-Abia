from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import OrganizerProfile

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    interests = serializers.ListField(child=serializers.CharField(max_length=100),max_length=20,required=False)
    class Meta:
        model = User
        fields = ["id","email","first_name","last_name","phone","whatsapp","lga","address","date_of_birth","gender","bio","avatar","role","is_verified","email_verified","is_staff","interests","email_notifications"]
        read_only_fields = ["id","email","role","is_verified","email_verified","is_staff"]

    def validate_avatar(self, value):
        from apps.common.api import validate_image
        return validate_image(value) if value else value

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True,trim_whitespace=False,max_length=128)
    otp_code = serializers.RegexField(r"^[0-9]{6}$", write_only=True, trim_whitespace=True, max_length=6)
    class Meta:
        model = User
        fields = ["id","email","first_name","last_name","phone","password","otp_code","date_of_birth"]
        read_only_fields = ["id"]
    def validate_email(self,value):
        value = value.strip().lower()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account already uses this email.")
        return value
    def validate(self,attrs):
        candidate = User(**{k:v for k,v in attrs.items() if k not in {"password", "otp_code"}})
        validate_password(attrs["password"],candidate)
        return attrs
    def create(self,validated_data):
        from .email_codes import complete_email_code
        code = validated_data.pop("otp_code")
        return complete_email_code(validated_data["email"], code, registration=validated_data)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True,trim_whitespace=False,max_length=128)
    def validate(self,attrs):
        user = User.objects.filter(email__iexact=attrs["email"].strip()).first()
        if user is None:
            make_password(attrs["password"])
        if not user or not user.check_password(attrs["password"]) or not user.is_active:
            raise serializers.ValidationError("Invalid email or password.")
        if not user.email_verified:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied({"detail": "Verify your email with a code before logging in.", "code": "email_not_verified"})
        return {"user":user}

class EmailCodeRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=254)

    def validate_email(self, value):
        return value.strip().lower()

class EmailCodeVerifySerializer(EmailCodeRequestSerializer):
    otp_code = serializers.RegexField(r"^[0-9]{6}$", trim_whitespace=True, max_length=6)

class OrganizerSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizerProfile
        fields = ["business_name","description","contact_phone","verification_reference","status","reviewed_at"]
        read_only_fields = ["status","reviewed_at"]
