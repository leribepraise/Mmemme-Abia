import json
import os
import subprocess
import sys
from pathlib import Path

from django.test import SimpleTestCase


class RailwaySettingsTests(SimpleTestCase):
    def inspect_settings(self, **changes):
        environment = {**os.environ,
            "DJANGO_SETTINGS_MODULE":"config.settings.production",
            "SECRET_KEY":"railway-settings-test-only-abcdefghijklmnopqrstuvwxyz1234567890",
            "ALLOWED_HOSTS":"app.example.test",
            "DATABASE_URL":"postgresql://unit:unit@localhost/unit_test_only",
            "REDIS_URL":"redis://localhost:6379/0",
            "EMAIL_PROVIDER":"resend", "RESEND_API_KEY":"re_test_only",
            "EMAIL_HOST":"", "EMAIL_HOST_USER":"", "EMAIL_HOST_PASSWORD":"",
            "DEFAULT_FROM_EMAIL":"noreply@example.test",
            "FRONTEND_URL":"https://app.example.test", "CORS_ALLOWED_ORIGINS":"https://app.example.test",
            "PAYSTACK_SECRET_KEY":"sk_test_settings_only", "TRUST_PROXY_SSL_HEADER":"true",
            "MEDIA_STORAGE":"s3", "S3_ACCESS_KEY_ID":"unit-access", "S3_SECRET_ACCESS_KEY":"unit-secret",
            "S3_BUCKET_NAME":"unit-uploads", "S3_ENDPOINT_URL":"https://storage.example.test", "S3_REGION":"auto",
            "S3_ADDRESSING_STYLE":"virtual", "RAILWAY_ENVIRONMENT_ID":"unit-environment", **changes,
        }
        script = '''
import json, django
django.setup()
from django.conf import settings
from django.test import Client
from django.core.files.storage import storages
from urllib.parse import urlsplit, parse_qs
client=Client()
probe=client.get('/health/live/',HTTP_HOST='healthcheck.railway.app')
redirect=client.get('/api/v1/auth/csrf/',HTTP_HOST='app.example.test')
upload_url=storages['default'].url('image.png')
print(json.dumps({'email':settings.EMAIL_BACKEND,'storage':settings.STORAGES['default']['BACKEND'],'static':settings.STORAGES['staticfiles']['BACKEND'],'probe_status':probe.status_code,'insecure_api_status':redirect.status_code,'signed_upload':bool(parse_qs(urlsplit(upload_url).query).get('X-Amz-Signature')),'upload_host':urlsplit(upload_url).hostname}))
'''
        return subprocess.run([sys.executable, "-c", script], cwd=Path(__file__).resolve().parents[1], env=environment, text=True, capture_output=True, timeout=45)

    def test_resend_s3_and_http_liveness_without_smtp_credentials(self):
        result = self.inspect_settings()
        self.assertEqual(result.returncode, 0, result.stderr)
        data = json.loads(result.stdout)
        self.assertEqual(data["email"], "apps.notifications.backends.ResendEmailBackend")
        self.assertEqual(data["storage"], "storages.backends.s3.S3Storage")
        self.assertEqual(data["static"], "whitenoise.storage.CompressedManifestStaticFilesStorage")
        self.assertEqual(data["probe_status"], 200)
        self.assertEqual(data["insecure_api_status"], 301)
        self.assertTrue(data["signed_upload"])
        self.assertEqual(data["upload_host"], "unit-uploads.storage.example.test")

    def test_railway_refuses_ephemeral_upload_storage(self):
        result = self.inspect_settings(MEDIA_STORAGE="local")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Configure persistent S3 upload storage for Railway", result.stderr)

    def test_resend_requires_its_key(self):
        result = self.inspect_settings(RESEND_API_KEY="")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("RESEND_API_KEY must be configured", result.stderr)

    def test_storage_rejects_insecure_endpoint(self):
        result = self.inspect_settings(S3_ENDPOINT_URL="http://storage.example.test")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("S3_ENDPOINT_URL must be an HTTPS storage endpoint", result.stderr)
