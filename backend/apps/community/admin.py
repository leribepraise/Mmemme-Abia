from django.contrib import admin
from .models import CommunityProfile, Group, GroupMember, Post, Comment, Report
from .blog_models import ArticleComment


@admin.register(ArticleComment)
class ArticleCommentAdmin(admin.ModelAdmin):
    list_display = ['article', 'author', 'is_hidden', 'created_at']
    list_filter = ['is_hidden', 'created_at']
    search_fields = ['article__title', 'body', 'author__username']
    readonly_fields = ['article', 'author', 'body', 'created_at']
    actions = ['hide_comments']

    @admin.action(description='Hide selected blog comments')
    def hide_comments(self, request, queryset):
        queryset.update(is_hidden=True)

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'kind', 'author', 'status', 'created_at']
    list_filter = ['kind', 'status']
    search_fields = ['title', 'body']

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ['post', 'reporter', 'resolved', 'created_at']
    readonly_fields = ['post', 'reporter', 'reason', 'created_at']

admin.site.register([CommunityProfile, Group, GroupMember, Comment])
