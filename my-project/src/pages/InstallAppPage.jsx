import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { canInstall, installApp, isInstalled, watchInstall } from '@/lib/install';
import { registerAppWorker } from '@/lib/push';

export default function InstallAppPage(){
  const [available,setAvailable]=useState(canInstall);
  const [installed,setInstalled]=useState(isInstalled);
  const [message,setMessage]=useState('');
  useEffect(()=>{registerAppWorker().catch(()=>setMessage('Installation is unavailable in this browser. Try again over HTTPS.'));return watchInstall(()=>{setAvailable(canInstall());setInstalled(isInstalled());});},[]);
  const install=async()=>{try{const accepted=await installApp();setMessage(accepted?'Installation accepted. Check your Home Screen or apps list.':'You can install later from your browser menu.');}catch{setMessage('Use your browser menu to install the app.');}};
  return <><Header/><main className="min-h-screen bg-[#F5F7F3] px-5 py-12"><section className="mx-auto max-w-xl space-y-6 rounded-2xl bg-white p-7 shadow-sm"><img src="/icons/app.svg" alt="Mmemme Abia app" className="h-20 w-20"/><h1 className="text-3xl font-bold text-[#172033]">Install Mmemme Abia</h1><p>Keep events, bookings and updates close. Add Mmemme Abia to your device and open it like an app.</p>
    {installed?<p className="font-semibold text-green-800">You are using the installed app.</p>:available?<button onClick={install} className="rounded-lg bg-[#3F783D] px-6 py-3 font-semibold text-white">Install app</button>:<div className="space-y-4 text-sm leading-6"><p><strong>Android or desktop:</strong> Open this website in Chrome or Edge, open the browser menu, and choose “Install app” or “Add to Home screen” when available.</p><p><strong>iPhone or iPad:</strong> Open this website in Safari, tap Share, then “Add to Home Screen”. Open the installed app to enable push notifications.</p></div>}
    <p className="text-sm text-gray-500">An internet connection is needed for bookings, payments and account information.</p>{message&&<p role="status">{message}</p>}<Link to="/notifications" className="inline-block text-green-800 underline">Manage notifications</Link></section></main></>;
}
