import { api } from './api.js';

let registration;
export function registerAppWorker() {
  if (!('serviceWorker' in navigator) || !window.isSecureContext) return Promise.resolve(null);
  if (!registration) registration=navigator.serviceWorker.register('/sw.js',{scope:'/',updateViaCache:'none'}).then(()=>navigator.serviceWorker.ready).catch(error=>{registration=null;throw error;});
  return registration;
}
export async function currentPushSubscription() {
  if (!('serviceWorker' in navigator)) return null;
  const worker=await navigator.serviceWorker.getRegistration('/');
  return worker?.pushManager ? worker.pushManager.getSubscription() : null;
}
export function applicationServerKey(value) {
  const encoded=value.replace(/-/g,'+').replace(/_/g,'/');
  return Uint8Array.from(atob(encoded+'='.repeat((4-encoded.length%4)%4)),c=>c.charCodeAt(0));
}
export async function enablePush(publicKey) {
  if (!('PushManager' in window) || !('Notification' in window)) throw new Error('Push is not supported here. On iPhone or iPad, install the app from Safari first.');
  // Called only by the user's Enable button so permission remains a user gesture.
  const permission=await Notification.requestPermission();
  if(permission!=='granted') throw new Error('Notifications are blocked. Allow them in your browser or device settings to continue.');
  const worker=await registerAppWorker();
  if(!worker)throw new Error('Notifications require a secure HTTPS connection.');
  let subscription=await worker.pushManager.getSubscription();
  const key=applicationServerKey(publicKey);
  const oldKey=subscription?.options?.applicationServerKey;
  if(oldKey && Array.from(new Uint8Array(oldKey)).join(',')!==Array.from(key).join(',')){
    await subscription.unsubscribe();subscription=null;
  }
  let fresh=!subscription;
  if(!subscription)subscription=await worker.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:key});
  try{await api('/push/subscription/',{method:'POST',body:subscription.toJSON()});}
  catch(error){
    // Switching accounts must create a new browser subscription, never transfer ownership.
    if(!fresh && error.status===409){
      if(!await subscription.unsubscribe())throw error;
      subscription=await worker.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:key});
      fresh=true;
      try{await api('/push/subscription/',{method:'POST',body:subscription.toJSON()});}
      catch(retryError){await subscription.unsubscribe().catch(()=>{});throw retryError;}
    }else{if(fresh)await subscription.unsubscribe().catch(()=>{});throw error;}
  }
  return subscription;
}
export async function disablePush() {
  const subscription=await currentPushSubscription();
  if(!subscription)return;
  await api('/push/subscription/',{method:'DELETE',body:{endpoint:subscription.endpoint}});
  if(!await subscription.unsubscribe())throw new Error('The server stopped notifications, but your browser could not remove the subscription. Try again.');
}
