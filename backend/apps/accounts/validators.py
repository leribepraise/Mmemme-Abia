from django.core.exceptions import ValidationError
from django.utils import timezone


def validate_date_of_birth(value):
    if value and value > timezone.localdate():
        raise ValidationError("Date of birth cannot be in the future.")
