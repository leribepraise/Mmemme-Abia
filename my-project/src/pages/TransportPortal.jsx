import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCollection, useApi } from '@/hooks/useApi';
import { api, money, downloadJSON } from '@/lib/api';
import { TransportForm, TransportLoading, TransportPayouts, TransportSupport, panel, button, outline } from '@/components/Transport/TransportUI';
import TransportFinance from '@/components/Transport/TransportFinance';

const companyFields = [
  { name: 'name', label: 'Company name' }, { name: 'registration_number', label: 'Business registration number' },
  { name: 'contact_email', label: 'Support email', type: 'email' }, { name: 'contact_phone', label: 'Support phone', type: 'tel' },
  { name: 'address', label: 'Business address' }, { name: 'description', label: 'About your company', optional: true },
  { name: 'boarding_instructions', label: 'Boarding and baggage instructions', optional: true },
  { name: 'cancellation_hours', label: 'Passenger cancellation cutoff (hours)', type: 'number', min: 0, max: 720, help: 'Full refund before this cutoff; operator cancellations always receive a full refund.' },
  { name: 'logo', label: 'Company logo', type: 'file', optional: true },
];

function InventoryEditor({ title, fields, rows, save }) {
  const [editing, setEditing] = useState(null);
  const [version, setVersion] = useState(0);
  const initial = editing ? { ...editing, departs_at: editing.departs_at?.slice(0, 16), arrives_at: editing.arrives_at?.slice(0, 16) } : { is_active: true, service_type: 'BUS' };
  // datetime-local controls use local wall time; retain instants when opening an edit.
  if (editing) for (const field of ['departs_at', 'arrives_at']) if (editing[field]) {
    const date = new Date(editing[field]);
    initial[field] = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }
  return <section className="space-y-4"><div className={panel}><div className="flex justify-between gap-3 mb-4"><h2 className="text-xl font-bold">{editing ? 'Edit' : 'Add'} {title}</h2>{editing && <button className={outline} onClick={() => setEditing(null)}>Cancel edit</button>}</div><TransportForm key={`${editing?.id || 'new'}-${version}`} initial={initial} fields={fields} onSave={async values => {
    const body = { ...values };
    for (const field of ['departs_at', 'arrives_at']) if (body[field]) body[field] = new Date(body[field]).toISOString();
    await save(body); setEditing(null); setVersion(v => v + 1); toast.success('Saved.');
  }} /></div><div className="grid gap-3 sm:grid-cols-2">{rows.map(row => <article className={panel} key={row.id}><h3 className="font-bold break-words">{row.name || row.vehicle || row.id}</h3>{row.departs_at && <><p>{new Date(row.departs_at).toLocaleString()}</p><p>{money(row.price)} · {row.quantity_available} available / {row.quantity} allocated</p><p>{row.status}</p></>}{row.city && <p>{row.city} · {row.address}</p>}{row.capacity && <p>{row.capacity} seats · {row.registration_number}</p>}<button className={`${outline} mt-3`} onClick={() => setEditing(row)}>Edit</button></article>)}</div></section>;
}

