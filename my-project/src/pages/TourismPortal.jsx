import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useApi, useCollection } from '@/hooks/useApi';
import { api, money, downloadJSON } from '@/lib/api';
import { TransportForm as Form, TransportLoading as Loading, TransportPayouts, panel, button, outline } from '@/components/Transport/TransportUI';
import TransportFinance from '@/components/Transport/TransportFinance';
import { TourismSupport } from './TourismVisits';

const operatorFields = [
  { name: 'name', label: 'Operator / business name' }, { name: 'registration_number', label: 'Business registration number' },
  { name: 'contact_email', label: 'Support email', type: 'email' }, { name: 'contact_phone', label: 'Support phone', type: 'tel' },
  { name: 'address', label: 'Business address' }, { name: 'description', label: 'About your business', optional: true },
  { name: 'visitor_instructions', label: 'Visitor preparation and safety instructions', optional: true },
  { name: 'cancellation_hours', label: 'Visitor cancellation cutoff (hours)', type: 'number', min: 0, max: 720 },
  { name: 'logo', label: 'Business logo', type: 'file', optional: true },
];
const categories = ['ATTRACTION', 'CULTURAL_SITE', 'ACTIVITY', 'LOCAL_EXPERIENCE'].map(value => ({ value, label: value.replaceAll('_', ' ') }));
const options = rows => rows.map(r => ({ value: r.id, label: r.name || r.email }));
function multipart(values, fields) {
  const body = new FormData();
  for (const f of fields) {
    const value = values[f.name];
    if (f.type === 'file') { if (value instanceof File) body.append(f.name, value); }
    else if (value != null && value !== '') body.append(f.name, value);
    else if (f.optional && f.type !== 'number') body.append(f.name, '');
  }
  if (values.id) body.append('id', values.id);
  return body;
}
function Editor({ title, fields, rows, save, defaults = {}, upload = false }) {
  const [editing, setEditing] = useState(null);
  const [version, setVersion] = useState(0);
  const initial = editing ? { ...editing } : { is_active: true, ...defaults };
  for (const key of ['starts_at', 'ends_at']) if (initial[key]) {
    const date = new Date(initial[key]);
    initial[key] = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }
  return <section className="space-y-4"><div className={panel}><div className="flex flex-wrap gap-3 justify-between mb-4"><h2 className="font-bold text-xl">{editing ? 'Edit' : 'Add'} {title}</h2>{editing && <button className={outline} onClick={() => setEditing(null)}>Cancel edit</button>}</div><Form key={`${editing?.id || 'new'}-${version}`} fields={fields.map(f => f.type === 'file' && editing ? { ...f, optional: true } : f)} initial={initial} onSave={async values => {
    const body = { ...values };
    for (const key of ['starts_at', 'ends_at']) if (body[key]) body[key] = new Date(body[key]).toISOString();
    for (const key of ['latitude', 'longitude']) if (body[key] === '') body[key] = null;
    await save(upload ? multipart(body, fields) : body); setEditing(null); setVersion(v => v + 1); toast.success('Saved.');
  }} /></div><div className="grid gap-4 sm:grid-cols-2">{rows.map(row => <article className={panel} key={row.id}><h3 className="font-bold break-words">{row.name || row.caption || (row.starts_at ? new Date(row.starts_at).toLocaleString() : 'Gallery image')}</h3>{row.image && <img src={row.image} alt={row.caption || 'Experience photo'} className="w-full max-h-56 object-contain my-3 rounded-xl" loading="lazy" />}{row.review_status && <p>{row.review_status} · {row.review_note}</p>}{row.status && <p>{row.status} · {money(row.price)} · {row.quantity_available} places available</p>}<button className={`${outline} mt-3`} onClick={() => setEditing(row)}>Edit</button></article>)}</div></section>;
}
function Earnings({ base }) {
  const { data, loading, error } = useApi(base + 'earnings/');
  if (loading) return <Loading />;
  if (error) return <p role="alert">{error.message}</p>;
  return <div className={panel}><h2 className="text-xl font-bold">Tour earnings</h2><p>Gross sales: {money(data?.sale?.gross)}</p><p>Commission: {money(data?.sale?.platform_fee)}</p><p>Refunds: {money(data?.refund?.gross)}</p><p>Net before payouts: {money(Number(data?.sale?.provider_amount || 0) - Number(data?.refund?.provider_amount || 0))}</p></div>;
}
function Workspace({ operator, admin }) {
  const guide = !admin && operator.my_role === 'GUIDE';
  const owner = admin || operator.my_role === 'OWNER';
  const base = `/tourism-operators/${operator.id}/`;
  const [tab, setTab] = useState(admin ? 'review' : guide ? 'participants' : 'experiences');
  const [departure, setDeparture] = useState('');
  const [busy, setBusy] = useState(false);
  const { data: experiences } = useCollection(base + 'experiences/');
  const { data: packages } = useCollection(base + 'packages/');
  const { data: departures, reload: reloadDepartures } = useCollection(base + 'departures/');
  const { data: images } = useCollection(!guide ? base + 'images/' : null);
  const { data: bookings, reload: reloadBookings } = useCollection(base + 'bookings/' + (departure ? `?departure=${departure}` : ''));
  const { data: team } = useApi(!guide ? base + 'team/' : null);
  const { data: staff } = useApi(owner && tab === 'staff' ? base + 'staff/' : null);
  const { data: legacy } = useCollection(admin && tab === 'listing reviews' ? '/tourism/mine/' : null);
  const tabs = guide ? ['participants'] : [...(admin ? ['review', 'listing reviews', 'finance'] : []), 'experiences', 'images', 'packages', 'departures', 'participants', 'earnings', 'support', ...(owner ? ['profile', 'staff'] : []), ...(!admin && owner ? ['payouts'] : [])];
  const save = resource => body => api(base + resource + '/', { method: 'POST', body });
  const act = async (d, action) => {
    if (busy) return;
    const reason = action === 'cancel' ? window.prompt('Explain the cancellation. Paid bookings will receive full refunds through Paystack.') : '';
    if (action === 'cancel' && !reason) return;
    if (action === 'complete' && !window.confirm('Confirm the tour actually finished? This makes earnings eligible after the settlement hold.')) return;
    setBusy(true);
    try { await api(base + 'departure-action/', { method: 'POST', body: { departure: d.id, action, reason } }); reloadDepartures(); reloadBookings(); toast.success('Tour updated.'); }
    catch (e) { toast.error(e.message); } finally { setBusy(false); }
  };
  return <div className="space-y-5"><div className={panel}><h2 className="text-2xl font-bold break-words">{operator.name}</h2><p>{operator.status} · {operator.my_role || 'Admin'}</p><p>{operator.review_note}</p><p className="mt-3 text-sm">Create an experience, upload photos, add packages, then schedule departures. Listings need admin review before visitors can book.</p></div><nav className="flex flex-wrap gap-2" aria-label="Tourism management sections">{tabs.map(t => <button className={tab === t ? button : outline} key={t} onClick={() => setTab(t)}>{t[0].toUpperCase() + t.slice(1)}</button>)}</nav>
    {admin && tab === 'listing reviews' && <div className={panel}><Link className="underline" to="/admin/tourism/records">View existing tourism records</Link><p className="my-3">Move an existing destination owned by this operator into this dashboard. Resolve ongoing bookings first; the listing needs review after moving.</p><Form fields={[{ name: 'experience', label: 'Existing destination', options: options(legacy.filter(e => !e.operator)) }]} submit="Move to operator dashboard" onSave={body => api(base + 'adopt-experience/', { method: 'POST', body })} /></div>}
    {tab === 'review' && <div className={panel}><p className="mb-4 break-words">{operator.registration_number} · {operator.contact_email} · {operator.contact_phone} · {operator.address}</p><Form fields={[{ name: 'status', label: 'Decision', options: ['APPROVED', 'REJECTED', 'SUSPENDED'].map(value => ({ value, label: value })) }, { name: 'commission_bps', label: 'Agreed commission (500 = 5%)', type: 'number', min: 0, max: 10000, optional: true }, { name: 'note', label: 'Review message', optional: true }]} initial={{ status: 'APPROVED', commission_bps: operator.commission_bps ?? '' }} onSave={values => api(base + 'review/', { method: 'POST', body: { ...values, commission_bps: values.commission_bps === '' ? undefined : values.commission_bps } })} /></div>}
    {tab === 'listing reviews' && <div className="space-y-4">{experiences.map(e => <div className={panel} key={e.id}><h3 className="font-bold">{e.name} · {e.review_status}</h3><p>{e.description}</p><p>{e.address}</p><div className="flex flex-wrap gap-3 my-4">{images.filter(i => i.experience === e.id).map(i => <img className="h-40 max-w-full object-contain rounded-xl" src={i.image} alt={i.caption || e.name} key={i.id} />)}</div><Form fields={[{ name: 'status', label: 'Decision', options: ['APPROVED', 'REJECTED'].map(value => ({ value, label: value })) }, { name: 'note', label: 'Review feedback', optional: true }]} initial={{ status: 'APPROVED' }} onSave={body => api(base + 'review-experience/', { method: 'POST', body: { ...body, experience: e.id } })} /></div>)}</div>}
    {tab === 'profile' && <div className={panel}><p className="mb-4">Changing the legal name or registration number requires fresh approval.</p><Form fields={operatorFields} initial={operator} onSave={values => api(base, { method: 'PATCH', body: multipart(values, operatorFields) })} /></div>}
    {tab === 'experiences' && <Editor title="experience" rows={experiences} defaults={{ is_active: false }} fields={[{ name: 'name', label: 'Experience name' }, { name: 'description', label: 'Description' }, { name: 'category', label: 'Category', options: categories }, { name: 'location_name', label: 'Town / location' }, { name: 'address', label: 'Address' }, { name: 'latitude', label: 'Latitude', type: 'number', step: 'any', optional: true }, { name: 'longitude', label: 'Longitude', type: 'number', step: 'any', optional: true }, { name: 'contact_phone', label: 'Public support phone', optional: true }, { name: 'contact_email', label: 'Public support email', type: 'email', optional: true }, { name: 'is_active', label: 'Accept bookings (after approval)', type: 'checkbox' }]} save={save('experiences')} />}
    {tab === 'images' && <Editor title="gallery photo" upload rows={images} fields={[{ name: 'experience', label: 'Experience', options: options(experiences) }, { name: 'image', label: 'Photo from your gallery', type: 'file', optional: false }, { name: 'caption', label: 'Caption', optional: true }, { name: 'is_primary', label: 'Main photo', type: 'checkbox' }]} save={save('images')} />}
    {tab === 'packages' && <Editor title="package" rows={packages} fields={[{ name: 'experience', label: 'Experience', options: options(experiences) }, { name: 'name', label: 'Package name' }, { name: 'description', label: 'Description', optional: true }, { name: 'price', label: 'Reference price (₦); departures set the bookable fare', type: 'number', min: 0, step: '0.01' }, { name: 'duration_hours', label: 'Duration in hours', type: 'number', min: 1, max: 720 }, { name: 'meeting_point', label: 'Meeting point' }, { name: 'itinerary', label: 'Itinerary' }, { name: 'inclusions', label: 'Included', optional: true }, { name: 'exclusions', label: 'Not included', optional: true }, { name: 'is_active', label: 'Active', type: 'checkbox' }]} save={save('packages')} />}
    {tab === 'departures' && <><Editor title="tour departure" rows={departures} fields={[{ name: 'package', label: 'Package', options: options(packages) }, { name: 'guide', label: 'Guide', optional: true, options: options(team || []) }, { name: 'starts_at', label: 'Start (local time)', type: 'datetime-local' }, { name: 'ends_at', label: 'End (local time)', type: 'datetime-local' }, { name: 'price', label: 'Price per participant (₦)', type: 'number', min: 0, step: '0.01' }, { name: 'quantity', label: 'Places allocated to MMEMME ABIA', type: 'number', min: 1, max: 10000 }, { name: 'is_active', label: 'Accept bookings', type: 'checkbox' }]} save={save('departures')} /><div className={panel}><h2 className="font-bold">Tour operations</h2>{departures.filter(d => d.status === 'SCHEDULED').map(d => <div className="flex flex-wrap gap-3 items-center border-b py-4" key={d.id}><p className="flex-1 min-w-40">{new Date(d.starts_at).toLocaleString()}</p><button className={outline} disabled={busy || new Date(d.starts_at) <= new Date()} onClick={() => act(d, 'cancel')}>Cancel and refund</button><button className={button} disabled={busy || new Date(d.ends_at) > new Date()} onClick={() => act(d, 'complete')}>Mark completed</button></div>)}</div></>}
    {tab === 'participants' && <><div className={panel}><h2 className="font-bold mb-4">Participant manifest and check-in</h2><label>Tour<select className="w-full p-3 border rounded-xl my-3" value={departure} onChange={e => setDeparture(e.target.value)}><option value="">All departures</option>{departures.map(d => <option value={d.id} key={d.id}>{new Date(d.starts_at).toLocaleString()}</option>)}</select></label><Form fields={[{ name: 'token', label: 'Tour pass token', help: 'Read the QR using your scanner, then paste its value here.' }]} submit="Check in booking" onSave={async body => { await api('/tourism-operators/check-in/', { method: 'POST', body }); reloadBookings(); toast.success('Participants checked in.'); }} /><button className={`${outline} mt-4`} onClick={() => downloadJSON('tour-participants', bookings.filter(b => b.status === 'CONFIRMED'))}>Download confirmed manifest</button></div>{bookings.map(b => <article className={panel} key={b.id}><h3 className="font-bold">{b.customer_name} · {b.status}</h3><p>{b.customer_phone}</p><p>{b.details.passengers?.join(', ')}</p><p className="break-all text-xs">{b.booking_reference}</p><p>{b.details.checked_in_at ? 'Checked in' : 'Not checked in'} · {b.fulfillment_status}</p></article>)}</>}
    {tab === 'staff' && <div className={panel}><Form fields={[{ name: 'email', label: 'Existing verified user email', type: 'email' }, { name: 'role', label: 'Role', options: [{ value: 'MANAGER', label: 'Manager' }, { value: 'GUIDE', label: 'Guide / check-in' }] }, { name: 'is_active', label: 'Access enabled', type: 'checkbox' }]} initial={{ is_active: true }} onSave={body => api(base + 'staff/', { method: 'POST', body })} />{staff?.map(s => <p className="mt-3 break-words" key={s.email}>{s.email} · {s.role} · {s.is_active ? 'Active' : 'Disabled'}</p>)}</div>}
    {tab === 'earnings' && <Earnings base={base} />}
    {tab === 'payouts' && <TransportPayouts service="tour" />}
    {tab === 'finance' && <TransportFinance company={operator} />}
    {tab === 'support' && <TourismSupport operator={operator.id} manage />}
  </div>;
}
export default function TourismPortal({ admin = false }) {
  const { data: operators, loading, error } = useCollection(admin ? '/tourism-operators/' : '/tourism-operators/mine/');
  const [selected, setSelected] = useState('');
  const operator = operators.find(o => o.id === selected) || operators[0];
  return <main className="mx-auto max-w-6xl p-4 sm:p-6 space-y-5"><header className="flex flex-wrap justify-between gap-3"><h1 className="text-2xl font-bold">{admin ? 'Tourism administration' : 'Tourism operator dashboard'}</h1><Link className={outline} to="/tourism">Explore tourism</Link>{admin && <Link className={outline} to="/admin/tourism/records">Existing tourism records</Link>}</header>{loading ? <Loading /> : error ? <p role="alert">{error.message}</p> : operator ? <><label>Operator<select className="w-full p-3 my-3 border rounded-xl" value={operator.id} onChange={e => setSelected(e.target.value)}>{operators.map(o => <option key={o.id} value={o.id}>{o.name} · {o.status}</option>)}</select></label><Workspace key={operator.id} operator={operator} admin={admin} /></> : admin ? <p>No applications yet.</p> : <div className={panel}><h2 className="font-bold text-xl mb-3">Apply as a tourism operator</h2><p className="mb-4">Submit your business details for review, then manage destinations, packages, tours and visitor bookings.</p><Form fields={operatorFields} initial={{ cancellation_hours: 24 }} submit="Submit application" onSave={values => api('/tourism-operators/', { method: 'POST', body: multipart(values, operatorFields) })} /></div>}{admin && <details className={panel}><summary>All tourism support requests</summary><TourismSupport manage /></details>}</main>;
}
