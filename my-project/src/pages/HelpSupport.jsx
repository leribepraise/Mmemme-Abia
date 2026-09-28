import { useState } from 'react';
import { Link } from 'react-router-dom';
import ContactForm from '../components/contact/ContactForm';
const topics = [
  ['How do I book?', 'Open a published listing, select an available ticket, room or departure, and follow checkout. Check the confirmed booking in My Bookings.', '/profile?section=My%20Bookings'],
  ['Which payment methods are supported?', 'All payments go through Paystack in Nigerian naira. Paystack displays the payment options available for your transaction.', '/profile?section=Payment%20History'],
  ['How do memberships work?', 'Bronze is free. Silver and Diamond last one calendar month after verified payment. Renewals are manual. Ticket discounts and early access apply only when the organizer enables them.', '/plans'],
  ['Can I cancel or request a refund?', 'Cancellation depends on the booking type, its status and the applicable cancellation window. Open the booking details to check available actions. Contact support if you need help.', '/profile?section=My%20Bookings'],
  ['Is community posting free?', 'Yes. Verified accounts can create posts and groups without a paid plan. Posts appear immediately; admins can remove content that breaks community rules.', '/community'],
  ['How do I manage notifications?', 'Open Notifications to read messages and manage browser push preferences. Push delivery depends on your device and browser settings.', '/notifications'],
];
export default function HelpSupport() {
  const [query, setQuery] = useState('');
  const rows = topics.filter(row => row.slice(0,2).join(' ').toLowerCase().includes(query.toLowerCase()));
  return <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 text-gray-800"><h1 className="text-center text-3xl font-bold">How can we help you?</h1><input type="search" aria-label="Search help" placeholder="Search for help…" value={query} onChange={e=>setQuery(e.target.value)} className="w-full rounded-lg border bg-white p-3"/><div className="grid gap-4 md:grid-cols-2">{rows.map(([title,body,to])=><section key={title} className="space-y-3 rounded-xl border bg-white p-5"><h2 className="font-bold">{title}</h2><p className="text-sm">{body}</p><Link to={to} className="text-sm text-green-800 underline">Open related page</Link></section>)}</div>{!rows.length&&<p>No matching questions. You can contact support below.</p>}<ContactForm/><Link to="/terms" className="block text-green-800 underline">Terms and conditions</Link></main>;
}
