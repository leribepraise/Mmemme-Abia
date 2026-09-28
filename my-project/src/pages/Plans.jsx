import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api, money } from '@/lib/api';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/components/context/AuthContext';
import ShareApp from '@/components/ShareApp';

export default function Plans() {
  const { reloadUser } = useAuth();
  const { search } = useLocation();
  const plans = useApi('/plans/');
  const membership = useApi('/memberships/');
  const history = useApi('/memberships/payments/');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const checkoutKey = useRef({});
  const verify = async reference => {
    setBusy(true); setMessage('Confirming your payment with Paystack…');
    try {
      const payment = await api('/memberships/verify-reference/', { method: 'POST', body: { reference } });
      setMessage(payment.status === 'SUCCESS' ? 'Payment confirmed. Your membership is active.' : `Payment status: ${payment.status.toLowerCase()}. Your plan changes only after payment is confirmed.`);
      membership.reload(); history.reload(); await reloadUser();
    } catch (error) { setMessage(error.message); } finally { setBusy(false); }
  };
  useEffect(() => {
    const params = new URLSearchParams(search);
    const reference = params.get('reference') || params.get('trxref');
    if (reference) verify(reference);
    // The callback is verified once per reference, not every profile refresh.
  }, [search]);
  const checkout = async plan => {
    if (busy) return;
    setBusy(true); setMessage('Opening Paystack…');
    checkoutKey.current[plan] ||= crypto.randomUUID();
    try {
      const payment = await api('/memberships/checkout/', { method: 'POST', key: checkoutKey.current[plan], body: { plan } });
      if (payment.status === 'SUCCESS') { setMessage('This payment is already confirmed.'); membership.reload(); history.reload(); return; }
      const url = new URL(payment.authorization_url);
      if (url.protocol !== 'https:' || url.hostname !== 'checkout.paystack.com') throw new Error('Invalid payment link.');
      window.location.assign(url.href);
    } catch (error) { setMessage(error.message); delete checkoutKey.current[plan]; history.reload(); } finally { setBusy(false); }
  };
  const active = membership.data?.plan;
  return <main className="mx-auto max-w-6xl space-y-6 px-4 py-8"><div className="flex flex-wrap justify-between gap-4"><div><h1 className="text-3xl font-bold text-[#1B5E20]">Membership plans</h1><p className="mt-2">Pay securely in naira with Paystack.</p></div><ShareApp/></div>
    <section className="rounded-xl bg-white p-5"><p>Current plan: <strong className="capitalize">{active || 'Loading…'}</strong></p>{membership.data?.expires_at && <p>Active until {new Date(membership.data.expires_at).toLocaleString()}</p>}<p className="mt-2 text-sm text-gray-600">Paid plans last one calendar month. Renew when you choose; there are no automatic charges. Your account returns to Bronze after expiry. Change to another paid plan after your current plan expires.</p></section>
    {message && <p role="status" className="rounded-lg bg-green-50 p-4">{message}</p>}
    {(plans.error || membership.error) && <p role="alert">{plans.error?.message || membership.error?.message}</p>}
    <div className="grid gap-5 md:grid-cols-3">{plans.data?.results?.map(plan=><section key={plan.code} className="flex flex-col rounded-2xl border bg-white p-6 shadow-sm"><h2 className="text-2xl font-bold text-green-900">{plan.name}</h2><p className="my-4 text-2xl font-bold">{Number(plan.price) ? money(plan.price) : 'Free'}{Number(plan.price)>0 && <span className="text-sm font-normal"> / month</span>}</p><ul className="mb-6 flex-1 space-y-3 text-sm">{plan.features.map(feature=><li key={feature}>✓ {feature}</li>)}</ul>{Number(plan.price)>0?<button disabled={busy || (active && active!=='bronze' && active!==plan.code)} onClick={()=>checkout(plan.code)} className="rounded-lg bg-[#3F783D] px-4 py-3 font-semibold text-white disabled:opacity-50">{active===plan.code?'Renew':'Choose'} {plan.name}</button>:<Link to="/profile" className="rounded-lg border px-4 py-3 text-center">Continue with {active==='bronze'?'Bronze':'your account'}</Link>}</section>)}</div>
    <p className="text-sm text-gray-600">Discounts, early booking and member-only access apply only to tickets enabled by the organizer. Event tickets are purchased separately.</p>
    <section className="rounded-xl bg-white p-5"><h2 className="mb-4 text-xl font-bold">Membership payments</h2>{history.error && <p role="alert">{history.error.message}</p>}{history.loading?<p>Loading…</p>:!history.data?.results?.length?<p>No membership payments yet.</p>:<div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-2">Plan</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead><tbody>{history.data.results.map(payment=><tr key={payment.id} className="border-t"><td className="p-3 capitalize">{payment.plan}</td><td>{money(payment.amount)}</td><td>{payment.status}</td><td>{payment.status==='PROCESSING' && <><button disabled={busy} onClick={()=>verify(payment.reference)} className="mr-3 text-green-800 underline">Check payment</button>{payment.authorization_url?.startsWith('https://checkout.paystack.com/')&&<a href={payment.authorization_url} className="text-green-800 underline">Continue payment</a>}</>}{payment.status==='REVIEW'&&<Link to="/message">Contact support</Link>}</td></tr>)}</tbody></table></div>}</section>
    <Link to="/profile" className="text-green-800 underline">Back to dashboard</Link>
  </main>;
}
