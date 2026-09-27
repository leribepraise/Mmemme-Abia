import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, money } from '@/lib/api';
import { useApi } from '@/hooks/useApi';
import { RequestState, Field, personName, statusName, dateLabel } from './LiveManagement';

const Card = ({title,children}) => <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm"><h2 className="mb-4 font-semibold">{title}</h2>{children}</section>;
export default function LiveReview({kind}) {
  const {id}=useParams();
  const request=useApi(`/admin/${kind}/${id}/`);
  const [note,setNote]=useState('');
  const [busy,setBusy]=useState(false);
  const [contentChecked,setContentChecked]=useState(false);
  const [policyChecked,setPolicyChecked]=useState(false);
  useEffect(()=>{setNote('');setContentChecked(false);setPolicyChecked(false);},[id,kind]);
  const row=request.data;
  const act=async decision=>{
    if(busy)return;
    if(['reject','request-info','request-changes','suspend'].includes(decision)&&!note.trim()){toast.error('Add a reason before continuing.');return;}
    setBusy(true);
    try {await api(`/admin/${kind}/${id}/${decision}/`,{method:'POST',body:{reason:note}});setNote('');toast.success('Decision saved. The account owner will be notified.');request.reload();}
    catch(error){toast.error(error.message);}finally{setBusy(false);}
  };
  if(request.loading||request.error||!row)return <RequestState request={request}/>;
  const user=kind==='users'?row:row.user;
  const pending=kind==='events'?row.status==='IN_REVIEW':row.status==='PENDING';
  const suspended=kind==='events'?row.is_suspended:!user?.is_active;
  const maySuspend=kind==='events'?row.status==='PUBLISHED':!user?.is_staff;
  const title=kind==='users'?personName(row):row.title||row.business_name;
  const button=(decision,label,style='bg-[#174a20] text-white',disabled=false)=><button key={decision} disabled={busy||disabled} onClick={()=>act(decision)} className={`rounded-lg px-4 py-2.5 text-sm font-medium disabled:opacity-40 ${style}`}>{busy?'Saving…':label}</button>;
  return <div className="mx-auto max-w-6xl space-y-5">
    <Link to={`/admin/${kind}`} className="text-sm text-green-800">← Back to {kind}</Link>
    <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-bold">{kind==='events'&&pending?'Review Event':kind==='organizers'&&pending?'Organizer Approval':kind==='users'?'User Details':'Details'}</h1><span className="rounded-full bg-amber-50 px-4 py-2 text-sm capitalize">{statusName(row)}</span></div>
    <Card title={title}><div className="flex flex-wrap gap-6">{(row.image||user?.avatar)&&<img src={row.image||user.avatar} alt="" className="h-28 w-36 rounded-xl object-cover"/>}<dl className="grid flex-1 gap-5 sm:grid-cols-3">{user?<><Field label="Name">{personName(user)}</Field><Field label="Email">{user.email}</Field><Field label="Phone">{row.contact_phone||user.phone}</Field><Field label="Location">{[user.address,user.lga].filter(Boolean).join(', ')}</Field><Field label="Email verification">{user.email_verified?'Verified':'Not verified'}</Field><Field label="Joined">{dateLabel(user.date_joined)}</Field></>:<><Field label="Organizer">{row.organizer.name}</Field><Field label="Organizer verification">{row.organizer.verified?'Verified':'Not verified'}</Field><Field label="Category">{row.category}</Field><Field label="Starts">{new Date(row.start_datetime).toLocaleString()}</Field><Field label="Ends">{new Date(row.end_datetime).toLocaleString()}</Field><Field label="Venue">{[row.venue,row.address,row.city].filter(Boolean).join(', ')}</Field></>}</dl></div></Card>
    <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]"><div className="space-y-5">
      {kind==='organizers'&&<><Card title="Business Information"><dl className="grid gap-5 sm:grid-cols-2"><Field label="Business name">{row.business_name}</Field><Field label="Type of event">{row.event_type}</Field><Field label="Region of coverage">{row.coverage_region}</Field><Field label="Verification reference">{row.verification_reference}</Field><Field label="Terms accepted">{dateLabel(row.terms_accepted_at)}</Field><Field label="Events created">{row.event_count ?? 0}</Field></dl><p className="mt-5 whitespace-pre-wrap text-sm text-slate-600">{row.description||'No additional description provided.'}</p></Card><Card title="Verification Details"><p className="text-sm text-slate-600">Review the supplied business information and verification reference. Request more information if anything is missing.</p><ul className="mt-4 space-y-3 text-sm"><li>Email: {user.email_verified?'Verified':'Not verified'}</li><li>Account: {user.is_active?'Active':'Suspended'}</li><li>Organizer terms: {row.terms_accepted_at?'Accepted':'Not recorded for this application'}</li></ul></Card></>}
      {kind==='events'&&<><Card title="Event Information"><p className="whitespace-pre-wrap text-sm text-slate-600">{row.description}</p><p className="mt-4 text-sm">Capacity: {row.capacity}</p></Card><Card title="Ticket Types"><div className="space-y-3">{row.ticket_types.map(t=><div key={t.id} className="flex justify-between gap-3 rounded-lg bg-slate-50 p-3 text-sm"><span>{t.name} · {t.is_active?'Active':'Inactive'}<br/><small>{t.quantity_sold} sold / {t.quantity} total</small></span><span>{money(t.price)}</span></div>)}{!row.ticket_types.length&&<p className="text-sm">No ticket types configured.</p>}</div></Card></>}
      {kind==='users'&&<Card title="Account Information"><dl className="grid gap-5 sm:grid-cols-2"><Field label="Role">{row.role}</Field><Field label="Account status">{row.is_active?'Active':'Suspended'}</Field><Field label="Date of birth">{dateLabel(row.date_of_birth)}</Field><Field label="Gender">{row.gender}</Field><Field label="Organizer application">{row.organizer_status||'No application'}</Field><Field label="Last login">{dateLabel(row.last_login)}</Field></dl><p className="mt-5 text-sm">{row.bio}</p></Card>}
      {row.reviewed_at&&<Card title="Latest Review"><p className="text-xs text-slate-500">{dateLabel(row.reviewed_at)} · {row.review_decision||statusName(row)}</p><p className="mt-3 whitespace-pre-wrap text-sm">{row.review_note||'No additional note.'}</p></Card>}
      <Card title={kind==='users'?'Manage Account':'Admin Review'}><label className="text-sm" htmlFor="review-note">{kind==='users'?'Reason for account status change':'Feedback to the applicant'}</label><textarea id="review-note" rows={4} maxLength={2000} value={note} onChange={e=>setNote(e.target.value)} className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-sm" placeholder="Explain your decision or the information needed…"/><p className="text-right text-xs text-slate-400">{note.length}/2000</p><div className="mt-4 flex flex-wrap gap-3">{kind!=='users'&&pending&&<>{button('approve',kind==='events'?'Approve Event':'Approve Organizer',undefined,kind==='events'&&(!contentChecked||!policyChecked))}{button('reject','Reject','border border-red-300 text-red-700')}{button(kind==='events'?'request-changes':'request-info',kind==='events'?'Request Changes':'Request More Information','border border-amber-300 text-amber-800')}</>}{kind==='organizers'&&['REJECTED','NEEDS_INFO'].includes(row.status)&&button('reopen','Reopen for Review')}{maySuspend&&button(suspended?'activate':'suspend',suspended?'Reactivate':'Suspend','border border-slate-300 text-slate-700')}</div>{user?.is_staff&&<p className="mt-3 text-sm text-slate-500">Staff account access is managed by a superuser in Django administration.</p>}</Card>
    </div><aside className="space-y-5"><Card title={kind==='events'?'Review Checklist':'Review Guidance'}>{kind==='events'?<div className="space-y-4 text-sm"><p className="flex gap-2"><CheckCircle2 size={18} className="text-green-700"/>Event information submitted</p><p className="flex gap-2"><ShieldCheck size={18}/>{row.organizer.verified?'Organizer verified':'Organizer not verified'}</p><p>Active ticket types: {row.ticket_types.filter(t=>t.is_active).length}</p><label className="flex gap-2"><input type="checkbox" checked={contentChecked} onChange={e=>setContentChecked(e.target.checked)}/>Content reviewed and appropriate</label><label className="flex gap-2"><input type="checkbox" checked={policyChecked} onChange={e=>setPolicyChecked(e.target.checked)}/>No policy violations identified</label></div>:<p className="text-sm leading-6 text-slate-600">Check the account details before changing access. Give a clear reason for suspension, rejection, or a request for more information. Decisions are saved to the audit history.</p>}</Card><Card title="After your decision"><p className="flex gap-2 text-sm leading-6 text-slate-600"><Clock size={20} className="shrink-0"/>The owner receives an account notification and an email queued for delivery.</p></Card></aside></div>
  </div>;
}
