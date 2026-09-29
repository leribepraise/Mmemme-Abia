export default function PageSkeleton({ cards = 3 }) {
  return <section role="status" aria-label="Loading page" aria-busy="true" className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
    <span className="sr-only">Loading page</span>
    <div aria-hidden="true" className="space-y-6 motion-safe:animate-pulse">
      <div className="h-8 w-48 rounded-lg bg-slate-200/80"/><div className="h-4 w-2/3 max-w-md rounded bg-slate-200/60"/>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({length:cards},(_,i)=><div key={i} className="overflow-hidden rounded-2xl border border-slate-100 bg-white"><div className="aspect-[16/10] bg-slate-200/60"/><div className="space-y-3 p-5"><div className="h-5 w-3/4 rounded bg-slate-200/80"/><div className="h-3 w-full rounded bg-slate-100"/><div className="h-3 w-1/2 rounded bg-slate-100"/><div className="h-10 rounded-lg bg-slate-100"/></div></div>)}</div>
    </div>
  </section>;
}
