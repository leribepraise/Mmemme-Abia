"""Account review operations shared by the dashboard API and Django admin."""
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import PermissionDenied, ValidationError

from apps.common.api import Conflict
from apps.common.models import audit
from apps.notifications.services import notify
from .models import User, OrganizerProfile
from .services import revoke_tokens


def require_staff_permission(actor, permission):
    if not actor.is_active or not actor.is_staff or not actor.has_perm(permission):
        raise PermissionDenied('You do not have permission to perform this action.')


@transaction.atomic
def set_account_active(actor, user_id, active, reason=''):
    require_staff_permission(actor, 'accounts.change_user')
    user = User.objects.select_for_update().get(pk=user_id)
    if user.pk == actor.pk or user.is_staff or user.is_superuser:
        raise PermissionDenied('Staff accounts cannot be changed through this dashboard action.')
    if user.is_active == active:
        return user
    if not active and not reason.strip():
        raise ValidationError({'reason': 'Explain why this account is being suspended.'})
    user.is_active = active
    # Reactivation never revives credentials issued before suspension.
    user.session_version += 1
    user.save(update_fields=['is_active', 'session_version', 'updated_at'])
    revoke_tokens(user)
    action = 'activated' if active else 'suspended'
    audit(actor, f'account.{action}', user.pk, reason=reason)
    notify(user, f'account:{user.pk}:{user.session_version}', 'Account status update',
           f'Your Mmemme Abia account has been {action}.' + (f'\n\n{reason}' if reason else ''))
    return user


@transaction.atomic
def review_organizer(actor, profile_id, decision, reason=''):
    require_staff_permission(actor, 'accounts.change_organizerprofile')
    original = OrganizerProfile.objects.get(pk=profile_id)
    user = User.objects.select_for_update().get(pk=original.user_id)
    profile = OrganizerProfile.objects.select_for_update().get(pk=profile_id)
    if actor.pk == user.pk:
        raise PermissionDenied('You cannot review your own organizer application.')
    if decision == 'PENDING':
        if profile.status not in {'REJECTED', 'NEEDS_INFO'}:
            raise Conflict('Only rejected applications can be reopened.')
    elif decision in {'APPROVED', 'REJECTED', 'NEEDS_INFO'}:
        if profile.status != 'PENDING':
            raise Conflict('Only pending applications can be reviewed.')
        if decision == 'APPROVED' and (not user.is_active or not user.email_verified):
            raise Conflict('The account must be active and its email verified before approval.')
        if decision in {'REJECTED', 'NEEDS_INFO'} and not reason.strip():
            raise ValidationError({'reason': 'Explain what the organizer needs to correct.'})
    else:
        raise ValidationError('Invalid review decision.')
    profile.status = decision
    profile.review_note = reason
    profile.reviewed_by = actor
    profile.reviewed_at = timezone.now()
    profile.save(update_fields=['status', 'review_note', 'reviewed_by', 'reviewed_at'])
    user.is_verified = decision == 'APPROVED'
    if decision == 'APPROVED':
        user.role = User.Role.ORGANIZER
    user.save(update_fields=['role', 'is_verified', 'updated_at'])
    audit(actor, 'organizer.' + decision.lower(), user.pk, application_id=profile.pk, reason=reason)
    notify(user, f'organizer:{profile.pk}:{profile.reviewed_at.isoformat()}', 'Organizer application update',
           f'Your organizer application is {decision.lower()}.' + (f'\n\n{reason}' if reason else ''))
    return profile
