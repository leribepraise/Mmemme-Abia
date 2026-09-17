import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, apiPage, money } from "../lib/api";
import { useAuth } from "../components/context/AuthContext";

const services = {
  EVENT: { title:"Events", path:"events", subtitle:"Find your next experience in Abia.", singular:"event" },
  HOTEL: { title:"Hotels", path:"hotels", subtitle:"Reserve rooms for every night of your stay.", singular:"hotel" },
  FOOD: { title:"Food", path:"restaurants", subtitle:"Order from approved local kitchens.", singular:"restaurant" },
  TRANSPORT: { title:"Transport", path:"transport-routes", subtitle:"Book seats on scheduled departures.", singular:"route" },
  TOURISM: { title:"Explore Abia", path:"tourism", subtitle:"Discover places and reserve guided experiences.", singular:"experience" },
};
export const fieldClass="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2";
export const buttonClass="rounded-lg bg-[#3F7D3D] px-5 py-3 font-semibold text-white disabled:opacity-50";
export function Notice({error}) { return error?<p role="alert" className="rounded-lg bg-red-50 p-3 text-red-800">{error}</p>:null; }

export default function Marketplace({kind="EVENT"}) {
  const config=services[kind];
  const [items,setItems]=useState(null);
  const [error,setError]=useState("");
  const [search,setSearch]=useState("");
  const [query,setQuery]=useState("");
  const [page,setPage]=useState(1);
  useEffect(()=>{
    let cancelled=false;
    apiPage("/"+config.path+"/?page="+page+"&search="+encodeURIComponent(query))
      .then(data=>{if(!cancelled){setItems(data);setError("");}})
      .catch(error=>{if(!cancelled)setError(error.message);});
    return()=>{cancelled=true;};
  },[config.path,page,query]);
  return <main className="mx-auto max-w-6xl px-5 py-10 space-y-6">
    <nav className="flex flex-wrap gap-4">{Object.entries(services).map(([key,c])=><Link key={key} className={key===kind?"font-bold text-[#3F7D3D]":"text-gray-600"} to={"/"+c.path}>{c.title}</Link>)}</nav>
    <header><h1 className="text-4xl font-bold">{config.title}</h1><p className="mt-2 text-gray-600">{config.subtitle}</p></header>
    {kind==="EVENT"&&<form onSubmit={e=>{e.preventDefault();setQuery(search);setPage(1);}} className="flex gap-3"><input aria-label="Search events" placeholder="Search events, categories or places" className={fieldClass} value={search} onChange={e=>setSearch(e.target.value)}/><button className={buttonClass}>Search</button></form>}
    <Notice error={error}/>
    {!items&&!error&&<p role="status">Loading…</p>}
    {items?.count===0&&<p className="rounded-2xl border bg-white p-10 text-gray-600">No available listings yet. Please check back soon.</p>}
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{items?.results.map(item=><article key={item.id} className="flex flex-col rounded-2xl border bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-[#3F7D3D]">{item.category||item.city||item.origin||item.location_name}</p>
      <h2 className="mt-2 text-xl font-bold">{item.title||item.name}</h2>
      {item.start_datetime&&<p className="mt-2 text-sm">{new Date(item.start_datetime).toLocaleString()}</p>}
      <p className="mt-3 line-clamp-3 text-gray-600">{item.description||[item.origin,item.destination].filter(Boolean).join(" → ")||item.address}</p>
      <Link className="mt-5 font-semibold text-[#3F7D3D]" to={"/book/"+kind.toLowerCase()+"/"+item.id}>View and book →</Link>
    </article>)}</div>
    {items&&<div className="flex items-center gap-4"><button disabled={!items.previous} onClick={()=>setPage(p=>p-1)} className="rounded border px-4 py-2 disabled:opacity-40">Previous</button><span>Page {page}</span><button disabled={!items.next} onClick={()=>setPage(p=>p+1)} className="rounded border px-4 py-2 disabled:opacity-40">Next</button></div>}
  </main>;
}

