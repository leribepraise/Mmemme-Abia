import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import SectionHeader from '../profile/common/SectionHeader';
import FilterTabs from './FilterTabs';
import NotificationGroup from './NotificationGroup';
import { useApi } from '@/hooks/useApi';
import { useNotifications } from '../context/NotificationsContext';
import { safeAppPath } from '@/lib/navigation';
import PushPreferences from '../pwa/PushPreferences';

export default function Inbox() {
  const {revision,markRead,markAllRead,unreadCount}=useNotifications();
  const [page,setPage]=useState(1);
  const [filter,setFilter]=useState('All');
  const [busy,setBusy]=useState(null);
  const [params,setParams]=useSearchParams();
  const navigate=useNavigate();
  const selected=params.get('notification');
  const request=useApi(`/notifications/?page=${page}&page_size=20&refresh=${revision}`);
  useEffect(()=>{
    if(!selected || !/^\d+$/.test(selected))return;
    let alive=true;
    markRead(selected).then(row=>{if(alive)navigate(safeAppPath(row.url),{replace:true});}).catch(error=>{
      if(alive){toast.error(error.message);setParams(previous=>{const next=new URLSearchParams(previous);next.delete('notification');return next;},{replace:true});}
    });
    return()=>{alive=false;};
    // Read actions refresh badges; the identifier alone controls opening a push.
  },[selected,navigate,setParams]);
  const items=(request.data?.results||[]).map(n=>({...n,title:n.subject,message:n.body,read:n.is_read,type:n.category==='update'?'welcome':n.category,
    time:new Date(n.created_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),date:new Date(n.created_at).toDateString()===new Date().toDateString()?'Today':'Earlier'}));
  const types={Updates:['welcome','event'],Bookings:['booking','ticket'],Events:['event','reminder'],Offers:['offer'],Community:['community']};
  const filtered=filter==='All'?items:items.filter(n=>types[filter]?.includes(n.type));
  const act=async(row,open=false)=>{
    if(busy!==null)return;
    setBusy(row.id);
    try{if(!row.read)await markRead(row.id);if(open)navigate(safeAppPath(row.url));}catch(error){toast.error(error.message);}finally{setBusy(null);}
  };
  const all=async()=>{if(busy!==null)return;setBusy('all');try{await markAllRead();}catch(error){toast.error(error.message);}finally{setBusy(null);}};
  return <div className="mx-auto max-w-[1100px]"><SectionHeader title="Notifications" description="Stay updated with your activities and bookings."/>
    <div className="mt-6 space-y-6"><PushPreferences/><FilterTabs onFilterChange={setFilter} onMarkAllRead={all} busy={busy!==null} unreadCount={unreadCount}/>
      {request.loading?<p role="status">Loading notifications…</p>:request.error?<div role="alert">{request.error.message} <button onClick={request.reload} className="underline">Retry</button></div>:<>
        {['Today','Earlier'].map(day=><NotificationGroup key={day} title={day} notifications={filtered.filter(n=>n.date===day)} onRead={row=>act(row)} onOpen={row=>act(row,true)} busy={busy!==null}/>)}
        {!filtered.length&&<p className="rounded-xl bg-white p-6 text-sm text-gray-500">{items.length?'No matching notifications on this page.':'You have no notifications yet.'}</p>}
        <div className="flex items-center justify-between gap-3 text-sm"><button disabled={!request.data?.previous} onClick={()=>setPage(n=>Math.max(1,n-1))} className="disabled:opacity-40">Previous</button><span>Page {page}</span><button disabled={!request.data?.next} onClick={()=>setPage(n=>n+1)} className="disabled:opacity-40">Next</button></div>
      </>}
    </div></div>;
}
