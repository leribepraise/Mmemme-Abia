from rest_framework import serializers
from rest_framework.throttling import UserRateThrottle

from .blog_models import ArticleComment


def visible_comments(article):
    return article.comments.filter(is_hidden=False, author__is_active=True).select_related('author')


def can_remove_comment(user, comment):
    return bool(user and user.is_authenticated and user.is_active and (
        user.pk == comment.author_id or user.is_staff or user.has_perm('community.manage_blog')
    ))


class BlogCommentThrottle(UserRateThrottle):
    scope = 'blog_comments'
    rate = '10/minute'


class ArticleCommentSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    can_remove = serializers.SerializerMethodField()
    body = serializers.CharField(max_length=2000, trim_whitespace=True, allow_blank=False)

    def get_author(self, obj):
        return {'id': obj.author_id, 'name': obj.author.get_full_name() or obj.author.username}

    def get_can_remove(self, obj):
        request = self.context.get('request')
        return can_remove_comment(request.user if request else None, obj)

    class Meta:
        model = ArticleComment
        fields = ['id', 'author', 'body', 'created_at', 'can_remove']
        read_only_fields = ['id', 'author', 'created_at', 'can_remove']
