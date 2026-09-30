"""Server-side OpenID Connect for Google and Sign in with Apple."""
import base64
import hashlib
import hmac
import json
import secrets
import time
import uuid
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

import jwt
from django.conf import settings
from django.core.cache import cache
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.db import transaction

from apps.common.models import audit
from .models import SocialIdentity, User


class SocialAuthError(Exception):
    pass


PROVIDERS = {
    'google': {
        'authorize': 'https://accounts.google.com/o/oauth2/v2/auth',
        'token': 'https://oauth2.googleapis.com/token',
        'keys': 'https://www.googleapis.com/oauth2/v3/certs',
        'issuer': ['https://accounts.google.com', 'accounts.google.com'],
    },
    'apple': {
        'authorize': 'https://appleid.apple.com/auth/authorize',
        'token': 'https://appleid.apple.com/auth/token',
        'keys': 'https://appleid.apple.com/auth/keys',
        'issuer': 'https://appleid.apple.com',
    },
}


def configured(provider):
    if provider == 'google':
        return bool(settings.GOOGLE_OAUTH_CLIENT_ID and settings.GOOGLE_OAUTH_CLIENT_SECRET)
    if provider == 'apple':
        return bool(settings.APPLE_SERVICES_ID and settings.APPLE_TEAM_ID and settings.APPLE_KEY_ID
                    and settings.APPLE_PRIVATE_KEY and settings.SOCIAL_AUTH_ORIGIN.startswith('https://'))
    return False


def client_id(provider):
    return settings.GOOGLE_OAUTH_CLIENT_ID if provider == 'google' else settings.APPLE_SERVICES_ID


def callback_uri(provider):
    return f'{settings.SOCIAL_AUTH_ORIGIN}/api/v1/auth/social/{provider}/callback/'


def state_cookie(provider):
    return f'mmemme_oauth_{provider}'


def authorization(provider, flow):
    if provider not in PROVIDERS or not configured(provider):
        raise SocialAuthError('This sign-in option is not available yet.')
    if flow not in {'user', 'organizer'}:
        raise SocialAuthError('Invalid sign-in flow.')
    state = secrets.token_urlsafe(32)
    nonce = secrets.token_urlsafe(32)
    verifier = secrets.token_urlsafe(64)
    cache.set(f'social-auth:{state}', {'provider': provider, 'flow': flow, 'nonce': nonce,
                                       'verifier': verifier}, timeout=600)
    params = {'client_id': client_id(provider), 'redirect_uri': callback_uri(provider),
              'response_type': 'code', 'state': state, 'scope': 'openid email profile'}
    if provider == 'google':
        challenge = base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).rstrip(b'=').decode()
        params.update(code_challenge=challenge, code_challenge_method='S256', prompt='select_account')
    else:
        params.update(scope='name email', response_mode='form_post', nonce=nonce)
    return PROVIDERS[provider]['authorize'] + '?' + urlencode(params), state


def consume_state(provider, received, cookie):
    if not isinstance(received, str) or not isinstance(cookie, str) or not received or not hmac.compare_digest(received, cookie):
        raise SocialAuthError('Sign-in session expired. Please try again.')
    key = f'social-auth:{received}'
    stored = cache.get(key)
    if not stored or stored.get('provider') != provider:
        raise SocialAuthError('Sign-in session expired. Please try again.')
    cache.delete(key)
    return stored


def _apple_secret():
    now = int(time.time())
    return jwt.encode({'iss': settings.APPLE_TEAM_ID, 'iat': now, 'exp': now + 300,
                       'aud': 'https://appleid.apple.com', 'sub': settings.APPLE_SERVICES_ID},
                      settings.APPLE_PRIVATE_KEY, algorithm='ES256', headers={'kid': settings.APPLE_KEY_ID})


