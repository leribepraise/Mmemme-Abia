import { useState } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export default function RecordActions({ resource, row, onChanged }) {
  const [action, setAction] = useState(null);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const next = (row.kind === 'FOOD'
    ? { NEW: 'ACCEPTED', ACCEPTED: 'READY', READY: 'IN_PROGRESS', IN_PROGRESS: 'COMPLETED' }
    : { NEW: 'IN_PROGRESS', IN_PROGRESS: 'COMPLETED' })[row.fulfillment_status];
  const run = async event => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      await api(`/admin/manage/${resource}/${row.id}/action/`, { method: 'POST', body: { action, reason, status: next } });
      toast.success('Record updated.'); setAction(null); setReason(''); onChanged();
    } catch (error) { toast.error(error.message); } finally { setBusy(false); }
  };
  return <>
    {resource === 'bookings' ? <>
      {row.status === 'CONFIRMED' && next && <button className="text-green-800 underline" onClick={() => setAction('fulfill')}>Update service</button>}
      {['PENDING', 'CONFIRMED'].includes(row.status) && row.fulfillment_status !== 'COMPLETED' && <button className="text-red-700 underline" onClick={() => setAction('cancel')}>Cancel booking</button>}
    </> : <button className="text-green-800 underline" onClick={() => setAction('verify')}>Check with Paystack</button>}
    {action && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><form onSubmit={run} role="dialog" aria-modal="true" aria-label="Confirm action" className="w-full max-w-md space-y-4 rounded-xl bg-white p-6">
      <h2 className="font-bold">{action === 'cancel' ? 'Cancel this booking?' : action === 'fulfill' ? `Change service to ${next?.toLowerCase().replaceAll('_', ' ')}?` : 'Check the latest payment status?'}</h2>
      {action === 'cancel' && <p>Cancellation rules still apply. An eligible paid booking will enter the refund queue.</p>}
      {action !== 'verify' && <label className="block">Reason<textarea required minLength={5} maxLength={500} className="mt-2 w-full rounded border p-2" value={reason} onChange={e => setReason(e.target.value)} /></label>}
      <div className="flex gap-4"><button disabled={busy} className="rounded bg-green-800 px-4 py-2 text-white">{busy ? 'Checking…' : 'Confirm'}</button><button disabled={busy} type="button" onClick={() => setAction(null)}>Go back</button></div>
    </form></div>}
  </>;
}
