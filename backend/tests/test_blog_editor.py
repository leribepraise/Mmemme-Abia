from datetime import timedelta
from io import BytesIO
from tempfile import TemporaryDirectory

from django.contrib.auth.models import Permission
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management import call_command
from django.test import TestCase, override_settings
from django.utils import timezone
from PIL import Image
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.community.blog_models import Article, BlogImage
from apps.community.blog_api import publish_due_articles


@override_settings(FRONTEND_URL='https://mmemme.com.ng')
class BlogEditorTests(TestCase):
    def setUp(self):
        self.editor = User.objects.create_user('writer', 'writer@example.test', 'Strong-test-42!', email_verified=True)
        self.reader = User.objects.create_user('reader', 'reader@example.test', 'Strong-test-42!', email_verified=True)
        self.editor.user_permissions.add(Permission.objects.get(codename='manage_blog', content_type__app_label='community'))
        self.client = APIClient()
        self.client.force_authenticate(self.editor)
        self.base = '/api/v1/blog-editor/articles/'
        self.data = {'title': 'Abia culture', 'slug': 'abia-culture', 'author_name': 'Ada', 'body': '<h2>Our traditions</h2><p>A story about Abia.</p>', 'categories': ['Culture'], 'tags': ['Abia']}

    def create(self, **changes):
        response = self.client.post(self.base, {**self.data, **changes}, format='json')
        self.assertEqual(response.status_code, 201, response.data)
        return response.data

    def test_non_staff_editor_can_create_but_cannot_enter_admin(self):
        article = self.create()
        self.assertEqual(article['status'], 'DRAFT')
        self.assertFalse(self.editor.is_staff)
        for path in ['overview/', 'users/', 'events/', 'manage/posts/']:
            self.assertEqual(self.client.get('/api/v1/admin/' + path).status_code, 403)
        self.assertTrue(self.client.get('/api/v1/auth/me/').data['can_manage_blog'])

    def test_ordinary_users_and_anonymous_cannot_manage_or_preview(self):
        article = self.create()
        for user in [self.reader, None]:
            self.client.force_authenticate(user)
            for path in [self.base, self.base + f"{article['id']}/", self.base + 'access/']:
                self.assertIn(self.client.get(path).status_code, [401, 403])
            for path in [self.base, self.base + 'preview/', self.base + 'images/']:
                self.assertIn(self.client.post(path, self.data, format='json').status_code, [401, 403])
            self.assertIn(self.client.patch(self.base + f"{article['id']}/", {'status': 'PUBLISHED'}, format='json').status_code, [401, 403])
            self.assertIn(self.client.delete(self.base + f"{article['id']}/").status_code, [401, 403])

    def test_drafts_are_private_and_preview_does_not_publish(self):
        self.create()
        before = Article.objects.count()
        preview = self.client.post(self.base + 'preview/', {**self.data, 'theme': 'dark'}, format='json')
        self.assertEqual(preview.status_code, 200, preview.data)
        self.assertIn('<h2>Our traditions</h2>', preview.data['html'])
        self.assertIn('noindex,nofollow', preview.data['html'])
        self.assertIn('class="dark"', preview.data['html'])
        self.assertNotIn('/blog-shell-loader.js', preview.data['html'])
        self.assertEqual(preview['Cache-Control'], 'no-store')
        self.assertEqual(Article.objects.count(), before)
        self.client.force_authenticate(None)
        self.assertEqual(self.client.get('/blog/abia-culture').status_code, 404)
        self.assertEqual(self.client.get('/api/v1/blog/articles/abia-culture/').status_code, 404)
        self.assertNotIn('abia-culture', self.client.get('/sitemap.xml').content.decode())

    def test_published_response_has_content_seo_and_own_canonical(self):
        self.create(status='PUBLISHED', page_title='Abia festivals guide', meta_description='Explore Abia traditions.')
        self.client.force_authenticate(None)
        response = self.client.get('/blog/abia-culture')
        self.assertEqual(response.status_code, 200)
        html = response.content.decode()
        self.assertIn('/blog-shell-loader.js', html)
        self.assertIn('mmemme-theme', html)
        for text in ['<title>Abia festivals guide</title>', '<h2>Our traditions</h2>', 'Explore Abia traditions.', 'By Ada', '<time datetime=', 'https://mmemme.com.ng/blog/abia-culture', 'application/ld+json']:
            self.assertIn(text, html)
        sitemap = self.client.get('/sitemap.xml').content.decode()
        self.assertIn('https://mmemme.com.ng/blog/abia-culture', sitemap)
        self.assertIn('<lastmod>', sitemap)
        self.assertIn('https://mmemme.com.ng/events', sitemap)
        self.assertIn('Abia culture', self.client.get('/blog').content.decode())

    def test_canonical_override_and_json_script_are_safe(self):
        self.create(status='PUBLISHED', canonical_url='https://example.test/original', title='</script><script>alert(1)</script>')
        html = self.client.get('/blog/abia-culture').content.decode()
        self.assertIn('href="https://example.test/original"', html)
        self.assertNotIn('<script>alert(1)</script>', html)

    def test_content_sanitizer_preserves_tables_images_and_removes_xss(self):
        body = '<h2>Title</h2><blockquote>Quote</blockquote><ul><li>One</li></ul><table><tbody><tr><td>Cell</td></tr></tbody></table><img src="https://example.test/image.jpg" alt="Festival" onerror="alert(1)"><a href="javascript:alert(1)">Bad link</a><script>alert(2)</script><iframe src="https://evil.test"></iframe>'
        article = self.create(body=body)
        for text in ['<table>', '<blockquote>', '<ul>', 'alt="Festival"']:
            self.assertIn(text, article['body'])
        for text in ['onerror', 'javascript:', '<script', '<iframe', 'alert(2)']:
            self.assertNotIn(text, article['body'])

    def test_scheduled_posts_publish_once_only_when_due(self):
        future = timezone.now() + timedelta(hours=2)
        result = self.create(status='SCHEDULED', scheduled_at=future.isoformat())
        self.assertEqual(publish_due_articles(), 0)
        self.assertEqual(self.client.get('/blog/abia-culture').status_code, 404)
        self.assertNotIn('abia-culture', self.client.get('/sitemap.xml').content.decode())
        due = timezone.now() - timedelta(minutes=5)
        Article.objects.filter(pk=result['id']).update(scheduled_at=due)
        self.assertEqual(publish_due_articles(), 1)
        self.assertEqual(publish_due_articles(), 0)
        article = Article.objects.get(pk=result['id'])
        self.assertEqual(article.published_at, due)
        self.assertEqual(self.client.get('/blog/abia-culture').status_code, 200)
        self.assertIn('abia-culture', self.client.get('/sitemap.xml').content.decode())

    def test_cancel_schedule_unpublish_republish_and_delete(self):
        result = self.create(status='SCHEDULED', scheduled_at=(timezone.now() + timedelta(hours=2)).isoformat())
        url = self.base + f"{result['id']}/"
        self.assertEqual(self.client.patch(url, {'status': 'DRAFT'}, format='json').status_code, 200)
        Article.objects.filter(pk=result['id']).update(scheduled_at=timezone.now() - timedelta(hours=1))
        self.assertEqual(publish_due_articles(), 0)
        self.assertEqual(self.client.patch(url, {'status': 'PUBLISHED'}, format='json').status_code, 200)
        published = Article.objects.get(pk=result['id']).published_at
        self.assertEqual(self.client.patch(url, {'title': 'Updated'}, format='json').status_code, 200)
        self.assertEqual(Article.objects.get(pk=result['id']).published_at, published)
        self.assertEqual(self.client.patch(url, {'status': 'DRAFT'}, format='json').status_code, 200)
        self.assertEqual(self.client.get('/blog/abia-culture').status_code, 404)
        self.assertNotIn('abia-culture', self.client.get('/sitemap.xml').content.decode())
        self.assertEqual(self.client.delete(url).status_code, 204)
        self.assertFalse(Article.objects.filter(pk=result['id']).exists())

    def test_invalid_schedule_empty_content_and_duplicate_slugs_are_rejected(self):
        for changes in [{'status': 'SCHEDULED'}, {'status': 'SCHEDULED', 'scheduled_at': (timezone.now() - timedelta(days=1)).isoformat()}, {'status': 'PUBLISHED', 'body': '<p></p>'}, {'canonical_url': 'ftp://example.test/a'}]:
            self.assertEqual(self.client.post(self.base, {**self.data, **changes}, format='json').status_code, 400)
        self.create()
        self.assertEqual(self.client.post(self.base, self.data, format='json').status_code, 400)

    def test_validated_upload_and_featured_alt(self):
        with TemporaryDirectory() as media, override_settings(MEDIA_ROOT=media):
            output = BytesIO()
            Image.new('RGB', (10, 10), 'green').save(output, format='PNG')
            response = self.client.post(self.base + 'images/', {'image': SimpleUploadedFile('cover.png', output.getvalue(), content_type='image/png'), 'alt': 'Abia festival'}, format='multipart')
            self.assertEqual(response.status_code, 201, response.data)
            image_url = response.data['url']
            self.assertIn('/blog-media/', image_url)
            from urllib.parse import urlsplit
            image_response = self.client.get(urlsplit(image_url).path)
            self.assertEqual(image_response.status_code, 302)
            self.assertEqual(image_response['Cache-Control'], 'no-store')
            self.assertIn('/media/blog/', image_response['Location'])
            self.assertEqual(self.client.post(self.base, {**self.data, 'status': 'PUBLISHED', 'featured_image': image_url}, format='json').status_code, 400)
            self.create(status='PUBLISHED', featured_image=image_url, featured_image_alt='Abia festival')
            html = self.client.get('/blog/abia-culture').content.decode()
            self.assertIn('alt="Abia festival"', html)
            preview = self.client.post(self.base + 'preview/', {**self.data, 'featured_image': image_url}, format='json')
            self.assertEqual(preview.status_code, 200, preview.data)
            bad = self.client.post(self.base + 'images/', {'image': SimpleUploadedFile('evil.png', b'not an image'), 'alt': 'test'}, format='multipart')
            self.assertEqual(bad.status_code, 400)

    def test_permission_grant_and_revoke_does_not_grant_staff(self):
        call_command('grant_blog_editor', self.reader.email)
        self.reader.refresh_from_db()
        self.assertFalse(self.reader.is_staff)
        self.assertTrue(self.reader.has_perm('community.manage_blog'))
        call_command('grant_blog_editor', self.reader.email, revoke=True)
        self.assertFalse(User.objects.get(pk=self.reader.pk).has_perm('community.manage_blog'))

    def test_legacy_url_redirects_and_old_endpoint_cannot_create_blogs(self):
        result = self.create(status='PUBLISHED')
        Article.objects.filter(pk=result['id']).update(legacy_post_id=123)
        response = self.client.get('/blog/123')
        self.assertEqual(response.status_code, 301)
        self.assertEqual(response['Location'], '/blog/abia-culture')
        self.assertEqual(self.client.post('/api/v1/community/posts/', {'kind': 'BLOG', 'title': 'Bypass', 'body': 'test'}, format='json').status_code, 403)

    def test_slug_changes_redirect_and_old_urls_cannot_be_reused(self):
        result = self.create(status='PUBLISHED')
        url = self.base + f"{result['id']}/"
        self.assertEqual(self.client.patch(url, {'slug': 'new-abia-guide'}, format='json').status_code, 200)
        response = self.client.get('/blog/abia-culture')
        self.assertEqual(response.status_code, 301)
        self.assertEqual(response['Location'], '/blog/new-abia-guide')
        self.assertEqual(self.client.post(self.base, self.data, format='json').status_code, 400)
        self.assertNotIn('/blog/abia-culture', self.client.get('/sitemap.xml').content.decode())
        self.assertEqual(self.client.patch(url, {'status': 'DRAFT'}, format='json').status_code, 200)
        self.assertEqual(self.client.get('/blog/abia-culture').status_code, 404)

    def test_existing_posts_are_migrated_without_losing_their_links(self):
        import importlib
        from django.apps import apps
        from apps.community.models import Post
        post = Post.objects.create(author=self.editor, kind='BLOG', title='Old story', body='A story\n\n<script>plain text</script>', status='PUBLISHED', category='Culture')
        migrate = importlib.import_module('apps.community.migrations.0003_import_existing_blogs')
        migrate.import_blogs(apps, None)
        article = Article.objects.get(legacy_post_id=post.pk)
        self.assertEqual(article.status, 'PUBLISHED')
        self.assertEqual(article.published_at, post.created_at)
        self.assertEqual(article.categories, ['Culture'])
        self.assertIn('&lt;script&gt;', article.body)
        self.assertEqual(self.client.get(f'/blog/{post.pk}').status_code, 301)
        self.assertEqual(self.client.get(article.get_absolute_url()).status_code, 200)
