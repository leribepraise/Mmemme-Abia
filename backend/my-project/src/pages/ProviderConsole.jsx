import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, money } from "../lib/api";
import { useAuth } from "../components/context/AuthContext";
import { buttonClass, fieldClass, Notice } from "./Marketplace";

// Fields describe customer-facing inventory; the server controls ownership and approval.
const forms={
  events:{label:"Events",fields:"title,description,category,venue,address,city,start_datetime:datetime-local,end_datetime:datetime-local,capacity:number",root:true},
  hotels:{label:"Hotels",fields:"name,description,city,address,amenities:list",root:true},
  "room-types":{label:"Room types",fields:"hotel:@hotels,name,max_guests:number,is_active:checkbox"},
  "room-nights":{label:"Room availability",fields:"room_type:@room-types,date:date,price:money,quantity:number,is_active:checkbox"},
  restaurants:{label:"Restaurants",fields:"name,description,city,address,accepts_orders:checkbox,offers_delivery:checkbox,delivery_fee:money,delivery_cities:list",root:true},
  "menu-items":{label:"Menu items",fields:"restaurant:@restaurants,name,description,allergens,price:money,quantity:number,is_active:checkbox"},
  "transport-routes":{label:"Transport routes",fields:"name,origin,destination,pickup_address",root:true},
  departures:{label:"Scheduled journeys",fields:"route:@transport-routes,departs_at:datetime-local,arrives_at:datetime-local,vehicle,price:money,quantity:number,is_active:checkbox"},
  tourism:{label:"Tourism experiences",fields:"name,description,category:category,location_name,address,contact_phone,contact_email:email",root:true},
  "tour-packages":{label:"Tour packages",fields:"experience:@tourism,name,description,price:money,duration_hours:number,is_active:checkbox"},
  "tour-departures":{label:"Scheduled tours",fields:"package:@tour-packages,starts_at:datetime-local,ends_at:datetime-local,price:money,quantity:number,is_active:checkbox"},
};
const labels={start_datetime:"Event starts",end_datetime:"Event ends",departs_at:"Departure time",arrives_at:"Arrival time",starts_at:"Tour starts",ends_at:"Tour ends",is_active:"Available to book",max_guests:"Guests per room",quantity:"Total stock including reservations and sales"};
const title=name=>labels[name]||name.replaceAll("_"," ").replace(/^./,c=>c.toUpperCase());
const fieldsFor=endpoint=>forms[endpoint].fields.split(",").map(f=>f.split(":"));
async function choicesFor(endpoint){
  const rows=[];
  for(let page=1;page<=50;page++){
    const result=await api("/"+endpoint+"/mine/?page_size=100&page="+page);
    rows.push(...result.results);if(!result.next)return rows;
  }
  throw new Error("Too many listings to display. Contact support to arrange a bulk update.");
}

