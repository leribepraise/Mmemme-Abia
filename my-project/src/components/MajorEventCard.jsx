import { Link } from 'react-router-dom';

export default function MajorEventCard({ promotion, compact = false }) {
  if (!promotion) return null;
  const external = promotion.kind === 'registration';
  const buttonClass = 'inline-flex min-h-11 items-center justify-center rounded-xl bg-[#ef6c19] px-5 py-2.5 text-center text-sm font-bold text-white transition hover:bg-[#d85d10] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef6c19]';
  return <article className={`overflow-hidden rounded-2xl border border-emerald-200 bg-white text-slate-900 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white ${compact ? 'sm:grid sm:grid-cols-[minmax(0,220px)_1fr]' : ''}`}>
    {promotion.image && <div className={`flex items-center justify-center bg-emerald-50 dark:bg-zinc-900 ${compact ? 'min-h-40' : 'min-h-48 max-h-72'}`}><img src={promotion.image} alt={`${promotion.title} event poster`} className="max-h-72 w-full object-contain" loading="lazy" /></div>}
    <div className="space-y-3 p-5">
      <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">Major event</span>
      <h2 className="text-xl font-bold leading-tight">{promotion.title}</h2>
      {promotion.starts_at && <p className="text-sm text-slate-600 dark:text-zinc-300">{new Date(promotion.starts_at).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}</p>}
      {promotion.description && <p className="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-zinc-300">{promotion.description}</p>}
      {external ? <a href={promotion.url} target="_blank" rel="noopener noreferrer" className={buttonClass}>{promotion.cta || 'Register now'}</a> : <Link to={promotion.url} className={buttonClass}>{promotion.cta || 'Get tickets'}</Link>}
    </div>
  </article>;
}
