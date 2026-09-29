import { Link } from 'react-router-dom';
import { CalendarDays, CreditCard, Mail, Trash2, UserRoundCheck } from 'lucide-react';
import { useApi } from '@/hooks/useApi';

const date = value => value ? new Date(value).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' }) : '';

function Queue({ title, description, icon: Icon, request, rows, empty, more, count }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-start gap-3">
      <span className="rounded-xl bg-green-50 p-2 text-green-800"><Icon size={20} /></span>
      <div className="min-w-0 flex-1"><h2 className="font-semibold text-slate-900">{title}</h2><p className="text-sm text-slate-500">{description}</p></div>
      {!request.loading && !request.error && <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold">{count ?? request.data?.count ?? 0}</span>}
    </div>
    {request.loading && <p role="status" className="text-sm text-slate-500">Loading requests…</p>}
    {request.error && <p role="alert" className="text-sm text-red-700">{request.error.message} <button onClick={request.reload} className="underline">Retry</button></p>}
    {!request.loading && !request.error && <>
      {rows.length ? <ul className="divide-y divide-slate-100">{rows.map(row => <li key={row.key} className="flex flex-wrap items-center justify-between gap-3 py-3"><div className="min-w-0"><p className="break-words text-sm font-medium text-slate-900">{row.title}</p><p className="mt-1 break-words text-xs text-slate-500">{row.detail}{row.at ? ` · ${date(row.at)}` : ''}</p></div><Link to={row.to} className="rounded-lg border border-green-700 px-3 py-2 text-sm font-medium text-green-800 hover:bg-green-50">Open</Link></li>)}</ul> : <p className="text-sm text-slate-500">{empty}</p>}
      {request.data?.next && <Link to={more} className="mt-4 inline-block text-sm font-medium text-green-800 underline">View all</Link>}
    </>}
  </section>;
}

export default function OrganizerInbox() {
  const organizers = useApi('/admin/organizers/?status=PENDING&page_size=30');
  const reviews = useApi('/admin/events/?status=IN_REVIEW&page_size=30');
  const removals = useApi('/admin/events/?status=DELETE_REQUESTED&page_size=30');
  const conversations = useApi('/conversations/?page_size=100');
  const payouts = useApi('/admin/manage/payouts/?status=REQUESTED&page_size=30');
  const organizerMessages = (conversations.data?.results || []).filter(row => row.is_support && row.customer_role === 'ORGANIZER');

  return <div className="mx-auto max-w-6xl space-y-6">
    <header><h1 className="text-2xl font-bold text-slate-900">Organizer inbox</h1><p className="mt-1 text-sm text-slate-600">Review organizer messages and requests in one place. Financial actions remain in their review screens.</p></header>
    <div className="grid gap-5 lg:grid-cols-2">
      <Queue title="Support messages" description="Conversations started by organizers" icon={Mail} request={conversations} count={organizerMessages.length}
        rows={organizerMessages.map(row => ({ key: row.id, title: row.customer_name, detail: row.last_message || 'New support conversation', at: row.last_message_at || row.created_at, to: `/admin/support?conversation=${row.id}` }))}
        empty="No organizer support messages." more="/admin/support" />
      <Queue title="Organizer approvals" description="New organizer accounts awaiting verification" icon={UserRoundCheck} request={organizers}
        rows={(organizers.data?.results || []).map(row => ({ key: row.id, title: row.business_name || row.user?.email || 'Organizer', detail: row.user?.email || row.event_type || '', at: row.created_at, to: `/admin/organizers/${row.id}` }))}
        empty="No organizer approvals waiting." more="/admin/organizers?status=PENDING" />
      <Queue title="Event approvals" description="Events submitted for publication" icon={CalendarDays} request={reviews}
        rows={(reviews.data?.results || []).map(row => ({ key: row.id, title: row.title, detail: row.organizer?.name || '', at: row.updated_at, to: `/admin/events/${row.id}` }))}
        empty="No event approvals waiting." more="/admin/events?status=IN_REVIEW" />
      <Queue title="Cancellation and refund requests" description="Admin approval will cancel tickets and queue attendee refunds" icon={Trash2} request={removals}
        rows={(removals.data?.results || []).map(row => ({ key: row.id, title: row.title, detail: row.organizer?.name || '', at: row.deletion_requested_at, to: `/admin/events/${row.id}` }))}
        empty="No event cancellation requests." more="/admin/events?status=DELETE_REQUESTED" />
      <Queue title="Payout requests" description="Review organizer earnings before payment" icon={CreditCard} request={payouts}
        rows={(payouts.data?.results || []).map(row => ({ key: row.id, title: `Payout ${row.id}`, detail: `${row.currency} ${row.amount} · Organizer ${row.provider}`, at: row.created_at, to: '/admin/payments' }))}
        empty="No payout requests waiting." more="/admin/payments" />
    </div>
  </div>;
}
