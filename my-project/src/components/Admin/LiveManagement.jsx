import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Users, UserCheck, UserPlus, CalendarDays, Clock, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { allPages } from '@/lib/api';
import toast from 'react-hot-toast';
import StatsGrid from './dashboard/StatsGrid';

export const statusName = row => row.deletion_requested_at ? 'Removal requested' : row.is_archived ? 'Removed' : row.is_suspended || row.is_active === false || row.user?.is_active === false ? 'Suspended' : ({APPROVED:'Verified', IN_REVIEW:'Pending', PUBLISHED:'Published', NEEDS_INFO:'More information needed'})[row.status] || (row.status ? row.status.replaceAll('_', ' ').toLowerCase() : 'Active');
export const personName = user => [user.first_name, user.last_name].filter(Boolean).join(' ') || user.email;
export const dateLabel = value => value ? new Date(value).toLocaleDateString('en-NG', {day:'numeric', month:'short', year:'numeric'}) : 'Not provided';
export const Field = ({label, children}) => <div className="min-w-0"><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 break-words text-sm text-slate-800">{children === 0 ? 0 : children || 'Not provided'}</dd></div>;
export function RequestState({request}) {
  if (request.loading) return <p role="status" className="rounded-xl bg-white p-8">Loading…</p>;
  if (request.error) return <div role="alert" className="rounded-xl border border-red-200 bg-white p-8"><p>{request.error.message}</p><button onClick={request.reload} className="mt-3 text-green-800 underline">Try again</button></div>;
  return null;
}
const stat = (id,label,value,icon) => ({id,label,value:value ?? '—',icon});
const statusOptions = {users:[['active','Active'],['suspended','Suspended']],organizers:[['PENDING','Pending'],['APPROVED','Verified'],['NEEDS_INFO','More information needed'],['REJECTED','Rejected'],['SUSPENDED','Suspended']],events:[['DELETE_REQUESTED','Removal requests'],['DRAFT','Draft'],['IN_REVIEW','Pending'],['PUBLISHED','Published'],['REJECTED','Rejected'],['SUSPENDED','Suspended'],['CANCELLED','Cancelled'],['COMPLETED','Completed']]};
const inputClass = 'rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm';
export default function LiveManagement({kind, hotelHosts = false}) {
  const [params,setParams] = useSearchParams();
  const [exporting,setExporting] = useState(false);
  const page = Number(params.get('page')) || 1;
  const request = useApi(`/admin/${kind}/?${params.toString()}&page_size=10${hotelHosts?'&hotel_hosts=true':''}`);
  const overview = useApi('/admin/overview/');
  const info = overview.data || {};
  const rows = request.data?.results || [];
  const total = request.data?.count || 0;
  const title = hotelHosts ? 'Hotel hosts' : kind[0].toUpperCase()+kind.slice(1);
  const filter = (name,value) => { const next = new URLSearchParams(params); value ? next.set(name,value) : next.delete(name); next.delete('page'); setParams(next, {replace:true}); };
  const stats = kind === 'users' ? [stat('total','Total Users',info.users,Users),stat('active','Active Users',info.active_users,UserCheck),stat('new','New This Month',info.new_users,UserPlus)] : kind === 'organizers' ? [stat('total','Total Organizers',info.organizers,Users),stat('pending','Pending Verification',info.pending_organizers,Clock),stat('verified','Verified Organizers',info.approved_organizers,ShieldCheck),stat('suspended','Suspended',info.suspended_organizers,XCircle)] : [stat('total','Total Events',info.events,CalendarDays),stat('pending','Pending',info.pending_events,Clock),stat('approved','Published',info.published_events,CheckCircle2),stat('rejected','Rejected / Changes Requested',info.rejected_events,XCircle)];
  const categories = kind === 'events' ? info.event_categories : info.organizer_categories;
  const exportUsers = async () => {
    setExporting(true);
    try {
      const filters = new URLSearchParams(params); filters.delete('page');
      if (hotelHosts) filters.set('hotel_hosts', 'true');
      const users = await allPages(`/admin/users/?${filters}`);
      const cell = value => {let text=String(value ?? ''); if (/^[\s]*[=+@-]/.test(text)) text="'"+text; return '"'+text.replaceAll('"','""')+'"';};
      const csv = [['Name','Email','Phone','Role','LGA','Status'],...users.map(u=>[personName(u),u.email,u.phone,u.role,u.lga,statusName(u)])].map(row=>row.map(cell).join(',')).join('\r\n');
      const url = URL.createObjectURL(new Blob([csv], {type:'text/csv;charset=utf-8;'}));
      const link = document.createElement('a'); link.href=url; link.download='mmemme-users.csv'; link.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
    } catch(error) {toast.error(error.message);} finally {setExporting(false);}
  };
  return <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-bold">{title}</h1><p className="mt-1 text-sm text-slate-500">Manage {kind === 'users' ? 'accounts and access to the platform' : kind === 'events' ? 'event submissions and publication' : 'organizer applications and verification'}.</p></div>{kind==='users' && <button onClick={exportUsers} disabled={exporting} className="rounded-lg bg-[#174a20] px-4 py-2 text-sm text-white disabled:opacity-50">{exporting?'Exporting…':'Export CSV'}</button>}</div>
    {!overview.error && <StatsGrid stats={stats}/>}
    <section className="rounded-xl bg-white shadow-sm">
      <div className="flex flex-wrap gap-3 border-b border-slate-100 p-4">
        <input aria-label={`Search ${kind}`} type="search" placeholder={`Search ${kind}…`} className={`${inputClass} min-w-0 flex-1`} value={params.get('search')||''} onChange={e=>filter('search',e.target.value)}/>
        <select aria-label="Status" className={inputClass} value={params.get('status')||''} onChange={e=>filter('status',e.target.value)}><option value="">All statuses</option>{statusOptions[kind].map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>
        {kind==='users' ? <><select aria-label="Role" className={inputClass} value={params.get('role')||''} onChange={e=>filter('role',e.target.value)}><option value="">All roles</option>{['USER','ORGANIZER','ADMIN'].map(v=><option key={v}>{v}</option>)}</select><input aria-label="Local Government Area" placeholder="LGA" className={inputClass} value={params.get('lga')||''} onChange={e=>filter('lga',e.target.value)}/></> : <select aria-label="Category" className={inputClass} value={params.get('category')||''} onChange={e=>filter('category',e.target.value)}><option value="">All categories</option>{(categories||[]).map(c=><option key={c}>{c}</option>)}</select>}
        {kind==='events' && ['date_from','date_to'].map((name,i)=><label key={name} className="text-xs text-slate-500">{i?'To':'From'} <input type="date" className={inputClass} value={params.get(name)||''} onChange={e=>filter(name,e.target.value)}/></label>)}
        {params.size>0 && <button onClick={()=>setParams({})} className="text-sm text-green-800">Clear filters</button>}
      </div>
      <RequestState request={request}/>
      {!request.loading && !request.error && <><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr>{[kind==='events'?'Event':'Name / Business',kind==='users'?'Email / Phone':kind==='events'?'Organizer':'Category',kind==='users'?'Role / LGA':kind==='events'?'Event date':'Joined','Status','Actions'].map(h=><th key={h} className="px-5 py-3 font-medium">{h}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{rows.map(row=><tr key={row.id} className="hover:bg-slate-50"><td className="px-5 py-4"><div className="flex items-center gap-3">{(row.image || row.avatar || row.user?.avatar) && <img src={row.image || row.avatar || row.user.avatar} alt="" className="h-10 w-10 rounded-lg object-cover"/>}<div><p className="font-semibold">{kind==='users'?personName(row):row.title||row.business_name}</p>{row.user && <p className="text-xs text-slate-500">{row.user.email}</p>}</div></div></td><td className="px-5 py-4">{kind==='users'?<>{row.email}<br/><span className="text-xs text-slate-500">{row.phone}</span></>:kind==='events'?row.organizer.name:row.event_type||'Not provided'}</td><td className="px-5 py-4 text-slate-500">{kind==='users'?<>{row.role}<br/>{row.lga}</>:dateLabel(row.start_datetime||row.created_at)}</td><td className="px-5 py-4"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs capitalize">{statusName(row)}</span></td><td className="px-5 py-4"><Link to={`/admin/${kind}/${row.id}`} className="font-medium text-green-800 underline">View / Review</Link></td></tr>)}</tbody></table></div>{!rows.length && <p className="p-10 text-center text-slate-500">No {kind} match these filters.</p>}<div className="flex items-center justify-between gap-3 border-t border-slate-100 p-4 text-xs"><span>{total?((page-1)*10+1):0}–{Math.min(page*10,total)} of {total}</span><div className="flex gap-4"><button disabled={!request.data?.previous} onClick={()=>{const next=new URLSearchParams(params);next.set('page',page-1);setParams(next);}} className="disabled:opacity-30">Previous</button><span>Page {page}</span><button disabled={!request.data?.next} onClick={()=>{const next=new URLSearchParams(params);next.set('page',page+1);setParams(next);}} className="disabled:opacity-30">Next</button></div></div></>}
    </section>
  </div>;
}
