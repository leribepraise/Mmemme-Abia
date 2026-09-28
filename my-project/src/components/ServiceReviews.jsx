import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
export default function ServiceReviews({ kind, listing }) {
  const [page,setPage]=useState(1);
  const state=useApi(`/service-reviews/?kind=${kind}&listing=${listing}&page=${page}`);
  return <section className="space-y-4 rounded-xl border bg-white p-5"><h2 className="text-xl font-bold">Guest reviews</h2><p className="text-sm text-gray-500">Reviews from completed bookings.</p>{state.loading?<p>Loading…</p>:state.error?<p role="alert">{state.error.message} <button onClick={state.reload}>Retry</button></p>:<>{state.data?.results?.map(row=><article key={row.id} className="border-t pt-3"><p className="font-semibold">{row.author} · {row.rating}/5</p><p className="whitespace-pre-wrap">{row.comment}</p><p className="text-xs text-gray-500">{new Date(row.created_at).toLocaleDateString()}</p></article>)}{state.data?.count===0&&<p>No reviews yet.</p>}<div className="flex justify-between text-sm"><button disabled={!state.data?.previous} onClick={()=>setPage(n=>n-1)}>Previous</button><span>Page {page}</span><button disabled={!state.data?.next} onClick={()=>setPage(n=>n+1)}>Next</button></div></>}</section>;
}
