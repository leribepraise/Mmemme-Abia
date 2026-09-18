"""Transactional email over HTTPS for hosts without outbound SMTP."""

import hashlib
import json
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from django.conf import settings
from django.core.mail.backends.base import BaseEmailBackend


class EmailDeliveryError(Exception):
    """A safe error that excludes email contents and provider credentials."""


class ResendEmailBackend(BaseEmailBackend):
    def __init__(self, fail_silently=False, **kwargs):
        super().__init__(**kwargs)
        self.fail_silently = fail_silently

    def send_messages(self, email_messages):
        sent = 0
        for message in email_messages or []:
            if not message.recipients():
                continue
            try:
                self._send(message)
            except EmailDeliveryError:
                if not self.fail_silently:
                    raise
            else:
                sent += 1
        return sent

    def _send(self, message):
        key = getattr(settings, "RESEND_API_KEY", "")
        if not key:
            raise EmailDeliveryError("Resend email delivery is not configured.")
        message.message()  # Retain Django's address and header validation.
        if message.attachments:
            raise EmailDeliveryError("Email attachments are not supported by this backend.")
        payload = {"from": message.from_email, "to": list(message.to), "subject": message.subject, "text": message.body}
        for field in ("cc", "bcc", "reply_to"):
            if getattr(message, field):
                payload[field] = list(getattr(message, field))
        for alternative in getattr(message, "alternatives", []):
            if alternative.mimetype != "text/html":
                raise EmailDeliveryError("Unsupported email alternative.")
            payload["html"] = alternative.content
        extra_headers = dict(message.extra_headers)
        notification_key = extra_headers.pop("X-Mmemme-Notification-Key", None)
        if extra_headers:
            payload["headers"] = extra_headers
        body = json.dumps(payload, sort_keys=True).encode("utf-8")
        headers = {"Authorization": "Bearer " + key, "Content-Type": "application/json", "Accept": "application/json", "User-Agent": "MmemmeAbia/1.0"}
        if notification_key:
            # Changed payloads get distinct keys. Retrying the same queued email
            # preserves Resend's 24-hour deduplication key.
            digest = hashlib.sha256(notification_key.encode("utf-8") + b"\0" + body).hexdigest()
            headers["Idempotency-Key"] = "mmemme-email-" + digest
        request = Request("https://api.resend.com/emails", data=body, headers=headers, method="POST")
        try:
            with urlopen(request, timeout=15) as response:
                result = json.loads(response.read(1024 * 1024))
            if not isinstance(result, dict) or not isinstance(result.get("id"), str) or not result["id"]:
                raise ValueError()
        except HTTPError as exc:
            exc.close()
            raise EmailDeliveryError(f"Resend rejected email delivery (HTTP {exc.code}).") from None
        except (URLError, OSError, ValueError):
            raise EmailDeliveryError("Resend could not confirm email delivery.") from None
