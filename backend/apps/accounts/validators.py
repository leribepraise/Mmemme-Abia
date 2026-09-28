from django.core.exceptions import ValidationError
from django.utils import timezone
import re
import unicodedata


class AccountPasswordValidator:
    """The agreed password policy, without identity or common-password checks."""

    def validate(self, password, user=None):
        errors = []
        if len(password) < 8:
            errors.append('Password must be at least 8 characters.')
        if len(password) > 128:
            errors.append('Password must be no more than 128 characters.')
        if not re.search(r'[A-Z]', password):
            errors.append('Password must contain at least one uppercase letter (A-Z).')
        if not re.search(r'[0-9]', password):
            errors.append('Password must contain at least one number (0-9).')
        if not any(unicodedata.category(char)[0] in 'PS' for char in password):
            errors.append('Password must contain at least one special character, such as !, @ or #.')
        if errors:
            raise ValidationError(errors)

    def get_help_text(self):
        return 'Use 8-128 characters, including an uppercase letter (A-Z), a number (0-9), and a special character such as !, @ or #.'


def validate_date_of_birth(value):
    if value and value > timezone.localdate():
        raise ValidationError("Date of birth cannot be in the future.")
