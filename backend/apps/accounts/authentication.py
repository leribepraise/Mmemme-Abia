from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication


class VerifiedEmailAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user = super().get_user(validated_token)
        if validated_token.get('session_version', 0) != user.session_version:
            raise AuthenticationFailed('This session has been revoked. Please log in again.')
        if not user.email_verified:
            raise AuthenticationFailed("Verify your email with a code before logging in.", code="email_not_verified")
        return user
