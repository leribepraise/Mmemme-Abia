import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import { api, money } from '@/lib/api';
import { useCollection } from '@/hooks/useApi';
import { useBooking } from '@/hooks/useBooking';
import { TransportForm as Form, TransportLoading as Loading, panel, button, outline } from '@/components/Transport/TransportUI';

export function TourBookingOptions({ tour }) {
  const { data: departures, loading, error } = useCollection(`/tour-departures/?experience=${tour.id}`);
  const { book, busy } = useBooking();
  const [selected, setSelected] = useState('');
  const [names, setNames] = useState(['']);
  const departure = departures.find(d => d.id === selected && d.quantity_available > 0);
  if (loading) return <Loading />;
  if (error) return <p role="alert">{error.message}</p>;
  return <div className="space-y-4"><h3 className="font-bold text-lg">Available tours</h3>{!departures.length && <p>No scheduled tours are currently available.</p>}{departures.map(d => <article className="border-b pb-4 space-y-2" key={d.id}><h4 className="font-bold">{d.package_name}</h4><p>{d.operator_name}</p><p>{new Date(d.starts_at).toLocaleString()} – {new Date(d.ends_at).toLocaleTimeString()}</p><p>{money(d.price)} per participant · {d.quantity_available} places</p><p className="whitespace-pre-wrap break-words">{d.itinerary}</p>{d.inclusions && <p>Included: {d.inclusions}</p>}{d.exclusions && <p>Not included: {d.exclusions}</p>}<p>Meeting point: {d.meeting_point || tour.address}</p><p>Full refund at least {d.cancellation_hours} hours before the start.</p><button className={outline} disabled={d.quantity_available < 1 || busy} onClick={() => { setSelected(d.id); setNames(['']); }}>Choose tour</button></article>)}{departure && <form className="space-y-3" onSubmit={e => { e.preventDefault(); book('TOURISM', [{ id: departure.id, quantity: names.length }], { passengers: names }); }}><label className="block">Participants<select className="w-full border rounded-xl p-3 mt-2 text-base" value={names.length} onChange={e => setNames(Array.from({ length: Number(e.target.value) }, (_, i) => names[i] || ''))}>{Array.from({ length: Math.min(20, departure.quantity_available) }, (_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}</select></label>{names.map((name, i) => <label className="block" key={i}>Participant {i + 1}<input className="w-full border rounded-xl p-3 mt-2 text-base" required maxLength={200} value={name} onChange={e => setNames(names.map((value, index) => index === i ? e.target.value : value))} /></label>)}<p>Total: {money(Number(departure.price) * names.length)}</p><button className={button} disabled={busy || names.length > departure.quantity_available}>{busy ? 'Reserving…' : Number(departure.price) ? 'Continue to payment' : 'Reserve places'}</button></form>}</div>;
}

export function TourismSupport({ operator, manage = false }) {
  const params = new URLSearchParams(window.location.search);
  const { data: rows, loading, error } = useCollection('/tourism-requests/' + (operator ? `?operator=${operator}` : ''));
  const { data: operators } = useCollection(!manage ? '/tourism-operators/' : null);
  return <section className="mx-auto max-w-4xl p-4 space-y-4"><h2 className="font-bold text-xl">Tourism support</h2>{!manage && <div className={panel}><Form fields={[{ name: 'operator', label: 'Operator', options: operators.map(o => ({ value: o.id, label: o.name })) }, { name: 'message', label: 'How can we help?' }]} initial={{ operator: params.get('operator') || operator || '' }} submit="Send request" onSave={values => api('/tourism-requests/', { method: 'POST', body: { ...values, booking: params.get('booking') || null } })} /></div>}{loading && <Loading />}{error && <p role="alert">{error.message}</p>}{rows.map(row => <article className={panel} key={row.id}><p>{row.status} · {new Date(row.created_at).toLocaleString()}</p><p className="whitespace-pre-wrap break-words my-3">{row.message}</p>{row.response && <p className="whitespace-pre-wrap break-words">Reply: {row.response}</p>}{manage && <Form fields={[{ name: 'response', label: 'Reply' }]} submit="Reply and resolve" onSave={body => api(`/tourism-requests/${row.id}/respond/`, { method: 'POST', body })} />}</article>)}</section>;
}

export default function TourismVisits() {
  const { data: rows, loading, error, reload } = useCollection('/bookings/');
  const [busy, setBusy] = useState(false);
  const cancel = async b => {
    if (busy || !window.confirm('Cancel this tour booking? Refund eligibility follows the cancellation policy shown here.')) return;
    setBusy(true);
    try { await api(`/bookings/${b.id}/cancel/`, { method: 'POST', body: {} }); reload(); toast.success('Cancellation processed.'); }
    catch (e) { toast.error(e.message); } finally { setBusy(false); }
  };
  if (loading) return <Loading />;
  if (error) return <p role="alert">{error.message}</p>;
  const bookings = rows.filter(b => b.kind === 'TOURISM');
  return <main className="mx-auto max-w-5xl p-4 space-y-5"><h1 className="text-2xl font-bold">My tour bookings</h1><Link className={outline} to="/tourism">Explore tours</Link>{!bookings.length && <p>No tour bookings yet.</p>}{bookings.map(b => <article className={panel} key={b.id}>{b.image && <img src={b.image} alt={b.details.title} loading="lazy" className="w-full max-h-64 object-contain rounded-xl mb-4" />}<h2 className="font-bold text-xl">{b.details.title}</h2><p>{b.details.operator_name} · {b.details.package_name}</p><p>{b.status.replaceAll('_', ' ')} · {b.fulfillment_status}</p><p>{b.details.starts_at && new Date(b.details.starts_at).toLocaleString()}</p><p>Meeting point: {b.details.meeting_point || b.details.location}</p><p>{b.details.visitor_instructions}</p><p>{b.details.contact_phone}</p><p className="my-3">{b.details.cancellation_policy}</p><p>{b.details.passengers?.join(', ')}</p><p className="break-all text-xs my-3">{b.booking_reference}</p>{b.admission_token && <div className="inline-block bg-white rounded-xl p-3 text-black"><QRCodeSVG value={b.admission_token} size={160} /><p className="text-sm mt-2">Show at tour check-in</p></div>}<div className="flex flex-wrap gap-3 mt-4">{b.status === 'PENDING' && <Link className={button} to={`/Payment?booking=${b.id}`}>Continue payment</Link>}{['PENDING', 'CONFIRMED'].includes(b.status) && b.fulfillment_status === 'NEW' && !b.details.checked_in_at && <button className={outline} disabled={busy} onClick={() => cancel(b)}>Cancel booking</button>}{b.details.operator_id && <Link className={outline} to={`/tourism/support?operator=${b.details.operator_id}&booking=${b.id}`}>Get help</Link>}</div></article>)}</main>;
}
