"""Shared event registration validation for editing, moderation and promotion."""
from urllib.parse import urlsplit

from django.core.exceptions import ValidationError
from django.core.validators import URLValidator


def validate_registration_url(value):
    message = 'Enter a valid HTTPS registration link.'
    try:
        URLValidator(schemes=['https'])(value)
        parsed = urlsplit(value)
        if not parsed.hostname or parsed.username or parsed.password or '\\' in value:
            raise ValueError(message)
    except (ValidationError, ValueError, TypeError):
        raise ValidationError(message) from None
    return value


def registration_is_ready(event):
    if event.registration_type == event.RegistrationType.EXTERNAL:
        try:
            validate_registration_url(event.registration_url)
        except ValidationError:
            return False
        return True
    return event.ticket_types.filter(is_active=True).exists()
