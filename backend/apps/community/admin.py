from django.contrib import admin
from .models import CommunityProfile, Group, GroupMember, Post, Comment, Report

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
