import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api, money } from "../lib/api";
import { useAuth } from "../components/context/AuthContext";
import { Notice, fieldClass, buttonClass } from "./Marketplace";

export default function AccountDashboard() {
  const {user,reloadUser,logout}=useAuth();
  const [bookings,setBookings]=useState(null);
  const [tickets,setTickets]=useState([]);
  const [notifications,setNotifications]=useState([]);
  const [saved,setSaved]=useState([]);
  const [error,setError]=useState("");
  const [message,setMessage]=useState("");
  const [page,setPage]=useState(1);
  const [busy,setBusy]=useState(false);
  const [collectionPages,setCollectionPages]=useState({tickets:1,notifications:1,saved:1});
  const [collectionMeta,setCollectionMeta]=useState({});
  const [messagePage,setMessagePage]=useState(1);
  const [messageNext,setMessageNext]=useState(false);
  const [profile,setProfile]=useState({first_name:user?.first_name||"",last_name:user?.last_name||"",phone:user?.phone||"",interests:(user?.interests||[]).join(", "),email_notifications:user?.email_notifications??true});
  const [application,setApplication]=useState({business_name:"",description:"",contact_phone:"",verification_reference:""});
  const [conversation,setConversation]=useState(null);
  const [messages,setMessages]=useState([]);
  const [draft,setDraft]=useState("");
  const fetchData=useCallback(()=>Promise.all([api("/bookings/?page="+page),api("/tickets/?page="+collectionPages.tickets),api("/notifications/?page="+collectionPages.notifications),api("/saved-events/?page="+collectionPages.saved)]),[page,collectionPages]);
  const applyData=useCallback(([b,t,n,s])=>{
    setBookings(b);setTickets(t.results);setNotifications(n.results);setSaved(s.results);setCollectionMeta({tickets:t,notifications:n,saved:s});
  },[]);
  const load=useCallback(async()=>applyData(await fetchData()),[fetchData,applyData]);
  useEffect(()=>{let active=true;fetchData().then(data=>{if(active)applyData(data);}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[fetchData,applyData]);
  async function run(work){
    setBusy(true);setError("");setMessage("");
    try{await work();}catch(error){setError(error.message);}finally{setBusy(false);}
  }
  function pager(name){const data=collectionMeta[name];return data&&<nav aria-label={name+" pages"} className="flex gap-4"><button disabled={!data.previous||busy} onClick={()=>setCollectionPages({...collectionPages,[name]:collectionPages[name]-1})}>Previous</button><span>Page {collectionPages[name]}</span><button disabled={!data.next||busy} onClick={()=>setCollectionPages({...collectionPages,[name]:collectionPages[name]+1})}>Next</button></nav>;}
  async function fetchMessages(id,page=1){const data=await api("/conversations/"+id+"/messages/?page_size=100&page="+page);setMessages(data.results.reverse());setMessagePage(page);setMessageNext(Boolean(data.next));}
  async function openMessages(booking){
    const thread=await api("/conversations/",{method:"POST",body:{booking:booking.id}});
    setConversation(thread);await fetchMessages(thread.id);
  }
  async function download(ticket){
    const data=await api("/tickets/"+ticket.id+"/qr/",{blob:true});
    const url=URL.createObjectURL(data);
    const link=document.createElement("a");link.href=url;link.download=ticket.ticket_number+".png";link.click();URL.revokeObjectURL(url);
  }
  return <main className="mx-auto max-w-5xl space-y-8 px-5 py-10">
    <header className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-3xl font-bold">My account</h1><p className="text-gray-600">{user?.email}</p></div><div className="flex gap-4"><Link to="/events" className="text-[#3F7D3D]">Explore</Link>{(user?.role==="ORGANIZER"||user?.is_staff)&&<Link to="/organizer/dashboard" className="text-[#3F7D3D]">Provider dashboard</Link>}<button onClick={()=>run(logout)}>Log out</button></div></header>
    <Notice error={error}/>{message&&<p role="status" className="rounded-lg bg-green-50 p-3 text-green-800">{message}</p>}
    {!user?.email_verified&&<section className="rounded-xl border border-orange-200 bg-orange-50 p-5"><h2 className="font-bold">Verify your email to book</h2><p className="my-2">Open the verification link we sent you.</p><button disabled={busy} onClick={()=>run(async()=>{await api("/auth/resend-verification/",{method:"POST",body:{}});setMessage("A verification email has been requested.");})} className={buttonClass}>Resend verification</button><button className="ml-4 underline" onClick={()=>run(reloadUser)}>I’ve verified my email</button></section>}
    <section className="space-y-4"><h2 className="text-2xl font-bold">My bookings</h2>
      {bookings?.count===0&&<p>You have no bookings yet.</p>}
      {bookings?.results.map(booking=><article key={booking.id} className="space-y-3 rounded-xl border bg-white p-5">
        <div className="flex flex-wrap justify-between gap-2"><h3 className="text-lg font-bold">{booking.details.title||booking.kind}</h3><span className="rounded-full bg-gray-100 px-3 py-1 text-sm">{booking.status.replaceAll("_"," ")}</span></div>
        <p className="text-sm text-gray-600 break-all">{booking.booking_reference}</p>
        {booking.details.check_in&&<p>{booking.details.check_in} → {booking.details.check_out} · {booking.details.rooms} room(s)</p>}
        <ul>{booking.items.map(item=><li key={item.id}>{item.quantity} × {item.description} · {money(item.subtotal)}</li>)}</ul>
        <p className="font-bold">Total {money(booking.total_amount)}</p><p className="text-sm">Fulfillment: {booking.fulfillment_status.replaceAll("_"," ")}</p>
        <div className="flex flex-wrap gap-3">
          {booking.status==="PENDING"&&new Date(booking.expires_at)>new Date()&&<button disabled={busy} className={buttonClass} onClick={()=>run(async()=>{const payment=await api("/payments/initialize/",{method:"POST",body:{booking:booking.id}});window.location.assign(payment.authorization_url);})}>Complete payment</button>}
          {["PENDING","CONFIRMED"].includes(booking.status)&&<button disabled={busy} className="rounded-lg border px-4 py-2" onClick={()=>{if(window.confirm("Cancel "+booking.booking_reference+"? Eligible paid bookings will enter the refund process."))run(async()=>{await api("/bookings/"+booking.id+"/cancel/",{method:"POST",body:{}});await load();setMessage("Cancellation recorded. Paid bookings enter the refund process.");});}}>Cancel booking</button>}
          <button className="rounded-lg border px-4 py-2" onClick={()=>run(()=>openMessages(booking))}>Message provider</button>
        </div>
      </article>)}
      {bookings&&<div className="flex gap-4"><button disabled={!bookings.previous} onClick={()=>setPage(p=>p-1)}>Previous</button><span>Page {page}</span><button disabled={!bookings.next} onClick={()=>setPage(p=>p+1)}>Next</button></div>}
    </section>
    {conversation&&<section className="space-y-4 rounded-xl border bg-white p-5"><h2 className="text-xl font-bold">Booking conversation</h2><button className="underline" onClick={()=>run(async()=>{await fetchMessages(conversation.id);await api("/conversations/"+conversation.id+"/read/",{method:"POST",body:{}});})}>Refresh messages</button><div className="flex gap-4"><button disabled={!messageNext||busy} onClick={()=>run(()=>fetchMessages(conversation.id,messagePage+1))}>Older messages</button><button disabled={messagePage===1||busy} onClick={()=>run(()=>fetchMessages(conversation.id,messagePage-1))}>Newer messages</button></div><div className="max-h-80 space-y-3 overflow-auto">{messages.map(m=><p key={m.id} className={"rounded-lg p-3 "+(m.sender===user.id?"bg-green-50":"bg-gray-100")}><strong>{m.sender===user.id?"You":"Provider"}: </strong>{m.body}</p>)}</div><form className="flex gap-3" onSubmit={e=>{e.preventDefault();run(async()=>{await api("/conversations/"+conversation.id+"/messages/",{method:"POST",body:{body:draft}});await fetchMessages(conversation.id);setDraft("");});}}><input required maxLength="4000" aria-label="Message" className={fieldClass} value={draft} onChange={e=>setDraft(e.target.value)}/><button disabled={busy} className={buttonClass}>Send</button></form></section>}
    <section className="space-y-3"><h2 className="text-2xl font-bold">My tickets</h2>{tickets.length===0&&<p>No tickets issued yet.</p>}{tickets.map(ticket=><article key={ticket.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4"><p className="break-all">{ticket.ticket_number} · {ticket.status}</p><button disabled={busy||ticket.status!=="ACTIVE"} className="text-[#3F7D3D]" onClick={()=>run(()=>download(ticket))}>Download admission QR</button></article>)}{pager("tickets")}</section>
    <section className="space-y-3"><h2 className="text-2xl font-bold">Saved events</h2>{saved.map(event=><div key={event.id} className="flex justify-between rounded border bg-white p-4"><Link to={"/book/event/"+event.id}>{event.title}</Link><button onClick={()=>run(async()=>{await api("/saved-events/",{method:"DELETE",body:{event:event.id}});await load();})}>Remove</button></div>)}{pager("saved")}</section>
    <section className="space-y-3"><h2 className="text-2xl font-bold">Notifications</h2>{notifications.map(n=><article key={n.id} className={"rounded-lg border p-4 "+(n.is_read?"bg-white":"bg-green-50")}><h3 className="font-semibold">{n.subject}</h3><p>{n.body}</p>{!n.is_read&&<button className="mt-2 underline" onClick={()=>run(async()=>{await api("/notifications/"+n.id+"/read/",{method:"POST",body:{}});await load();})}>Mark read</button>}</article>)}{pager("notifications")}</section>
    <form className="space-y-4 rounded-xl border bg-white p-6" onSubmit={e=>{e.preventDefault();run(async()=>{await api("/auth/me/",{method:"PATCH",body:{...profile,interests:profile.interests.split(",").map(x=>x.trim()).filter(Boolean)}});await reloadUser();setMessage("Profile saved.");});}}>
      <h2 className="text-2xl font-bold">Profile and preferences</h2>{[["first_name","First name"],["last_name","Last name"],["phone","Phone"],["interests","Interests, separated by commas"]].map(([name,label])=><label key={name} className="block">{label}<input className={fieldClass} value={profile[name]} onChange={e=>setProfile({...profile,[name]:e.target.value})}/></label>)}
      <label className="flex gap-3"><input type="checkbox" checked={profile.email_notifications} onChange={e=>setProfile({...profile,email_notifications:e.target.checked})}/>Email event reminders</label><button disabled={busy} className={buttonClass}>Save profile</button><Link className="ml-4 underline" to="/reset-password">Reset password</Link>
    </form>
    {user?.role!=="ORGANIZER"&&<form className="space-y-4 rounded-xl border bg-white p-6" onSubmit={e=>{e.preventDefault();run(async()=>{const result=await api("/auth/organizer-application/",{method:"POST",body:application});setMessage("Your provider application is "+result.status.toLowerCase()+".");});}}>
      <h2 className="text-2xl font-bold">Become a provider</h2><p className="text-gray-600">Apply to host events, offer stays, sell food, or run transport and tours. Your application is reviewed before you can accept bookings.</p>
      {[["business_name","Business name"],["description","About your business"],["contact_phone","Contact phone"],["verification_reference","Business registration or verification reference"]].map(([name,label])=><label className="block" key={name}>{label}<input required className={fieldClass} value={application[name]} onChange={e=>setApplication({...application,[name]:e.target.value})}/></label>)}
      <button disabled={busy||!user?.email_verified} className={buttonClass}>Submit application</button>
    </form>}
  </main>;
}

export function PaymentReturn() {
  const [params]=useSearchParams();
  const [result,setResult]=useState(null);
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  async function verify(){
    setBusy(true);setError("");
    try{
      const payment=await api("/payments/verify-reference/",{method:"POST",body:{reference:params.get("reference")||params.get("trxref")}});
      const booking=await api("/bookings/"+payment.booking+"/");
      setResult({payment,booking});
    }catch(error){setError(error.message);}finally{setBusy(false);}
  }
  return <main className="mx-auto max-w-xl space-y-5 p-8">
    <h1 className="text-3xl font-bold">Confirm your payment</h1>
    <p>We’ll verify your payment with Paystack before confirming your booking.</p><Notice error={error}/>
    <button className={buttonClass} disabled={busy} onClick={verify}>{busy?"Checking payment…":"Check payment status"}</button>
    {result&&<section className="space-y-2 rounded-xl border bg-white p-5"><h2 className="text-xl font-bold">{result.booking.status==="CONFIRMED"?"Booking confirmed":result.payment.status==="REFUND_PENDING"?"Payment received; refund pending":result.payment.status==="REVIEW"?"Payment requires support review":"Payment not confirmed yet"}</h2><p>Booking: {result.booking.booking_reference}</p><p>Amount: {money(result.booking.total_amount)}</p><p>Status: {result.booking.status.replaceAll("_"," ")}</p></section>}
    <Link className="block text-[#3F7D3D]" to="/account">View bookings and tickets</Link>
  </main>;
}