function CompanyWorkspace({ company, admin }) {
  const [tab, setTab] = useState(admin ? 'review' : 'departures');
  const [departure, setDeparture] = useState('');
  const [busy, setBusy] = useState(false);
  const base = `/transport-companies/${company.id}/`;
  const { data: terminals } = useCollection(base + 'terminals/');
  const { data: vehicles } = useCollection(base + 'vehicles/');
  const { data: routes } = useCollection(base + 'routes/');
  const { data: departures } = useCollection(base + 'departures/');
  const { data: bookings } = useCollection(tab === 'manifest' ? base + `bookings/${departure ? `?departure=${departure}` : ''}` : null);
  const { data: events } = useCollection(tab === 'routes' ? '/events/' : null);
  const boardingOnly = !admin && company.my_role === 'BOARDING';
  const owner = admin || company.my_role === 'OWNER';
  const [staffRows, setStaffRows] = useState([]);
  const tabs = boardingOnly ? ['manifest'] : [...(admin ? ['review', 'finance'] : []), 'departures', 'routes', 'terminals', 'vehicles', 'manifest', 'earnings', 'support', ...(owner ? ['profile', 'staff'] : []), ...(!admin && company.my_role === 'OWNER' ? ['payouts'] : [])];
  const selectedTab = boardingOnly ? 'manifest' : tab;
  const options = rows => rows.map(r => ({ value: r.id, label: r.name }));
  const save = resource => body => api(base + resource + '/', { method: 'POST', body });
  const actionDeparture = async (d, action) => {
    const reason = action === 'cancel' ? window.prompt('Why is this departure cancelled? Confirming will cancel bookings and queue full refunds.') : '';
    if (action === 'cancel' && !reason) return;
    if (action === 'complete' && !window.confirm('Confirm that this journey has finished? This makes completed earnings eligible for settlement after the hold period.')) return;
    if (busy) return; setBusy(true);
    try { await api(base + 'departure-action/', { method: 'POST', body: { departure: d.id, action, reason } }); toast.success(action === 'cancel' ? 'Departure cancelled. Refunds queued for paid bookings.' : 'Journey completed.'); }
    catch (error) { toast.error(error.message); } finally { setBusy(false); }
  };
  return <div className="space-y-5"><div className={panel}><h1 className="text-2xl font-bold">{company.name}</h1><p>{company.status} · {company.my_role || 'Admin'}</p>{company.review_note && <p className="mt-2">{company.review_note}</p>}<p className="text-sm mt-3">Allocate seats exclusively to MMEMME ABIA. Do not sell the same allocation at your terminal or on another platform.</p></div><nav className="flex flex-wrap gap-2" aria-label="Company sections">{tabs.map(t => <button className={selectedTab === t ? button : outline} key={t} onClick={async () => { setTab(t); if (t === 'staff') try { setStaffRows(await api(base + 'staff/')); } catch (e) { toast.error(e.message); } }}>{t[0].toUpperCase() + t.slice(1)}</button>)}</nav>
    {selectedTab === 'review' && <div className={panel}><p className="mb-4">Registration: {company.registration_number} · {company.contact_email} · {company.contact_phone}</p><p className="mb-4">{company.address}</p><TransportForm key={company.id + company.status} fields={[{ name: 'status', label: 'Decision', options: ['APPROVED', 'REJECTED', 'SUSPENDED'].map(value => ({ value, label: value })) }, { name: 'commission_bps', label: 'Agreed commission (basis points)', type: 'number', min: 0, max: 10000, optional: true, help: '500 = 5%. Set this explicitly before approving.' }, { name: 'note', label: 'Review message', optional: true }]} initial={{ status: company.status === 'PENDING' ? 'APPROVED' : company.status, commission_bps: company.commission_bps ?? '' }} onSave={body => api(base + 'review/', { method: 'POST', body: { ...body, ...(body.commission_bps === '' ? { commission_bps: undefined } : {}) } })} submit="Save review decision" /></div>}
    {selectedTab === 'profile' && <div className={panel}><p className="mb-4 text-sm">Changing the legal company name or registration number sends your company for approval again.</p><TransportForm key={company.id} fields={companyFields} initial={company} onSave={async values => { const body = new FormData(); for (const field of companyFields) { const value = values[field.name]; if (field.type === 'file') { if (value instanceof File) body.append(field.name, value); } else if (value != null) body.append(field.name, value); } await api(base, { method: 'PATCH', body }); toast.success('Company profile saved.'); }} /></div>}
    {selectedTab === 'terminals' && <InventoryEditor title="terminal" rows={terminals} fields={[{ name: 'name', label: 'Terminal name' }, { name: 'city', label: 'City' }, { name: 'address', label: 'Full pickup address' }, { name: 'is_active', label: 'Active', type: 'checkbox' }]} save={save('terminals')} />}
    {selectedTab === 'vehicles' && <InventoryEditor title="vehicle" rows={vehicles} fields={[{ name: 'name', label: 'Vehicle name / type' }, { name: 'registration_number', label: 'Registration number' }, { name: 'capacity', label: 'Seat capacity', type: 'number', min: 1, max: 100 }, { name: 'amenities', label: 'Amenities', optional: true }, { name: 'is_active', label: 'Active', type: 'checkbox' }]} save={save('vehicles')} />}
    {selectedTab === 'routes' && <InventoryEditor title="route" rows={routes} fields={[{ name: 'name', label: 'Route name' }, { name: 'origin_terminal', label: 'Pickup terminal', options: options(terminals.filter(r => r.is_active)) }, { name: 'destination_terminal', label: 'Destination terminal', options: options(terminals.filter(r => r.is_active)) }, { name: 'service_type', label: 'Service', options: [{ value: 'BUS', label: 'Scheduled bus' }, { value: 'EVENT_SHUTTLE', label: 'Event shuttle' }] }, { name: 'event', label: 'Event (shuttles only)', optional: true, options: events.map(e => ({ value: e.id, label: e.title })) }, { name: 'is_active', label: 'Accept bookings', type: 'checkbox' }]} save={save('routes')} />}
    {selectedTab === 'departures' && <><InventoryEditor title="departure" rows={departures} fields={[{ name: 'route', label: 'Route', options: options(routes) }, { name: 'fleet_vehicle', label: 'Vehicle', options: options(vehicles.filter(v => v.is_active)) }, { name: 'departs_at', label: 'Departure (your local time)', type: 'datetime-local' }, { name: 'arrives_at', label: 'Arrival (your local time)', type: 'datetime-local' }, { name: 'price', label: 'Fare per passenger (₦)', type: 'number', min: 0, step: '0.01' }, { name: 'quantity', label: 'Seats allocated exclusively to MMEMME ABIA', type: 'number', min: 1, max: 100 }, { name: 'is_active', label: 'Accept bookings', type: 'checkbox' }]} save={save('departures')} /><div className={panel}><h2 className="font-bold">Journey operations</h2>{departures.filter(d => d.status === 'SCHEDULED').map(d => <div key={d.id} className="flex flex-wrap items-center gap-3 border-b border-gray-200 py-4"><p className="flex-1 min-w-40">{d.vehicle} · {new Date(d.departs_at).toLocaleString()}</p><button disabled={busy || new Date(d.departs_at) <= new Date()} className={outline} onClick={() => actionDeparture(d, 'cancel')}>Cancel and refund</button><button disabled={busy || new Date(d.arrives_at) > new Date()} className={button} onClick={() => actionDeparture(d, 'complete')}>Mark completed</button></div>)}</div></>}
    {selectedTab === 'manifest' && <div className="space-y-4"><div className={panel}><h2 className="font-bold text-xl mb-3">Passenger manifest and boarding</h2><label className="block">Departure<select className="w-full rounded-xl border p-3 my-3" value={departure} onChange={e => setDeparture(e.target.value)}><option value="">All departures</option>{departures.map(d => <option key={d.id} value={d.id}>{d.vehicle} · {new Date(d.departs_at).toLocaleString()}</option>)}</select></label><TransportForm fields={[{ name: 'token', label: 'Boarding pass token', help: 'Scan the passenger QR code with your scanner and paste its value here.' }]} submit="Check in booking" onSave={async body => { await api('/transport-companies/check-in/', { method: 'POST', body }); toast.success('Passengers checked in.'); }} /><button className={`${outline} mt-4`} onClick={() => downloadJSON('passenger-manifest', bookings.filter(b => b.status === 'CONFIRMED'))}>Download confirmed manifest</button></div>{bookings.map(b => <div className={panel} key={b.id}><p className="font-bold">{b.customer_name} · {b.status.replaceAll('_', ' ')}</p><p>{b.customer_phone}</p><p>{b.details.passengers?.join(', ')}</p><p className="text-xs break-all">{b.booking_reference}</p><p>{b.details.boarded_at ? 'Checked in' : 'Not checked in'}</p><p>{b.fulfillment_status}</p></div>)}</div>}
    {selectedTab === 'staff' && <div className={panel}><TransportForm fields={[{ name: 'email', label: 'Existing staff account email', type: 'email' }, { name: 'role', label: 'Access', options: [{ value: 'MANAGER', label: 'Manager: schedules, bookings and support' }, { value: 'BOARDING', label: 'Boarding: manifests and check-in' }] }, { name: 'is_active', label: 'Access enabled', type: 'checkbox' }]} initial={{ is_active: true }} onSave={async body => { setStaffRows(await api(base + 'staff/', { method: 'POST', body })); toast.success('Staff access saved.'); }} />{staffRows.map(s => <p className="mt-4 break-words" key={s.email}>{s.email} · {s.role} · {s.is_active ? 'Active' : 'Disabled'}</p>)}</div>}
    {selectedTab === 'payouts' && <TransportPayouts />}
    {selectedTab === 'finance' && <TransportFinance company={company} />}
    {selectedTab === 'support' && <TransportSupport company={company.id} manage />}
    {selectedTab === 'earnings' && <TransportEarnings base={base} />}
  </div>;
}

