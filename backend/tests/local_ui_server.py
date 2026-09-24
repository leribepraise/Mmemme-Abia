"""Disposable SQLite browser-test server. Never connects to the application DB."""
import os
import sys
import tempfile
from pathlib import Path
from datetime import timedelta

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
os.environ['DJANGO_SETTINGS_MODULE'] = 'config.settings.test'
from django.conf import settings

workspace = Path(__file__).resolve().parents[2] / 'artifacts'
workspace.mkdir(exist_ok=True)
temporary = tempfile.TemporaryDirectory(prefix='ui-test-', dir=workspace)
settings.DATABASES = {'default': {'ENGINE': 'django.db.backends.sqlite3', 'NAME': str(Path(temporary.name) / 'test.sqlite3')}}
settings.CACHES = {'default': {'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'}}
settings.DEBUG = True
settings.ALLOWED_HOSTS = ['127.0.0.1', 'localhost']
settings.CSRF_TRUSTED_ORIGINS = ['http://localhost:55173', 'http://127.0.0.1:55173']
settings.FRONTEND_URL = 'http://localhost:55173'
settings.PAYSTACK_SECRET_KEY = ''
settings.PAYSTACK_TRANSFERS_ENABLED = False
settings.REFRESH_COOKIE_SECURE = False
settings.CSRF_COOKIE_SECURE = False
import django
django.setup()
from django.core.management import call_command
from django.contrib.auth import get_user_model
from django.utils import timezone
from apps.events.models import Event, TicketType
from apps.hotels.models import Hotel, RoomType, RoomNight
from apps.restaurants.models import Restaurant, MenuItem
from apps.transport.models import Route, Departure

call_command('migrate', interactive=False, verbosity=0)
User = get_user_model()
owner = User.objects.create_user(username='ui-provider', email='provider@example.test', password='LocalSmokeOnly!493', role='ORGANIZER', is_verified=True, email_verified=True, first_name='Test Provider', phone='08000000000')
buyer = User.objects.create_user(username='ui-buyer', email='buyer@example.test', password='LocalSmokeOnly!493', email_verified=True, first_name='Test Customer', phone='08000000000')
event = Event.objects.create(organizer=owner, title='Local test event', slug='local-test-event', description='Disposable listing for API checks.', category='Culture', venue='Test venue', city='Aba', status='PUBLISHED', capacity=100, start_datetime=timezone.now()+timedelta(days=5), end_datetime=timezone.now()+timedelta(days=5,hours=2))
TicketType.objects.create(event=event, name='Free admission', price=0, quantity=100)
hotel = Hotel.objects.create(owner=owner, name='Local test hotel', city='Aba', address='Test location', is_active=True)
room = RoomType.objects.create(hotel=hotel, name='Double', max_guests=2)
for day in range(1,8):
    RoomNight.objects.create(room_type=room, date=timezone.localdate()+timedelta(days=day), price=15000, quantity=3)
restaurant = Restaurant.objects.create(owner=owner, name='Local test kitchen', city='Aba', address='Test location', is_active=True, accepts_orders=True)
MenuItem.objects.create(restaurant=restaurant, name='Test meal', price=2500, quantity=100)
route = Route.objects.create(owner=owner, name='Local test route', origin='Aba', destination='Umuahia', pickup_address='Test station', is_active=True)
Departure.objects.create(route=route, departs_at=timezone.now()+timedelta(days=2), arrives_at=timezone.now()+timedelta(days=2,hours=2), vehicle='Test bus', price=5000, quantity=15)
from apps.tourism.models import TourismExperience, TourPackage, TourDeparture
tour = TourismExperience.objects.create(created_by=owner, name='Local test tour', description='Disposable tour fixture.', category='ACTIVITY', location_name='Aba', is_active=True)
package = TourPackage.objects.create(experience=tour, name='Guided tour', price=3000)
TourDeparture.objects.create(package=package, starts_at=timezone.now()+timedelta(days=3), ends_at=timezone.now()+timedelta(days=3,hours=1), price=3000, quantity=10)
# A genuinely zero-priced fixture exercises confirmation without a payment provider.
from apps.bookings.services import reserve
complimentary = RoomNight.objects.create(room_type=room, date=timezone.localdate()+timedelta(days=10), price=0, quantity=1)
reserve(buyer, 'ui-complimentary-stay', 'HOTEL', [{'id': complimentary.pk, 'quantity': 1}], {'guests': 1}, 'Test Customer', '08000000000')
try:
    call_command('runserver', '127.0.0.1:58000', use_reloader=False)
finally:
    from django.db import connections
    connections.close_all()
    temporary.cleanup()
