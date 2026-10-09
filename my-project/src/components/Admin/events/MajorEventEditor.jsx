import { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { useApi, useCollection } from '@/hooks/useApi';
import MajorEventCard from '@/components/MajorEventCard';

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900';
export default function MajorEventEditor() {
  const current = useApi('/admin/major-event/');
  const events = useCollection('/admin/events/?status=PUBLISHED');
  const [mode, setMode] = useState('ticket');
  const [eventId, setEventId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState(null);
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [busy, setBusy] = useState(false);
  const save = async event => {
    event.preventDefault();
    if (busy) return;
    const form = new FormData();
    if (mode === 'ticket') form.append('event_id', eventId);
    else {
      form.append('title', title.trim());
      form.append('description', description.trim());
      form.append('registration_url', url.trim());
      if (image) form.append('image', image);
      if (startsAt) form.append('starts_at', new Date(startsAt).toISOString());
      if (endsAt) form.append('ends_at', new Date(endsAt).toISOString());
    }
    setBusy(true);
    try { await api('/admin/major-event/', { method: 'PUT', body: form }); toast.success('Major event is live.'); current.reload(); }
    catch (error) { toast.error(error.message); }
    finally { setBusy(false); }
  };
  const clear = async () => {
    if (busy) return;
    setBusy(true);
    try { await api('/admin/major-event/', { method: 'DELETE' }); toast.success('Major event removed.'); current.reload(); }
    catch (error) { toast.error(error.message); }
    finally { setBusy(false); }
  };
  return <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 sm:p-6">
    <h2 className="text-xl font-bold">Major event promotion</h2>
    <p className="mb-4 mt-1 text-sm text-slate-600">Only staff with event management permission can publish this card. Visitors see it once per website visit; everyone can see it on the home page and profile dashboard. Publishing also queues an email alert for eligible users.</p>
    {current.data && <div className="mb-5 max-w-xl">{!current.data.active && <p className="mb-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">The selected event is no longer eligible or has ended. It is hidden from users.</p>}<MajorEventCard promotion={current.data} compact /></div>}
    <form onSubmit={save} className="grid gap-3 sm:max-w-xl">
      <label className="text-sm font-medium">Destination
        <select className={inputClass} value={mode} onChange={event => setMode(event.target.value)}><option value="ticket">MMEMME ABIA ticketed event</option><option value="registration">External registration event</option></select>
      </label>
      {mode === 'ticket' ? <label className="text-sm font-medium">Approved event
        <select required className={inputClass} value={eventId} onChange={event => setEventId(event.target.value)}><option value="">Select an event</option>{events.data.map(event => <option key={event.id} value={event.id}>{event.title} — {new Date(event.start_datetime).toLocaleDateString('en-NG')}</option>)}</select>
      </label> : <>
        <label className="text-sm font-medium">Event name<input required maxLength={255} className={inputClass} value={title} onChange={event => setTitle(event.target.value)}/></label>
        <label className="text-sm font-medium">Short description<textarea maxLength={500} rows={3} className={inputClass} value={description} onChange={event => setDescription(event.target.value)}/></label>
        <label className="text-sm font-medium">Event poster<input required type="file" accept="image/png,image/jpeg,image/webp" className={inputClass} onChange={event => setImage(event.target.files?.[0] || null)}/></label>
        <label className="text-sm font-medium">Registration link<input required type="url" pattern="https://.*" placeholder="https://www.abiatechrise.ng/" className={inputClass} value={url} onChange={event => setUrl(event.target.value)}/></label>
        <label className="text-sm font-medium">Event starts (optional)<input type="datetime-local" className={inputClass} value={startsAt} onChange={event => setStartsAt(event.target.value)}/></label>
        <label className="text-sm font-medium">Promotion ends<input required type="datetime-local" className={inputClass} value={endsAt} onChange={event => setEndsAt(event.target.value)}/></label>
      </>}
      <div className="flex flex-wrap gap-3"><button disabled={busy} className="rounded-lg bg-emerald-800 px-5 py-2.5 font-semibold text-white disabled:opacity-50">{busy ? 'Saving…' : 'Publish major event'}</button>{current.data && <button type="button" disabled={busy} onClick={clear} className="rounded-lg border border-red-300 px-5 py-2.5 font-semibold text-red-700 disabled:opacity-50">Remove promotion</button>}</div>
    </form>
  </section>;
}
