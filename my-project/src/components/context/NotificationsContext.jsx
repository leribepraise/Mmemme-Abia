import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from './AuthContext';

const Context = createContext(null);
export function NotificationsProvider({children}) {
  const {user} = useAuth();
  const [revision,setRevision] = useState(0);
  const [count,setCount] = useState({owner:null,value:0});
  const refresh = useCallback(()=>setRevision(n=>n+1),[]);
  useEffect(()=>{
    if (!user) return;
    let alive=true;
    const load=()=>api('/notifications/unread-count/').then(result=>{if(alive)setCount({owner:user.id,value:result.count});}).catch(()=>{});
    load();
    const visible=()=>{if(document.visibilityState==='visible')refresh();};
    const interval=setInterval(visible,60000);
    window.addEventListener('focus',visible);
    const storage=event=>{if(event.key==='notifications-updated')refresh();};
    const push=event=>{if(event.data?.type==='notification-received')refresh();};
    window.addEventListener('storage',storage);
    navigator.serviceWorker?.addEventListener('message',push);
    return ()=>{alive=false;clearInterval(interval);window.removeEventListener('focus',visible);window.removeEventListener('storage',storage);navigator.serviceWorker?.removeEventListener('message',push);};
  },[user?.id,revision,refresh]);
  const changed=()=>{refresh();try{localStorage.setItem('notifications-updated',String(Date.now()));}catch{/* Storage may be disabled. */}};
  const markRead=async id=>{const result=await api(`/notifications/${id}/read/`,{method:'POST'});changed();return result;};
  const markAllRead=async()=>{await api('/notifications/read-all/',{method:'POST'});changed();};
  return <Context.Provider value={{revision,refresh,markRead,markAllRead,unreadCount:user&&count.owner===user.id?count.value:0}}>{children}</Context.Provider>;
}
export const useNotifications=()=>useContext(Context);
