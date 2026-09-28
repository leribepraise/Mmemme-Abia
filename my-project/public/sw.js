/* Public offline fallback only. Never cache API, account or payment responses. */
const CACHE='mmemme-public-v1';
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(['/offline.html','/icons/app.svg','/icons/app-192.png','/icons/app-512.png'])).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('mmemme-public-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin||event.request.method!=='GET'||url.pathname.startsWith('/api/'))return;
  if(event.request.mode==='navigate')event.respondWith(fetch(event.request).catch(()=>caches.match('/offline.html')));
  else if(url.pathname.startsWith('/icons/'))event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request)));
});
self.addEventListener('push',event=>{
  let payload={};try{payload=event.data?.json()||{};}catch{/* Use a generic alert for malformed payloads. */}
  const url=/^\/notifications\?notification=\d+$/.test(payload.url||'')?payload.url:'/notifications';
  event.waitUntil(Promise.all([
    self.registration.showNotification('Mmemme Abia',{body:'You have a new notification. Open the app to view it.',icon:'/icons/app-192.png',tag:payload.tag||'mmemme-update',data:{url}}),
    self.clients.matchAll({type:'window',includeUncontrolled:true}).then(clients=>clients.forEach(client=>client.postMessage({type:'notification-received'})))
  ]));
});
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const raw=event.notification.data?.url;
  const path=/^\/notifications(?:\?notification=\d+)?$/.test(raw||'')?raw:'/notifications';
  const target=new URL(path,self.location.origin).href;
  event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(async clients=>{
    const client=clients.find(item=>new URL(item.url).origin===self.location.origin);
    if(client){const navigated=await client.navigate(target);if(navigated)return navigated.focus();}
    return self.clients.openWindow(target);
  }));
});
