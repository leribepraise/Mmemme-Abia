from datetime import timedelta
from unittest.mock import patch

from django.test import override_settings
from django.utils import timezone
from rest_framework.test import APITestCase

from apps.accounts.models import User
from apps.events.models import Event


@override_settings(FRONTEND_URL='https://www.mmemme.com.ng')
class EventSharingTests(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user('sharing-host', 'host@example.test',
            role='ORGANIZER', is_verified=True, email_verified=True)
        self.event = self.create_event('Abia Tech Rise')

    def create_event(self, title, **extra):
        start = timezone.now() + timedelta(days=5)
        values = dict(organizer=self.owner, title=title, slug=f'internal-{Event.objects.count()}',
                      description='Learn and connect in Abia.', venue='Town Hall', city='Aba',
                      category='Leadership', capacity=100, start_datetime=start,
                      end_datetime=start + timedelta(hours=3), status='PUBLISHED',
                      image_url='https://images.example.test/event-poster.jpg')
        return Event.objects.create(**{**values, **extra})

    def test_event_names_are_unique_readable_and_stable(self):
        duplicate = self.create_event('Abia Tech Rise')
        colliding_title = self.create_event('Abia Tech Rise 2')
        self.assertEqual(self.event.share_slug, 'abia-tech-rise')
        self.assertEqual(duplicate.share_slug, 'abia-tech-rise-2')
        self.assertEqual(colliding_title.share_slug, 'abia-tech-rise-2-2')
        self.event.title = 'A renamed event'
        self.event.save()
        self.assertEqual(self.event.share_slug, 'abia-tech-rise')
        self.assertEqual(self.create_event('🎉').share_slug, 'event')

    def test_preview_contains_event_metadata_without_javascript_or_login(self):
        response = self.client.get('/share/events/abia-tech-rise')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, '<meta property="og:title" content="Abia Tech Rise">', html=True)
        self.assertContains(response, 'https://www.mmemme.com.ng/share/event-images/abia-tech-rise')
        self.assertContains(response, '<meta property="og:url" content="https://www.mmemme.com.ng/share/events/abia-tech-rise">', html=True)
        self.assertContains(response, 'summary_large_image')
        self.assertContains(response, '/event-share-loader.js')
        self.assertIn('no-cache', response['Cache-Control'])
        self.assertEqual(self.client.head('/share/events/abia-tech-rise').status_code, 200)

    def test_raw_titles_and_descriptions_are_escaped(self):
        self.event.title = 'Abia "special" <script>alert(1)</script>'
        self.event.description = '<b>Community</b> & culture'
        self.event.save()
        response = self.client.get('/share/events/abia-tech-rise')
        self.assertNotContains(response, '<script>alert(1)</script>')
        self.assertContains(response, '&quot;special&quot;')
        self.assertContains(response, 'Community &amp; culture')

    def test_uploaded_poster_resolves_fresh_storage_url(self):
        self.event.image.name = 'events/real-poster.jpg'
        self.event.save()
        storage = Event._meta.get_field('image').storage
        with patch.object(storage, 'url', return_value='https://storage.example.test/poster.jpg?signature=fresh') as url:
            page = self.client.get('/share/events/abia-tech-rise')
            url.assert_not_called()
            self.assertNotContains(page, 'signature=fresh')
            image = self.client.get('/share/event-images/abia-tech-rise')
            self.assertEqual(image['Location'], 'https://storage.example.test/poster.jpg?signature=fresh')
            url.assert_called_once_with('events/real-poster.jpg')
        self.assertEqual(image['Cache-Control'], 'no-store')

    def test_existing_image_url_and_fallback_are_supported(self):
        image = self.client.get('/share/event-images/abia-tech-rise')
        self.assertEqual(image['Location'], self.event.image_url)
        Event.objects.filter(pk=self.event.pk).update(image_url='')
        image = self.client.get('/share/event-images/abia-tech-rise')
        self.assertEqual(image['Location'], 'https://www.mmemme.com.ng/logo.png')

    def test_shared_event_resolves_real_id_and_exposes_readable_slug(self):
        response = self.client.get('/api/v1/events/shared/abia-tech-rise/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], str(self.event.pk))
        self.assertEqual(response.data['share_slug'], 'abia-tech-rise')
        self.assertNotIn('review_note', response.data)
        self.assertEqual(self.client.get(f'/api/v1/events/{self.event.pk}/').data['share_slug'], 'abia-tech-rise')

    def test_old_uuid_links_still_work(self):
        response = self.client.get(f'/share/events/{self.event.pk}')
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response['Location'], 'https://www.mmemme.com.ng/share/events/abia-tech-rise')
        self.assertEqual(self.client.get(f'/api/v1/events/shared/{self.event.pk}/').data['id'], str(self.event.pk))

    def test_unpublished_unavailable_and_unknown_events_have_no_public_preview(self):
        for changes in [dict(status='DRAFT'), dict(status='IN_REVIEW'), dict(status='CANCELLED'),
                        dict(is_archived=True), dict(is_suspended=True),
                        dict(deletion_requested_at=timezone.now()),
                        dict(start_datetime=timezone.now()-timedelta(days=2), end_datetime=timezone.now()-timedelta(days=1))]:
            event = self.create_event(f'Hidden {Event.objects.count()}', **changes)
            for route in [f'/share/events/{event.share_slug}', f'/share/event-images/{event.share_slug}',
                          f'/api/v1/events/shared/{event.share_slug}/']:
                self.assertEqual(self.client.get(route).status_code, 404, route)
        self.assertEqual(self.client.get('/share/events/unknown').status_code, 404)
        self.owner.is_active = False
        self.owner.save()
        self.assertEqual(self.client.get('/share/events/abia-tech-rise').status_code, 404)

    def test_migration_assigns_names_to_existing_records(self):
        from importlib import import_module
        from django.apps import apps
        from django.db import connection
        self.event.share_slug = 'old-name'
        self.event.save()
        duplicate = self.create_event('Abia Tech Rise')
        # The migration's historical models update rows without calling save().
        migration = import_module('apps.events.migrations.0013_event_share_slug')
        from types import SimpleNamespace
        Event.objects.filter(pk=duplicate.pk).update(share_slug='another-old-name')
        migration.populate_share_slugs(apps, SimpleNamespace(connection=connection))
        self.event.refresh_from_db()
        duplicate.refresh_from_db()
        self.assertEqual(self.event.share_slug, 'abia-tech-rise')
        self.assertEqual(duplicate.share_slug, 'abia-tech-rise-2')
