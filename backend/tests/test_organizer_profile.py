from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from apps.accounts.models import OrganizerProfile


class OrganizerProfileTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='profile-owner', email='owner@example.test',
            first_name='Before', email_verified=True, is_verified=True, role='ORGANIZER')
        self.other = get_user_model().objects.create_user(username='other-profile', email='other@example.test')
        self.profile = OrganizerProfile.objects.create(user=self.user, business_name='Original brand',
            contact_phone='08012345678', event_type='Culture', coverage_region='Abia', status='APPROVED')
        self.url = '/api/v1/auth/organizer-profile/'
        self.client.force_authenticate(self.user)

    def test_profile_persists_contact_and_organization_together(self):
        result = self.client.patch(self.url, {'user':{'first_name':'Updated','address':'Aba','email_notifications':False},
            'organizer':{'business_name':'Updated brand','contact_phone':'08098765432','description':'Events across Abia'}}, format='json')
        self.assertEqual(result.status_code, 200, result.data)
        self.user.refresh_from_db(); self.profile.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Updated')
        self.assertFalse(self.user.email_notifications)
        self.assertEqual(self.profile.business_name, 'Updated brand')
        self.assertEqual(self.profile.status, 'APPROVED')
        self.assertEqual(self.client.get(self.url).data['organizer']['contact_phone'], '08098765432')

    def test_invalid_details_do_not_partially_save_contact(self):
        for details in [{'contact_phone':'wrong'}, {'business_name':''}, {'description':'x'*2001}, {'event_type':''}]:
            result = self.client.patch(self.url, {'user':{'first_name':'Must not save'},'organizer':details}, format='json')
            self.assertEqual(result.status_code,400,result.data)
            self.user.refresh_from_db()
            self.assertEqual(self.user.first_name,'Before')

    def test_cannot_change_approval_identity_or_another_user(self):
        result = self.client.patch(self.url, {'user':{'id':self.other.pk,'email':'attacker@example.test','is_staff':True,'is_verified':False,'role':'ADMIN'},
            'organizer':{'user':self.other.pk,'status':'REJECTED','verification_reference':'overwrite'}}, format='json')
        self.assertEqual(result.status_code,200)
        self.user.refresh_from_db(); self.profile.refresh_from_db(); self.other.refresh_from_db()
        self.assertFalse(self.user.is_staff)
        self.assertTrue(self.user.is_verified)
        self.assertEqual(self.user.role,'ORGANIZER')
        self.assertEqual(self.user.email,'owner@example.test')
        self.assertEqual(self.profile.status,'APPROVED')
        self.assertEqual(self.profile.user_id,self.user.pk)
        self.assertEqual(self.profile.verification_reference,'')
        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.get(self.url).status_code,404)
        self.assertEqual(self.client.patch(self.url,{'user':{'first_name':'Bad'}},format='json').status_code,404)
        self.client.force_authenticate(None)
        self.assertEqual(self.client.get(self.url).status_code,401)

    def test_invalid_nested_payload_is_rejected(self):
        result = self.client.patch(self.url, {'user':['wrong'],'organizer':{}},format='json')
        self.assertEqual(result.status_code,400)
        self.assertEqual(self.client.patch(self.url, [], format='json').status_code,400)
