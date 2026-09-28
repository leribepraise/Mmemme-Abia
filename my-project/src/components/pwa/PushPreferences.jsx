import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { currentPushSubscription, enablePush, disablePush } from '@/lib/push';
import { useAuth } from '../context/AuthContext';

export default function PushPreferences(){
  const {user}=useAuth();
  const [config,setConfig]=useState(null);
  const [enabled,setEnabled]=useState(false);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');
  const supported=window.isSecureContext&&'PushManager' in window&&'Notification' in window;
  useEffect(()=>{
    let alive=true;
    if(user)Promise.all([api('/push/config/'),currentPushSubscription()]).then(async([next,subscription])=>{
      const status=subscription?await api('/push/subscription/',{method:'PATCH',body:{endpoint:subscription.endpoint}}):{enabled:false};
      if(alive){setConfig(next);setEnabled(status.enabled);}
    }).catch(error=>{if(alive)setMessage(error.message);});
    return()=>{alive=false;};
  },[user?.id]);
  const toggle=async()=>{setBusy(true);setMessage('');try{if(enabled){await disablePush();setEnabled(false);setMessage('Push notifications disabled on this device.');}else{await enablePush(config.public_key);setEnabled(true);setMessage('Push notifications enabled on this device.');}}catch(error){setMessage(error.message);}finally{setBusy(false);}};
  return <section className="rounded-xl border border-gray-200 bg-white p-5"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="font-semibold text-[#172033]">Push notifications</h2><p className="mt-1 text-sm text-gray-500">Receive updates on this device, even when the app is closed.</p></div><button onClick={toggle} disabled={busy||!supported||(!enabled&&!config?.enabled)} className="rounded-lg bg-[#3F783D] px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">{busy?'Please wait…':enabled?'Disable push notifications':'Enable push notifications'}</button></div>
    {!supported&&<p className="mt-3 text-sm">Your browser does not support push here. On iPhone or iPad, <Link to="/install" className="text-green-800 underline">add the app to your Home Screen</Link> first.</p>}
    {supported&&config&&!config.enabled&&<p className="mt-3 text-sm text-gray-500">Push notifications are not available yet. Your in-app notifications still work.</p>}
    {message&&<p role="status" className="mt-3 text-sm">{message}</p>}<Link to="/install" className="mt-3 inline-block text-sm text-green-800 underline">Install Mmemme Abia</Link></section>;
}
