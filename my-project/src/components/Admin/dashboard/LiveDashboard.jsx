import { useState } from 'react';
import { Users, Ticket, Wallet, ShieldCheck, CalendarDays, UserCog, Clock } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { money } from '@/lib/api';
import { RequestState } from '../LiveManagement';
import WelcomeBar from './WelcomeBar';
import StatsGrid from './StatsGrid';
import PlatformActivity from './PlatformActivity';
import TopCategories from './TopCategories';
import QuickActions from './QuickActions';
import RecentActivities from './RecentActivities';

export default function LiveDashboard() {
  const [range,setRange]=useState('30');
  const request=useApi(`/admin/overview/?days=${range}`);
  const data=request.data;
  const actions=[{label:'Review Events',to:'/admin/events?status=IN_REVIEW',icon:CalendarDays,tint:'bg-orange-50 text-orange-600'},{label:'Review Organizers',to:'/admin/organizers?status=PENDING',icon:ShieldCheck,tint:'bg-green-50 text-green-700'},{label:'Manage Users',to:'/admin/users',icon:UserCog,tint:'bg-blue-50 text-blue-600'}];
  const series=data?Object.fromEntries(Object.entries(data.activity).filter(([,values])=>values!==null).map(([key,values])=>[key,{label:key==='revenue'?'Payments':key[0].toUpperCase()+key.slice(1),prefix:key==='revenue'?'₦':'',values:values.map(Number)}])):{};
  const total=data?.categories.reduce((n,c)=>n+c.value,0)||0;
  const colors=['#15803d','#2563eb','#0d9488','#ea580c','#84cc16','#f59e0b','#cbd5e1'];
  return <div className="space-y-5"><WelcomeBar range={range} onRangeChange={setRange}/><RequestState request={request}/>{data&&<>
    <StatsGrid stats={[{id:'users',label:'Total Users',value:data.users,icon:Users},{id:'bookings',label:'Total Bookings',value:data.bookings??'Restricted',icon:Ticket},{id:'revenue',label:'Successful Payments (NGN)',value:data.gross_payments===null?'Restricted':money(data.gross_payments),icon:Wallet},{id:'organizers',label:'Active Organizers',value:data.active_organizers,icon:ShieldCheck}]}/>
    <div className="grid gap-4 lg:grid-cols-3"><div className="lg:col-span-2"><PlatformActivity key={Object.keys(series).join(',')} labels={data.labels.map((v,i)=>i%Math.max(1,Math.ceil(data.labels.length/7))===0?new Date(v).toLocaleDateString('en-NG',{month:'short',day:'numeric'}):'')} series={series}/></div>{total?<TopCategories categories={data.categories.map((c,i)=>({name:c.category,value:Math.round(c.value/total*100),color:colors[i]}))}/>:<section className="rounded-xl bg-white p-5"><h2 className="font-semibold">Top Categories</h2><p className="mt-5 text-sm text-slate-500">No events yet.</p></section>}</div>
    <QuickActions actions={actions}/>
    {data.recent_activity.length?<RecentActivities activities={data.recent_activity.map(a=>({id:a.id,title:a.action.replaceAll('.',' ').replaceAll('_',' '),description:`Record ${a.target}`,time:new Date(a.created_at).toLocaleString(),icon:Clock,tint:'bg-green-50 text-green-700'}))}/>:<p className="rounded-xl bg-white p-5 text-sm text-slate-500">No activity available to display.</p>}
  </>}</div>;
}
