"""Disposable local UI fixture. Run only against the isolated PostgreSQL test container."""
import os
import sys
from pathlib import Path
from datetime import timedelta

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
os.environ["DJANGO_SETTINGS_MODULE"]="config.settings.test_postgres"
import django
django.setup()
from django.conf import settings
from django.core.management import call_command
from django.contrib.auth import get_user_model
from django.utils import timezone
from apps.events.models import Event,TicketType
from apps.hotels.models import Hotel,RoomType,RoomNight
from apps.restaurants.models import Restaurant,MenuItem
from apps.transport.models import Route,Departure

if settings.DATABASES["default"]["HOST"] not in {"127.0.0.1","localhost"} or settings.DATABASES["default"]["NAME"]!="mmemme_test":
    raise RuntimeError("UI smoke fixtures require the isolated mmemme_test database on loopback.")
settings.PAYSTACK_SECRET_KEY=""
settings.PAYSTACK_TRANSFERS_ENABLED=False
settings.DEBUG=True
settings.ALLOWED_HOSTS=["localhost","127.0.0.1"]
settings.CSRF_TRUSTED_ORIGINS=["http://localhost:5173","http://127.0.0.1:5173"]
call_command("migrate",interactive=False,verbosity=0)
User=get_user_model()
owner,_=User.objects.get_or_create(username="ui-provider",defaults={"email":"provider@example.test","role":"ORGANIZER","is_verified":True,"email_verified":True,"first_name":"Test Provider"})
buyer,_=User.objects.get_or_create(username="ui-buyer",defaults={"email":"buyer@example.test","email_verified":True,"first_name":"Test Customer","phone":"08000000000"})
for user in [owner,buyer]:
    user.set_password("LocalSmokeOnly!493");user.save()
finance,_=User.objects.get_or_create(username="ui-finance",defaults={"email":"finance@example.test","is_staff":True,"is_superuser":True,"email_verified":True})
finance.set_password("LocalSmokeOnly!493");finance.save()
from apps.payments.models import PayoutAccount,Payment,LedgerEntry
from apps.bookings.models import Booking
if not PayoutAccount.objects.filter(provider=owner,is_current=True).exists():
    PayoutAccount.objects.create(provider=owner,bank_name="Local test bank",bank_code="058",account_name="TEST PROVIDER",account_last4="6789",recipient_code="RCP_ui_fake",recipient_id="123",status="APPROVED")
earnings,_=Booking.objects.get_or_create(booking_reference="UI-PAYOUT-EARNINGS",defaults={"user":buyer,"supplier":owner,"kind":"FOOD","status":"CONFIRMED","fulfillment_status":"COMPLETED","completed_at":timezone.now()-timedelta(days=8),"total_amount":10000,"details":{"title":"Disposable payout test"}})
payment,_=Payment.objects.get_or_create(reference="ui-payout-test",defaults={"booking":earnings,"user":buyer,"idempotency_key":"ui-payout-test","provider":"PAYSTACK","amount":10000,"status":"SUCCESS"})
LedgerEntry.objects.get_or_create(payment=payment,kind="SALE",defaults={"booking":earnings,"gross":10000,"platform_fee":500,"provider_amount":9500})
event,_=Event.objects.get_or_create(slug="ui-test-event",defaults={"organizer":owner,"title":"Local test event","description":"A disposable test listing for booking verification.","category":"Culture","venue":"Test venue","city":"Aba","status":"PUBLISHED","capacity":100,"start_datetime":timezone.now()+timedelta(days=5),"end_datetime":timezone.now()+timedelta(days=5,hours=2)})
TicketType.objects.get_or_create(event=event,name="Free admission",defaults={"price":0,"quantity":100})
hotel,_=Hotel.objects.get_or_create(owner=owner,name="Local test hotel",defaults={"city":"Aba","address":"Test location","is_active":True})
room,_=RoomType.objects.get_or_create(hotel=hotel,name="Double",defaults={"max_guests":2})
for i in range(1,8):RoomNight.objects.get_or_create(room_type=room,date=timezone.localdate()+timedelta(days=i),defaults={"price":15000,"quantity":3})
restaurant,_=Restaurant.objects.get_or_create(owner=owner,name="Local test kitchen",defaults={"city":"Aba","address":"Test location","is_active":True,"accepts_orders":True})
MenuItem.objects.get_or_create(restaurant=restaurant,name="Test meal",defaults={"price":2500,"quantity":100})
route,_=Route.objects.get_or_create(owner=owner,name="Local test route",defaults={"origin":"Aba","destination":"Umuahia","pickup_address":"Test station","is_active":True})
if not route.departures.exists():Departure.objects.create(route=route,departs_at=timezone.now()+timedelta(days=2),arrives_at=timezone.now()+timedelta(days=2,hours=2),vehicle="Test bus",price=5000,quantity=15)
call_command("runserver","127.0.0.1:8000",use_reloader=False)
