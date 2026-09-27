import secrets
import uuid
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password, make_password
from django.db import IntegrityError, transaction
from django.utils import timezone
from rest_framework.exceptions import Throttled, ValidationError

from apps.notifications.models import Notification
from .models import EmailVerificationCode

CODE_LIFETIME = timedelta(minutes=10)
RESEND_SECONDS = 60
MAX_ATTEMPTS = 5
MAX_SENDS_PER_HOUR = 5


def request_email_code(email):
    email = email.strip().lower()
    now = timezone.now()
    with transaction.atomic():
        challenge, _ = EmailVerificationCode.objects.get_or_create(email=email, defaults={
            "expires_at": now, "sent_at": now - timedelta(seconds=RESEND_SECONDS),
            "window_started_at": now,
        })
        challenge = EmailVerificationCode.objects.select_for_update().get(pk=challenge.pk)
        remaining = RESEND_SECONDS - (now - challenge.sent_at).total_seconds()
        if remaining > 0:
            raise Throttled(wait=remaining, detail="Please wait before requesting another code.")
        if now - challenge.window_started_at >= timedelta(hours=1):
            challenge.window_started_at = now
            challenge.send_count = 0
        if challenge.send_count >= MAX_SENDS_PER_HOUR:
            wait = (challenge.window_started_at + timedelta(hours=1) - now).total_seconds()
            raise Throttled(wait=wait, detail="Too many codes requested for this email. Try again later.")
        code = f"{secrets.randbelow(1000000):06d}"
        challenge.code_hash = make_password(code)
        challenge.expires_at = now + CODE_LIFETIME
        challenge.sent_at = now
        challenge.send_count += 1
        challenge.attempts = 0
        challenge.consumed_at = None
        challenge.save()
        # Replacing a code also cancels its older queued email.
        Notification.objects.filter(key__startswith=f"email-otp:{challenge.pk}:", sent_at__isnull=True).delete()
        Notification.objects.create(
            key=f"email-otp:{challenge.pk}:{uuid.uuid4().hex}", email=email,
            subject="Your Mmemme Abia verification code", is_private=True,
            expires_at=challenge.expires_at,
            body=f"Your Mmemme Abia email verification code is:\n\n{code}\n\n"
                 "This code expires in 10 minutes. Do not share it with anyone.\n"
                 "If you did not request this code, you can ignore this email.",
        )


def complete_email_code(email, code, registration=None):
    """Consume proof and create/verify the user under one lock; persist failed attempts."""
    User = get_user_model()
    email = email.strip().lower()
    error = None
    user = None
    try:
        with transaction.atomic():
            challenge = EmailVerificationCode.objects.select_for_update().filter(email=email).first()
            now = timezone.now()
            if not challenge or challenge.consumed_at or challenge.expires_at <= now:
                error = "This code is invalid or expired. Request a new code."
            elif challenge.attempts >= MAX_ATTEMPTS:
                error = "Too many incorrect attempts. Request a new code."
            elif not check_password(code, challenge.code_hash):
                challenge.attempts += 1
                challenge.save(update_fields=["attempts"])
                error = "Incorrect verification code."
            else:
                if registration is not None:
                    details = dict(registration)
                    password = details.pop("password")
                    user = User(username="u_" + uuid.uuid4().hex, email_verified=True, **details)
                    user.set_password(password)
                    user.save()
                else:
                    user = User.objects.select_for_update().filter(email__iexact=email, is_active=True).first()
                    if user:
                        user.email_verified = True
                        user.save(update_fields=["email_verified"])
                    else:
                        error = "Complete the signup form to create your account with this code."
                if user:
                    challenge.consumed_at = now
                    challenge.code_hash = ""
                    challenge.save(update_fields=["consumed_at", "code_hash"])
                    Notification.objects.filter(key__startswith=f"email-otp:{challenge.pk}:", sent_at__isnull=True).delete()
    except IntegrityError as exc:
        raise ValidationError("An account already uses this email. Please log in.") from exc
    # Raising outside atomic is essential: wrong-code attempts must not roll back.
    if error:
        raise ValidationError({"otp_code": error})
    return user
