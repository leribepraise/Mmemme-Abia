from datetime import timedelta
from importlib import import_module

from django.apps import apps
from django.contrib.auth.models import Permission
from django.core.cache import cache
from django.test import TestCase, override_settings
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.models import User
from apps.community.blog_models import Article, ArticleComment
from apps.community.models import Comment, Post


@override_settings(FRONTEND_URL='https://www.mmemme.com.ng')
class BlogCommentTests(TestCase):
    def setUp(self):
        cache.clear()
        self.writer = User.objects.create_user('writer', 'writer@example.test', 'test', email_verified=True)
        self.reader = User.objects.create_user('reader', 'reader@example.test', 'test', email_verified=True, first_name='Ada', last_name='Obi')
        self.other = User.objects.create_user('other', 'other@example.test', 'test', email_verified=True)
        self.article = Article.objects.create(
            author=self.writer, author_name='Writer', title='Discover Abia', slug='discover-abia',
            body='<p>Explore Abia.</p>', status='PUBLISHED', published_at=timezone.now(),
        )
        self.url = '/api/v1/blog/articles/discover-abia/comments/'
        self.client = APIClient()

    def comment(self, **changes):
        return ArticleComment.objects.create(**{'article': self.article, 'author': self.reader, 'body': 'Great read!', **changes})

    def test_comments_are_public_paginated_newest_first_without_private_account_data(self):
        for number in range(26):
            self.comment(body=f'Comment {number}')
        self.comment(is_hidden=True)
        self.other.is_active = False
        self.other.save()
        self.comment(author=self.other)
        result = self.client.get(self.url)
        self.assertEqual(result.status_code, 200)
        self.assertEqual(result.data['count'], 26)
        self.assertEqual(len(result.data['results']), 24)
        first = result.data['results'][0]
        self.assertEqual(first['body'], 'Comment 25')
        self.assertEqual(first['author'], {'id': self.reader.pk, 'name': 'Ada Obi'})
        self.assertFalse(first['can_remove'])
        self.assertNotIn(self.reader.email, str(result.data))
        self.assertEqual(len(self.client.get(self.url + '?page=2').data['results']), 2)

    def test_post_requires_login_and_stores_the_authenticated_author(self):
        self.assertEqual(self.client.post(self.url, {'body': 'Hello'}).status_code, 401)
        self.client.force_authenticate(self.reader)
        response = self.client.post(self.url, {'body': '  Thanks for sharing!  ', 'author': self.other.pk, 'article': 999, 'is_hidden': True}, format='json')
        self.assertEqual(response.status_code, 201, response.data)
        saved = ArticleComment.objects.get()
        self.assertEqual(saved.author, self.reader)
        self.assertEqual(saved.article, self.article)
        self.assertEqual(saved.body, 'Thanks for sharing!')
        self.assertFalse(saved.is_hidden)
        self.assertTrue(response.data['can_remove'])

    def test_blank_and_oversized_comments_are_rejected(self):
        self.client.force_authenticate(self.reader)
        for data in [{}, {'body': ''}, {'body': ' \n\t '}, {'body': 'x' * 2001}]:
            self.assertEqual(self.client.post(self.url, data, format='json').status_code, 400)
        self.assertFalse(ArticleComment.objects.exists())

    def test_comments_are_unavailable_for_private_future_and_inactive_author_articles(self):
        self.comment()
        self.client.force_authenticate(self.reader)
        for changes in [
            {'status': 'DRAFT'},
            {'status': 'SCHEDULED'},
            {'status': 'PUBLISHED', 'published_at': timezone.now() + timedelta(days=1)},
        ]:
            Article.objects.filter(pk=self.article.pk).update(**changes)
            self.assertEqual(self.client.get(self.url).status_code, 404)
            self.assertEqual(self.client.post(self.url, {'body': 'Hidden'}).status_code, 404)
        Article.objects.filter(pk=self.article.pk).update(status='PUBLISHED', published_at=timezone.now())
        self.writer.is_active = False
        self.writer.save()
        self.assertEqual(self.client.get(self.url).status_code, 404)

    def test_only_author_or_moderator_can_remove_and_removal_hides_comment(self):
        row = self.comment()
        url = self.url + f'{row.pk}/'
        self.assertEqual(self.client.delete(url).status_code, 401)
        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.delete(url).status_code, 403)
        self.client.force_authenticate(self.reader)
        self.assertEqual(self.client.delete(url).status_code, 204)
        row.refresh_from_db()
        self.assertTrue(row.is_hidden)
        self.assertEqual(self.client.get(self.url).data['count'], 0)
        self.assertEqual(self.client.delete(url).status_code, 404)

    def test_blog_editor_can_moderate_without_staff_access(self):
        row = self.comment()
        self.writer.user_permissions.add(Permission.objects.get(codename='manage_blog', content_type__app_label='community'))
        self.client.force_authenticate(self.writer)
        self.assertTrue(self.client.get(self.url).data['results'][0]['can_remove'])
        self.assertEqual(self.client.delete(self.url + f'{row.pk}/').status_code, 204)
        self.assertFalse(self.writer.is_staff)

    def test_comment_cannot_be_removed_through_a_different_article(self):
        another = Article.objects.create(author=self.writer, author_name='Writer', title='Other', slug='other', status='PUBLISHED', published_at=timezone.now())
        row = self.comment(article=another)
        self.client.force_authenticate(self.reader)
        self.assertEqual(self.client.delete(self.url + f'{row.pk}/').status_code, 404)
        self.assertFalse(ArticleComment.objects.get(pk=row.pk).is_hidden)

    def test_revoked_unverified_and_inactive_sessions_cannot_comment(self):
        token = str(RefreshToken.for_user(self.reader).access_token)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        for changes in [{'email_verified': False}, {'email_verified': True, 'is_active': False}, {'is_active': True, 'session_version': 1}]:
            User.objects.filter(pk=self.reader.pk).update(**changes)
            self.assertEqual(self.client.post(self.url, {'body': 'Invalid session'}).status_code, 401)
        self.assertFalse(ArticleComment.objects.exists())

    def test_repeated_posting_is_throttled(self):
        self.client.force_authenticate(self.reader)
        for _ in range(10):
            self.assertEqual(self.client.post(self.url, {'body': 'A comment'}).status_code, 201)
        response = self.client.post(self.url, {'body': 'One too many'})
        self.assertEqual(response.status_code, 429)
        self.assertIn('Retry-After', response)

    def test_article_html_escapes_comments_shares_local_url_and_renders_comment_pages(self):
        self.article.canonical_url = 'https://example.test/original'
        self.article.save()
        row = self.comment(body='<script>alert("bad")</script>\nA second line')
        self.comment(body='A hidden comment', is_hidden=True)
        html = self.client.get('/blog/discover-abia').content.decode()
        self.assertIn('Share this article', html)
        self.assertIn('WhatsApp', html)
        self.assertIn('Facebook', html)
        self.assertIn('Comments (1)', html)
        self.assertIn('Ada Obi', html)
        self.assertIn('&lt;script&gt;', html)
        self.assertNotIn('<script>alert(', html)
        self.assertNotIn('A hidden comment', html)
        self.assertIn('blog-engagement-data', html)
        self.assertIn('"url": "https://www.mmemme.com.ng/blog/discover-abia"', html)
        self.assertIn('next=%2Fblog%2Fdiscover-abia%23comments', html)
        for i in range(24):
            self.comment(body=f'More {i}')
        second = self.client.get('/blog/discover-abia?comment_page=2')
        self.assertEqual(second.context['comments_page'][0].pk, row.pk)

    def test_preview_does_not_expose_or_enable_article_engagement(self):
        self.writer.user_permissions.add(Permission.objects.get(codename='manage_blog', content_type__app_label='community'))
        self.client.force_authenticate(self.writer)
        result = self.client.post('/api/v1/blog-editor/articles/preview/', {'id': self.article.pk, 'title': 'Preview', 'author_name': 'Writer', 'body': '<p>Draft</p>'}, format='json')
        self.assertEqual(result.status_code, 200)
        self.assertNotIn('blog-article-comments', result.data['html'])
        self.assertNotIn('blog-article-share', result.data['html'])

    def test_legacy_comments_keep_body_author_visibility_and_timestamp(self):
        post = Post.objects.create(author=self.writer, kind='BLOG', body='Old article')
        self.article.legacy_post_id = post.pk
        self.article.save()
        old = Comment.objects.create(post=post, author=self.reader, body='An old comment', is_hidden=True)
        import_module('apps.community.migrations.0005_articlecomment').import_legacy_comments(apps, None)
        imported = ArticleComment.objects.get()
        self.assertEqual(imported.article, self.article)
        self.assertEqual(imported.author, self.reader)
        self.assertEqual(imported.body, old.body)
        self.assertTrue(imported.is_hidden)
        self.assertEqual(imported.created_at, old.created_at)
