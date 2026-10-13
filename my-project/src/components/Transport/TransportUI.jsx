import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import { api, money } from '@/lib/api';
import { useApi, useCollection } from '@/hooks/useApi';
import PayoutAccountForm from '@/components/organizer/PayoutAccountForm';

export const panel = 'rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 min-w-0';
export const button = 'rounded-xl bg-[#3F7D3D] px-4 py-3 text-white font-semibold disabled:opacity-50 break-words';
export const outline = 'rounded-xl border border-gray-300 px-4 py-3 font-semibold disabled:opacity-50';
export function TransportLoading() { return <div role="status" aria-label="Loading transport" className="space-y-4 animate-pulse">{[1, 2, 3].map(n => <div key={n} className="h-32 rounded-2xl bg-gray-200" />)}</div>; }

export function TransportForm({ fields, initial = {}, onSave, submit = 'Save', children }) {
  const [values, setValues] = useState(initial);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const save = async event => {
    event.preventDefault(); if (lock.current) return;
    lock.current = true; setBusy(true);
    try { await onSave(values); } catch (error) { toast.error(error.message); }
    finally { lock.current = false; setBusy(false); }
  };
  return <form onSubmit={save} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2">{fields.map(field => <label key={field.name} className="block min-w-0 text-sm font-medium">{field.label}
    {field.type === 'checkbox' ? <input type="checkbox" checked={!!values[field.name]} onChange={e => setValues(v => ({ ...v, [field.name]: e.target.checked }))} className="ml-3" /> : field.options ? <select required={!field.optional} value={values[field.name] ?? ''} onChange={e => setValues(v => ({ ...v, [field.name]: e.target.value || null }))} className="mt-2 w-full min-w-0 rounded-xl border border-gray-300 p-3 text-base"><option value="">Select…</option>{field.options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select> : <input required={!field.optional} type={field.type || 'text'} min={field.min} max={field.max} step={field.step} maxLength={field.maxLength || 3000} value={field.type === 'file' ? undefined : values[field.name] ?? ''} accept={field.type === 'file' ? 'image/png,image/jpeg,image/webp' : undefined} onChange={e => setValues(v => ({ ...v, [field.name]: field.type === 'file' ? e.target.files[0] : e.target.value }))} className="mt-2 w-full min-w-0 rounded-xl border border-gray-300 p-3 text-base" />}
    {field.help && <span className="block mt-1 text-xs text-gray-500">{field.help}</span>}</label>)}</div>{children}<button disabled={busy} className={button}>{busy ? 'Saving…' : submit}</button></form>;
}

export function TransportPayouts({ service = 'journey' }) {
  const { data: summary, reload } = useApi('/payouts/summary/');
  const { data: payouts } = useCollection('/payouts/');
  const [busy, setBusy] = useState(false);
  const key = useRef(crypto.randomUUID());
  const request = async () => {
    if (busy) return; setBusy(true);
    try { await api('/payouts/', { method: 'POST', body: {}, key: key.current }); key.current = crypto.randomUUID(); reload(); toast.success('Payout requested for finance review.'); }
    catch (error) { toast.error(error.message); } finally { setBusy(false); }
  };
  return <div className="space-y-5"><div className={panel}><h2 className="text-xl font-bold">Bank account and payouts</h2><p className="mt-2">Available: {money(summary?.available_for_payout)} · Paid: {money(summary?.paid_out)}</p><p className="text-sm my-3">Earnings become eligible after {service} completion and the {summary?.hold_days ?? 'configured'} day settlement hold. This is your provider account balance across services.</p><button className={button} disabled={busy || !Number(summary?.available_for_payout)} onClick={request}>Request payout</button></div><PayoutAccountForm onSaved={reload} /><div className={panel}><h3 className="font-bold">Payout history</h3>{payouts.map(p => <p className="py-3 break-all" key={p.id}>{money(p.amount)} · {p.status} · {new Date(p.created_at).toLocaleDateString()}</p>)}{!payouts.length && <p>No payout requests yet.</p>}</div></div>;
}

