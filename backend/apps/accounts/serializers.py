from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import OrganizerProfile

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    plan = serializers.SerializerMethodField()
    def get_plan(self, obj):
        from apps.memberships.services import current_membership
        return current_membership(obj)['plan']
    organizer_status = serializers.CharField(source='organizer_profile.status', read_only=True, default=None)
    interests = serializers.ListField(child=serializers.CharField(max_length=100),max_length=20,required=False)
    class Meta:
        model = User
        fields = ["id","email","first_name","last_name","phone","whatsapp","lga","address","date_of_birth","gender","bio","avatar","role","is_verified","email_verified","is_staff","interests","email_notifications","onboarding_completed_at","date_joined","organizer_status","plan"]
        read_only_fields = ["id","email","role","is_verified","email_verified","is_staff","onboarding_completed_at","date_joined","organizer_status"]

    def validate_avatar(self, value):
        from apps.common.api import validate_image
        return validate_image(value) if value else value

    def validate_phone(self, value):
        import re
        if value and not re.fullmatch(r'\+?[0-9 ()-]{10,20}', value):
            raise serializers.ValidationError('Enter a valid phone number.')
        return value

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True,trim_whitespace=False,max_length=128)
    otp_code = serializers.RegexField(r"^[0-9]{6}$", write_only=True, trim_whitespace=True, max_length=6)
    class Meta:
        model = User
        fields = ["id","email","username","first_name","last_name","phone","password","otp_code","date_of_birth"]
        read_only_fields = ["id"]
        extra_kwargs = {'username': {'required': False}}
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
    accept_terms = serializers.BooleanField(write_only=True, required=True)
    class Meta:
        model = OrganizerProfile
        fields = ["business_name","description","contact_phone","verification_reference","event_type","coverage_region","accept_terms","terms_accepted_at","status","reviewed_at","review_note"]
        read_only_fields = ["status","reviewed_at","review_note","terms_accepted_at"]

    def validate_accept_terms(self, value):
        if not value:
            raise serializers.ValidationError('Accept the organizer terms before applying.')
        return value

    def validate_contact_phone(self, value):
        import re
        if not re.fullmatch(r'\+?[0-9 ()-]{10,20}', value):
            raise serializers.ValidationError('Enter a valid contact phone number.')
        return value

    def validate(self, attrs):
        for name in ['event_type', 'coverage_region']:
            if not attrs.get(name, '').strip():
                raise serializers.ValidationError({name: 'This field is required.'})
        return attrs