async function allPages(path) {
  const results=[];
  for(let page=1;page<=50;page++) {
    const data=await apiPage(path+(path.includes("?")?"&":"?")+"page="+page+"&page_size=100");
    results.push(...data.results);
    if(!data.next)return results;
  }
  throw new Error("Please narrow the selection.");
}
export function ServiceBooking() {
  const params=useParams();
  const kind=params.kind.toUpperCase();
  const config=services[kind];
  const {user}=useAuth();
  const [listing,setListing]=useState(null);
  const [resources,setResources]=useState([]);
  const [rooms,setRooms]=useState([]);
  const [room,setRoom]=useState("");
  const [dates,setDates]=useState({checkIn:"",checkOut:""});
  const [roomCount,setRoomCount]=useState(1);
  const [quantities,setQuantities]=useState({});
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const [booking,setBooking]=useState(null);
  const [details,setDetails]=useState({guests:1,delivery_method:"PICKUP",delivery_address:"",delivery_city:""});
  const [contactOverrides,setContact]=useState({});
  const contact={customer_name:user?[user.first_name,user.last_name].filter(Boolean).join(" "):"",customer_phone:user?.phone||"",customer_note:"",...contactOverrides};
  const key=useRef({payload:"",key:""});
  useEffect(()=>{
    if(!config)return;
    let cancelled=false;
    (async()=>{
      try{
        const item=await api("/"+config.path+"/"+params.id+"/");
        let stock=[];
        if(kind==="EVENT")stock=item.ticket_types.filter(t=>t.is_active);
        if(kind==="FOOD")stock=await allPages("/menu-items/?restaurant="+item.id);
        if(kind==="TRANSPORT")stock=await allPages("/departures/?route="+item.id);
        if(kind==="TOURISM"){
          const packages=await allPages("/tour-packages/?experience="+item.id);
          const departures=await Promise.all(packages.map(p=>allPages("/tour-departures/?package="+p.id).then(rows=>rows.map(r=>({...r,name:p.name})))));
          stock=departures.flat();
        }
        if(kind==="HOTEL"){
          const types=await allPages("/room-types/?hotel="+item.id);
          if(!cancelled)setRooms(types);
        }
        if(!cancelled){setListing(item);setResources(stock);}
      }catch(error){if(!cancelled)setError(error.message);}
    })();
    return()=>{cancelled=true;};
  },[config,kind,params.id]);
  async function findRooms(){
    setError("");setResources([]);setQuantities({});
    if(!room||!dates.checkIn||!dates.checkOut||dates.checkOut<=dates.checkIn){setError("Choose a room type and valid check-in and check-out dates.");return;}
    const days=Math.round((Date.parse(dates.checkOut)-Date.parse(dates.checkIn))/86400000);
    if(days>30){setError("Book up to 30 nights at a time.");return;}
    setBusy(true);
    try{
      const stock=await allPages("/room-nights/?room_type="+room+"&date_from="+dates.checkIn+"&date_to="+dates.checkOut);
      if(stock.length!==days)throw new Error("This room is not available for every night of your stay.");
      if(stock.some(r=>r.quantity_available<roomCount))throw new Error("There are not enough rooms for these dates.");
      setResources(stock);setQuantities(Object.fromEntries(stock.map(r=>[r.id,roomCount])));
    }catch(error){setError(error.message);}finally{setBusy(false);}
  }
  async function reserve(event){
    event.preventDefault();setError("");
    if(!user){setError("Please log in to book.");return;}
    const items=resources.filter(r=>Number(quantities[r.id])>0).map(r=>({id:r.id,quantity:Number(quantities[r.id])}));
    if(!items.length){setError("Select at least one item.");return;}
    const request={kind,items,...contact,details:kind==="HOTEL"?{guests:Number(details.guests)}:kind==="FOOD"?{delivery_method:details.delivery_method,...(details.delivery_method==="DELIVERY"?{delivery_address:details.delivery_address,delivery_city:details.delivery_city}:{})}:{}};
    const payload=JSON.stringify(request);
    if(key.current.payload!==payload)key.current={payload,key:crypto.randomUUID()};
    setBusy(true);
    try{setBooking(await api("/bookings/",{method:"POST",body:request,key:key.current.key}));}
    catch(error){setError(error.message);}finally{setBusy(false);}
  }
  async function pay(){
    setBusy(true);setError("");
    try{
      const payment=await api("/payments/initialize/",{method:"POST",body:{booking:booking.id}});
      window.location.assign(payment.authorization_url);
    }catch(error){setError(error.message);setBusy(false);}
  }
  const total=resources.reduce((sum,r)=>sum+Number(r.price)*Number(quantities[r.id]||0),0)+(kind==="FOOD"&&details.delivery_method==="DELIVERY"?Number(listing?.delivery_fee||0):0);
  if(!config)return <main className="p-8">Listing not found.</main>;
  return <main className="mx-auto max-w-3xl space-y-6 px-5 py-10">
    <Link to={"/"+config.path} className="text-[#3F7D3D]">← {config.title}</Link>
    <Notice error={error}/>
    {!listing?<p>Loading listing…</p>:<>
      <h1 className="text-3xl font-bold">{listing.title||listing.name}</h1>
      <p className="text-gray-600">{listing.description}</p><p>{listing.address||listing.pickup_address}</p>
      {kind==="EVENT"&&user&&<button className="rounded-lg border px-4 py-2" onClick={()=>api("/saved-events/",{method:"POST",body:{event:listing.id}}).then(()=>setError("")).catch(e=>setError(e.message))}>Save event</button>}
      {booking?<section className="space-y-4 rounded-2xl border bg-white p-6">
        <h2 className="text-xl font-bold">{booking.status==="CONFIRMED"?"Booking confirmed":"Reservation created"}</h2>
        <p>Reference: {booking.booking_reference}</p><p>Total: <strong>{money(booking.total_amount)}</strong></p>
        {booking.status==="PENDING"&&<><p>Reserved until {new Date(booking.expires_at).toLocaleTimeString()}. Complete payment before this time.</p><button disabled={busy} className={buttonClass} onClick={pay}>{busy?"Opening checkout…":"Pay securely with Paystack"}</button></>}
        <Link className="block text-[#3F7D3D]" to="/account">View my bookings</Link>
      </section>:<form onSubmit={reserve} className="space-y-5 rounded-2xl border bg-white p-6">
        {kind==="HOTEL"&&<fieldset disabled={busy} className="grid gap-3 sm:grid-cols-2">
          <label>Room type<select className={fieldClass} value={room} onChange={e=>{setRoom(e.target.value);setResources([]);setQuantities({});}}><option value="">Choose a room</option>{rooms.map(r=><option key={r.id} value={r.id}>{r.name} · up to {r.max_guests} guests per room</option>)}</select></label>
          <label>Rooms<input className={fieldClass} type="number" min="1" max="20" value={roomCount} onChange={e=>{setRoomCount(Number(e.target.value));setResources([]);setQuantities({});}}/></label>
          <label>Check-in<input className={fieldClass} type="date" value={dates.checkIn} onChange={e=>{setDates({...dates,checkIn:e.target.value});setResources([]);setQuantities({});}}/></label>
          <label>Check-out<input className={fieldClass} type="date" value={dates.checkOut} onChange={e=>{setDates({...dates,checkOut:e.target.value});setResources([]);setQuantities({});}}/></label>
          <label>Guests<input className={fieldClass} type="number" min="1" max="100" value={details.guests} onChange={e=>setDetails({...details,guests:e.target.value})}/></label>
          <button type="button" disabled={busy} className={buttonClass} onClick={findRooms}>Check availability</button>
        </fieldset>}
        {resources.map(r=><div key={r.id} className="flex items-center justify-between gap-4 border-b pb-3">
          <div><p className="font-semibold">{r.name||r.date||r.vehicle||"Departure"}</p>{(r.departs_at||r.starts_at)&&<p className="text-sm">{new Date(r.departs_at||r.starts_at).toLocaleString()}</p>}<p>{money(r.price)} · {r.quantity_available} available</p>{r.allergens&&<p className="text-sm">Allergens: {r.allergens}</p>}</div>
          <input aria-label={"Quantity for "+(r.name||r.date||r.vehicle||r.id)} className="w-20 rounded-lg border p-2" type="number" min="0" max={Math.min(20,r.quantity_available)} disabled={kind==="HOTEL"} value={quantities[r.id]||0} onChange={e=>setQuantities(["TRANSPORT","TOURISM"].includes(kind)?{[r.id]:e.target.value}:{...quantities,[r.id]:e.target.value})}/>
        </div>)}
        {kind!=="HOTEL"&&!resources.length&&<p>No bookable availability at the moment.</p>}
        {kind==="FOOD"&&<section className="space-y-3">
          <label>Collection<select className={fieldClass} value={details.delivery_method} onChange={e=>setDetails({...details,delivery_method:e.target.value})}><option value="PICKUP">Pick up at restaurant</option>{listing.offers_delivery&&<option value="DELIVERY">Delivery · {money(listing.delivery_fee)}</option>}</select></label>
          {details.delivery_method==="DELIVERY"&&<><label>Delivery city<select required className={fieldClass} value={details.delivery_city} onChange={e=>setDetails({...details,delivery_city:e.target.value})}><option value="">Choose city</option>{listing.delivery_cities.map(city=><option key={city}>{city}</option>)}</select></label><label>Delivery address<input required className={fieldClass} value={details.delivery_address} onChange={e=>setDetails({...details,delivery_address:e.target.value})}/></label></>}
        </section>}
        <label className="block">Contact name<input required className={fieldClass} value={contact.customer_name} onChange={e=>setContact({...contact,customer_name:e.target.value})}/></label>
        <label className="block">Phone<input required type="tel" className={fieldClass} value={contact.customer_phone} onChange={e=>setContact({...contact,customer_phone:e.target.value})}/></label>
        <label className="block">Notes<textarea maxLength="500" className={fieldClass} value={contact.customer_note} onChange={e=>setContact({...contact,customer_note:e.target.value})}/></label>
        <p className="text-lg font-bold">Estimated total: {money(total)}</p>
        <p className="text-sm text-gray-600">Full refund before the service starts. Food orders can only be cancelled before the restaurant accepts them. Hotel cancellation closes on the check-in date. Your reservation is held for 15 minutes.</p>
        {!user?<Link className={buttonClass} to="/login" state={{from:{pathname:"/book/"+kind.toLowerCase()+"/"+params.id}}}>Log in to book</Link>:!user.email_verified?<Link className="text-[#3F7D3D]" to="/account">Verify your email before booking</Link>:<button disabled={busy||!resources.length} className={buttonClass}>{busy?"Reserving…":"Reserve and review total"}</button>}
      </form>}
    </>}
  </main>;
}
