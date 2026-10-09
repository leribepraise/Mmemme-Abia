import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import MajorEventCard from './MajorEventCard';

export default function MajorEventPopup() {
  const { data: promotion } = useApi('/events/major/');
  const [closed, setClosed] = useState(false);
  const visible = !!(promotion && !closed);
  const dismiss = () => setClosed(true);
  useEffect(() => {
    if (!visible) return;
    const onKeyDown = event => { if (event.key === 'Escape') dismiss(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [visible]);
  if (!visible) return null;
  return <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) dismiss(); }}>
    <div role="dialog" aria-modal="true" aria-label="Featured major event" className="relative my-auto w-full max-w-xl">
      <button type="button" onClick={dismiss} aria-label="Close major event" className="absolute right-3 top-3 z-10 rounded-full bg-white/95 p-2 text-slate-900 shadow hover:bg-white"><X size={20}/></button>
      <div onClickCapture={event => { if (event.target.closest('a')) dismiss(); }}><MajorEventCard promotion={promotion}/></div>
    </div>
  </div>;
}
