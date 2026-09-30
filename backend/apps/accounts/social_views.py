import json
import secrets
from urllib.parse import urlencode

from django.conf import settings
from django.contrib.auth.password_validation import validate_password
from django.core.cache import cache
from django.core.exceptions import ValidationError as DjangoValidationError
from django.http import HttpResponseRedirect
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from rest_framework import serializers
from rest_framework.exceptions import Throttled
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from apps.common.models import audit
from .models import User
from .models import EmailVerificationCode
from .email_codes import complete_email_code, request_email_code
from .social_auth import (SocialAuthError, authorization, configured, consume_state,
                          exchange_code, resolve_user, state_cookie, verified_claims)
from .views import PublicAuthView, set_refresh


PENDING_COOKIE = 'mmemme_social_pending'
PENDING_PATH = '/api/v1/auth/social/'


def finish_location(flow='user', error=None, verify=False):
    params = {'flow': flow if flow in {'user', 'organizer'} else 'user'}
    if error:
        params['error'] = error
    if verify:
        params['verify'] = '1'
    return settings.FRONTEND_URL + '/auth/social/complete?' + urlencode(params)


def pending_signup(request):
    token = request.COOKIES.get(PENDING_COOKIE, '')
    if not token or len(token) > 128:
        raise SocialAuthError('This verification session has expired. Start sign-up again.')
    pending = cache.get(f'social-pending:{token}')
    if not isinstance(pending, dict):
        raise SocialAuthError('This verification session has expired. Start sign-up again.')
    return token, pending


def set_session(response, user, provider, request):
    type(user).objects.filter(pk=user.pk).update(last_login=timezone.now())
    refresh = RefreshToken.for_user(user)
    refresh['session_version'] = user.session_version
    audit(user, 'account.login', user.pk, provider=provider,
          device=request.META.get('HTTP_USER_AGENT', '')[:160])
    set_refresh(response, refresh)
    return response


class SocialConfigView(PublicAuthView):
    throttle_scope = 'session'

    def get(self, request):
        return Response({'google': configured('google'), 'apple': configured('apple')})


class SocialStartView(PublicAuthView):
    def get(self, request, provider):
        try:
            url, state = authorization(provider, request.query_params.get('flow', 'user'))
        except SocialAuthError:
            return HttpResponseRedirect(finish_location(error='unavailable'))
        response = HttpResponseRedirect(url)
        response.set_cookie(state_cookie(provider), state, max_age=600, httponly=True,
                            secure=True if provider == 'apple' else settings.REFRESH_COOKIE_SECURE,
                            samesite='None' if provider == 'apple' else 'Lax',
                            path='/api/v1/auth/social/')
        return response


class SocialCallbackView(PublicAuthView):
    throttle_scope = 'session'

    def get(self, request, provider):
        return self.complete(request, provider, request.query_params)

    def post(self, request, provider):
        # Apple's form_post is cross-site. A one-time, browser-bound state cookie
        # protects this endpoint instead of Django's same-origin CSRF cookie.
        return self.complete(request, provider, request.data)

    def complete(self, request, provider, values):
        flow = 'user'
        error = None
        user = None
        try:
            state = consume_state(provider, values.get('state'), request.COOKIES.get(state_cookie(provider)))
            flow = state['flow']
            if values.get('error'):
                raise SocialAuthError('Sign-in was cancelled.')
            token = exchange_code(provider, values.get('code'), state)
            claims = verified_claims(provider, token, state['nonce'])
            apple_name = None
            if provider == 'apple' and isinstance(values.get('user'), str):
                try:
                    apple_name = json.loads(values['user']).get('name')
                    if not isinstance(apple_name, dict):
                        apple_name = None
                except (ValueError, AttributeError):
                    apple_name = None
            user = resolve_user(provider, claims, apple_name)
            if user is None:
                try:
                    request_email_code(claims['email'])
                except Throttled:
                    # A recent code can still be used; otherwise restart later.
                    challenge = EmailVerificationCode.objects.filter(email=claims['email']).first()
                    if not challenge or challenge.consumed_at or challenge.expires_at <= timezone.now():
                        raise SocialAuthError('A verification code cannot be sent yet.')
                pending_token = secrets.token_urlsafe(32)
                cache.set(f'social-pending:{pending_token}', {
                    'provider': provider, 'claims': claims, 'apple_name': apple_name,
                    'flow': flow,
                }, timeout=600)
        except (SocialAuthError, KeyError, TypeError):
            error = 'cancelled' if values.get('error') else 'failed'
        response = HttpResponseRedirect(finish_location(flow, error, verify=not error and user is None))
        response.delete_cookie(state_cookie(provider), path='/api/v1/auth/social/',
                               samesite='None' if provider == 'apple' else 'Lax')
        if user:
            set_session(response, user, provider, request)
        elif not error:
            response.set_cookie(PENDING_COOKIE, pending_token, max_age=600, httponly=True,
                                secure=settings.REFRESH_COOKIE_SECURE, samesite='Lax', path=PENDING_PATH)
        return response


