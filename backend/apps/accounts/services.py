import uuid
from urllib.parse import urlencode
from django.conf import settings
from django.core import signing
from django.contrib.auth.tokens import default_token_generator
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from apps.notifications.services import notify

def send_verification(user):
    token = signing.dumps({"user":user.pk,"email":user.email},salt="verify-email")
    url = settings.FRONTEND_URL + "/verify-email?" + urlencode({"token":token})
    notify(user,"verify:"+uuid.uuid4().hex,"Verify your email","Verify your Mmemme Abia account:\n\n"+url,private=True)

def send_reset(user):
    token = default_token_generator.make_token(user)
    url = settings.FRONTEND_URL + "/reset-password?" + urlencode({"user":user.pk,"token":token})
    notify(user,"reset:"+uuid.uuid4().hex,"Reset your password","Reset your password:\n\n"+url,private=True)

def revoke_tokens(user):
    for token in OutstandingToken.objects.filter(user=user):
        BlacklistedToken.objects.get_or_create(token=token)
