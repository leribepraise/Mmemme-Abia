from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = 'Grant or revoke blog access for an existing verified account without granting staff access.'

    def add_arguments(self, parser):
        parser.add_argument('email')
        parser.add_argument('--revoke', action='store_true')

    def handle(self, *args, **options):
        user = get_user_model().objects.filter(email__iexact=options['email']).first()
        if not user:
            raise CommandError('No account with that email exists. Register and verify the account first.')
        permission = Permission.objects.get(codename='manage_blog', content_type__app_label='community')
        if options['revoke']:
            user.user_permissions.remove(permission)
        else:
            if user.is_staff or user.is_superuser:
                raise CommandError('Choose a non-staff account to keep blog access separate from admin access.')
            if not user.is_active or not user.email_verified:
                raise CommandError('Activate and verify this account first.')
            user.user_permissions.add(permission)
        self.stdout.write(self.style.SUCCESS('Blog access revoked.' if options['revoke'] else 'Blog access granted. Staff access was not granted.'))
