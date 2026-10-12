from datetime import timedelta
from decimal import Decimal
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from apps.common.api import Conflict
from apps.transport.models import TransportCompany, Terminal, Vehicle, Route, Departure, CompanyStaff
from apps.transport.services import boarding_token, check_in, cancel_departure, complete_departure
from apps.bookings.services import reserve, cancel
from apps.payments.services import settle
from apps.payments.models import Payment, Refund, LedgerEntry


class TransportMarketplaceTests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.owner = User.objects.create_user(username='bus-owner', email='bus@example.com', email_verified=True, is_verified=True)
        self.buyer = User.objects.create_user(username='passenger', email='passenger@example.com', email_verified=True)
        self.admin = User.objects.create_superuser(username='admin', email='admin@example.com', password='StrongPassword9!', email_verified=True)
        self.manager = User.objects.create_user(username='manager', email='manager@example.com', email_verified=True)
        self.boarding = User.objects.create_user(username='boarding', email='boarding@example.com', email_verified=True)
        self.company = TransportCompany.objects.create(owner=self.owner, name='Abia Travel', registration_number='RC123', contact_email=self.owner.email, contact_phone='08012345678', address='Aba', status='APPROVED', commission_bps=700)
        CompanyStaff.objects.create(company=self.company, user=self.manager, role='MANAGER')
        CompanyStaff.objects.create(company=self.company, user=self.boarding, role='BOARDING')
        self.origin = Terminal.objects.create(company=self.company, name='Aba terminal', city='Aba', address='1 Main Road')
        self.destination = Terminal.objects.create(company=self.company, name='Umuahia terminal', city='Umuahia', address='2 Main Road')
        self.vehicle = Vehicle.objects.create(company=self.company, name='Bus 1', registration_number='ABC123', capacity=10)
        self.route = Route.objects.create(owner=self.owner, company=self.company, name='Aba to Umuahia', origin='Aba', destination='Umuahia', origin_terminal=self.origin, destination_terminal=self.destination, pickup_address=self.origin.address, is_active=True)
        self.departure = Departure.objects.create(route=self.route, fleet_vehicle=self.vehicle, vehicle=self.vehicle.name, price='1000', quantity=5, departs_at=timezone.now()+timedelta(days=3), arrives_at=timezone.now()+timedelta(days=3, hours=2))
        self.client = APIClient(); self.client.force_authenticate(self.owner)
        self.base = f'/api/v1/transport-companies/{self.company.pk}/'
    def reserve(self, quantity=1, price=None):
        if price is not None: self.departure.price=price; self.departure.save(update_fields=['price'])
        return reserve(self.buyer, 'transport-request', 'TRANSPORT', [{'id':self.departure.pk, 'quantity':quantity}], {'passengers':['Ada'] * quantity}, customer_name='Ada', customer_phone='08012345678')[0]
    def pay(self, booking):
        payment = Payment.objects.create(booking=booking, user=self.buyer, provider='PAYSTACK', reference='PAY-'+str(booking.pk), amount=booking.total_amount, currency='NGN', idempotency_key=str(booking.pk))
        return settle(payment.pk, {'id': 12345, 'reference': payment.reference, 'status':'success', 'amount':int(payment.amount*100), 'currency':'NGN', 'metadata':{'booking_id':str(booking.pk)}, 'customer':{'email':self.buyer.email}})
    def test_public_company_and_departure_metadata(self):
        client = APIClient()
        companies = client.get('/api/v1/transport-companies/').data['results']
        self.assertEqual(companies[0]['name'], self.company.name)
        self.assertNotIn('registration_number', companies[0])
        data = client.get('/api/v1/departures/').data['results'][0]
        self.assertEqual(data['company_name'], self.company.name)
        self.assertEqual(data['origin'], 'Aba')
        self.company.status='SUSPENDED'; self.company.save()
        self.assertEqual(client.get('/api/v1/departures/').data['count'], 0)
        with self.assertRaises(Conflict): self.reserve()
    def test_application_requires_verified_email_and_approval_commission(self):
        self.client.force_authenticate(self.buyer)
        response = self.client.post('/api/v1/transport-companies/', {'name':'New Bus', 'registration_number':'RC999', 'contact_email':self.buyer.email, 'contact_phone':'08011111111', 'address':'Aba'}, format='json')
        self.assertEqual(response.status_code,201,response.data)
        company = TransportCompany.objects.get(pk=response.data['id'])
        self.assertEqual(company.status,'PENDING')
        self.client.force_authenticate(self.admin)
        path=f'/api/v1/transport-companies/{company.pk}/review/'
        self.assertEqual(self.client.post(path, {'status':'APPROVED'}, format='json').status_code,400)
        self.assertEqual(self.client.post(path, {'status':'APPROVED', 'commission_bps':500}, format='json').status_code,200)
        self.buyer.refresh_from_db(); self.assertTrue(self.buyer.is_verified)
    def test_boarding_role_cannot_edit_or_read_finances(self):
        self.client.force_authenticate(self.boarding)
        self.assertEqual(self.client.get(self.base+'bookings/').status_code,200)
        self.assertEqual(self.client.post(self.base+'vehicles/', {'name':'Hack'}, format='json').status_code,403)
        self.assertEqual(self.client.get(self.base+'earnings/').status_code,403)
        self.client.force_authenticate(self.buyer)
        self.assertEqual(self.client.get(self.base+'bookings/').status_code,404)
    def test_manager_cannot_grant_staff_access_or_edit_identity(self):
        self.client.force_authenticate(self.manager)
        self.assertEqual(self.client.post(self.base+'staff/', {'email':self.buyer.email, 'role':'MANAGER'}, format='json').status_code,403)
        self.assertEqual(self.client.patch(self.base, {'name':'Changed'}, format='json').status_code,403)
    def test_capacity_and_overlapping_vehicle_rejected(self):
        payload = {'route':str(self.route.pk), 'fleet_vehicle':str(self.vehicle.pk), 'departs_at':self.departure.departs_at.isoformat(), 'arrives_at':self.departure.arrives_at.isoformat(), 'price':'1000', 'quantity':20}
        response = self.client.post(self.base+'departures/', payload, format='json')
        self.assertEqual(response.status_code,400)
        payload['quantity']=5
        response = self.client.post(self.base+'departures/', payload, format='json')
        self.assertEqual(response.status_code,400)
        payload['departs_at']=(self.departure.arrives_at+timedelta(hours=1)).isoformat()
        payload['arrives_at']=(self.departure.arrives_at+timedelta(hours=3)).isoformat()
        self.assertEqual(self.client.post(self.base+'departures/',payload,format='json').status_code,200)
    def test_foreign_terminal_rejected(self):
        other = TransportCompany.objects.create(owner=self.buyer, name='Other', registration_number='OTHER', contact_email=self.buyer.email, contact_phone='08011111111', address='Aba')
        terminal = Terminal.objects.create(company=other, name='Other', city='Aba', address='Elsewhere')
        response=self.client.post(self.base+'routes/', {'name':'Invalid', 'origin_terminal':str(terminal.pk), 'destination_terminal':str(self.destination.pk), 'service_type':'BUS'},format='json')
        self.assertEqual(response.status_code,400)
    def test_reserved_inventory_cannot_be_repriced_or_reduced(self):
        self.reserve(quantity=2)
        self.assertEqual(self.client.post(self.base+'departures/', {'id':str(self.departure.pk), 'price':'2000'},format='json').status_code,400)
        self.assertEqual(self.client.post(self.base+'departures/', {'id':str(self.departure.pk), 'quantity':1},format='json').status_code,400)
        self.assertEqual(self.client.patch(f'/api/v1/departures/{self.departure.pk}/', {'price':'2000'},format='json').status_code,400)
    def test_allocated_inventory_prevents_overselling(self):
        self.reserve(quantity=5)
        with self.assertRaises(Conflict):
            reserve(self.manager,'another-request','TRANSPORT',[{'id':self.departure.pk,'quantity':1}],{'passengers':['Chidi']})
    def test_names_required_for_each_passenger(self):
        with self.assertRaisesMessage(Exception,'passenger name'):
            reserve(self.buyer,'missing-names','TRANSPORT',[{'id':self.departure.pk,'quantity':2}],{'passengers':['Ada']})
    def test_commission_snapshot_survives_agreement_change(self):
        booking=self.reserve(quantity=2)
        self.company.commission_bps=1000;self.company.save()
        payment=self.pay(booking)
        sale=LedgerEntry.objects.get(payment=payment,kind='SALE')
        self.assertEqual(sale.platform_fee,Decimal('140.00'))
    def test_cancellation_cutoff_and_operator_full_refund(self):
        booking=self.reserve();self.pay(booking)
        Departure.objects.filter(pk=self.departure.pk).update(departs_at=timezone.now()+timedelta(hours=5))
        with self.assertRaises(Conflict):cancel(booking.pk,self.buyer)
        cancel_departure(self.manager,self.departure.pk,'Vehicle maintenance')
        booking.refresh_from_db();self.departure.refresh_from_db()
        self.assertEqual(booking.status,'REFUND_PENDING')
        self.assertEqual(self.departure.quantity_sold,0)
        self.assertEqual(Refund.objects.count(),1)
        cancel_departure(self.manager,self.departure.pk,'Vehicle maintenance')
        self.assertEqual(Refund.objects.count(),1)
    def test_boarding_is_signed_authorized_and_single_use(self):
        booking=self.reserve(price=0)
        Departure.objects.filter(pk=self.departure.pk).update(departs_at=timezone.now()+timedelta(hours=1), arrives_at=timezone.now()+timedelta(hours=3))
        token=boarding_token(booking)
        self.client.force_authenticate(self.buyer)
        self.assertEqual(self.client.post('/api/v1/transport-companies/check-in/',{'token':token},format='json').status_code,403)
        result=check_in(self.boarding,token)
        self.assertTrue(result.details['boarded_at'])
        with self.assertRaises(Conflict):check_in(self.boarding,token)
        with self.assertRaises(Exception):check_in(self.boarding,token+'bad')
    def test_completion_only_after_arrival(self):
        booking=self.reserve(price=0)
        with self.assertRaises(Conflict):complete_departure(self.manager,self.departure.pk)
        Departure.objects.filter(pk=self.departure.pk).update(departs_at=timezone.now()-timedelta(hours=3), arrives_at=timezone.now()-timedelta(hours=1))
        complete_departure(self.manager,self.departure.pk)
        booking.refresh_from_db();self.assertEqual(booking.fulfillment_status,'COMPLETED');self.assertIsNotNone(booking.completed_at)
        with self.assertRaises(Conflict):cancel_departure(self.manager,self.departure.pk,'No deletion')
    def test_support_requests_scoped_to_passenger_company_and_admin(self):
        booking=self.reserve()
        self.client.force_authenticate(self.buyer)
        response=self.client.post('/api/v1/transport-requests/', {'company':str(self.company.pk),'booking':str(booking.pk),'message':'Pickup assistance'},format='json')
        self.assertEqual(response.status_code,201,response.data)
        path=f"/api/v1/transport-requests/{response.data['id']}/respond/"
        self.assertEqual(self.client.post(path,{'response':'Self-resolved'},format='json').status_code,403)
        self.client.force_authenticate(self.manager)
        self.assertEqual(self.client.post(path,{'response':'Please arrive 30 minutes early.'},format='json').status_code,200)
    def test_legal_identity_change_requires_review(self):
        response=self.client.patch(self.base,{'registration_number':'RC_CHANGED'},format='json')
        self.assertEqual(response.status_code,200)
        self.company.refresh_from_db();self.assertEqual(self.company.status,'PENDING')
    def test_revoked_staff_cannot_read_manifest(self):
        CompanyStaff.objects.filter(company=self.company,user=self.manager).update(is_active=False)
        self.client.force_authenticate(self.manager)
        self.assertEqual(self.client.get(self.base+'bookings/').status_code,404)
    def test_duplicate_vehicle_returns_validation_error(self):
        response = self.client.post(self.base+'vehicles/', {'name':'Duplicate', 'registration_number':self.vehicle.registration_number, 'capacity':10},format='json')
        self.assertEqual(response.status_code,400)
    def test_paused_vehicle_closes_new_sales(self):
        self.client.post(self.base+'vehicles/', {'id':str(self.vehicle.pk),'is_active':False},format='json')
        self.assertEqual(APIClient().get('/api/v1/departures/').data['count'],0)
        with self.assertRaises(Conflict): self.reserve()
    def test_reminders_are_once_only_and_route_to_boarding_passes(self):
        from apps.transport.services import queue_journey_reminders
        from apps.notifications.models import Notification
        from apps.notifications.routing import notification_destination
        booking=self.reserve(price=0)
        Departure.objects.filter(pk=self.departure.pk).update(departs_at=timezone.now()+timedelta(hours=10),arrives_at=timezone.now()+timedelta(hours=12))
        self.assertEqual(queue_journey_reminders(),1)
        self.assertEqual(queue_journey_reminders(),0)
        notification=Notification.objects.get(key=f'transport-reminder:{booking.pk.hex}')
        self.assertEqual(notification_destination(notification)[0],'/transport/bookings')
    def test_external_event_shuttle_route(self):
        from apps.events.models import Event
        event=Event.objects.create(organizer=self.owner,title='Tech conference',slug='tech-conference',description='Conference',category='Business',venue='Hall',city='Aba',start_datetime=timezone.now()+timedelta(days=5),end_datetime=timezone.now()+timedelta(days=5,hours=2),capacity=100,status='PUBLISHED',registration_type='EXTERNAL',registration_url='https://example.org/register')
        response=self.client.post(self.base+'routes/',{'name':'Conference shuttle','origin_terminal':str(self.origin.pk),'destination_terminal':str(self.destination.pk),'service_type':'EVENT_SHUTTLE','event':str(event.pk),'is_active':True},format='json')
        self.assertEqual(response.status_code,200,response.data)
