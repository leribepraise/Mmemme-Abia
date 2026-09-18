import { test, afterEach } from "node:test";
import assert from "node:assert/strict";

const realFetch=globalThis.fetch;
let moduleID=0;
afterEach(()=>{globalThis.fetch=realFetch;});
const client=()=>import("../src/lib/api.js?test="+(++moduleID));
const response=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{"Content-Type":"application/json"}});

test("booking requests send cookies, CSRF, bearer and stable idempotency key",async()=>{
  const calls=[];
  globalThis.fetch=async(url,options)=>{calls.push({url,options});return url.endsWith("/csrf/")?response({csrf_token:"csrf-test"}):response({id:"booking-test"},201);};
  const api=await client();api.setAccess("memory-token");
  await api.api("/bookings/",{method:"POST",body:{kind:"EVENT"},key:"request-key-123"});
  const call=calls[1];
  assert.equal(call.options.credentials,"include");
  assert.equal(call.options.headers.Authorization,"Bearer memory-token");
  assert.equal(call.options.headers["X-CSRFToken"],"csrf-test");
  assert.equal(call.options.headers["Idempotency-Key"],"request-key-123");
  assert.deepEqual(JSON.parse(call.options.body),{kind:"EVENT"});
});

test("simultaneous expired requests share one refresh and retry safely",async()=>{
  let refreshes=0;
  globalThis.fetch=async(url,options)=>{
    if(url.endsWith("/csrf/"))return response({csrf_token:"csrf-test"});
    if(url.endsWith("/refresh/")){refreshes++;await new Promise(resolve=>setTimeout(resolve,5));return response({access:"new-token"});}
    return options.headers.Authorization==="Bearer new-token"?response({ok:true}):response({detail:"expired"},401);
  };
  const api=await client();api.setAccess("expired-token");
  const results=await Promise.all([api.api("/bookings/"),api.api("/auth/me/")]);
  assert.deepEqual(results,[{ok:true},{ok:true}]);assert.equal(refreshes,1);
});

test("login failures do not loop through refresh",async()=>{
  let refreshes=0;
  globalThis.fetch=async(url)=>{if(url.endsWith("/csrf/"))return response({csrf_token:"csrf-test"});if(url.endsWith("/refresh/"))refreshes++;return response({error:{detail:"Invalid credentials"}},401);};
  const api=await client();
  await assert.rejects(api.api("/auth/login/",{method:"POST",body:{email:"test@example.test",password:"invalid"}}),/Invalid credentials/);
  assert.equal(refreshes,0);
});

test("a booking retry keeps its idempotency key and original body",async()=>{
  const bookings=[];
  globalThis.fetch=async(url,options)=>{
    if(url.endsWith("/csrf/"))return response({csrf_token:"csrf-test"});
    if(url.endsWith("/refresh/"))return response({access:"new-token"});
    bookings.push(options);return bookings.length===1?response({detail:"expired"},401):response({id:"same-booking"});
  };
  const api=await client();
  await api.api("/bookings/",{method:"POST",body:{kind:"HOTEL"},key:"same-reservation"});
  assert.equal(bookings.length,2);
  assert.equal(bookings[0].body,bookings[1].body);
  assert.equal(bookings[0].headers["Idempotency-Key"],bookings[1].headers["Idempotency-Key"]);
});

test("nested validation errors remain understandable",async()=>{
  globalThis.fetch=async()=>response({error:{items:[{quantity:["Insufficient stock."]}]}},409);
  const api=await client();
  await assert.rejects(api.api("/bookings/"),error=>error.status===409&&error.message==="Insufficient stock.");
});

test("an HTML fallback from hosting rejects instead of becoming listing data",async()=>{
  globalThis.fetch=async()=>new Response('<!doctype html><div id="root"></div>',{headers:{"Content-Type":"text/html; charset=utf-8"}});
  const api=await client();
  await assert.rejects(api.apiPage("/events/"),/temporarily unavailable/);
});

test("invalid JSON and malformed listing responses reject before rendering",async()=>{
  const api=await client();
  globalThis.fetch=async()=>new Response("broken",{headers:{"Content-Type":"application/json"}});
  await assert.rejects(api.apiPage("/events/"),/temporarily unavailable/);
  for(const body of [{},null,{results:null},{results:{}}]){
    globalThis.fetch=async()=>response(body);
    await assert.rejects(api.apiPage("/events/"),/temporarily unavailable/);
  }
});

test("valid listing pages retain pagination and empty results",async()=>{
  const page={count:0,results:[],next:null,previous:null};
  globalThis.fetch=async()=>response(page);
  const api=await client();
  assert.deepEqual(await api.apiPage("/events/"),page);
});

test("an HTML CSRF response prevents sending an account mutation",async()=>{
  let requests=0;
  globalThis.fetch=async()=>{requests++;return new Response("<!doctype html>",{headers:{"Content-Type":"text/html"}});};
  const api=await client();
  await assert.rejects(api.api("/auth/login/",{method:"POST",body:{email:"test@example.test",password:"test-only"}}),/temporarily unavailable/);
  assert.equal(requests,1);
});
