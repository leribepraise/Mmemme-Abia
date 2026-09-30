from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import Q, Count, Exists, OuterRef
from django.shortcuts import get_object_or_404
from rest_framework import permissions, serializers, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from apps.common.api import validate_image
from apps.common.models import audit
from .models import CommunityProfile, Group, GroupMember, Post, Comment, Like, Report


def person(user):
    return {'id': user.pk, 'name': user.get_full_name() or user.username,
            'avatar': user.avatar.url if user.avatar else None, 'bio': user.bio}


class PostSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    like_count = serializers.IntegerField(read_only=True)
    comment_count = serializers.IntegerField(read_only=True)
    liked = serializers.BooleanField(read_only=True)
    def get_author(self, obj):
        return person(obj.author)
    def validate_image(self, value):
        return validate_image(value) if value else value
    def validate(self, attrs):
        user = self.context['request'].user
        if attrs.get('kind', getattr(self.instance, 'kind', 'COMMUNITY')) == 'BLOG':
            if not user.has_perm('community.add_post') or not user.is_staff:
                raise PermissionDenied('Only editors can create blog articles.')
            if not attrs.get('title', getattr(self.instance, 'title', '')).strip():
                raise serializers.ValidationError({'title': 'An article title is required.'})
        group = attrs.get('group', getattr(self.instance, 'group', None))
        if group and (not group.is_active or not GroupMember.objects.filter(group=group, user=user).exists()):
            raise PermissionDenied('Join this active group before posting.')
        return attrs
    class Meta:
        model = Post
        fields = ['id', 'author', 'kind', 'group', 'title', 'body', 'image', 'category', 'status', 'created_at', 'updated_at', 'like_count', 'comment_count', 'liked']
        read_only_fields = ['id', 'author', 'status', 'created_at', 'updated_at']


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    def get_author(self, obj):
        return person(obj.author)
    class Meta:
        model = Comment
        fields = ['id', 'author', 'body', 'created_at']
        read_only_fields = ['id', 'author', 'created_at']


class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']
    def get_permissions(self):
        return [permissions.AllowAny()] if self.action in {'list', 'retrieve'} else [permissions.IsAuthenticated()]
    def get_queryset(self):
        user = self.request.user
        qs = Post.objects.select_related('author', 'group').filter(author__is_active=True)
        if self.action in {'mine', 'update', 'partial_update', 'destroy'}:
            qs = qs.filter(author=user)
        else:
            qs = qs.filter(status='PUBLISHED').filter(Q(group__isnull=True) | Q(group__is_active=True))
            # Community content requires an authenticated account; blog articles are public.
            if not user.is_authenticated:
                qs = qs.filter(kind='BLOG')
        for field in ['kind', 'category', 'group']:
            if self.request.query_params.get(field):
                value = self.request.query_params[field]
                if field == 'group':
                    value = serializers.IntegerField(min_value=1).run_validation(value)
                qs = qs.filter(**{field: value})
        if self.request.query_params.get('search'):
            text = self.request.query_params['search'][:200]
            qs = qs.filter(Q(body__icontains=text) | Q(title__icontains=text))
        qs = qs.annotate(like_count=Count('likes', distinct=True), comment_count=Count('comments', filter=Q(comments__is_hidden=False), distinct=True),
                         liked=Exists(Like.objects.filter(post_id=OuterRef('pk'), user_id=user.pk if user.is_authenticated else None)))
        return qs.order_by('-like_count', '-created_at', '-pk') if self.request.query_params.get('sort') == 'trending' else qs.order_by('-created_at', '-pk')
    def perform_create(self, serializer):
        kind = serializer.validated_data.get('kind', 'COMMUNITY')
        serializer.save(author=self.request.user, status='PUBLISHED' if kind == 'COMMUNITY' else 'PENDING')
    def perform_update(self, serializer):
        if serializer.instance.author_id != self.request.user.pk:
            raise PermissionDenied()
        # An author edit must not undo a moderator's removal.
        status = 'HIDDEN' if serializer.instance.status == 'HIDDEN' else 'PUBLISHED' if serializer.validated_data.get('kind', serializer.instance.kind) == 'COMMUNITY' else 'PENDING'
        serializer.save(status=status)
    def perform_destroy(self, instance):
        if instance.author_id != self.request.user.pk:
            raise PermissionDenied()
        instance.status = 'HIDDEN'
        instance.save(update_fields=['status'])
    @action(detail=False, methods=['get'])
    def mine(self, request):
        return self.list(request)
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        post = self.get_object()
        enabled = serializers.BooleanField().run_validation(request.data.get('liked'))
        if enabled:
            Like.objects.get_or_create(post=post, user=request.user)
        else:
            Like.objects.filter(post=post, user=request.user).delete()
        return Response({'liked': enabled, 'like_count': post.likes.count()})
    @action(detail=True, methods=['get', 'post'])
    def comments(self, request, pk=None):
        post = self.get_object()
        if request.method == 'POST':
            if post.group_id and not GroupMember.objects.filter(group=post.group, user=request.user).exists():
                raise PermissionDenied('Join the group before commenting.')
            serializer = CommentSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(post=post, author=request.user)
            return Response(serializer.data, status=201)
        rows = post.comments.filter(is_hidden=False, author__is_active=True).select_related('author').order_by('-created_at', '-pk')
        return self.get_paginated_response(CommentSerializer(self.paginate_queryset(rows), many=True).data)
    @action(detail=True, methods=['post'])
    def report(self, request, pk=None):
        reason = serializers.CharField(max_length=1000).run_validation(request.data.get('reason'))
        Report.objects.update_or_create(post=self.get_object(), reporter=request.user, defaults={'reason': reason, 'resolved': False})
        return Response({'detail': 'Report sent to the moderation team.'})


