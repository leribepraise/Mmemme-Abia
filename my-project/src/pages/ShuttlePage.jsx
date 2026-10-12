import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCollection } from '@/hooks/useApi';
import { useBooking } from '@/hooks/useBooking';
import { money } from '@/lib/api';
import { panel, button, outline, TransportLoading } from '@/components/Transport/TransportUI';

export default function ShuttlePage() {
  const [params, setParams] = useSearchParams();
  const { data: departures, loading, error } = useCollection('/departures/');
  const { book, busy } = useBooking();
  const [selected, setSelected] = useState(null);
  const [names, setNames] = useState(['']);
  const [sort, setSort] = useState('time');
  const seatCount = Math.min(20, Math.max(1, Number(params.get('seats')) || 1));
  const schedules = departures.filter(d => (!params.get('route') || d.route === params.get('route')) &&
    (!params.get('origin') || d.origin?.toLowerCase().includes(params.get('origin').toLowerCase())) &&
    (!params.get('destination') || d.destination?.toLowerCase().includes(params.get('destination').toLowerCase())) &&
    (!params.get('date') || new Date(d.departs_at).toLocaleDateString('en-CA') === params.get('date')) &&
    (!params.get('company') || d.company === params.get('company')) &&
    (!params.get('event') || d.event === params.get('event')) &&
    (!params.get('service_type') || d.service_type === params.get('service_type')))
    .sort((a, b) => sort === 'price' ? Number(a.price) - Number(b.price) : new Date(a.departs_at) - new Date(b.departs_at));
  const companies = [...new Map(departures.filter(d => d.company).map(d => [d.company, d.company_name])).entries()];
  const filter = (name, value) => { const next = new URLSearchParams(params); value ? next.set(name, value) : next.delete(name); setParams(next); setSelected(null); };
  return <main className="mx-auto max-w-6xl p-4 sm:p-6 space-y-5"><header className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-bold">Find your journey</h1><p className="mt-2">Compare companies, terminals, fares and departure times.</p></div><Link to="/transport/bookings" className={outline}>My boarding passes</Link></header><div className={`${panel} grid gap-3 sm:grid-cols-2 lg:grid-cols-3`}>
    {[['origin', 'From', 'text'], ['destination', 'To', 'text'], ['date', 'Travel date', 'date'], ['seats', 'Passengers', 'number']].map(([key, label, type]) => <label key={key} className="block min-w-0 text-sm">{label}<input className="mt-2 w-full rounded-xl border border-gray-300 p-3 text-base" type={type} min={type === 'number' ? 1 : undefined} max={type === 'number' ? 20 : undefined} value={params.get(key) || (key === 'seats' ? 1 : '')} onChange={e => filter(key, e.target.value)} /></label>)}
    <label className="block text-sm">Company<select className="mt-2 w-full rounded-xl border border-gray-300 p-3 text-base" value={params.get('company') || ''} onChange={e => filter('company', e.target.value)}><option value="">All companies</option>{companies.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label><label className="block text-sm">Sort by<select className="mt-2 w-full rounded-xl border border-gray-300 p-3 text-base" value={sort} onChange={e => setSort(e.target.value)}><option value="time">Departure time</option><option value="price">Lowest fare</option></select></label><button className={outline} onClick={() => { setParams({}); setSelected(null); }}>Clear filters</button></div>
    {loading ? <TransportLoading /> : error ? <p role="alert">{error.message}</p> : !schedules.length ? <p role="status">No matching journeys are available. Try another date or route.</p> : <div className="space-y-4">{schedules.map(d => <article className={panel} key={d.id}><div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><div className="flex items-center gap-3">{d.company_logo && <img src={d.company_logo} alt="" loading="lazy" className="h-12 w-12 rounded-xl object-contain" />}<h2 className="text-xl font-bold break-words">{d.company_name || 'Transport provider'}</h2></div><p className="font-semibold mt-3">{d.origin} → {d.destination}</p><p>{d.service_type === 'EVENT_SHUTTLE' ? 'Event shuttle' : 'Scheduled bus'} · {d.vehicle}</p><p className="mt-2">Departs: {new Date(d.departs_at).toLocaleString()}</p><p>Arrives: {new Date(d.arrives_at).toLocaleString()}</p><p>Pickup: {d.pickup_address}</p>{d.amenities && <p>{d.amenities}</p>}</div><div><p className="font-bold text-xl">{money(d.price)} <span className="text-sm font-normal">/ seat</span></p><p>{d.quantity_available} seats available</p><button className={`${button} mt-3`} disabled={busy || d.quantity_available < seatCount} onClick={() => { setSelected(d.id); setNames(Array(seatCount).fill('')); }}>Choose journey</button></div></div>{selected === d.id && <form className="mt-5 border-t border-gray-200 pt-5 space-y-4" onSubmit={e => { e.preventDefault(); book('TRANSPORT', [{ id: d.id, quantity: seatCount }], { passengers: names.map(n => n.trim()) }); }}><h3 className="font-bold">Passenger details</h3><div className="grid sm:grid-cols-2 gap-3">{names.map((name, i) => <label key={i} className="text-sm">Passenger {i + 1} full name<input required maxLength={200} pattern=".*\S.*" className="w-full border border-gray-300 rounded-xl p-3 text-base mt-2" value={name} onChange={e => setNames(current => current.map((n, j) => j === i ? e.target.value : n))} /></label>)}</div><p>{d.boarding_instructions}</p><p className="text-sm">Full refund when cancelled at least {d.cancellation_hours} hours before departure. Company cancellations receive full refunds.</p><p className="font-bold">Total: {money(Number(d.price) * seatCount)}</p><button disabled={busy || d.quantity_available < seatCount} className={button}>{busy ? 'Reserving…' : 'Reserve and continue to Paystack'}</button></form>}</article>)}</div>}</main>;
}
