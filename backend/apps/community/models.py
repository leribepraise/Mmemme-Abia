from django.conf import settings
from django.db import models


class CommunityProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='community_profile')
    listed = models.BooleanField(default=False)
    allow_messages = models.BooleanField(default=False)


class Group(models.Model):
    name = models.CharField(max_length=120)
    description = models.TextField(max_length=2000)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


class GroupMember(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='memberships')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        constraints = [models.UniqueConstraint(fields=['group', 'user'], name='community_member_once')]


class Post(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    kind = models.CharField(max_length=12, default='COMMUNITY', choices=[('COMMUNITY', 'Community'), ('BLOG', 'Blog')])
    group = models.ForeignKey(Group, null=True, blank=True, on_delete=models.PROTECT)
    title = models.CharField(max_length=200, blank=True)
    body = models.TextField(max_length=20000)
    image = models.ImageField(upload_to='community/', blank=True)
    category = models.CharField(max_length=80, blank=True)
    status = models.CharField(max_length=12, default='PENDING', choices=[(x, x.title()) for x in ['PENDING', 'PUBLISHED', 'HIDDEN']])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        ordering = ['-created_at', '-pk']
        indexes = [models.Index(fields=['kind', 'status', 'created_at'])]


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    body = models.CharField(max_length=2000)
    is_hidden = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


class Like(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    class Meta:
        constraints = [models.UniqueConstraint(fields=['post', 'user'], name='community_like_once')]


class Report(models.Model):
    post = models.ForeignKey(Post, on_delete=models.PROTECT)
    reporter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    reason = models.CharField(max_length=1000)
    resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        constraints = [models.UniqueConstraint(fields=['post', 'reporter'], name='community_report_once')]