class GroupSerializer(serializers.ModelSerializer):
    member_count = serializers.IntegerField(read_only=True)
    joined = serializers.BooleanField(read_only=True)
    class Meta:
        model = Group
        fields = ['id', 'name', 'description', 'owner', 'is_active', 'member_count', 'joined']
        read_only_fields = ['id', 'owner', 'is_active']


class GroupViewSet(viewsets.ModelViewSet):
    serializer_class = GroupSerializer
    http_method_names = ['get', 'post', 'head', 'options']
    def get_queryset(self):
        qs = Group.objects.filter(owner__is_active=True).filter(Q(is_active=True) | Q(owner=self.request.user)).annotate(
            member_count=Count('memberships'), joined=Exists(GroupMember.objects.filter(group_id=OuterRef('pk'), user=self.request.user)))
        if self.request.query_params.get('mine') == 'true':
            qs = qs.filter(memberships__user=self.request.user)
        return qs.order_by('name', 'pk')
    @transaction.atomic
    def perform_create(self, serializer):
        group = serializer.save(owner=self.request.user, is_active=True)
        GroupMember.objects.create(group=group, user=self.request.user)
    @action(detail=True, methods=['post'])
    @transaction.atomic
    def membership(self, request, pk=None):
        group = self.get_object()
        if not group.is_active:
            raise PermissionDenied('This group is unavailable.')
        joined = serializers.BooleanField().run_validation(request.data.get('joined'))
        if joined:
            GroupMember.objects.get_or_create(group=group, user=request.user)
        elif group.owner_id != request.user.pk:
            GroupMember.objects.filter(group=group, user=request.user).delete()
        else:
            raise serializers.ValidationError('Group owners must stay in their group.')
        return Response({'joined': joined})


class PersonSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    allow_messages = serializers.BooleanField(source='community_profile.allow_messages', read_only=True)
    def get_name(self, obj):
        return obj.get_full_name() or obj.username
    class Meta:
        model = get_user_model()
        fields = ['id', 'name', 'bio', 'avatar', 'allow_messages']


class PeopleViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PersonSerializer
    def get_queryset(self):
        qs = get_user_model().objects.filter(
            is_active=True,
            email_verified=True
        ).select_related('community_profile').order_by('first_name', 'pk')
        if self.request.query_params.get('search'):
            term = self.request.query_params['search'][:100]
            qs = qs.filter(Q(first_name__icontains=term) | Q(last_name__icontains=term))
        return qs
    @action(detail=False, methods=['get', 'patch'])
    def preferences(self, request):
        profile, _ = CommunityProfile.objects.get_or_create(user=request.user)
        if request.method == 'PATCH':
            for field in ['listed', 'allow_messages']:
                if field in request.data:
                    setattr(profile, field, serializers.BooleanField().run_validation(request.data[field]))
            profile.save()
        return Response({'listed': profile.listed, 'allow_messages': profile.allow_messages})
