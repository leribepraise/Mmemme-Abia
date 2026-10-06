from django.conf import settings
import uuid
from django.db import models
from django.utils import timezone


class ArticleQuerySet(models.QuerySet):
    def public(self):
        return self.filter(status='PUBLISHED', published_at__lte=timezone.now(), author__is_active=True)


class Article(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    author_name = models.CharField(max_length=150)
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    legacy_post_id = models.PositiveIntegerField(null=True, blank=True, unique=True)
    body = models.TextField(max_length=200000, blank=True)
    page_title = models.CharField(max_length=200, blank=True)
    meta_description = models.CharField(max_length=320, blank=True)
    canonical_url = models.URLField(max_length=500, blank=True)
    featured_image = models.URLField(max_length=1000, blank=True)
    featured_image_alt = models.CharField(max_length=300, blank=True)
    categories = models.JSONField(default=list, blank=True)
    tags = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=12, default='DRAFT', choices=[(s, s.title()) for s in ['DRAFT', 'SCHEDULED', 'PUBLISHED']])
    scheduled_at = models.DateTimeField(null=True, blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    objects = ArticleQuerySet.as_manager()

    class Meta:
        ordering = ['-created_at', '-pk']
        permissions = [('manage_blog', 'Can manage blog without staff access')]
        indexes = [models.Index(fields=['status', 'scheduled_at'])]

    def get_absolute_url(self):
        return f'/blog/{self.slug}'


class BlogImage(models.Model):
    public_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    image = models.ImageField(upload_to='blog/%Y/%m/')
    alt = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)


class ArticleSlugRedirect(models.Model):
    slug = models.SlugField(max_length=200, unique=True)
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='old_slugs')