export default function ProviderConsole(){
  const {user}=useAuth();
  const [endpoint,setEndpoint]=useState("events");
  const [page,setPage]=useState(1);
  const [rows,setRows]=useState(null);
  const [choices,setChoices]=useState({});
  const [values,setValues]=useState({});
  const [editing,setEditing]=useState(null);
  const [error,setError]=useState("");
  const [notice,setNotice]=useState("");
  const [busy,setBusy]=useState(false);
  const [bookings,setBookings]=useState(null);
  const [bookingPage,setBookingPage]=useState(1);
  const [analytics,setAnalytics]=useState(null);
  const [token,setToken]=useState("");
  const [ticketEvent,setTicketEvent]=useState(null);
  const [ticket,setTicket]=useState({name:"",price:"",quantity:""});
  const [thread,setThread]=useState(null);
  const [messages,setMessages]=useState([]);
  const [messagePage,setMessagePage]=useState(1);
  const [messageNext,setMessageNext]=useState(false);
  const [draft,setDraft]=useState("");
  const [nightRange,setNightRange]=useState({room_type:"",date_from:"",date_to:"",price:"",quantity:""});
  const approved=user?.is_verified||user?.is_staff;
  const fetchData=useCallback(async()=>{
    if(!approved)return null;
    const [catalog,orders,stats]=await Promise.all([api("/"+endpoint+"/mine/?page="+page),api("/bookings/received/?page="+bookingPage),api("/bookings/analytics/")]);
    const related=fieldsFor(endpoint).find(([,type])=>type?.startsWith("@"));
    return {catalog,orders,stats,options:related?{[related[0]]:await choicesFor(related[1].slice(1))}:{}};
  },[approved,endpoint,page,bookingPage]);
  const applyData=useCallback(data=>{if(data){setRows(data.catalog);setBookings(data.orders);setAnalytics(data.stats);setChoices(data.options);}},[]);
  const load=useCallback(async()=>applyData(await fetchData()),[fetchData,applyData]);
  useEffect(()=>{let active=true;fetchData().then(data=>{if(active)applyData(data);}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[fetchData,applyData]);
  async function run(work){setBusy(true);setError("");setNotice("");try{await work();}catch(e){setError(e.message);}finally{setBusy(false);}}
  function selectType(value){setEndpoint(value);setPage(1);setEditing(null);setValues({});setRows(null);setError("");}
  function edit(row){
    const data={};
    for(const [name,type] of fieldsFor(endpoint)){
      const value=row[name];
      data[name]=type==="list"?(value||[]).join(", "):type==="datetime-local"&&value?new Date(new Date(value).getTime()-new Date(value).getTimezoneOffset()*60000).toISOString().slice(0,16):value??"";
    }
    setEditing(row.id);setValues(data);
  }
  async function save(){
    const body={};
    for(const [name,type] of fieldsFor(endpoint)){
      const value=values[name];
      if(editing&&type?.startsWith("@"))continue;
      if(type==="checkbox")body[name]=value??true;
      else if(type==="list")body[name]=(value||"").split(",").map(x=>x.trim()).filter(Boolean);
      else if(type==="datetime-local")body[name]=new Date(value).toISOString();
      else if(type==="number")body[name]=Number(value);
      else body[name]=value??"";
    }
    await api("/"+endpoint+"/"+(editing?editing+"/":""),{method:editing?"PATCH":"POST",body});
    setValues({});setEditing(null);setNotice("Saved. New listings require approval before customers can book.");await load();
  }
  async function action(id,name){await api("/"+endpoint+"/"+id+"/"+name+"/",{method:"POST",body:{}});await load();setNotice("Updated successfully.");}
  async function fetchMessages(id,page=1){const data=await api("/conversations/"+id+"/messages/?page_size=100&page="+page);setMessages(data.results.reverse());setMessagePage(page);setMessageNext(Boolean(data.next));}
  async function openThread(booking){const conversation=await api("/conversations/",{method:"POST",body:{booking:booking.id}});setThread(conversation);await fetchMessages(conversation.id);}
  if(!approved)return <main className="mx-auto max-w-xl space-y-5 p-10"><h1 className="text-3xl font-bold">Provider account</h1><p>Complete your provider application and wait for approval before publishing listings.</p><Link to="/account" className={buttonClass}>Go to my account</Link></main>;
  return <main className="mx-auto max-w-6xl space-y-8 px-5 py-10">
    <header><h1 className="text-3xl font-bold">Provider dashboard</h1><p className="mt-2 text-gray-600">Manage your listings, availability and customer bookings.</p></header>
    <Notice error={error}/>{notice&&<p role="status" className="rounded-lg bg-green-50 p-4 text-green-800">{notice}</p>}
    {analytics&&<section className="grid gap-4 sm:grid-cols-3">{[["Confirmed bookings",analytics.confirmed_bookings],["Sales",money(analytics.gross_sales)],["Earnings before payouts",money(analytics.provider_balance_before_payouts)]].map(([label,value])=><div key={label} className="rounded-xl border bg-white p-5"><p className="text-gray-600">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div>)}</section>}
    <section className="space-y-5"><label className="block max-w-md font-bold">Manage listings<select className={fieldClass} value={endpoint} onChange={e=>selectType(e.target.value)}>{Object.entries(forms).map(([key,value])=><option key={key} value={key}>{value.label}</option>)}</select></label>
      <div className="grid gap-6 lg:grid-cols-2"><div className="space-y-3">
        {rows?.count===0&&<p>No listings yet. Add your first listing.</p>}
        {rows?.results.map(row=><article key={row.id} className="space-y-3 rounded-xl border bg-white p-5"><h2 className="font-bold">{row.title||row.name||row.date||new Date(row.departs_at||row.starts_at).toLocaleString()}</h2><p>{row.status||(row.is_active?"Active":"Awaiting approval or inactive")}{row.price!==undefined?" · "+money(row.price):""}{row.quantity_available!==undefined?" · "+row.quantity_available+" available":""}</p><div className="flex flex-wrap gap-4">
          {(endpoint!=="events"||["DRAFT","REJECTED"].includes(row.status))&&<button className="underline" disabled={busy} onClick={()=>edit(row)}>Edit</button>}
          {endpoint==="events"&&["DRAFT","REJECTED"].includes(row.status)&&<><button className="underline" onClick={()=>{setTicketEvent(row);setTicket({name:"",price:"",quantity:""});}}>Add ticket type</button><button disabled={busy} className="underline" onClick={()=>run(()=>action(row.id,"submit"))}>Submit for review</button></>}
          {user.is_staff&&((endpoint==="events"&&row.status==="IN_REVIEW")||(endpoint!=="events"&&forms[endpoint].root&&!row.is_active))&&<button disabled={busy} className="underline" onClick={()=>run(()=>action(row.id,"approve"))}>Approve listing</button>}
          {user.is_staff&&endpoint==="events"&&row.status==="IN_REVIEW"&&<button className="underline" disabled={busy} onClick={()=>run(()=>action(row.id,"reject"))}>Reject</button>}
          {endpoint==="events"&&row.status==="PUBLISHED"&&<button className="text-red-700 underline" disabled={busy} onClick={()=>{if(window.confirm("Cancel "+row.title+" and refund all eligible bookings?"))run(()=>action(row.id,"cancel"));}}>Cancel event and refund bookings</button>}
        </div>{row.ticket_types?.map(t=><p key={t.id} className="text-sm">{t.name}: {money(t.price)} · {t.quantity_available} available</p>)}</article>)}
        {rows&&<div className="flex gap-4"><button disabled={!rows.previous||busy} onClick={()=>setPage(p=>p-1)}>Previous</button><span>Page {page}</span><button disabled={!rows.next||busy} onClick={()=>setPage(p=>p+1)}>Next</button></div>}
      </div><form onSubmit={e=>{e.preventDefault();run(save);}} className="space-y-4 rounded-xl border bg-white p-5"><h2 className="text-xl font-bold">{editing?"Edit listing":"Add listing"}</h2>
        {fieldsFor(endpoint).map(([name,type="text"])=>{const value=values[name]??(type==="checkbox"?true:"");return <label className="block" key={name}>{title(name)}{type==="list"&&" (separated by commas)"}
          {type.startsWith("@")?<select required disabled={!!editing} className={fieldClass} value={value} onChange={e=>setValues({...values,[name]:e.target.value})}><option value="">Choose a listing</option>{choices[name]?.map(row=><option key={row.id} value={row.id}>{row.name||row.title}</option>)}</select>:
          type==="category"?<select required className={fieldClass} value={value} onChange={e=>setValues({...values,[name]:e.target.value})}><option value="">Choose a category</option>{["ATTRACTION","CULTURAL_SITE","ACTIVITY","LOCAL_EXPERIENCE"].map(c=><option key={c}>{c}</option>)}</select>:
          type==="checkbox"?<input className="ml-3" type="checkbox" checked={value} onChange={e=>setValues({...values,[name]:e.target.checked})}/>:
          <input required={!["description","address","allergens","contact_email","contact_phone","amenities","delivery_cities"].includes(name)} type={type==="money"?"number":type==="list"?"text":type} min={type==="money"||type==="number"?0:undefined} step={type==="money"?"0.01":undefined} className={fieldClass} value={value} onChange={e=>setValues({...values,[name]:e.target.value})}/>}
        </label>;})}
        <button disabled={busy} className={buttonClass}>Save</button>{editing&&<button type="button" className="ml-4 underline" onClick={()=>{setEditing(null);setValues({});}}>Cancel editing</button>}
      </form></div>
    </section>
    {endpoint==="room-nights"&&<form className="space-y-4 rounded-xl border bg-white p-5" onSubmit={e=>{e.preventDefault();run(async()=>{await api("/room-nights/availability/",{method:"POST",body:{...nightRange,quantity:Number(nightRange.quantity)}});await load();setNotice("Nightly availability created. Existing dates are preserved.");});}}><h2 className="text-xl font-bold">Add a range of nights</h2><label className="block">Room type<select required className={fieldClass} value={nightRange.room_type} onChange={e=>setNightRange({...nightRange,room_type:e.target.value})}><option value="">Choose a room type</option>{choices.room_type?.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select></label><div className="grid gap-4 md:grid-cols-4">{[["date_from","First night","date"],["date_to","End date (not included)","date"],["price","Price per night","number"],["quantity","Rooms each night","number"]].map(([name,label,type])=><label key={name}>{label}<input required type={type} min={type==="number"?0:undefined} step={name==="price"?"0.01":undefined} className={fieldClass} value={nightRange[name]} onChange={e=>setNightRange({...nightRange,[name]:e.target.value})}/></label>)}</div><button disabled={busy} className={buttonClass}>Add nights</button></form>}
    {ticketEvent&&<form className="space-y-4 rounded-xl border bg-white p-5" onSubmit={e=>{e.preventDefault();run(async()=>{await api("/events/"+ticketEvent.id+"/ticket-types/",{method:"POST",body:ticket});setTicketEvent(null);await load();});}}><h2 className="text-xl font-bold">Add tickets · {ticketEvent.title}</h2>{[["name","text"],["price","number"],["quantity","number"]].map(([name,type])=><label key={name} className="block">{title(name)}<input required type={type} min={name==="quantity"?1:0} step={name==="price"?"0.01":undefined} className={fieldClass} value={ticket[name]} onChange={e=>setTicket({...ticket,[name]:e.target.value})}/></label>)}<button className={buttonClass} disabled={busy}>Save ticket type</button><button type="button" className="ml-4 underline" onClick={()=>setTicketEvent(null)}>Close</button></form>}
    <section className="space-y-4"><h2 className="text-2xl font-bold">Customer bookings</h2>{bookings?.count===0&&<p>No customer bookings yet.</p>}{bookings?.results.map(b=>{const next=b.kind==="FOOD"?{NEW:"ACCEPTED",ACCEPTED:"READY",READY:"IN_PROGRESS",IN_PROGRESS:"COMPLETED"}[b.fulfillment_status]:{NEW:"IN_PROGRESS",IN_PROGRESS:"COMPLETED"}[b.fulfillment_status];return <article key={b.id} className="space-y-3 rounded-xl border bg-white p-5"><h3 className="font-bold">{b.details.title} · {b.status}</h3><p className="break-all text-sm">{b.booking_reference}</p><p>{b.customer_name} · {b.customer_phone}</p><p>{b.details.check_in&&b.details.check_in+" → "+b.details.check_out}{b.details.delivery_method&&" · "+b.details.delivery_method}{b.details.delivery_address&&" · "+b.details.delivery_address}</p><p>{b.customer_note}</p>{b.items.map(i=><p key={i.id}>{i.quantity} × {i.description}</p>)}<p>{money(b.total_amount)} · {b.fulfillment_status.replaceAll("_"," ")}</p><div className="flex flex-wrap gap-3">{b.status==="CONFIRMED"&&next&&<button disabled={busy} className={buttonClass} onClick={()=>run(async()=>{await api("/bookings/"+b.id+"/fulfill/",{method:"POST",body:{status:next}});await load();})}>Mark {next.toLowerCase().replaceAll("_"," ")}</button>}{["PENDING","CONFIRMED"].includes(b.status)&&<button disabled={busy} className="rounded border px-3 py-2" onClick={()=>{if(window.confirm("Decline "+b.booking_reference+"? Paid bookings will enter the refund process."))run(async()=>{await api("/bookings/"+b.id+"/decline/",{method:"POST",body:{}});await load();});}}>Decline and refund</button>}<button className="underline" onClick={()=>run(()=>openThread(b))}>Message customer</button></div></article>;})}{bookings&&<div className="flex gap-4"><button disabled={!bookings.previous||busy} onClick={()=>setBookingPage(p=>p-1)}>Previous</button><span>Page {bookingPage}</span><button disabled={!bookings.next||busy} onClick={()=>setBookingPage(p=>p+1)}>Next</button></div>}</section>
    {thread&&<section className="space-y-4 rounded-xl border bg-white p-5"><h2 className="text-xl font-bold">Customer conversation</h2><button className="underline" onClick={()=>run(()=>fetchMessages(thread.id))}>Refresh messages</button><div className="flex gap-4"><button disabled={!messageNext||busy} onClick={()=>run(()=>fetchMessages(thread.id,messagePage+1))}>Older messages</button><button disabled={messagePage===1||busy} onClick={()=>run(()=>fetchMessages(thread.id,messagePage-1))}>Newer messages</button></div>{messages.map(m=><p key={m.id}><strong>{m.sender===user.id?"You":"Customer"}: </strong>{m.body}</p>)}<form className="flex gap-3" onSubmit={e=>{e.preventDefault();run(async()=>{await api("/conversations/"+thread.id+"/messages/",{method:"POST",body:{body:draft}});await fetchMessages(thread.id);setDraft("");});}}><input required maxLength="4000" aria-label="Message" className={fieldClass} value={draft} onChange={e=>setDraft(e.target.value)}/><button className={buttonClass} disabled={busy}>Send</button></form></section>}
    <form className="space-y-4 rounded-xl border bg-white p-5" onSubmit={e=>{e.preventDefault();run(async()=>{const t=await api("/tickets/check-in/",{method:"POST",body:{token}});setNotice("Admission recorded: "+t.ticket_number);setToken("");});}}><h2 className="text-xl font-bold">Event admission</h2><label className="block">Scan or paste the ticket QR value<input required className={fieldClass} value={token} onChange={e=>setToken(e.target.value)}/></label><button className={buttonClass} disabled={busy}>Check in ticket</button></form>
    {user.is_staff&&<p>Provider verification and review moderation are available in the <a href="/admin/" className="underline">staff administration area</a>.</p>}
  </main>;
}
