import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {safeAppPath,eventTicketPath} from '../src/lib/navigation.js';

test('ticket routes use real IDs, with a catalogue fallback',()=>{
  assert.equal(eventTicketPath({id:'event-id'}),'/events/event-id');
  assert.equal(eventTicketPath({}),'/events');
  assert.equal(eventTicketPath(null),'/events');
});
test('notification and login redirects stay in the application',()=>{
  for(const value of ['//evil.test','https://evil.test','/\\evil.test','javascript:alert(1)','/\nevil.test',null])assert.equal(safeAppPath(value),'/notifications');
  assert.equal(safeAppPath('/ticket?booking=abc'),'/ticket?booking=abc');
  assert.equal(safeAppPath(undefined,'/organizer/dashboard'),'/organizer/dashboard');
});

function worker(){
  const handlers={}, notices=[], windows=[], reads=[], writes=[];
  const self={location:{origin:'https://mmemme.com.ng'},addEventListener:(name,fn)=>handlers[name]=fn,
    skipWaiting:async()=>{},registration:{showNotification:async(...args)=>notices.push(args)},
    clients:{claim:async()=>{},matchAll:async()=>[],openWindow:async url=>windows.push(url)}};
  const context={self,URL,Promise,fetch:async()=>{throw Error('offline');},caches:{
    open:async()=>({addAll:async paths=>writes.push(...paths)}),keys:async()=>[],delete:async()=>true,
    match:async path=>{reads.push(path);return 'offline fallback';}}};
  vm.runInNewContext(readFileSync(new URL('../public/sw.js',import.meta.url),'utf8'),context);
  return {handlers,notices,windows,reads,writes};
}
test('service worker caches only public offline resources',async()=>{
  const w=worker();let pending;
  w.handlers.install({waitUntil:p=>pending=p});await pending;
  assert.deepEqual(w.writes,['/offline.html','/icons/app.svg','/icons/app-192.png','/icons/app-512.png']);
  for(const path of ['/api/v1/auth/me/','/api/v1/tickets/']){
    let intercepted=false;
    w.handlers.fetch({request:{url:'https://mmemme.com.ng'+path,method:'GET',mode:'cors'},respondWith:()=>intercepted=true});
    assert.equal(intercepted,false);
  }
  w.handlers.fetch({request:{url:'https://mmemme.com.ng/profile',method:'GET',mode:'navigate'},respondWith:p=>pending=p});
  assert.equal(await pending,'offline fallback');
  assert.deepEqual(w.reads,['/offline.html']);
});
test('push payloads cannot expose sensitive text or navigate off site',async()=>{
  const w=worker();let pending;
  w.handlers.push({data:{json:()=>({title:'secret',body:'OTP 123456',url:'https://evil.test'})},waitUntil:p=>pending=p});await pending;
  assert.equal(w.notices[0][0],'Mmemme Abia');
  assert.equal(w.notices[0][1].data.url,'/notifications');
  assert.doesNotMatch(w.notices[0][1].body,/123456/);
  w.handlers.notificationclick({notification:{data:{url:'//evil.test'},close:()=>{}},waitUntil:p=>pending=p});await pending;
  assert.equal(w.windows[0],'https://mmemme.com.ng/notifications');
});
test('push clicks preserve notification ID for authenticated server lookup',async()=>{
  const w=worker();let pending;
  w.handlers.notificationclick({notification:{data:{url:'/notifications?notification=123'},close:()=>{}},waitUntil:p=>pending=p});await pending;
  assert.equal(w.windows[0],'https://mmemme.com.ng/notifications?notification=123');
});
test('install manifest has scoped routes and real PNG icons',()=>{
  const manifest=JSON.parse(readFileSync(new URL('../public/manifest.webmanifest',import.meta.url),'utf8'));
  assert.equal(manifest.start_url,'/');assert.equal(manifest.scope,'/');assert.equal(manifest.display,'standalone');
  for(const icon of manifest.icons){
    const png=readFileSync(new URL('../public'+icon.src,import.meta.url));
    assert.equal(png.subarray(1,4).toString(),'PNG');
    const size=Number(icon.sizes.split('x')[0]);
    assert.equal(png.readUInt32BE(16),size);assert.equal(png.readUInt32BE(20),size);
  }
});