function TransportEarnings({ base }) {
  const { data, loading, error } = useApi(base + 'earnings/');
  if (loading) return <TransportLoading />;
  if (error) return <p role="alert">{error.message}</p>;
  return <div className={panel}><h2 className="text-xl font-bold">Transport earnings</h2><p className="mt-3">Gross sales: {money(data?.sale?.gross)}</p><p>Platform commission: {money(data?.sale?.platform_fee)}</p><p>Refunds: {money(data?.refund?.gross)}</p><p>Net earnings before payouts: {money(Number(data?.sale?.provider_amount || 0) - Number(data?.refund?.provider_amount || 0))}</p><p className="mt-3 text-sm">Each booking keeps the commission agreed when it was created.</p></div>;
}

export default function TransportPortal({ admin = false }) {
  const { data: companies, loading, error } = useCollection(admin ? '/transport-companies/' : '/transport-companies/mine/');
  const [selected, setSelected] = useState('');
  const company = companies.find(c => c.id === selected) || companies[0];
  return <main className="mx-auto max-w-6xl p-4 sm:p-6 space-y-5"><header className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-bold">{admin ? 'Transport administration' : 'Transport company dashboard'}</h1><Link className={outline} to="/transport">Passenger transport</Link>{admin && <Link className={outline} to="/admin/payments">Payments and refunds</Link>}</header>{loading ? <TransportLoading /> : error ? <p role="alert">{error.message}</p> : companies.length ? <><label className="block">Company<select className="w-full rounded-xl border border-gray-300 p-3 text-base mt-2" value={company.id} onChange={e => setSelected(e.target.value)}>{companies.map(c => <option key={c.id} value={c.id}>{c.name} · {c.status}</option>)}</select></label><CompanyWorkspace key={company.id} company={company} admin={admin} /></> : admin ? <p>No transport company applications yet.</p> : <div className={panel}><h2 className="text-xl font-bold mb-3">Join as a transport company</h2><p className="mb-5">Apply with your company details. Once approved, add terminals, vehicles and allocated seats. Payouts go to the owner’s Paystack-verified bank account.</p><TransportForm fields={companyFields} initial={{ cancellation_hours: 24 }} submit="Submit company application" onSave={async values => { const body = new FormData(); for (const [name, value] of Object.entries(values)) if (value != null) body.append(name, value); await api('/transport-companies/', { method: 'POST', body }); toast.success('Application sent for admin approval.'); }} /></div>}{admin && <details className={panel}><summary className="font-bold cursor-pointer">All transport support requests</summary><TransportSupport manage /></details>}</main>;
}