export function TransportPasses() {
  const { data, loading, error, reload } = useCollection('/bookings/');
  const [busy, setBusy] = useState(null);
  const cancel = async booking => {
    if (!window.confirm('Cancel this journey? Refund eligibility follows the cancellation policy shown on your booking.')) return;
    setBusy(booking.id);
    try { await api(`/bookings/${booking.id}/cancel/`, { method: 'POST', body: {} }); reload(); toast.success('Booking cancellation processed.'); }
    catch (e) { toast.error(e.message); } finally { setBusy(null); }
  };
  if (loading) return <TransportLoading />;
  if (error) return <p role="alert">{error.message}</p>;
  const bookings = data.filter(row => row.kind === 'TRANSPORT');
  return <section className="mx-auto max-w-5xl p-4 space-y-5"><h1 className="text-2xl font-bold">My transport bookings</h1><Link to="/transport/shuttle" className="text-green-700 underline">Book another journey</Link>{!bookings.length && <p>No transport bookings yet.</p>}{bookings.map(b => <article key={b.id} className={panel}><h2 className="text-xl font-bold">{b.details.title}</h2><p>{b.details.company_name} · {b.status.replaceAll('_', ' ')}</p><p className="mt-2">{b.details.departs_at ? new Date(b.details.departs_at).toLocaleString() : ''}</p><p>Pickup: {b.details.location}</p><p>Vehicle: {b.details.vehicle}</p><p>{b.details.boarding_instructions}</p><p>Support: {b.details.contact_phone}</p><p className="text-sm mt-3">{b.details.cancellation_policy}</p><ul className="my-3">{b.details.passengers?.map((name, i) => <li key={i}>Passenger {i + 1}: {name}</li>)}</ul><p className="break-all text-xs mb-3">{b.booking_reference}</p>{b.boarding_token && <div className="inline-block rounded-xl bg-white p-3 text-black"><QRCodeSVG value={b.boarding_token} size={160} /><p className="text-xs mt-2">Show this pass at boarding</p></div>}{b.details.boarded_at && <p>Checked in</p>}<div className="mt-4 flex flex-wrap gap-3">{['PENDING', 'CONFIRMED'].includes(b.status) && !b.details.boarded_at && <button className={outline} disabled={busy === b.id} onClick={() => cancel(b)}>Cancel booking</button>}{b.status === 'PENDING' && <Link className={button} to={`/Payment?booking=${b.id}`}>Continue payment</Link>}{b.details.company_id && <Link className={outline} to={`/transport/support?company=${b.details.company_id}&booking=${b.id}`}>Get help</Link>}</div></article>)}</section>;
}

export function TransportSupport({ company, manage = false }) {
  const { data: rows, loading } = useCollection(`/transport-requests/${company ? `?company=${company}` : ''}`);
  const { data: companies } = useCollection(!manage ? '/transport-companies/' : null);
  const params = new URLSearchParams(window.location.search);
  return <div className="space-y-4"><h2 className="text-xl font-bold">Transport support</h2>{!manage && <div className={panel}><TransportForm fields={[{ name: 'company', label: 'Company', options: companies.map(c => ({ value: c.id, label: c.name })) }, { name: 'message', label: 'How can we help?' }]} initial={{ company: params.get('company') || company || '' }} submit="Send request" onSave={async values => { await api('/transport-requests/', { method: 'POST', body: { ...values, booking: params.get('booking') || null } }); toast.success('Your request has been sent.'); }} /></div>}{loading && <TransportLoading />}{rows.map(row => <article className={panel} key={row.id}><p className="text-xs">{row.status} · {new Date(row.created_at).toLocaleString()}</p><p className="my-3 whitespace-pre-wrap break-words">{row.message}</p>{row.response && <p className="whitespace-pre-wrap break-words">Reply: {row.response}</p>}{manage && <TransportForm fields={[{ name: 'response', label: 'Reply' }]} submit="Send reply and resolve" onSave={values => api(`/transport-requests/${row.id}/respond/`, { method: 'POST', body: values })} />}</article>)}</div>;
}
