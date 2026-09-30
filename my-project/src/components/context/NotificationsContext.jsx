import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { safeAppPath } from '@/lib/navigation';
import { useAuth } from './AuthContext';

const Context = createContext(null);
export function NotificationsProvider({children}) {
  const {user} = useAuth();
  const navigate = useNavigate();
  const [revision,setRevision] = useState(0);
  const [count,setCount] = useState({owner:null,value:0});
  const [toast,setToast] = useState(null);
  const cursor = useRef(null);
  const busy = useRef(false);
  const activeRequest = useRef(null);
  const refresh = useCallback(()=>setRevision(n=>n+1),[]);
  const poll = useCallback(async()=>{
    if (!user || busy.current || document.visibilityState !== 'visible') return;
    busy.current=true;
    const request = Symbol('notification-poll');
    activeRequest.current = request;
    try {
      let after=cursor.current;
      let result=await api(`/notifications/live/${after===null?'':`?after=${after}`}`);
      if (activeRequest.current !== request) return;
      setCount({owner:user.id,value:result.unread_count});
      if(after===null){cursor.current=result.latest_id;return;}
      let newest=null;
      while(result.updates.length){
        newest=result.updates.at(-1);
        after=newest.id;
        cursor.current=after;
        if(!result.has_more)break;
        result=await api(`/notifications/live/?after=${after}`);
        if (activeRequest.current !== request) return;
      }
      if(newest){setToast(newest);refresh();window.dispatchEvent(new Event('mmemme-data-changed'));}
    }catch{/* Keep the current view during a temporary outage. */}
    finally{if(activeRequest.current === request)busy.current=false;}
  },[user?.id,refresh]);
  useEffect(()=>{
    cursor.current=null;
    busy.current=false;
    activeRequest.current=null;
    setToast(null);
    if(!user){setCount({owner:null,value:0});return;}
    poll();
    const visible=()=>{if(document.visibilityState==='visible')poll();};
    const interval=setInterval(poll,10000);
    window.addEventListener('focus',visible);
    window.addEventListener('online',poll);
    const storage=event=>{if(event.key==='notifications-updated')poll();};
    const push=event=>{if(event.data?.type==='notification-received')poll();};
    window.addEventListener('storage',storage);
    navigator.serviceWorker?.addEventListener('message',push);
    return ()=>{activeRequest.current=null;clearInterval(interval);window.removeEventListener('focus',visible);window.removeEventListener('online',poll);window.removeEventListener('storage',storage);navigator.serviceWorker?.removeEventListener('message',push);};
  },[user?.id,poll]);
  useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(null),8000);return()=>clearTimeout(timer);},[toast]);
  const changed=()=>{refresh();poll();try{localStorage.setItem('notifications-updated',String(Date.now()));}catch{/* Storage may be disabled. */}};
  const markRead=async id=>{const result=await api(`/notifications/${id}/read/`,{method:'POST'});changed();return result;};
  const markAllRead=async()=>{await api('/notifications/read-all/',{method:'POST'});changed();};
  const deleteNotification=async id=>{await api(`/notifications/${id}/`,{method:'DELETE'});if(toast?.id===id)setToast(null);changed();};
  const openToast=()=>{if(!toast)return;const destination=safeAppPath(toast.url);markRead(toast.id).catch(()=>{});setToast(null);navigate(destination);};
  return <Context.Provider value={{revision,refresh,markRead,markAllRead,deleteNotification,unreadCount:user&&count.owner===user.id?count.value:0}}>
    {children}
    {toast&&<div className="mmemme-notification-popup" role="status" aria-live="polite">
      <strong>{toast.subject}</strong><p>{toast.body}</p>
      <div className="mmemme-notification-popup__actions"><button type="button" onClick={openToast}>View</button><button type="button" onClick={()=>setToast(null)}>Dismiss</button></div>
    </div>}
  </Context.Provider>;
}
export const useNotifications=()=>useContext(Context);