class SocialPendingView(PublicAuthView):
    throttle_scope = 'session'

    def get(self, request):
        try:
            _, pending = pending_signup(request)
        except SocialAuthError as exc:
            return Response({'detail': str(exc)}, status=404)
        return Response({'email': pending['claims']['email'], 'flow': pending['flow'],
                         'stage': 'password' if pending.get('email_proven') else 'otp'})


@method_decorator(csrf_protect, name='dispatch')
class SocialVerifyView(PublicAuthView):
    def post(self, request):
        try:
            token, pending = pending_signup(request)
        except SocialAuthError as exc:
            raise serializers.ValidationError(str(exc)) from exc
        code = serializers.RegexField(r'^[0-9]{6}$', max_length=6).run_validation(request.data.get('otp_code'))
        if pending.get('email_proven'):
            raise serializers.ValidationError('Email already verified. Set your password to continue.')
        if User.objects.filter(email__iexact=pending['claims']['email']).exists():
            try:
                user = complete_email_code(
                    pending['claims']['email'], code,
                    on_verified=lambda: resolve_user(pending['provider'], pending['claims'],
                                                     pending['apple_name'], email_proven=True),
                )
            except SocialAuthError as exc:
                raise serializers.ValidationError(str(exc)) from exc
            cache.delete(f'social-pending:{token}')
            response = set_session(Response({'detail': 'Email verified.', 'needs_password': False}),
                                   user, pending['provider'], request)
            response.delete_cookie(PENDING_COOKIE, path=PENDING_PATH, samesite='Lax')
            return response
        complete_email_code(pending['claims']['email'], code, consume_only=True)
        pending['email_proven'] = True
        cache.set(f'social-pending:{token}', pending, timeout=600)
        response = Response({'detail': 'Email verified. Set your password.', 'needs_password': True})
        response.set_cookie(PENDING_COOKIE, token, max_age=600, httponly=True,
                            secure=settings.REFRESH_COOKIE_SECURE, samesite='Lax', path=PENDING_PATH)
        return response


@method_decorator(csrf_protect, name='dispatch')
class SocialResendView(PublicAuthView):
    def post(self, request):
        try:
            _, pending = pending_signup(request)
        except SocialAuthError as exc:
            raise serializers.ValidationError(str(exc)) from exc
        if pending.get('email_proven'):
            raise serializers.ValidationError('Email already verified. Set your password to continue.')
        request_email_code(pending['claims']['email'])
        return Response({'detail': 'Verification code queued. Check your email.'}, status=202)


@method_decorator(csrf_protect, name='dispatch')
class SocialPasswordView(PublicAuthView):
    def post(self, request):
        try:
            token, pending = pending_signup(request)
        except SocialAuthError as exc:
            raise serializers.ValidationError(str(exc)) from exc
        if not pending.get('email_proven'):
            raise serializers.ValidationError('Verify your email code first.')
        password = serializers.CharField(trim_whitespace=False, min_length=8, max_length=128).run_validation(
            request.data.get('password'))
        confirmation = request.data.get('confirm_password')
        if password != confirmation:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})
        try:
            validate_password(password, User(email=pending['claims']['email']))
        except DjangoValidationError as exc:
            raise serializers.ValidationError({'password': exc.messages}) from exc
        try:
            user = resolve_user(pending['provider'], pending['claims'], pending['apple_name'],
                                email_proven=True, password=password)
        except SocialAuthError as exc:
            raise serializers.ValidationError(str(exc)) from exc
        cache.delete(f'social-pending:{token}')
        response = set_session(Response({'detail': 'Account created.'}), user, pending['provider'], request)
        response.delete_cookie(PENDING_COOKIE, path=PENDING_PATH, samesite='Lax')
        return response