def exchange_code(provider, code, state):
    if not isinstance(code, str) or not 1 <= len(code) <= 4096:
        raise SocialAuthError('The identity provider did not return a valid code.')
    fields = {'grant_type': 'authorization_code', 'code': code, 'client_id': client_id(provider),
              'redirect_uri': callback_uri(provider)}
    if provider == 'google':
        fields.update(client_secret=settings.GOOGLE_OAUTH_CLIENT_SECRET, code_verifier=state['verifier'])
    else:
        try:
            fields['client_secret'] = _apple_secret()
        except (jwt.PyJWTError, ValueError) as exc:
            raise SocialAuthError('Apple sign-in is temporarily unavailable.') from exc
    request = Request(PROVIDERS[provider]['token'], data=urlencode(fields).encode(),
                      headers={'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'},
                      method='POST')
    try:
        with urlopen(request, timeout=10) as response:
            data = json.loads(response.read(32769))
    except (HTTPError, URLError, TimeoutError, ValueError, OSError) as exc:
        raise SocialAuthError('The identity provider could not complete sign-in. Please try again.') from exc
    if not isinstance(data, dict) or not isinstance(data.get('id_token'), str):
        raise SocialAuthError('The identity provider returned an invalid response.')
    return data['id_token']


def verified_claims(provider, token, nonce):
    if not isinstance(token, str) or len(token) > 10000:
        raise SocialAuthError('The identity provider returned an invalid identity token.')
    try:
        key = jwt.PyJWKClient(PROVIDERS[provider]['keys']).get_signing_key_from_jwt(token).key
        claims = jwt.decode(token, key, algorithms=['RS256'], audience=client_id(provider),
                            issuer=PROVIDERS[provider]['issuer'],
                            options={'require': ['exp', 'iat', 'iss', 'aud', 'sub']})
    except (jwt.PyJWTError, ValueError, URLError, TimeoutError, OSError) as exc:
        raise SocialAuthError('The identity provider returned an invalid identity token.') from exc
    if provider == 'apple' and not hmac.compare_digest(str(claims.get('nonce', '')), nonce):
        raise SocialAuthError('The identity provider returned an invalid identity token.')
    if claims.get('email_verified') is not True and claims.get('email_verified') != 'true':
        raise SocialAuthError('Use an email address verified by the identity provider.')
    subject = claims.get('sub')
    email = claims.get('email')
    if not isinstance(subject, str) or not 1 <= len(subject) <= 255 or not isinstance(email, str):
        raise SocialAuthError('The identity provider did not provide a usable account.')
    email = email.strip().lower()
    try:
        validate_email(email)
    except ValidationError as exc:
        raise SocialAuthError('The identity provider did not provide a usable email address.') from exc
    return {'subject': subject, 'email': email,
            'first_name': str(claims.get('given_name') or '')[:150],
            'last_name': str(claims.get('family_name') or '')[:150]}


@transaction.atomic
def resolve_user(provider, claims, apple_name=None):
    identity = SocialIdentity.objects.select_for_update().select_related('user').filter(
        provider=provider, subject=claims['subject']).first()
    if identity:
        user = identity.user
    else:
        user = User.objects.select_for_update().filter(email__iexact=claims['email']).first()
        if user and (user.is_staff or user.role == User.Role.ADMIN):
            raise SocialAuthError('Staff accounts must use password sign-in.')
        if user and not user.email_verified:
            raise SocialAuthError('Verify this account with its email code first.')
        if user is None:
            name = apple_name or {}
            user = User.objects.create_user(
                username=f'social_{uuid.uuid4().hex[:24]}', email=claims['email'],
                first_name=(claims['first_name'] or str(name.get('firstName') or ''))[:150],
                last_name=(claims['last_name'] or str(name.get('lastName') or ''))[:150],
                email_verified=True, role=User.Role.USER,
            )
        SocialIdentity.objects.create(user=user, provider=provider, subject=claims['subject'])
        audit(user, 'account.social_linked', user.pk, provider=provider)
    if not user.is_active or not user.email_verified or user.is_staff or user.role == User.Role.ADMIN:
        raise SocialAuthError('This account cannot use social sign-in.')
    return user
