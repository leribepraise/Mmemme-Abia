import base64
import json
import io
import tempfile
from pathlib import Path
from datetime import timedelta
from types import SimpleNamespace
from unittest.mock import patch

from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import serialization
from django.contrib.auth import get_user_model
from django.test import override_settings
from django.core.management import call_command, CommandError
from django.db import IntegrityError
from django.utils import timezone
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from pywebpush import WebPushException

from apps.notifications.models import Notification, PushSubscription, PushDelivery
from apps.notifications.services import notify
from apps.notifications.push import allowed_endpoint, deliver_push_one
from apps.notifications.routing import notification_destination


def encode(value):
    return base64.urlsafe_b64encode(value).rstrip(b'=').decode()


KEY = ec.generate_private_key(ec.SECP256R1())
PUBLIC = encode(KEY.public_key().public_bytes(serialization.Encoding.X962, serialization.PublicFormat.UncompressedPoint))
PRIVATE = encode(KEY.private_bytes(serialization.Encoding.DER, serialization.PrivateFormat.PKCS8, serialization.NoEncryption()))
PUSH_SETTINGS = dict(WEB_PUSH_ENABLED=True, VAPID_PUBLIC_KEY=PUBLIC, VAPID_PRIVATE_KEY=PRIVATE, VAPID_SUBJECT='mailto:team@example.test')


