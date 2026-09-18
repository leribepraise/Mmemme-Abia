import uuid
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from django.db import IntegrityError, transaction
from rest_framework import serializers
from .models import OrganizerProfile

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    interests = serializers.ListField(child=serializers.CharField(max_length=100),max_length=20,required=False)
    class Meta:
        model = User
        fields = ["id","email","first_name","last_name","phone","role","is_verified","email_verified","is_staff","interests","email_notifications"]
        read_only_fields = ["id","email","role","is_verified","email_verified","is_staff"]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True,trim_whitespace=False,max_length=128)
    class Meta:
        model = User
        fields = ["id","email","first_name","last_name","phone","password"]
        read_only_fields = ["id"]
    def validate_email(self,value):
        value = value.strip().lower()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account already uses this email.")
        return value
    def validate(self,attrs):
        candidate = User(**{k:v for k,v in attrs.items() if k != "password"})
        validate_password(attrs["password"],candidate)
        return attrs
    def create(self,validated_data):
        from .services import send_verification
        password = validated_data.pop("password")
        try:
            with transaction.atomic():
                user = User(username="u_"+uuid.uuid4().hex,**validated_data)
                user.set_password(password)
                user.save()
                send_verification(user)
                return user
        except IntegrityError:
            raise serializers.ValidationError("An account already uses this email.")

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True,trim_whitespace=False,max_length=128)
    def validate(self,attrs):
        user = User.objects.filter(email__iexact=attrs["email"].strip()).first()
        if user is None:
            make_password(attrs["password"])
        if not user or not user.check_password(attrs["password"]) or not user.is_active:
            raise serializers.ValidationError("Invalid email or password.")
        return {"user":user}

class OrganizerSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizerProfile
        fields = ["business_name","description","contact_phone","verification_reference","status","reviewed_at"]
        read_only_fields = ["status","reviewed_at"]
