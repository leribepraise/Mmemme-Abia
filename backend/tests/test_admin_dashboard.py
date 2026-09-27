from datetime import timedelta
from django.contrib.auth.models import Permission
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from apps.accounts.models import User, OrganizerProfile
from apps.common.models import AuditLog
from apps.events.models import Event, TicketType
from apps.notifications.models import Notification
from apps.bookings.services import reserve
from apps.common.api import Conflict


class AdminDashboardTests(TestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser('admin', 'admin@example.test', 'Strong-test-42!', email_verified=True)
        self.user = User.objects.create_user('person', 'person@example.test', 'Strong-test-42!', email_verified=True)
        self.profile = OrganizerProfile.objects.create(user=self.user, business_name='Test business', contact_phone='08012345678', event_type='Culture', coverage_region='Abia')
        self.client = APIClient()
        self.client.force_authenticate(self.admin)

    def org(self, action, body=None):
        return self.client.post(f'/api/v1/admin/organizers/{self.profile.pk}/{action}/', body or {}, format='json')

    def test_admin_endpoints_require_staff_and_model_permissions(self):
        for identity in [None, self.user]:
            self.client.force_authenticate(identity)
            for path in ['users/', 'organizers/', 'events/', 'overview/']:
                self.assertIn(self.client.get('/api/v1/admin/'+path).status_code, [401,403])
        self.user.is_staff = True
        self.user.save()
        self.client.force_authenticate(self.user)
        self.assertEqual(self.client.get('/api/v1/admin/users/').status_code, 403)
        self.user.user_permissions.add(Permission.objects.get(codename='view_user', content_type__app_label='accounts'))
        self.client.force_authenticate(User.objects.get(pk=self.user.pk))
        self.assertEqual(self.client.get('/api/v1/admin/users/').status_code, 200)
        self.assertEqual(self.client.post(f'/api/v1/admin/users/{self.admin.pk}/suspend/', {'reason':'test'}).status_code, 403)

    def test_application_review_and_resubmission(self):
        self.assertEqual(self.org('request-info').status_code, 400)
        self.assertEqual(self.org('request-info', {'reason':'Please provide the business reference.'}).status_code, 200)
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.status, 'NEEDS_INFO')
        self.assertEqual(self.profile.reviewed_by, self.admin)
        self.client.force_authenticate(self.user)
        body={'business_name':'Updated business','contact_phone':'08012345678','event_type':'Culture','coverage_region':'Abia','accept_terms':False}
        self.assertEqual(self.client.post('/api/v1/auth/organizer-application/', body).status_code,400)
        body['accept_terms']=True
        self.assertEqual(self.client.post('/api/v1/auth/organizer-application/', body).status_code,201)
        self.profile.refresh_from_db()
        self.assertTrue(self.profile.terms_accepted_at)
        self.assertEqual(self.profile.status,'PENDING')
        self.assertEqual(self.profile.review_note,'')
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.org('approve').status_code,200)
        self.user.refresh_from_db()
        self.assertTrue(self.user.is_verified)
        self.assertEqual(self.user.role,'ORGANIZER')
        self.assertEqual(self.org('reject', {'reason':'Late rejection'}).status_code,409)
        self.assertTrue(Notification.objects.filter(user=self.user,subject='Organizer application update').exists())
        self.assertTrue(AuditLog.objects.filter(action='organizer.approved',target=str(self.user.pk)).exists())

    def test_first_organizer_application_has_an_empty_state(self):
        newcomer = User.objects.create_user('newcomer', 'newcomer@example.test', 'Strong-test-42!', email_verified=True)
        self.client.force_authenticate(newcomer)
        self.assertEqual(self.client.get('/api/v1/auth/organizer-application/').status_code,204)
        body={'business_name':'New business','contact_phone':'08012345678','event_type':'Culture','coverage_region':'Abia','accept_terms':True}
        self.assertEqual(self.client.post('/api/v1/auth/organizer-application/',body).status_code,201)
        self.assertEqual(self.client.get('/api/v1/auth/organizer-application/').data['status'],'PENDING')
        self.assertEqual(self.client.post('/api/v1/auth/organizer-application/',body).status_code,400)

    def test_cannot_approve_unverified_or_suspended_or_own_organizer(self):
        self.user.email_verified=False;self.user.save()
        self.assertEqual(self.org('approve').status_code,409)
        self.user.email_verified=True;self.user.is_active=False;self.user.save()
        self.assertEqual(self.org('approve').status_code,409)
        own=OrganizerProfile.objects.create(user=self.admin,business_name='Own',contact_phone='08012345678')
        self.assertEqual(self.client.post(f'/api/v1/admin/organizers/{own.pk}/approve/').status_code,403)

    def test_suspend_reactivate_never_revives_old_access_or_refresh(self):
        session=APIClient()
        result=session.post('/api/v1/auth/login/',{'email':self.user.email,'password':'Strong-test-42!'},format='json')
        old_access=result.data['access']
        path=f'/api/v1/admin/users/{self.user.pk}/'
        self.assertEqual(self.client.post(path+'suspend/',{}).status_code,400)
        self.assertEqual(self.client.post(path+'suspend/',{'reason':'Policy review'}).status_code,200)
        self.assertEqual(self.client.post(path+'activate/',{}).status_code,200)
        session.credentials(HTTP_AUTHORIZATION='Bearer '+old_access)
        self.assertEqual(session.get('/api/v1/auth/me/').status_code,401)
        session.credentials()
        self.assertEqual(session.post('/api/v1/auth/refresh/').status_code,401)
        self.assertEqual(session.post('/api/v1/auth/login/',{'email':self.user.email,'password':'Strong-test-42!'}).status_code,200)
        self.assertEqual(self.client.post(f'/api/v1/admin/users/{self.admin.pk}/suspend/',{'reason':'test'}).status_code,403)

    def event(self):
        self.org('approve')
        self.user.refresh_from_db()
        event=Event.objects.create(organizer=self.user,title='Test event',slug='test-event',description='Description',category='Culture',venue='Venue',city='Aba',start_datetime=timezone.now()+timedelta(days=2),end_datetime=timezone.now()+timedelta(days=2,hours=2),capacity=10,status='IN_REVIEW')
        ticket=TicketType.objects.create(event=event,name='General',price=100,quantity=10)
        return event,ticket

    def test_event_review_changes_public_visibility_and_booking_availability(self):
        event,ticket=self.event()
        path=f'/api/v1/admin/events/{event.pk}/'
        self.assertEqual(self.client.post(path+'request-changes/',{'reason':'Correct venue information.'}).status_code,200)
        event.refresh_from_db();self.assertEqual(event.status,'REJECTED')
        self.assertEqual(event.review_note,'Correct venue information.')
        self.client.force_authenticate(self.user)
        self.assertEqual(self.client.patch(f'/api/v1/events/{event.pk}/',{'venue':'Corrected venue'}).status_code,200)
        self.assertEqual(self.client.post(f'/api/v1/events/{event.pk}/submit/').status_code,200)
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.client.post(path+'approve/').status_code,200)
        public=APIClient()
        self.assertEqual(public.get(f'/api/v1/events/{event.pk}/').status_code,200)
        self.assertEqual(self.client.post(path+'suspend/',{'reason':'Safety review.'}).status_code,200)
        self.assertEqual(public.get(f'/api/v1/events/{event.pk}/').status_code,404)
        buyer=User.objects.create_user('buyer','buyer@example.test','Strong-test-42!',email_verified=True)
        with self.assertRaises(Conflict):
            reserve(buyer,'suspended-event','EVENT',[{'id':ticket.pk,'quantity':1}],{},'Buyer','08012345678')
        self.assertEqual(self.client.post(path+'activate/').status_code,200)
        self.assertEqual(public.get(f'/api/v1/events/{event.pk}/').status_code,200)

    def test_event_cannot_be_approved_without_tickets(self):
        event,ticket=self.event();ticket.delete()
        self.assertEqual(self.client.post(f'/api/v1/admin/events/{event.pk}/approve/').status_code,409)

    def test_onboarding_requires_saved_details_and_cannot_grant_privileges(self):
        self.client.force_authenticate(self.user)
        self.assertEqual(self.client.post('/api/v1/auth/onboarding/complete/').status_code,400)
        self.assertEqual(self.client.patch('/api/v1/auth/me/',{'phone':'08012345678','lga':'Aba North','address':'1 Test Road','gender':'female','is_staff':True,'onboarding_completed_at':timezone.now().isoformat()}).status_code,200)
        self.user.refresh_from_db();self.assertFalse(self.user.is_staff);self.assertIsNone(self.user.onboarding_completed_at)
        response=self.client.post('/api/v1/auth/onboarding/complete/');self.assertEqual(response.status_code,200);self.assertTrue(response.data['onboarding_completed_at'])

    def test_overview_uses_database_totals_and_validates_range(self):
        result=self.client.get('/api/v1/admin/overview/?days=7')
        self.assertEqual(result.status_code,200)
        self.assertEqual(result.data['users'],2)
        self.assertEqual(result.data['pending_organizers'],1)
        self.assertEqual(result.data['bookings'],0)
        self.assertEqual(len(result.data['activity']['users']),7)
        self.assertEqual(self.client.get('/api/v1/admin/overview/?days=9999').status_code,400)
