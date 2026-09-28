from decimal import Decimal

from django.test import override_settings

from apps.payments.models import LedgerEntry
from apps.payments.services import settle
from apps.restaurants.models import Restaurant, MenuItem
from tests.test_workflows import Fixture


@override_settings(EVENT_COMMISSION_BPS=500, PLATFORM_COMMISSION_BPS=0)
class TicketCommissionTests(Fixture):
    def test_ticket_fee_and_provider_share_are_recorded_once(self):
        payment = self.payment(self.reserve())
        settle(payment.pk, self.verified(payment))
        sale = LedgerEntry.objects.get(payment=payment, kind='SALE')
        self.assertEqual(sale.gross, Decimal('2000.00'))
        self.assertEqual(sale.platform_fee, Decimal('100.00'))
        self.assertEqual(sale.provider_amount, Decimal('1900.00'))
        # Reconciliation after a rate change must not rewrite historical earnings.
        with override_settings(EVENT_COMMISSION_BPS=750):
            settle(payment.pk, self.verified(payment))
        sale.refresh_from_db()
        self.assertEqual(sale.platform_fee, Decimal('100.00'))
        self.assertEqual(LedgerEntry.objects.filter(payment=payment, kind='SALE').count(), 1)

    def test_ticket_fee_rounds_to_kobo(self):
        self.stock.price = Decimal('100.10')
        self.stock.save()
        payment = self.payment(self.reserve(quantity=1))
        settle(payment.pk, self.verified(payment))
        sale = LedgerEntry.objects.get(payment=payment, kind='SALE')
        self.assertEqual(sale.platform_fee, Decimal('5.01'))
        self.assertEqual(sale.provider_amount, Decimal('95.09'))

    @override_settings(PLATFORM_COMMISSION_BPS=200)
    def test_food_keeps_its_separate_commission_rate(self):
        restaurant = Restaurant.objects.create(owner=self.owner, name='Kitchen', city='Aba', address='Aba', is_active=True, accepts_orders=True)
        item = MenuItem.objects.create(restaurant=restaurant, name='Rice', price=2000, quantity=20)
        booking = self.reserve(kind='FOOD', entries=[{'id': item.pk, 'quantity': 1}], details={'fulfillment': 'PICKUP'})
        payment = self.payment(booking)
        settle(payment.pk, self.verified(payment))
        sale = LedgerEntry.objects.get(payment=payment, kind='SALE')
        self.assertEqual(sale.platform_fee, Decimal('40.00'))
        self.assertEqual(sale.provider_amount, Decimal('1960.00'))
