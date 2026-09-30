import json
from urllib.parse import urlencode

from django.conf import settings
from django.http import HttpResponseRedirect
from django.utils import timezone
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from apps.common.models import audit
from .social_auth import (SocialAuthError, authorization, configured, consume_state,
                          exchange_code, resolve_user, state_cookie, verified_claims)
from .views import PublicAuthView, set_refresh


def finish_location(flow='user', error=None):
    params = {'flow': flow if flow in {'user', 'organizer'} else 'user'}
    if error:
        params['error'] = error
    return settings.FRONTEND_URL + '/auth/social/complete?' + urlencode(params)


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
        except (SocialAuthError, KeyError, TypeError):
            error = 'cancelled' if values.get('error') else 'failed'
        response = HttpResponseRedirect(finish_location(flow, error))
        response.delete_cookie(state_cookie(provider), path='/api/v1/auth/social/',
                               samesite='None' if provider == 'apple' else 'Lax')
        if user:
            type(user).objects.filter(pk=user.pk).update(last_login=timezone.now())
            refresh = RefreshToken.for_user(user)
            refresh['session_version'] = user.session_version
            audit(user, 'account.login', user.pk, provider=provider,
                  device=request.META.get('HTTP_USER_AGENT', '')[:160])
            set_refresh(response, refresh)
        return response
