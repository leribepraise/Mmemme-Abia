import base64
import os
from pathlib import Path
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import serialization
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = 'Generate a VAPID key pair in a private local file. Never commit or share that file.'

    def add_arguments(self, parser):
        parser.add_argument('--output', default='.push-keys.env')

    def handle(self, *args, **options):
        key = ec.generate_private_key(ec.SECP256R1())
        encode = lambda value: base64.urlsafe_b64encode(value).rstrip(b'=').decode()
        public = encode(key.public_key().public_bytes(serialization.Encoding.X962, serialization.PublicFormat.UncompressedPoint))
        private = encode(key.private_bytes(serialization.Encoding.DER, serialization.PrivateFormat.PKCS8, serialization.NoEncryption()))
        path = Path(options['output'])
        try:
            # Exclusive creation avoids silently rotating keys for existing subscribers.
            fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
            with os.fdopen(fd, 'w', encoding='utf-8') as stream:
                stream.write(f'VAPID_PUBLIC_KEY={public}\nVAPID_PRIVATE_KEY={private}\n')
        except OSError:
            raise CommandError('Could not create the key file. Choose a writable path that does not already exist.')
        self.stdout.write(f'Keys saved to {path.resolve()}. Keep this file private and keep using the same pair on backend and worker.')
