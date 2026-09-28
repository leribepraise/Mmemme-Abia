import uuid
from datetime import timedelta
from decimal import Decimal
from io import BytesIO
from unittest.mock import patch
from PIL import Image
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.core.cache import cache
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from django.utils import timezone
from rest_framework.test import APITestCase
from apps.memberships.models import Plan, Membership, PlanPayment
from apps.memberships.services import initialize, settle, current_membership
from apps.community.models import CommunityProfile, Post, Group, GroupMember, Like
from apps.messaging.models import Conversation, Message
from apps.notifications.models import Notification
from apps.events.models import Event, TicketType
from apps.bookings.services import reserve


class PlatformTests(APITestCase):
    def setUp(self):
        cache.clear()
        User = get_user_model()
        self.user = User.objects.create_user(username='member', email='member@example.test', email_verified=True)
        self.other = User.objects.create_user(username='other', email='other@example.test', email_verified=True)
        self.staff = User.objects.create_superuser(username='staff', email='staff@example.test', password='Testing!12345', email_verified=True)
        self.client.force_authenticate(self.user)

    def payment(self, **kwargs):
        return PlanPayment.objects.create(user=self.user, plan_id='silver', amount=2000,
            reference='PLAN-'+uuid.uuid4().hex, idempotency_key=uuid.uuid4().hex, **kwargs)

    def verification(self, payment):
        return {'status':'success', 'reference':payment.reference, 'amount':200000, 'currency':'NGN',
                'id':uuid.uuid4().hex, 'metadata':{'plan_payment_id':str(payment.pk)}, 'customer':{'email':self.user.email}}

    def test_plans_are_naira_prices_and_client_cannot_grant_membership(self):
        rows = self.client.get('/api/v1/plans/').data['results']
        self.assertEqual([(p['code'],p['price']) for p in rows], [('bronze','0.00'),('silver','2000.00'),('diamond','5000.00')])
        self.client.patch('/api/v1/auth/me/', {'plan':'diamond'}, format='json')
        self.assertEqual(self.client.get('/api/v1/auth/me/').data['plan'], 'bronze')

    @patch('apps.memberships.services.Paystack.request')
    def test_checkout_uses_server_price_and_retries_same_reference(self, request):
        request.side_effect=lambda path,data: {'reference':data['reference'], 'authorization_url':'https://checkout.paystack.com/example'}
        first=self.client.post('/api/v1/memberships/checkout/', {'plan':'silver','amount':1}, format='json', HTTP_IDEMPOTENCY_KEY='checkout-test-key')
        self.assertEqual(first.status_code,200,first.data)
        second=self.client.post('/api/v1/memberships/checkout/', {'plan':'silver'}, format='json', HTTP_IDEMPOTENCY_KEY='checkout-test-key')
        self.assertEqual(first.data['id'],second.data['id'])
        self.assertEqual(request.call_count,1)
        self.assertEqual(request.call_args.args[1]['amount'],200000)
        self.assertEqual(current_membership(self.user)['plan'],'bronze')

    def test_duplicate_verification_grants_one_month_only(self):
        payment=self.payment();data=self.verification(payment)
        settle(payment.pk,data)
        first=Membership.objects.get(user=self.user).expires_at
        settle(payment.pk,data)
        self.assertEqual(Membership.objects.get(user=self.user).expires_at,first)
        self.assertEqual(current_membership(self.user)['plan'],'silver')
        Membership.objects.filter(user=self.user).update(expires_at=timezone.now()-timedelta(seconds=1))
        self.assertEqual(current_membership(self.user)['plan'],'bronze')

    def test_mismatch_never_activates(self):
        for field,value in [('amount',1),('currency','USD'),('reference','different'),('customer',{'email':'someone@example.test'}),('metadata',{})]:
            payment=self.payment(); data=self.verification(payment);data[field]=value
            self.assertEqual(settle(payment.pk,data).status,'REVIEW')
        self.assertFalse(Membership.objects.exists())

    def test_verification_owner_boundary(self):
        payment=self.payment();self.client.force_authenticate(self.other)
        self.assertEqual(self.client.post('/api/v1/memberships/verify-reference/',{'reference':payment.reference}).status_code,404)

    def test_paid_plan_switch_does_not_discard_existing_time(self):
        Membership.objects.create(user=self.user,plan_id='diamond',expires_at=timezone.now()+timedelta(days=20))
        result=self.client.post('/api/v1/memberships/checkout/',{'plan':'silver'},HTTP_IDEMPOTENCY_KEY='different-plan')
        self.assertEqual(result.status_code,409)

    def test_blog_requires_editor_and_publication(self):
        denied=self.client.post('/api/v1/community/posts/',{'kind':'BLOG','title':'Story','body':'Text'},format='json')
        self.assertEqual(denied.status_code,403)
        self.client.force_authenticate(self.staff)
        created=self.client.post('/api/v1/admin/manage/posts/',{'kind':'BLOG','title':'Story','body':'Text','status':'PUBLISHED'},format='json')
        self.assertEqual(created.status_code,201,created.data)
        Post.objects.create(author=self.staff,kind='BLOG',title='Draft',body='Private')
        self.client.force_authenticate(None)
        self.assertEqual(self.client.get('/api/v1/community/posts/?kind=BLOG').data['count'],1)

    def test_community_moderation_likes_and_comments_persist(self):
        result=self.client.post('/api/v1/community/posts/',{'body':'Abia is beautiful','status':'PUBLISHED'},format='json')
        self.assertEqual(result.status_code,201)
        post=Post.objects.get(pk=result.data['id']);self.assertEqual(post.status,'PENDING')
        self.assertEqual(self.client.get('/api/v1/community/posts/').data['count'],0)
        self.client.force_authenticate(self.staff)
        self.assertEqual(self.client.patch(f'/api/v1/admin/manage/posts/{post.pk}/',{'status':'PUBLISHED'},format='json').status_code,200)
        self.client.force_authenticate(self.user)
        url=f'/api/v1/community/posts/{post.pk}/'
        self.client.post(url+'like/',{'liked':True},format='json');self.client.post(url+'like/',{'liked':True},format='json')
        self.assertEqual(Like.objects.count(),1)
        self.assertEqual(self.client.post(url+'comments/',{'body':'A comment'}).status_code,201)
        self.assertEqual(self.client.get(url).data['comment_count'],1)
        self.assertEqual(self.client.post(url+'report/',{'reason':'Review this'}).status_code,200)

    def test_author_can_remove_pending_post_but_not_other_authors(self):
        post=Post.objects.create(author=self.user,body='Draft')
        self.assertEqual(self.client.delete(f'/api/v1/community/posts/{post.pk}/').status_code,204)
        other=Post.objects.create(author=self.other,body='Published',status='PUBLISHED')
        self.assertEqual(self.client.delete(f'/api/v1/community/posts/{other.pk}/').status_code,404)

    def test_group_membership_required_for_posting(self):
        group=Group.objects.create(owner=self.other,name='Group',description='Group',is_active=True)
        body={'group':group.pk,'body':'Hello'}
        self.assertEqual(self.client.post('/api/v1/community/posts/',body).status_code,403)
        self.client.post(f'/api/v1/community/groups/{group.pk}/membership/',{'joined':True},format='json')
        self.assertEqual(self.client.post('/api/v1/community/posts/',body).status_code,201)
        self.client.post(f'/api/v1/community/groups/{group.pk}/membership/',{'joined':True},format='json')
        self.assertEqual(GroupMember.objects.filter(group=group,user=self.user).count(),1)

    def chat(self):
        CommunityProfile.objects.update_or_create(user=self.other, defaults={'listed':True,'allow_messages':True})
        response=self.client.post('/api/v1/conversations/',{'recipient':self.other.pk},format='json')
        self.assertEqual(response.status_code,201,response.data)
        return response.data['id']

    def test_directory_is_opt_in_and_never_exposes_private_contacts(self):
        self.assertEqual(self.client.get('/api/v1/community/people/').data['count'],0)
        self.assertEqual(self.client.post('/api/v1/conversations/',{'recipient':self.other.pk}).status_code,404)
        self.chat()
        row=self.client.get('/api/v1/community/people/').data['results'][0]
        self.assertNotIn('email',row);self.assertNotIn('phone',row)

    def test_chat_retry_read_archive_and_block(self):
        conversation=self.chat();root=f'/api/v1/conversations/{conversation}/'
        data={'body':'Hello','client_id':str(uuid.uuid4())}
        self.assertEqual(self.client.post(root+'messages/',data).status_code,201)
        self.assertEqual(self.client.post(root+'messages/',data).status_code,200)
        self.assertEqual(Message.objects.count(),1)
        self.client.post(root+'archive/',{'archived':True},format='json')
        self.assertTrue(self.client.get('/api/v1/conversations/').data['results'][0]['archived'])
        self.client.force_authenticate(self.other)
        self.client.post(root+'read/',{'through':Message.objects.get().pk})
        self.assertIsNotNone(Message.objects.get().read_at)
        self.assertTrue(Notification.objects.get().is_read)
        self.client.post(root+'block/',{'blocked':True},format='json')
        self.client.force_authenticate(self.user)
        self.assertEqual(self.client.post(root+'messages/',{'body':'Blocked'}).status_code,403)

    def test_chat_photo_is_private_and_strips_original_format(self):
        conversation=self.chat();buffer=BytesIO();Image.new('RGB',(20,20),'red').save(buffer,format='PNG')
        photo=SimpleUploadedFile('photo.png',buffer.getvalue(),content_type='image/png')
        root=f'/api/v1/conversations/{conversation}/'
        result=self.client.post(root+'messages/',{'image':photo,'client_id':str(uuid.uuid4())},format='multipart')
        self.assertEqual(result.status_code,201,result.data)
        path=root+f"images/{result.data['id']}/"
        response=self.client.get(path);self.assertEqual(response['Content-Type'],'image/jpeg')
        self.assertEqual(response['Cache-Control'],'private, no-store')
        self.client.force_authenticate(self.staff)
        self.assertEqual(self.client.get(path).status_code,404)
        self.assertEqual(self.client.get(root+'messages/').status_code,404)

    def test_chat_pagination_and_typing(self):
        conversation=self.chat();root=f'/api/v1/conversations/{conversation}/'
        for n in range(55):Message.objects.create(conversation_id=conversation,sender=self.user,body=str(n))
        rows=self.client.get(root+'messages/?page_size=50').data
        self.assertEqual(len(rows['results']),50);self.assertTrue(rows['next'])
        self.assertEqual(self.client.get(root+f"messages/?before={rows['results'][-1]['id']}").data['count'],5)
        self.client.post(root+'typing/')
        self.client.force_authenticate(self.other)
        self.assertTrue(self.client.get(root+'typing/').data['typing'])

    def test_staff_permissions_and_history_immutability(self):
        self.assertEqual(self.client.get('/api/v1/admin/manage/bookings/').status_code,403)
        self.client.force_authenticate(self.staff)
        from apps.common.management_api import CATALOG,HISTORY,EDITABLE
        for resource in [*CATALOG,*HISTORY,*EDITABLE]:
            response=self.client.get(f'/api/v1/admin/manage/{resource}/')
            self.assertEqual(response.status_code,200,(resource,response.data))
        self.assertEqual(self.client.post('/api/v1/admin/manage/payments/',{'amount':1}).status_code,403)
        self.assertEqual(self.client.patch('/api/v1/admin/manage/plans/bronze/',{'price':5}).status_code,400)
        self.other.is_staff=True;self.other.save()
        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.get('/api/v1/admin/manage/posts/').status_code,403)

    def test_membership_discount_and_access_are_enforced_on_server(self):
        self.other.is_verified=True;self.other.save()
        event=Event.objects.create(organizer=self.other,title='Live',slug='membership-live',category='Culture',venue='Aba',city='Aba',
            status='PUBLISHED',start_datetime=timezone.now()+timedelta(days=3),end_datetime=timezone.now()+timedelta(days=3,hours=2),capacity=50)
        ticket=TicketType.objects.create(event=event,name='Member',price=1000,quantity=50,minimum_plan='silver',membership_discount=True,
            membership_early_access=True,sales_start=timezone.now()+timedelta(hours=12))
        body={'kind':'EVENT','items':[{'id':str(ticket.pk),'quantity':1}],'customer_name':'Member','customer_phone':'08000000000','details':{}}
        response=self.client.post('/api/v1/bookings/',body,format='json',HTTP_IDEMPOTENCY_KEY='bronze-reserve')
        self.assertEqual(response.status_code,409)
        Membership.objects.create(user=self.user,plan_id='silver',expires_at=timezone.now()+timedelta(days=5))
        response=self.client.post('/api/v1/bookings/',body,format='json',HTTP_IDEMPOTENCY_KEY='silver-reserve')
        self.assertEqual(response.status_code,201,response.data)
        self.assertEqual(Decimal(response.data['total_amount']),Decimal('850.00'))
        self.assertEqual(Decimal(response.data['items'][0]['unit_price']),Decimal('850.00'))
