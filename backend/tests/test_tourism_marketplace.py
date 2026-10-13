from datetime import timedelta
from decimal import Decimal
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.test import override_settings
from django.core.files.uploadedfile import SimpleUploadedFile
from io import BytesIO
from tempfile import TemporaryDirectory
from PIL import Image
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework.exceptions import PermissionDenied
from apps.common.api import Conflict
from apps.tourism.models import TourismOperator, TourismStaff, TourismExperience, TourPackage, TourDeparture, TourismRequest
from apps.tourism.services import admission_token, check_in, departure_action, queue_tour_reminders
from apps.bookings.services import reserve, cancel
from apps.payments.services import settle
from apps.payments.models import Payment, Refund, LedgerEntry


class TourismMarketplaceTests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.owner = User.objects.create_user(username='tour-owner', email='tours@example.com', email_verified=True, is_verified=True)
        self.buyer = User.objects.create_user(username='visitor', email='visitor@example.com', email_verified=True)
        self.manager = User.objects.create_user(username='tour-manager', email='manager@example.com', email_verified=True)
        self.guide = User.objects.create_user(username='guide', email='guide@example.com', email_verified=True)
        self.admin = User.objects.create_superuser(username='tour-admin', email='admin@example.com', password='StrongPassword9!', email_verified=True)
        self.operator = TourismOperator.objects.create(owner=self.owner, name='Abia Tours', registration_number='RC123', contact_email=self.owner.email, contact_phone='08012345678', address='Aba', status='APPROVED', commission_bps=700)
        TourismStaff.objects.create(operator=self.operator, user=self.manager, role='MANAGER')
        TourismStaff.objects.create(operator=self.operator, user=self.guide, role='GUIDE')
        self.experience = TourismExperience.objects.create(operator=self.operator, created_by=self.owner, name='Culture tour', description='Tour description', category='CULTURAL_SITE', location_name='Aba', is_active=True)
        self.package = TourPackage.objects.create(experience=self.experience, name='Guided visit', price=1000, meeting_point='Visitor centre', itinerary='Museum and garden', inclusions='Guide', exclusions='Lunch')
        self.departure = TourDeparture.objects.create(package=self.package, price=1000, quantity=5, starts_at=timezone.now()+timedelta(days=3), ends_at=timezone.now()+timedelta(days=3, hours=2))
        self.client = APIClient(); self.client.force_authenticate(self.owner)
        self.base = f'/api/v1/tourism-operators/{self.operator.pk}/'
    def reserve(self, key='tour-test', price=None):
        if price is not None: self.departure.price=price; self.departure.save(update_fields=['price'])
        return reserve(self.buyer, key, 'TOURISM', [{'id': self.departure.pk, 'quantity': 1}], {'passengers': ['Ada']}, 'Ada', '08012345678')[0]
    def pay(self, booking):
        payment = Payment.objects.create(booking=booking, user=self.buyer, provider='PAYSTACK', reference='PAY-'+str(booking.pk), amount=booking.total_amount, currency='NGN', idempotency_key=str(booking.pk))
        settle(payment.pk, {'id':12345, 'reference':payment.reference, 'status':'success', 'amount':int(payment.amount*100), 'currency':'NGN', 'metadata':{'booking_id':str(booking.pk)}, 'customer':{'email':self.buyer.email}})
    def test_application_approval_requires_explicit_commission(self):
        self.client.force_authenticate(self.buyer)
        r=self.client.post('/api/v1/tourism-operators/', {'name':'New Tours', 'registration_number':'RC2', 'contact_email':self.buyer.email, 'contact_phone':'08011111111', 'address':'Aba'}, format='json')
        self.assertEqual(r.status_code,201,r.data)
        path=f"/api/v1/tourism-operators/{r.data['id']}/review/"
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.client.post(path, {'status':'APPROVED'}, format='json').status_code,400)
        self.assertEqual(self.client.post(path, {'status':'APPROVED','commission_bps':500}, format='json').status_code,200)
        self.buyer.refresh_from_db(); self.assertTrue(self.buyer.is_verified)
    def test_unverified_application_rejected(self):
        self.buyer.email_verified=False; self.buyer.save()
        self.client.force_authenticate(self.buyer)
        self.assertEqual(self.client.post('/api/v1/tourism-operators/', {}, format='json').status_code,403)
    def test_public_filters_and_operator_metadata(self):
        public=APIClient()
        r=public.get('/api/v1/tour-departures/', {'experience':self.experience.pk})
        self.assertEqual(r.data['results'][0]['operator_name'],'Abia Tours')
        self.assertEqual(r.data['results'][0]['meeting_point'],'Visitor centre')
        self.operator.status='SUSPENDED'; self.operator.save()
        self.assertEqual(public.get('/api/v1/tourism/').data['count'],0)
        self.assertEqual(public.get('/api/v1/tour-departures/').data['count'],0)
        with self.assertRaises(Conflict): self.reserve()
    def test_listing_review_required_and_identity_changes_reopen_it(self):
        r=self.client.post(self.base+'experiences/', {'name':'New site', 'description':'Discover culture', 'category':'ACTIVITY', 'location_name':'Aba'}, format='json')
        self.assertEqual(r.status_code,200,r.data)
        experience=TourismExperience.objects.get(name='New site')
        self.assertFalse(experience.is_active)
        self.assertEqual(experience.review_status,'PENDING')
        self.assertEqual(self.client.post(self.base+'experiences/', {'id':experience.pk, 'is_active':True}, format='json').status_code,400)
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.client.post(self.base+'review-experience/', {'experience':experience.pk,'status':'APPROVED'}, format='json').status_code,200)
        self.client.force_authenticate(self.owner)
        self.assertEqual(self.client.post(self.base+'experiences/', {'id':experience.pk,'description':'Changed'}, format='json').status_code,200)
        experience.refresh_from_db(); self.assertEqual(experience.review_status,'PENDING'); self.assertFalse(experience.is_active)
    def test_guide_cannot_edit_or_see_finances_and_manager_cannot_manage_staff(self):
        self.client.force_authenticate(self.guide)
        self.assertEqual(self.client.get(self.base+'bookings/').status_code,200)
        self.assertEqual(self.client.get(self.base+'earnings/').status_code,403)
        self.assertEqual(self.client.post(self.base+'packages/',{},format='json').status_code,403)
        self.client.force_authenticate(self.manager)
        self.assertEqual(self.client.post(self.base+'staff/',{},format='json').status_code,403)
        self.assertEqual(self.client.patch(self.base,{'name':'Hack'},format='json').status_code,403)
    def test_other_operator_isolation(self):
        self.client.force_authenticate(self.buyer)
        self.assertEqual(self.client.get(self.base+'bookings/').status_code,404)
        self.assertEqual(self.client.post(self.base+'packages/',{},format='json').status_code,404)
    def test_foreign_package_rejected(self):
        other=TourismExperience.objects.create(created_by=self.buyer,name='Other',description='Other',category='ACTIVITY',location_name='Aba')
        r=self.client.post(self.base+'packages/', {'experience':other.pk,'name':'Hack','price':1,'duration_hours':1},format='json')
        self.assertEqual(r.status_code,400)
    def test_capacity_and_booked_terms_protected(self):
        self.reserve()
        self.assertEqual(self.client.post(self.base+'departures/',{'id':str(self.departure.pk),'price':'5000'},format='json').status_code,400)
        self.assertEqual(self.client.post(self.base+'departures/',{'id':str(self.departure.pk),'quantity':0},format='json').status_code,400)
        self.assertEqual(self.client.post(self.base+'packages/',{'id':self.package.pk,'meeting_point':'Other'},format='json').status_code,400)
    def test_overlapping_guide_rejected(self):
        self.departure.guide=self.guide; self.departure.save()
        r=self.client.post(self.base+'departures/',{'package':self.package.pk,'guide':self.guide.pk,'starts_at':self.departure.starts_at.isoformat(),'ends_at':self.departure.ends_at.isoformat(),'price':1000,'quantity':5},format='json')
        self.assertEqual(r.status_code,400,r.data)
    def test_snapshot_and_commission(self):
        booking=self.reserve(); self.pay(booking)
        self.assertEqual(booking.details['meeting_point'],'Visitor centre')
        self.operator.commission_bps=1000; self.operator.save()
        self.assertEqual(LedgerEntry.objects.get(booking=booking,kind='SALE').platform_fee,Decimal('70'))
        self.assertEqual(booking.details['commission_bps'],700)
    def test_cancel_operator_queues_full_refund_and_is_idempotent(self):
        booking=self.reserve(); self.pay(booking)
        departure_action(self.manager,self.departure.pk,'cancel','Weather warning')
        departure_action(self.manager,self.departure.pk,'cancel','Weather warning')
        booking.refresh_from_db(); self.assertEqual(booking.status,'REFUND_PENDING')
        self.assertEqual(Refund.objects.filter(payment__booking=booking).count(),1)
        self.assertEqual(Refund.objects.get(payment__booking=booking).amount,Decimal('1000'))
    def test_cancel_cutoff_and_checked_in_protected(self):
        booking=self.reserve(price=0)
        self.departure.starts_at=timezone.now()+timedelta(hours=3); self.departure.save()
        with self.assertRaises(Conflict): cancel(booking.pk,self.buyer)
    def test_qr_checkin_replay_and_cross_kind(self):
        booking=self.reserve(price=0)
        self.departure.starts_at=timezone.now()+timedelta(hours=1); self.departure.ends_at=timezone.now()+timedelta(hours=3); self.departure.save()
        check_in(self.guide,admission_token(booking))
        with self.assertRaises(Conflict): check_in(self.guide,admission_token(booking))
        with self.assertRaises(PermissionDenied): check_in(self.buyer,admission_token(booking))
    def test_completion_timing_and_fulfillment(self):
        booking=self.reserve(price=0)
        with self.assertRaises(Conflict): departure_action(self.manager,self.departure.pk,'complete')
        self.departure.starts_at=timezone.now()-timedelta(hours=3); self.departure.ends_at=timezone.now()-timedelta(hours=1); self.departure.save()
        departure_action(self.manager,self.departure.pk,'complete')
        booking.refresh_from_db(); self.assertEqual(booking.fulfillment_status,'COMPLETED')
        self.assertIsNotNone(booking.completed_at)
    def test_late_payment_after_cancellation_queues_refund(self):
        booking=self.reserve()
        departure_action(self.manager,self.departure.pk,'cancel','Weather')
        self.pay(booking)
        booking.refresh_from_db(); self.assertEqual(booking.status,'REFUND_PENDING')
    def test_support_scoping_and_reply(self):
        booking=self.reserve(price=0)
        self.client.force_authenticate(self.buyer)
        r=self.client.post('/api/v1/tourism-requests/',{'operator':str(self.operator.pk),'booking':str(booking.pk),'message':'What should I bring?'},format='json')
        self.assertEqual(r.status_code,201,r.data)
        self.client.force_authenticate(self.guide)
        self.assertEqual(self.client.get('/api/v1/tourism-requests/').data['count'],0)
        self.client.force_authenticate(self.manager)
        r=self.client.post(f"/api/v1/tourism-requests/{r.data['id']}/respond/",{'response':'Bring comfortable shoes.'},format='json')
        self.assertEqual(r.status_code,200,r.data)
        self.assertEqual(r.data['status'],'RESOLVED')
    def test_reminders_are_deduplicated(self):
        self.reserve(price=0)
        self.departure.starts_at=timezone.now()+timedelta(hours=12); self.departure.ends_at=timezone.now()+timedelta(hours=15); self.departure.save()
        self.assertEqual(queue_tour_reminders(),1)
        self.assertEqual(queue_tour_reminders(),0)
    def test_legacy_catalog_cannot_bypass_operator_dashboard(self):
        r=self.client.patch(f'/api/v1/tourism/{self.experience.pk}/',{'name':'Bypass'},format='json')
        self.assertEqual(r.status_code,400)
        self.client.force_authenticate(self.admin)
        r=self.client.post(f'/api/v1/admin/manage/tourism/{self.experience.pk}/',{'action':'approve'},format='json')
        self.assertEqual(r.status_code,409,r.data)
    def test_gallery_upload_reopens_review_and_uses_real_public_image(self):
        content=BytesIO(); Image.new('RGB',(30,20),'green').save(content,'PNG')
        with TemporaryDirectory() as media, override_settings(MEDIA_ROOT=media):
            r=self.client.post(self.base+'images/',{'experience':self.experience.pk,'image':SimpleUploadedFile('tour.png',content.getvalue(),content_type='image/png'),'is_primary':True,'caption':'The actual site'},format='multipart')
            self.assertEqual(r.status_code,200,r.data)
            self.experience.refresh_from_db(); self.assertEqual(self.experience.review_status,'PENDING'); self.assertFalse(self.experience.is_active)
            self.client.force_authenticate(self.admin)
            self.client.post(self.base+'review-experience/',{'experience':self.experience.pk,'status':'APPROVED'},format='json')
            data=APIClient().get(f'/api/v1/tourism/{self.experience.pk}/').data
            self.assertIn('/tourism/experiences/',data['image'])
            self.assertEqual(data['gallery'],[data['image']])
    def test_legacy_adoption_keeps_owner_and_requires_review(self):
        legacy=TourismExperience.objects.create(created_by=self.owner,name='Legacy',description='Legacy site',category='ATTRACTION',location_name='Aba')
        self.assertEqual(self.client.post(self.base+'adopt-experience/',{'experience':legacy.pk},format='json').status_code,403)
        self.client.force_authenticate(self.admin)
        r=self.client.post(self.base+'adopt-experience/',{'experience':legacy.pk},format='json')
        self.assertEqual(r.status_code,200,r.data)
        legacy.refresh_from_db(); self.assertEqual(legacy.operator,self.operator); self.assertEqual(legacy.created_by,self.owner)
        self.assertEqual(legacy.review_status,'PENDING')
