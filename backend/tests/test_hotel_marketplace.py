from datetime import timedelta
from decimal import Decimal
from datetime import datetime
from unittest.mock import patch
from io import BytesIO
from tempfile import TemporaryDirectory
from PIL import Image
from django.test import override_settings
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from apps.common.api import Conflict
from apps.hotels.models import HotelProvider, HotelStaff, Hotel, RoomType, RoomNight, RoomUnit, RoomAssignment
from apps.hotels.services import reception_action, stay_token, queue_stay_reminders
from apps.bookings.services import reserve, cancel, fulfill
from apps.payments.services import settle
from apps.payments.models import Payment, Refund, LedgerEntry

class HotelMarketplaceTests(TestCase):
 def setUp(self):
  User=get_user_model()
  self.owner=User.objects.create_user(username='host',email='host@example.com',email_verified=True,is_verified=True)
  self.buyer=User.objects.create_user(username='guest',email='guest@example.com',email_verified=True)
  self.manager=User.objects.create_user(username='manager',email='manager@example.com',email_verified=True)
  self.reception=User.objects.create_user(username='reception',email='reception@example.com',email_verified=True)
  self.cleaner=User.objects.create_user(username='cleaner',email='cleaner@example.com',email_verified=True)
  self.admin=User.objects.create_superuser(username='admin',email='admin@example.com',password='StrongPassword9!',email_verified=True)
  self.provider=HotelProvider.objects.create(owner=self.owner,name='Abia Stays',registration_number='RC100',contact_email=self.owner.email,contact_phone='08012345678',address='Aba',status='APPROVED',commission_bps=700)
  for user,role in [(self.manager,'MANAGER'),(self.reception,'RECEPTION'),(self.cleaner,'HOUSEKEEPING')]: HotelStaff.objects.create(provider=self.provider,user=user,role=role)
  self.hotel=Hotel.objects.create(provider=self.provider,owner=self.owner,name='Test Hotel',city='Aba',address='1 Main Road',is_active=True,house_rules='No smoking')
  self.room=RoomType.objects.create(hotel=self.hotel,name='Deluxe',max_guests=2)
  self.unit=RoomUnit.objects.create(hotel=self.hotel,room_type=self.room,name='101')
  self.unit2=RoomUnit.objects.create(hotel=self.hotel,room_type=self.room,name='102')
  self.date=timezone.localdate()+timedelta(days=3)
  self.nights=[RoomNight.objects.create(room_type=self.room,date=self.date+timedelta(days=i),price=1000,quantity=2) for i in range(3)]
  self.client=APIClient();self.client.force_authenticate(self.owner);self.base=f'/api/v1/hotel-providers/{self.provider.pk}/'
 def reserve(self,key='stay-test',quantity=1,free=False):
  if free: RoomNight.objects.filter(pk__in=[n.pk for n in self.nights]).update(price=0)
  return reserve(self.buyer,key,'HOTEL',[{'id':n.pk,'quantity':quantity} for n in self.nights],{'guests':quantity},'Ada','08012345678')[0]
 def pay(self,b):
  payment=Payment.objects.create(booking=b,user=self.buyer,provider='PAYSTACK',reference='PAY-'+str(b.pk),amount=b.total_amount,currency='NGN',idempotency_key=str(b.pk))
  settle(payment.pk,{'id':123,'reference':payment.reference,'status':'success','amount':int(payment.amount*100),'currency':'NGN','metadata':{'booking_id':str(b.pk)},'customer':{'email':self.buyer.email}})
 def arrive_now(self,b):
  clock=patch('django.utils.timezone.now',return_value=datetime.fromisoformat(b.details['check_in_at'])+timedelta(hours=1))
  clock.start();self.addCleanup(clock.stop)
 def test_provider_application_review_and_explicit_commission(self):
  self.client.force_authenticate(self.buyer)
  r=self.client.post('/api/v1/hotel-providers/',{'name':'New Host','registration_number':'RC2','contact_email':self.buyer.email,'contact_phone':'08012345678','address':'Aba'},format='json')
  self.assertEqual(r.status_code,201,r.data);path=f"/api/v1/hotel-providers/{r.data['id']}/review/"
  self.client.force_authenticate(self.admin)
  self.assertEqual(self.client.post(path,{'status':'APPROVED'},format='json').status_code,400)
  self.assertEqual(self.client.post(path,{'status':'APPROVED','commission_bps':500},format='json').status_code,200)
 def test_multiple_properties_and_review(self):
  r=self.client.post(self.base+'properties/',{'name':'Guesthouse','city':'Umuahia','address':'2 Main Road','property_type':'GUESTHOUSE'},format='json')
  self.assertEqual(r.status_code,200,r.data);hotel=Hotel.objects.get(name='Guesthouse');self.assertFalse(hotel.is_active)
  self.client.force_authenticate(self.admin)
  self.assertEqual(self.client.post(self.base+'review-property/',{'hotel':str(hotel.pk),'status':'APPROVED'},format='json').status_code,200)
  self.assertEqual(self.provider.properties.count(),2)
 def test_suspension_hides_properties_and_blocks_bookings(self):
  self.provider.status='SUSPENDED';self.provider.save()
  self.assertEqual(APIClient().get('/api/v1/hotels/').data['count'],0)
  self.assertEqual(APIClient().get('/api/v1/room-nights/').data['count'],0)
  with self.assertRaises(Conflict):self.reserve()
 def test_reception_and_housekeeping_permissions(self):
  self.client.force_authenticate(self.reception)
  self.assertEqual(self.client.get(self.base+'bookings/').status_code,200)
  self.assertEqual(self.client.get(self.base+'earnings/').status_code,403)
  self.assertEqual(self.client.post(self.base+'calendar/',{},format='json').status_code,403)
  self.client.force_authenticate(self.cleaner)
  self.assertEqual(self.client.get(self.base+'bookings/').status_code,403)
  self.assertEqual(self.client.post(self.base+'units/',{'id':str(self.unit.pk),'state':'DIRTY'},format='json').status_code,200)
  self.assertEqual(self.client.post(self.base+'units/',{'id':str(self.unit.pk),'name':'Hack'},format='json').status_code,403)
  self.assertEqual(self.client.post(self.base+'staff/',{},format='json').status_code,403)
 def test_tenant_isolation(self):
  self.client.force_authenticate(self.buyer)
  self.assertEqual(self.client.get(self.base+'bookings/').status_code,404)
  self.assertEqual(self.client.get(self.base+'calendar/').status_code,404)
 def test_calendar_range_capacity_and_blocking(self):
  data={'room_type':str(self.room.pk),'date_from':str(self.date+timedelta(days=4)),'date_to':str(self.date+timedelta(days=7)),'price':'1500','quantity':3}
  self.assertEqual(self.client.post(self.base+'calendar/',data,format='json').status_code,400)
  data['quantity']=2;self.assertEqual(self.client.post(self.base+'calendar/',data,format='json').status_code,200)
  self.assertEqual(self.room.nights.filter(price=1500).count(),3)
  data['quantity']=0;self.assertEqual(self.client.post(self.base+'calendar/',data,format='json').status_code,200)
  self.assertEqual(self.room.nights.filter(price=1500,quantity=0).count(),3)
 def test_calendar_update_rolls_back_all_dates_when_booked(self):
  self.reserve()
  data={'room_type':str(self.room.pk),'date_from':str(self.date-timedelta(days=1)),'date_to':str(self.date+timedelta(days=1)),'price':'2000','quantity':2}
  self.assertEqual(self.client.post(self.base+'calendar/',data,format='json').status_code,409)
  self.assertFalse(self.room.nights.filter(date=self.date-timedelta(days=1)).exists())
  self.nights[0].refresh_from_db();self.assertEqual(self.nights[0].price,Decimal('1000'))
 def test_maintenance_cannot_remove_reserved_capacity(self):
  self.reserve(quantity=2)
  r=self.client.post(self.base+'units/',{'id':str(self.unit.pk),'state':'MAINTENANCE'},format='json')
  self.assertEqual(r.status_code,409,r.data);self.unit.refresh_from_db();self.assertEqual(self.unit.state,'READY')
 def test_maintenance_reduces_unsold_inventory(self):
  self.assertEqual(self.client.post(self.base+'units/',{'id':str(self.unit.pk),'state':'MAINTENANCE'},format='json').status_code,200)
  self.nights[0].refresh_from_db();self.assertEqual(self.nights[0].quantity,1)
 def test_pricing_policy_and_commission_snapshot(self):
  b=self.reserve();self.pay(b)
  self.hotel.house_rules='Changed';self.hotel.cancellation_hours=72;self.hotel.save()
  self.provider.commission_bps=1000;self.provider.save()
  self.assertEqual(b.details['house_rules'],'No smoking');self.assertEqual(b.details['cancellation_hours'],24)
  self.assertEqual(b.total_amount,Decimal('3000'));self.assertEqual(LedgerEntry.objects.get(booking=b,kind='SALE').platform_fee,Decimal('210'))
  r=self.client.get(self.base+'earnings/');self.assertEqual(r.data['sale']['gross'],Decimal('3000'))
 def test_all_nights_reserved_and_capacity_not_oversold(self):
  self.reserve(quantity=2)
  with self.assertRaises(Conflict):self.reserve(key='second')
  for n in self.nights:n.refresh_from_db();self.assertEqual(n.quantity_reserved,2)
 def test_guest_capacity(self):
  from rest_framework.exceptions import ValidationError
  with self.assertRaises(ValidationError):reserve(self.buyer,'capacity','HOTEL',[{'id':n.pk,'quantity':1} for n in self.nights],{'guests':3},'Ada','08012345678')
 def test_reception_assigns_once_and_prevents_overlap(self):
  b=self.reserve(free=True);self.arrive_now(b)
  result=reception_action(self.reception,b.pk,'check-in',units=[self.unit.pk],token=stay_token(b))
  self.assertEqual(result.fulfillment_status,'IN_PROGRESS');self.assertEqual(RoomAssignment.objects.filter(booking=b).count(),1)
  with self.assertRaises(Conflict):reception_action(self.reception,b.pk,'check-in',units=[self.unit.pk])
  second=self.reserve(key='second',free=True);self.arrive_now(second)
  with self.assertRaises(Conflict):reception_action(self.reception,second.pk,'check-in',units=[self.unit.pk])
 def test_multinight_reception_endpoint_uses_distinct_booking(self):
  b=self.reserve(free=True);self.arrive_now(b);self.client.force_authenticate(self.reception)
  r=self.client.post(self.base+'reception/',{'booking':str(b.pk),'action':'check-in','units':[str(self.unit.pk)]},format='json')
  self.assertEqual(r.status_code,200,r.data)
 def test_overstaying_guest_blocks_next_room_assignment(self):
  b=self.reserve(free=True);self.arrive_now(b);reception_action(self.reception,b.pk,'check-in',units=[self.unit.pk])
  b.refresh_from_db();b.details['check_out']=str(self.date);b.save(update_fields=['details'])
  second=self.reserve(key='second',free=True);self.arrive_now(second)
  with self.assertRaises(Conflict):reception_action(self.reception,second.pk,'check-in',units=[self.unit.pk])
 def test_direct_fulfillment_cannot_bypass_reception(self):
  b=self.reserve(free=True)
  with self.assertRaises(Conflict):fulfill(b.pk,self.owner,'IN_PROGRESS')
 def test_checkout_requires_end_and_marks_dirty(self):
  b=self.reserve(free=True);self.arrive_now(b);reception_action(self.reception,b.pk,'check-in',units=[self.unit.pk])
  with self.assertRaises(Conflict):reception_action(self.reception,b.pk,'check-out')
  with patch('django.utils.timezone.now',return_value=datetime.fromisoformat(b.details['check_out_at'])+timedelta(minutes=1)):
   result=reception_action(self.reception,b.pk,'check-out')
  self.assertEqual(result.fulfillment_status,'COMPLETED')
  self.unit.refresh_from_db();self.assertEqual(self.unit.state,'DIRTY')
 def test_property_cancellation_full_refund(self):
  b=self.reserve();self.pay(b)
  reception_action(self.manager,b.pk,'cancel',reason='Emergency repair')
  b.refresh_from_db();self.assertEqual(b.status,'REFUND_PENDING');self.assertEqual(Refund.objects.get(payment__booking=b).amount,Decimal('3000'))
 def test_cutoff_and_checked_in_cannot_be_cancelled(self):
  b=self.reserve(free=True);self.arrive_now(b)
  with self.assertRaises(Conflict):cancel(b.pk,self.buyer)
  reception_action(self.reception,b.pk,'check-in',units=[self.unit.pk])
  with self.assertRaises(Conflict):reception_action(self.owner,b.pk,'cancel',reason='Change')
 def test_no_show_does_not_complete_or_release_payout(self):
  b=self.reserve(free=True);self.arrive_now(b)
  result=reception_action(self.reception,b.pk,'no-show');self.assertEqual(result.fulfillment_status,'NEW');self.assertIsNone(result.completed_at)
  with self.assertRaises(Conflict):reception_action(self.reception,b.pk,'check-out')
  result=reception_action(self.manager,b.pk,'clear-no-show',reason='Guest has now arrived')
  self.assertNotIn('no_show_at',result.details)
  reception_action(self.reception,b.pk,'check-in',units=[self.unit.pk])
 def test_reminders_deduplicated(self):
  b=self.reserve(free=True);b.details['check_in']=str(timezone.localdate()+timedelta(days=1));b.details['check_in_at']=(timezone.now()+timedelta(hours=12)).isoformat();b.save(update_fields=['details'])
  self.assertEqual(queue_stay_reminders(),1);self.assertEqual(queue_stay_reminders(),0)
 def test_legacy_catalog_cannot_bypass_dashboard(self):
  self.assertEqual(self.client.patch(f'/api/v1/hotels/{self.hotel.pk}/',{'name':'Bypass'},format='json').status_code,400)
  self.client.force_authenticate(self.admin)
  self.assertEqual(self.client.post(f'/api/v1/admin/manage/hotels/{self.hotel.pk}/',{'action':'approve'},format='json').status_code,409)
 def test_legacy_adoption_requires_same_owner(self):
  hotel=Hotel.objects.create(owner=self.owner,name='Legacy',city='Aba',address='Aba')
  self.client.force_authenticate(self.admin)
  self.assertEqual(self.client.post(self.base+'adopt-property/',{'hotel':str(hotel.pk)},format='json').status_code,200)
  hotel.refresh_from_db();self.assertEqual(hotel.provider,self.provider);self.assertFalse(hotel.is_active)
 def test_search_requires_enough_rooms_for_every_night(self):
  path='/api/v1/stay-search/'
  values={'check_in':str(self.date),'check_out':str(self.date+timedelta(days=3)),'rooms':2,'guests':4}
  r=APIClient().get(path,values);self.assertEqual(r.status_code,200,r.data);self.assertEqual(r.data['results'][0]['total'],'6000')
  self.nights[1].quantity=1;self.nights[1].save()
  self.assertEqual(APIClient().get(path,values).data['count'],0)
 def test_gallery_upload_requires_review_and_publishes_actual_image(self):
  content=BytesIO();Image.new('RGB',(30,20),'green').save(content,'PNG')
  with TemporaryDirectory() as media,override_settings(MEDIA_ROOT=media):
   r=self.client.post(self.base+'images/',{'hotel':str(self.hotel.pk),'image':SimpleUploadedFile('hotel.png',content.getvalue(),content_type='image/png'),'is_primary':True},format='multipart')
   self.assertEqual(r.status_code,200,r.data);self.hotel.refresh_from_db();self.assertFalse(self.hotel.is_active)
   self.client.force_authenticate(self.admin)
   self.client.post(self.base+'review-property/',{'hotel':str(self.hotel.pk),'status':'APPROVED'},format='json')
   data=APIClient().get(f'/api/v1/hotels/{self.hotel.pk}/').data
   self.assertIn('/hotels/properties/',data['image']);self.assertEqual(data['gallery'],[data['image']])
 def test_support_requests_are_private_and_managers_can_reply(self):
  b=self.reserve(free=True);self.client.force_authenticate(self.buyer)
  r=self.client.post('/api/v1/hotel-requests/',{'provider':str(self.provider.pk),'booking':str(b.pk),'message':'Can I leave my luggage?'},format='json')
  self.assertEqual(r.status_code,201,r.data);request_id=r.data['id']
  self.client.force_authenticate(self.cleaner);self.assertEqual(self.client.get('/api/v1/hotel-requests/').data['count'],0)
  self.client.force_authenticate(self.manager)
  self.assertEqual(self.client.post(f'/api/v1/hotel-requests/{request_id}/respond/',{'response':'Yes, ask reception.'},format='json').status_code,200)
