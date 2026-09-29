import json
import os
from django.core.management.base import BaseCommand, CommandError
from apps.payments.launch_cleanup import inspect_launch, apply_launch


class Command(BaseCommand):
    help = 'Preview verified Paystack test-payment cleanup and reset paid memberships to Bronze.'
    def add_arguments(self, parser):
        parser.add_argument('--apply', action='store_true')
        parser.add_argument('--backup', help='New, private backup filename (required with --apply).')
    def handle(self, *args, **options):
        if options['apply'] and not options['backup']:
            raise CommandError('--backup is required before applying cleanup.')
        report = inspect_launch(os.environ.get('PAYSTACK_TEST_SECRET_KEY', ''))
        self.stdout.write(json.dumps({'test_transactions': len(report['test']), 'live_transactions': len(report['live']),
                                     'unclassified_transactions': len(report['unknown']), 'paid_memberships': len(report['memberships'])}))
        if options['apply']:
            self.stdout.write(json.dumps(apply_launch(report, options['backup'])))