class NotificationTests(APITestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(username='reader', email='reader@example.test', email_verified=True)
        self.other = User.objects.create_user(username='other', email='other@example.test', email_verified=True)
        self.client.force_authenticate(self.user)

    def notification(self, key='booking:one', user=None, **kwargs):
        return Notification.objects.create(user=user or self.user, key=key, subject='Update', body='Details', email='reader@example.test', **kwargs)

    def test_read_persists_and_is_owner_scoped(self):
        own = self.notification()
        other = self.notification('other', self.other)
        self.assertEqual(self.client.post(f'/api/v1/notifications/{other.pk}/read/').status_code, 404)
        response = self.client.post(f'/api/v1/notifications/{own.pk}/read/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['url'], '/profile?section=My%20Bookings')
        own.refresh_from_db()
        other.refresh_from_db()
        self.assertTrue(own.is_read)
        self.assertFalse(other.is_read)
        self.assertTrue(self.client.get('/api/v1/notifications/').data['results'][0]['is_read'])
        self.assertEqual(self.client.get('/api/v1/notifications/unread-count/').data['count'], 0)

    def test_mark_all_excludes_private_expired_and_other_users(self):
        own = self.notification()
        private = self.notification('otp', is_private=True)
        expired = self.notification('expired', expires_at=timezone.now()-timedelta(seconds=1))
        other = self.notification('other', self.other)
        self.assertEqual(self.client.get('/api/v1/notifications/unread-count/').data['count'], 1)
        self.assertEqual(self.client.post('/api/v1/notifications/read-all/').data['updated'], 1)
        for row in (private, expired, other):
            row.refresh_from_db()
            self.assertFalse(row.is_read)
            self.assertEqual(self.client.get(f'/api/v1/notifications/{row.pk}/').status_code, 404)
        own.refresh_from_db()
        self.assertTrue(own.is_read)

    def test_live_baseline_new_updates_and_private_scope(self):
        old = self.notification()
        baseline = self.client.get('/api/v1/notifications/live/')
        self.assertEqual(baseline.status_code, 200)
        self.assertEqual(baseline.data['latest_id'], old.pk)
        self.assertEqual(baseline.data['updates'], [])
        self.notification('private-live', is_private=True)
        self.notification('other-live', self.other)
        new = self.notification('new-live')
        update = self.client.get(f'/api/v1/notifications/live/?after={old.pk}')
        self.assertEqual(update.data['unread_count'], 2)
        self.assertEqual([item['id'] for item in update.data['updates']], [new.pk])
        self.assertEqual(self.client.get('/api/v1/notifications/live/?after=bad').status_code, 400)

    def test_authentication_required(self):
        self.client.force_authenticate(None)
        for url in ('notifications/', 'notifications/unread-count/', 'notifications/live/', 'push/config/'):
            self.assertEqual(self.client.get('/api/v1/'+url).status_code, 401)
        self.assertEqual(self.client.post('/api/v1/notifications/read-all/').status_code, 401)

    def test_known_destinations_and_untrusted_keys(self):
        cases = {'organizer:1':'/organizer/apply', 'payout:1':'/organizer/payouts', 'refund:1':'/profile?section=Payment%20History',
                 'event-review:aaa20cd0-625c-48d6-a200-dc59aeb79772:date':'/organizer/events/aaa20cd0-625c-48d6-a200-dc59aeb79772/preview',
                 'event-new:aaa20cd0-625c-48d6-a200-dc59aeb79772:123':'/events/aaa20cd0-625c-48d6-a200-dc59aeb79772',
                 'event-new:https://evil.test':'/profile?section=Notifications',
                 'event-review:https://evil.test':'/profile?section=Notifications'}
        for key, url in cases.items():
            self.assertEqual(notification_destination(SimpleNamespace(key=key))[0], url)


@override_settings(**PUSH_SETTINGS)
class PushTests(NotificationTests):
    def subscription_body(self, endpoint='https://fcm.googleapis.com/fcm/send/test'):
        return {'endpoint':endpoint, 'keys':{'p256dh':PUBLIC, 'auth':encode(b'0123456789abcdef')}}

    def subscribe(self):
        response = self.client.post('/api/v1/push/subscription/', self.subscription_body(), format='json')
        self.assertEqual(response.status_code, 200, response.data)
        return PushSubscription.objects.get(pk=response.data['id'])

    def test_config_returns_only_public_key(self):
        result = self.client.get('/api/v1/push/config/').json()
        self.assertEqual(result, {'enabled':True,'public_key':PUBLIC})
        self.assertNotIn(PRIVATE, json.dumps(result))
        with override_settings(WEB_PUSH_ENABLED=False):
            self.assertEqual(self.client.get('/api/v1/push/config/').json(), {'enabled':False,'public_key':''})
            self.assertEqual(self.client.post('/api/v1/push/subscription/',self.subscription_body(),format='json').status_code,503)

    def test_endpoint_allowlist_rejects_ssrf_and_credentials(self):
        for endpoint in ('http://fcm.googleapis.com/x','https://localhost/x','https://127.0.0.1/x','https://fcm.googleapis.com.evil.test/x',
                         'https://fcm.googleapis.com:8080/x','https://user:secret@fcm.googleapis.com/x','https://fcm.googleapis.com/x#part'):
            self.assertFalse(allowed_endpoint(endpoint))
            result = self.client.post('/api/v1/push/subscription/', self.subscription_body(endpoint), format='json')
            self.assertEqual(result.status_code,400)
        for endpoint in ('https://updates.push.services.mozilla.com/wpush/v2/test','https://web.push.apple.com/test'):
            self.assertTrue(allowed_endpoint(endpoint))

    def test_keys_must_be_valid_browser_keys(self):
        for keys in ({}, {'p256dh':'a','auth':'a'}, {'p256dh':PUBLIC,'auth':encode(b'too-short')}):
            body = {**self.subscription_body(), 'keys':keys}
            self.assertEqual(self.client.post('/api/v1/push/subscription/',body,format='json').status_code,400)

    def test_status_disable_and_ownership(self):
        sub = self.subscribe()
        self.assertEqual(self.client.patch('/api/v1/push/subscription/', {'endpoint':sub.endpoint},format='json').data, {'enabled':True})
        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.post('/api/v1/push/subscription/',self.subscription_body(),format='json').status_code,409)
        self.assertEqual(self.client.patch('/api/v1/push/subscription/', {'endpoint':sub.endpoint},format='json').data, {'enabled':False})
        self.client.delete('/api/v1/push/subscription/', {'endpoint':sub.endpoint},format='json')
        sub.refresh_from_db()
        self.assertTrue(sub.is_active)
        self.client.force_authenticate(self.user)
        self.client.delete('/api/v1/push/subscription/', {'endpoint':sub.endpoint},format='json')
        sub.refresh_from_db()
        self.assertFalse(sub.is_active)

    def test_queue_is_unique_private_safe_and_has_no_historical_replay(self):
        notify(self.user,'old','Old','Old notification')
        self.subscribe()
        notify(self.user,'new','New','New notification')
        notify(self.user,'new','New','New notification')
        notify(self.user,'private','OTP','123456',private=True)
        self.assertEqual(PushDelivery.objects.count(),1)
        self.assertEqual(PushDelivery.objects.get().notification.key,'new')

    def test_success_payload_is_generic_and_no_second_delivery(self):
        self.subscribe()
        note, _ = notify(self.user,'new','Sensitive subject','Sensitive body')
        with patch('apps.notifications.push.webpush', return_value=SimpleNamespace(status_code=201)) as send:
            self.assertTrue(deliver_push_one())
            self.assertFalse(deliver_push_one())
            payload = json.loads(send.call_args.kwargs['data'])
            self.assertEqual(payload['url'],f'/notifications?notification={note.pk}')
            self.assertNotIn('Sensitive',send.call_args.kwargs['data'])
        self.assertIsNotNone(PushDelivery.objects.get().sent_at)

    def test_real_encryption_and_vapid_without_network(self):
        self.subscribe()
        notify(self.user,'new','New','Body')
        with patch('apps.notifications.push.NoRedirectSession.post',return_value=SimpleNamespace(status_code=201, text='', headers={})) as post:
            deliver_push_one()
            self.assertTrue(post.called)
            self.assertIn('authorization', {k.lower():v for k,v in post.call_args.kwargs['headers'].items()})
            self.assertIsInstance(post.call_args.kwargs['data'],bytes)
        self.assertIsNotNone(PushDelivery.objects.get().sent_at)

    def test_gone_subscription_is_disabled(self):
        sub = self.subscribe()
        notify(self.user,'new','New','Body')
        with patch('apps.notifications.push.webpush',side_effect=WebPushException('Gone',response=SimpleNamespace(status_code=410))):
            deliver_push_one()
        sub.refresh_from_db()
        self.assertFalse(sub.is_active)
        self.assertTrue(PushDelivery.objects.get().failed)

    def test_temporary_failure_retries_with_backoff(self):
        self.subscribe()
        notify(self.user,'new','New','Body')
        with patch('apps.notifications.push.webpush',side_effect=WebPushException('Busy',response=SimpleNamespace(status_code=429))) as send:
            deliver_push_one()
            self.assertFalse(deliver_push_one())
            self.assertEqual(send.call_count,1)
        job=PushDelivery.objects.get()
        self.assertFalse(job.failed)
        self.assertGreater(job.available_at,timezone.now())
        self.assertIsNone(job.claimed_at)

    def test_read_or_revoked_notifications_are_not_delivered(self):
        sub=self.subscribe()
        note,_=notify(self.user,'read','Read','Body')
        note.is_read=True
        note.save()
        with patch('apps.notifications.push.webpush') as send:
            deliver_push_one()
            send.assert_not_called()
        notify(self.user,'revoked','New','Body')
        self.user.session_version+=1
        self.user.save()
        with patch('apps.notifications.push.webpush') as send:
            deliver_push_one()
            send.assert_not_called()

    def test_claim_prevents_duplicate_worker_delivery(self):
        self.subscribe()
        notify(self.user,'new','New','Body')
        PushDelivery.objects.update(claimed_at=timezone.now())
        with patch('apps.notifications.push.webpush') as send:
            self.assertFalse(deliver_push_one())
            send.assert_not_called()
        PushDelivery.objects.update(claimed_at=timezone.now()-timedelta(minutes=6))
        with patch('apps.notifications.push.webpush',return_value=SimpleNamespace(status_code=201)):
            self.assertTrue(deliver_push_one())

    def test_logout_disables_only_refresh_token_owners_subscription(self):
        sub=self.subscribe()
        token=str(RefreshToken.for_user(self.other))
        self.client.cookies['mmemme_refresh']=token
        self.client.post('/api/v1/auth/logout/',{'refresh':token,'push_endpoint':sub.endpoint},format='json')
        sub.refresh_from_db()
        self.assertTrue(sub.is_active)
        token=str(RefreshToken.for_user(self.user))
        self.client.cookies['mmemme_refresh']=token
        self.client.post('/api/v1/auth/logout/',{'refresh':token,'push_endpoint':sub.endpoint},format='json')
        sub.refresh_from_db()
        self.assertFalse(sub.is_active)

    def test_device_limit_includes_reactivation(self):
        for index in range(10):
            body=self.subscription_body(f'https://fcm.googleapis.com/fcm/send/device-{index}')
            self.assertEqual(self.client.post('/api/v1/push/subscription/',body,format='json').status_code,200)
        self.assertEqual(self.client.post('/api/v1/push/subscription/',self.subscription_body(),format='json').status_code,409)
        # Updating an active subscription remains possible at the limit.
        body=self.subscription_body('https://fcm.googleapis.com/fcm/send/device-0')
        self.assertEqual(self.client.post('/api/v1/push/subscription/',body,format='json').status_code,200)
        old=PushSubscription.objects.create(user=self.user,is_active=False,endpoint=self.subscription_body()['endpoint'],**self.subscription_body()['keys'])
        self.assertEqual(self.client.post('/api/v1/push/subscription/',self.subscription_body(),format='json').status_code,409)
        old.refresh_from_db()
        self.assertFalse(old.is_active)

    def test_registration_race_cannot_overwrite_another_owner(self):
        with patch('apps.notifications.push_api.PushSubscription.objects.create',side_effect=IntegrityError('duplicate endpoint')):
            self.assertEqual(self.client.post('/api/v1/push/subscription/',self.subscription_body(),format='json').status_code,409)
        self.assertEqual(PushSubscription.objects.count(),0)

    def test_expired_notifications_are_not_pushed(self):
        self.subscribe()
        note,_=notify(self.user,'expired','Old','Body')
        note.expires_at=timezone.now()-timedelta(seconds=1)
        note.save()
        with patch('apps.notifications.push.webpush') as send:
            deliver_push_one()
            send.assert_not_called()

    def test_retries_stop_after_five_failures(self):
        self.subscribe()
        notify(self.user,'new','New','Body')
        PushDelivery.objects.update(attempts=4)
        with patch('apps.notifications.push.webpush',side_effect=TimeoutError()):
            deliver_push_one()
        self.assertTrue(PushDelivery.objects.get().failed)
        self.assertFalse(deliver_push_one())

    def test_generator_writes_matching_keys_without_printing_or_overwriting_them(self):
        from py_vapid import Vapid
        with tempfile.TemporaryDirectory() as directory:
            path=Path(directory)/'.push-keys.env'
            output=io.StringIO()
            call_command('generate_push_keys',output=str(path),stdout=output)
            text=path.read_text()
            values=dict(line.split('=',1) for line in text.splitlines())
            key=Vapid.from_string(values['VAPID_PRIVATE_KEY'])
            self.assertEqual(encode(key.public_key.public_bytes(serialization.Encoding.X962,serialization.PublicFormat.UncompressedPoint)),values['VAPID_PUBLIC_KEY'])
            self.assertNotIn(values['VAPID_PRIVATE_KEY'],output.getvalue())
            with self.assertRaises(CommandError):
                call_command('generate_push_keys',output=str(path),stdout=output)
            self.assertEqual(path.read_text(),text)
