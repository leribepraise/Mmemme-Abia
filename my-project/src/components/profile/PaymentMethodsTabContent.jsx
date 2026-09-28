import { Link } from 'react-router-dom';
export default function PaymentMethodsTabContent() {
  return <section className="space-y-4 rounded-xl border bg-white p-6">
    <h2 className="text-lg font-bold text-[#172033]">Payments with Paystack</h2>
    <p className="text-sm text-gray-600">Bookings and memberships are priced in Nigerian naira (₦). Choose an available payment option on Paystack’s checkout page when you pay.</p>
    <p className="text-sm text-gray-600">Mmemme Abia does not store your card details. Membership renewals are manual.</p>
    <Link to="/plans" className="block text-green-800 underline">Manage membership and view plan payments</Link>
    <Link to="/profile?section=My%20Bookings" className="block text-green-800 underline">View your bookings</Link>
  </section>;
}
