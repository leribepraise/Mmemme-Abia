import { useState } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export default function BookingReview({ booking }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  if (booking.fulfillment_status !== 'COMPLETED') return null;
  const submit = async event => {
    event.preventDefault(); setBusy(true);
    const data = new FormData(event.currentTarget);
    try {
      await api('/service-reviews/', { method: 'POST', body: { booking: booking.id, rating: Number(data.get('rating')), comment: data.get('comment') } });
      setSaved(true); setOpen(false); toast.success('Your review was saved.');
    } catch (error) { toast.error(error.message); } finally { setBusy(false); }
  };
  return <><button disabled={saved} onClick={() => setOpen(true)} className="text-xs text-green-800 underline">{saved ? 'Review saved' : 'Review service'}</button>
    {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><form onSubmit={submit} role="dialog" aria-modal="true" aria-label="Review your booking" className="w-full max-w-md space-y-4 rounded-xl bg-white p-6">
      <h2 className="font-bold">Review your completed booking</h2>
      <label className="block">Rating<select name="rating" required className="ml-3 rounded border p-2">{[5,4,3,2,1].map(n => <option key={n} value={n}>{n} / 5</option>)}</select></label>
      <label className="block">Your experience<textarea name="comment" required maxLength={3000} className="mt-2 w-full rounded border p-2" /></label>
      <div className="flex gap-4"><button disabled={busy} className="rounded bg-green-800 px-4 py-2 text-white">{busy ? 'Saving…' : 'Publish review'}</button><button disabled={busy} type="button" onClick={() => setOpen(false)}>Cancel</button></div>
    </form></div>}</>;
}
