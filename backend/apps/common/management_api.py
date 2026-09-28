"""Explicitly scoped staff operations; financial histories are never client-editable."""
from django.db import transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.accounts.administration import require_staff_permission
from apps.accounts.models import User
from apps.common.api import Pagination, Conflict
from apps.common.catalog import CONFIG, serializer_for, root_of, owner_of
from apps.common.models import audit, AuditLog, ServiceReview
from apps.bookings.models import Booking
from apps.payments.models import Payment, Refund, Payout
from apps.memberships.models import Plan, Membership, PlanPayment
from apps.community.models import Post, Group, Comment, Report
from apps.community.api import PostSerializer, GroupSerializer
from apps.events.models import EventReview

CATALOG = {('hotels' if cfg[0] == 'hotel' else cfg[0]): model for model, cfg in CONFIG.items()}
HISTORY = {
    'bookings': (Booking, ['id', 'booking_reference', 'user', 'supplier', 'kind', 'status', 'fulfillment_status', 'total_amount', 'currency', 'created_at']),
    'payments': (Payment, ['id', 'user', 'booking', 'reference', 'amount', 'currency', 'status', 'paid_at']),
    'refunds': (Refund, ['id', 'payment', 'amount', 'status', 'reason', 'created_at']),
    'payouts': (Payout, ['id', 'provider', 'amount', 'currency', 'status', 'created_at']),
    'subscriptions': (Membership, ['id', 'user', 'plan', 'expires_at']),
    'plan-payments': (PlanPayment, ['id', 'user', 'plan', 'reference', 'amount', 'status', 'paid_at', 'expires_at']),
    'audit': (AuditLog, ['id', 'action', 'target', 'created_at']),
}
EDITABLE = {
    'reviews': (EventReview, ['id', 'event', 'user', 'rating', 'comment', 'is_approved', 'created_at']),
    'service-reviews': (ServiceReview, ['id', 'booking', 'rating', 'comment', 'is_approved', 'created_at']),
    'plans': (Plan, ['code', 'name', 'price', 'features', 'is_active']),
    'posts': (Post, ['id', 'author', 'kind', 'group', 'title', 'body', 'image', 'category', 'status', 'created_at']),
    'groups': (Group, ['id', 'name', 'description', 'owner', 'is_active']),
    'comments': (Comment, ['id', 'post', 'author', 'body', 'is_hidden', 'created_at']),
    'reports': (Report, ['id', 'post', 'reporter', 'reason', 'resolved', 'created_at']),
}


def resource_config(resource):
    if resource in CATALOG:
        model = CATALOG[resource]
        return model, serializer_for(model), True
    if resource not in HISTORY and resource not in EDITABLE:
        from rest_framework.exceptions import NotFound
        raise NotFound()
    model, fields = {**HISTORY, **EDITABLE}[resource]
    readonly = fields if resource in HISTORY else ['id', 'created_at']
    readonly += {'plans': ['code'], 'posts': ['author'], 'comments': ['post', 'author', 'body'],
                 'reports': ['post', 'reporter', 'reason'], 'groups': ['owner'],
                 'reviews': ['event', 'user', 'rating', 'comment'], 'service-reviews': ['booking', 'rating', 'comment']}.get(resource, [])
    class ResourceSerializer(serializers.ModelSerializer):
        class Meta:
            pass
        def validate(self, attrs):
            if resource == 'plans':
                if attrs.get('price', 0) < 0 or (self.instance.pk == 'bronze' and attrs.get('price', 0) != 0):
                    raise serializers.ValidationError('Bronze must stay free; prices cannot be negative.')
                features = attrs.get('features', [])
                if not isinstance(features, list) or len(features) > 20 or any(not isinstance(f, str) or len(f) > 200 for f in features):
                    raise serializers.ValidationError('Provide up to 20 short benefit descriptions.')
            if resource == 'posts':
                if attrs.get('kind', getattr(self.instance, 'kind', '')) == 'BLOG' and not attrs.get('title', getattr(self.instance, 'title', '')).strip():
                    raise serializers.ValidationError('A blog article needs a title.')
                if attrs.get('image'):
                    from apps.common.api import validate_image
                    validate_image(attrs['image'])
            return attrs
    ResourceSerializer.Meta.model = model
    ResourceSerializer.Meta.fields = fields
    ResourceSerializer.Meta.read_only_fields = readonly
    return model, ResourceSerializer, resource in EDITABLE


