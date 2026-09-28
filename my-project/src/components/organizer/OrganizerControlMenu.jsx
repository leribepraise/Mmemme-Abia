import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { navItems } from './layout/navItems';

export default function OrganizerControlMenu({ mobileOnly = false }) {
  const [open,setOpen]=useState(false);
  const {pathname}=useLocation();
  useEffect(()=>setOpen(false),[pathname]);
  return <div className={mobileOnly?'lg:hidden':''}><Sheet open={open} onOpenChange={setOpen}><SheetTrigger aria-label="Open organizer control panel" className="flex min-h-11 items-center gap-2 rounded-lg border border-[#3F7D3D] bg-white px-4 py-2 text-sm font-bold text-[#3F7D3D]"><Menu size={20}/>Organizer controls</SheetTrigger><SheetContent side="left" className="z-[70] overflow-y-auto bg-white"><SheetHeader><SheetTitle>Organizer control panel</SheetTitle><SheetDescription>Manage your events, tickets and earnings.</SheetDescription></SheetHeader><nav aria-label="Organizer controls" className="space-y-2 px-4 pb-6">{navItems.map(({href,label,icon:Icon})=><NavLink key={href} to={href} end={href==='/organizer/events'} onClick={()=>setOpen(false)} className={({isActive})=>`flex min-h-11 items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold ${isActive?'bg-[#3F7D3D] text-white':'text-gray-800 hover:bg-green-50'}`}><Icon size={18}/>{label}</NavLink>)}<NavLink to="/profile" onClick={()=>setOpen(false)} className="block rounded-lg border px-4 py-3 text-sm">My account</NavLink><NavLink to="/" onClick={()=>setOpen(false)} className="block px-4 py-3 text-sm">Back to website</NavLink></nav></SheetContent></Sheet></div>;
}
