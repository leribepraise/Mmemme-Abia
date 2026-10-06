from urllib.parse import urlsplit

from django.conf import settings
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.html import strip_tags
from rest_framework import permissions, serializers, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.common.api import validate_image
from .blog_content import clean_content
from .blog_models import Article, BlogImage, ArticleSlugRedirect


def can_manage_blog(user):
    return bool(user.is_authenticated and user.is_active and user.has_perm('community.manage_blog'))


class BlogEditorPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return can_manage_blog(request.user)


class ArticleSerializer(serializers.ModelSerializer):
    featured_image = serializers.CharField(max_length=1000, allow_blank=True, required=False)
    categories = serializers.ListField(child=serializers.CharField(max_length=80), max_length=20, required=False)
    tags = serializers.ListField(child=serializers.CharField(max_length=80), max_length=30, required=False)
    url = serializers.SerializerMethodField()
    resolved_canonical_url = serializers.SerializerMethodField()

    def get_url(self, obj):
        return settings.FRONTEND_URL + obj.get_absolute_url()

    def get_resolved_canonical_url(self, obj):
        return obj.canonical_url or self.get_url(obj)

    def validate_body(self, value):
        return clean_content(value)

    def validate_slug(self, value):
        redirects = ArticleSlugRedirect.objects.filter(slug=value)
        if self.instance:
            redirects = redirects.exclude(article=self.instance)
        if redirects.exists():
            raise serializers.ValidationError('This URL belongs to an existing article redirect. Choose another slug.')
        return value

    def update(self, instance, validated_data):
        from django.db import transaction
        previous_slug = instance.slug
        with transaction.atomic():
            article = super().update(instance, validated_data)
            if article.slug != previous_slug:
                ArticleSlugRedirect.objects.get_or_create(slug=previous_slug, defaults={'article': article})
            return article

    def validate_canonical_url(self, value):
        if value and urlsplit(value).scheme not in {'http', 'https'}:
            raise serializers.ValidationError('Use an absolute HTTP or HTTPS URL.')
        return value

    def validate_featured_image(self, value):
        if value:
            # Editors share the blog media library; arbitrary external covers are rejected.
            from .blog_views import image_url
            if not any(image_url(image) == value for image in BlogImage.objects.all()):
                if not self.instance or value != self.instance.featured_image:
                    raise serializers.ValidationError('Select an uploaded blog image.')
        return value

    def validate(self, attrs):
        def value(key, default=None):
            return attrs.get(key, getattr(self.instance, key, default))
        status = value('status', 'DRAFT')
        if status in {'PUBLISHED', 'SCHEDULED'}:
            if not strip_tags(value('body', '')).strip():
                raise serializers.ValidationError({'body': 'Write article content before publishing.'})
            if value('featured_image', '') and not value('featured_image_alt', '').strip():
                raise serializers.ValidationError({'featured_image_alt': 'Describe the featured image.'})
        if status == 'SCHEDULED':
            scheduled = value('scheduled_at')
            if not scheduled or scheduled <= timezone.now():
                raise serializers.ValidationError({'scheduled_at': 'Choose a future date and time.'})
            attrs['published_at'] = None
        elif status == 'PUBLISHED':
            attrs['published_at'] = getattr(self.instance, 'published_at', None) or timezone.now()
            attrs['scheduled_at'] = None
        else:
            attrs['scheduled_at'] = None
        for field in ['categories', 'tags']:
            if field in attrs:
                attrs[field] = list(dict.fromkeys(x.strip() for x in attrs[field] if x.strip()))
        return attrs

    class Meta:
        model = Article
        fields = ['id', 'author', 'author_name', 'title', 'slug', 'body', 'page_title', 'meta_description', 'canonical_url', 'resolved_canonical_url', 'url', 'featured_image', 'featured_image_alt', 'categories', 'tags', 'status', 'scheduled_at', 'published_at', 'created_at', 'updated_at']
        read_only_fields = ['id', 'author', 'published_at', 'created_at', 'updated_at']


class BlogEditorViewSet(viewsets.ModelViewSet):
    permission_classes = [BlogEditorPermission]
    serializer_class = ArticleSerializer
    queryset = Article.objects.select_related('author')
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=False, methods=['get'])
    def access(self, request):
        return Response({'can_manage_blog': True})

    @action(detail=False, methods=['post'])
    def images(self, request):
        class UploadSerializer(serializers.ModelSerializer):
            def validate_image(self, value):
                return validate_image(value)
            class Meta:
                model = BlogImage
                fields = ['image', 'alt']
        serializer = UploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        image = serializer.save(owner=request.user)
        from .blog_views import image_url
        return Response({'url': image_url(image), 'alt': image.alt}, status=201)

    @action(detail=False, methods=['post'])
    def preview(self, request):
        # Preview never writes or publishes the supplied content.
        data = {**request.data, 'status': 'DRAFT', 'slug': 'preview'}
        pk = serializers.IntegerField(min_value=1).run_validation(request.data['id']) if request.data.get('id') else None
        instance = self.get_queryset().filter(pk=pk).first() if pk else None
        serializer = ArticleSerializer(instance=instance, data=data, context={'request': request})
        serializer.fields['slug'].validators = []
        serializer.is_valid(raise_exception=True)
        article = Article(**serializer.validated_data, author=request.user)
        if instance:
            article.published_at = instance.published_at
        from .blog_views import article_context
        context = article_context(article, preview=True)
        context['initial_theme'] = 'dark' if request.data.get('theme') == 'dark' else 'light'
        response = Response({'html': render_to_string('community/blog_detail.html', context)})
        response['Cache-Control'] = 'no-store'
        response['X-Robots-Tag'] = 'noindex, nofollow'
        return response


class PublicArticleViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = ArticleSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return Article.objects.public().select_related('author').order_by('-published_at', '-pk')


def publish_due_articles():
    now = timezone.now()
    from django.db.models import F
    return Article.objects.filter(status='SCHEDULED', scheduled_at__lte=now, author__is_active=True).update(status='PUBLISHED', published_at=F('scheduled_at'), scheduled_at=None, updated_at=now)