class ManageResource(APIView):
    def authorize(self, request, model, action):
        require_staff_permission(request.user, f'{model._meta.app_label}.{action}_{model._meta.model_name}')

    def get(self, request, resource, pk=None):
        model, serializer, editable = resource_config(resource)
        self.authorize(request, model, 'view')
        qs = model.objects.all().order_by('-pk')
        if resource == 'service-reviews' and request.query_params.get('kind'):
            qs = qs.filter(booking__kind=request.query_params['kind'])
        for name in ['kind', 'status', 'user', 'supplier', 'hotel', 'room_type', 'restaurant', 'route', 'experience', 'package', 'group']:
            if name in [f.name for f in model._meta.fields] and request.query_params.get(name):
                field = model._meta.get_field(name)
                try:
                    value = field.target_field.to_python(request.query_params[name]) if field.is_relation else field.to_python(request.query_params[name])
                except (ValueError, TypeError):
                    raise serializers.ValidationError('Invalid filter.')
                qs = qs.filter(**{name: value})
        if request.query_params.get('search'):
            condition = Q()
            for field in model._meta.fields:
                if field.get_internal_type() in {'CharField', 'TextField'}:
                    condition |= Q(**{field.name+'__icontains': request.query_params['search'][:100]})
            qs = qs.filter(condition)
        if pk is not None:
            return Response(serializer(get_object_or_404(qs, pk=pk), context={'request': request}).data)
        pagination = Pagination()
        page = pagination.paginate_queryset(qs, request)
        response = pagination.get_paginated_response(serializer(page, many=True, context={'request': request}).data)
        can_edit = editable and request.user.has_perm(f'{model._meta.app_label}.change_{model._meta.model_name}')
        schema = []
        for name, field in serializer().fields.items():
            if field.read_only:
                continue
            item = {'name': name, 'label': str(field.label), 'required': field.required, 'nullable': field.allow_null}
            item['type'] = 'boolean' if isinstance(field, serializers.BooleanField) else 'number' if isinstance(field, (serializers.IntegerField, serializers.DecimalField)) else 'datetime-local' if isinstance(field, serializers.DateTimeField) else 'date' if isinstance(field, serializers.DateField) else 'image' if isinstance(field, serializers.ImageField) else 'list' if isinstance(field, serializers.JSONField) else 'text'
            if isinstance(field, serializers.ChoiceField):
                item['choices'] = [{'value': key, 'label': str(value)} for key, value in field.choices.items()]
            if isinstance(field, serializers.PrimaryKeyRelatedField):
                related = field.queryset.model
                if request.user.has_perm(f'{related._meta.app_label}.view_{related._meta.model_name}'):
                    item['choices'] = [{'value': str(row.pk), 'label': str(row)[:120]} for row in field.queryset.order_by('-pk')[:100]]
            schema.append(item)
        if resource in CATALOG and CONFIG[model][2] is None:
            schema.append({'name': 'owner_id', 'label': 'Approved provider', 'required': True, 'type': 'text',
                           'choices': [{'value': u.pk, 'label': u.get_full_name() or u.username} for u in User.objects.filter(is_active=True, is_verified=True).order_by('pk')[:100]]})
        response.data.update(schema=schema, editable=can_edit, creatable=editable and resource not in {'plans', 'comments', 'reports', 'reviews', 'service-reviews'} and request.user.has_perm(f'{model._meta.app_label}.add_{model._meta.model_name}'),
                             actionable=resource in {'bookings', 'payments', 'plan-payments', 'refunds'} and request.user.has_perm(f'{model._meta.app_label}.change_{model._meta.model_name}'))
        return response

    @transaction.atomic
    def post(self, request, resource, pk=None):
        model, serializer_class, editable = resource_config(resource)
        action_name = request.data.get('action')
        if action_name and pk is None:
            raise serializers.ValidationError('Choose a record first.')
        self.authorize(request, model, 'change' if pk else 'add')
        if not editable or (not pk and resource in {'plans', 'comments', 'reports', 'reviews', 'service-reviews'}):
            raise PermissionDenied('Transaction history cannot be edited.')
        instance = get_object_or_404(model.objects.all(), pk=pk) if pk else None
        if instance:
            if resource in CATALOG:
                root = root_of(instance)
                type(root).objects.select_for_update().get(pk=root.pk)
            instance = model.objects.select_for_update().get(pk=instance.pk)
        if resource in CATALOG and action_name in {'approve', 'hide'}:
            if CONFIG[model][2] is not None:
                raise serializers.ValidationError('Approve the parent listing instead.')
            if action_name == 'approve' and (not owner_of(instance).is_verified or not owner_of(instance).is_active):
                raise Conflict('The provider must be active and approved.')
            instance.is_active = action_name == 'approve'
            instance.save(update_fields=['is_active'])
        else:
            serializer = serializer_class(instance, data=request.data, partial=bool(pk), context={'request': request})
            serializer.is_valid(raise_exception=True)
            extra = {}
            if not pk:
                if resource in CATALOG:
                    parent_field = CONFIG[model][2]
                    if parent_field:
                        root = root_of(serializer.validated_data[parent_field])
                        type(root).objects.select_for_update().get(pk=root.pk)
                    else:
                        owner_id = serializers.IntegerField(min_value=1).run_validation(request.data.get('owner_id'))
                        extra = {CONFIG[model][3]: get_object_or_404(User, pk=owner_id, is_verified=True, is_active=True), 'is_active': False}
                elif resource == 'posts': extra = {'author': request.user}
                elif resource == 'groups': extra = {'owner': request.user}
            instance = serializer.save(**extra)
        audit(request.user, 'admin.resource_updated' if pk else 'admin.resource_created', instance.pk, resource=resource)
        return Response(serializer_class(instance, context={'request': request}).data, status=200 if pk else 201)

    def patch(self, request, resource, pk=None):
        if pk is None:
            raise serializers.ValidationError('Choose a record to update.')
        return self.post(request, resource, pk)


