import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Share2, Link as LinkIcon } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { sharedEventPath } from '@/lib/authNavigation';

export default function ShareEvent({ event, compact = false, className = '', label = 'Share event' }) {
  const params = useParams();
  const [fallback, setFallback] = useState('');
  const path = sharedEventPath(event?.id || params.id);
  const url = new URL(path, window.location.origin).href;
  const title = event?.title || event?.name || 'Mmemme Abia event';
  const copy = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(url);
      toast.success('Event link copied.');
      setFallback('');
    } catch { setFallback(url); }
  };
  const share = async () => {
    if (!navigator.share) { await copy(); return; }
    try { await navigator.share({ title, text: `Join me at ${title} on Mmemme Abia.`, url }); }
    catch (error) { if (error.name !== 'AbortError') await copy(); }
  };
  const stop = action => click => { click.preventDefault(); click.stopPropagation(); action(); };
  const fallbackField = fallback && <label className="block w-full min-w-0 text-sm text-gray-600 dark:text-gray-300">
    Copy this event link
    <input readOnly value={fallback} aria-label="Event share link" onClick={click => { click.stopPropagation(); click.currentTarget.select(); }} onFocus={focus => focus.target.select()}
      className="mt-1 w-full min-w-0 rounded-lg border bg-white p-2 text-sm text-gray-900 dark:bg-gray-900 dark:text-gray-100" />
  </label>;
  if (compact) return <div className="flex min-w-0 flex-col gap-2">
    <button type="button" onClick={stop(share)} className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium ${className}`} aria-label={`Share ${title}`}>
      <Share2 size={16} aria-hidden="true" />{label}
    </button>{fallbackField}
  </div>;
  const networks = [
    { name: 'Facebook', icon: FaFacebookF, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, color: 'bg-blue-50 text-blue-600' },
    { name: 'X', icon: FaTwitter, url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, color: 'bg-slate-100 text-slate-900' },
    { name: 'WhatsApp', icon: FaWhatsapp, url: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`, color: 'bg-emerald-50 text-emerald-600' },
  ];
  return <div className={`mb-10 min-w-0 space-y-3 ${className}`}>
    <h3 className="text-xl font-semibold uppercase tracking-wider">Share this event</h3>
    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
      {networks.map(network => <a key={network.name} href={network.url} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${network.name}`}
        className={`rounded-full p-3 transition hover:scale-110 ${network.color}`}><network.icon className="h-4 w-4" aria-hidden="true" /></a>)}
      <button type="button" onClick={stop(share)} aria-label="Share event" className="rounded-full bg-green-50 p-3 text-green-800 transition hover:scale-110"><Share2 className="h-4 w-4" aria-hidden="true" /></button>
      <button type="button" onClick={stop(copy)} aria-label="Copy event link" className="rounded-full bg-slate-100 p-3 text-slate-700 transition hover:scale-110"><LinkIcon className="h-4 w-4" aria-hidden="true" /></button>
    </div>{fallbackField}
  </div>;
}
