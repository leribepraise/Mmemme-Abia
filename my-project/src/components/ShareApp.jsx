import { useState } from 'react';
import { Share2 } from 'lucide-react';

export default function ShareApp({ path = '/install', title = 'Mmemme Abia', label = 'Share app', className = '' }) {
  const [fallback, setFallback] = useState('');
  const [message, setMessage] = useState('');
  const share = async () => {
    const url = new URL(path, window.location.origin).href;
    try {
      if (navigator.share) await navigator.share({ title, text: 'Discover and experience Abia with Mmemme Abia.', url });
      else if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(url); setMessage('Link copied. Paste it into your message.'); }
      else setFallback(url);
    } catch (error) { if (error.name !== 'AbortError') setFallback(url); }
  };
  return <span className="inline-flex flex-col gap-2"><button type="button" onClick={share} className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm ${className}`}><Share2 size={16}/>{label}</button>{message && <span role="status" className="text-xs">{message}</span>}{fallback && <label className="text-xs">Copy this link<input readOnly value={fallback} onFocus={event=>event.target.select()} className="mt-1 w-full rounded border bg-white p-2 text-gray-900"/></label>}</span>;
}