class ManageAction(APIView):
    def post(self, request, resource, pk):
        model, serializer, _ = resource_config(resource)
        require_staff_permission(request.user, f'{model._meta.app_label}.change_{model._meta.model_name}')
        instance = get_object_or_404(model, pk=pk)
        action = serializers.CharField(max_length=30).run_validation(request.data.get('action'))
        if resource == 'bookings' and action in {'cancel', 'fulfill'}:
            from apps.bookings.services import cancel, fulfill
            reason = serializers.CharField(min_length=5, max_length=500).run_validation(request.data.get('reason'))
            if action == 'cancel':
                instance = cancel(instance.pk, request.user, force=False)
            else:
                instance = fulfill(instance.pk, request.user, request.data.get('status'))
            audit(request.user, 'admin.booking_action', instance.pk, action_taken=action, reason=reason)
        elif resource == 'payments' and action == 'verify':
            from apps.payments.services import verify_payment
            instance = verify_payment(instance)
        elif resource == 'plan-payments' and action == 'verify':
            from apps.memberships.services import verify
            instance = verify(instance)
        elif resource == 'refunds' and action == 'verify':
            from apps.payments.services import reconcile_refund
            reconcile_refund(instance.pk)
            instance.refresh_from_db()
        else:
            raise serializers.ValidationError('This action is not available for this record.')
        return Response(serializer(instance, context={'request': request}).data)
