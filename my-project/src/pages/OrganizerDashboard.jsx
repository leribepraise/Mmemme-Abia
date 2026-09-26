import { useOrganizerStats } from '@/hooks/useOrganizerStats';
import { useCollection } from "@/hooks/useApi";
import { organizerEvent } from "@/lib/catalog";
import { api } from "@/lib/api";
import { useAuth } from "@/components/context/AuthContext";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { ArrowRight, Banknote, CalendarDays, FilePlus2, Ticket, TrendingUp, Users, Zap } from "lucide-react";
import OrganizerShell from "@/components/organizer/OrganizerShell";
import OrganizerStatCard from "@/components/organizer/OrganizerStatCard";
import OrganizerEventRow, { OrganizerEventTableHeader } from "@/components/organizer/OrganizerEventRow";
import { seedEvents, seedOrganizer } from "@/data/organizerData";
import { naira, load } from "@/lib/utils";

export default function OrganizerDashboard() {
  const stats = useOrganizerStats();
  const events = stats.events;
  const { user } = useAuth();
  const organizer = { name: user.fullName };
  const totalSold = events.reduce((sum, e) => sum + e.ticketsSold, 0);
  const totalRevenue = events.reduce((sum, e) => sum + e.revenue, 0);
  const topEvent = [...events].sort((a, b) => b.ticketsSold - a.ticketsSold)[0];

  return (
    <OrganizerShell
      greeting={organizer.name}
      subtitle="Here's what's happening with your events."
      actions={
        <Link
          to="/organizer/events/new"
          className="bg-[#F36B25] hover:bg-[#d95d1d] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
          data-testid="button-header-create-event"
        >
          <FilePlus2 className="w-4 h-4" /> Create Event
        </Link>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <OrganizerStatCard title="Total Events" value={String(events.length)} trend="" icon={CalendarDays} />
        <OrganizerStatCard title="Tickets Sold" value={totalSold.toLocaleString()} trend="" icon={Ticket} />
        <OrganizerStatCard title="Total Revenue" value={naira(totalRevenue)} trend="" icon={Banknote} />
        <OrganizerStatCard title="Total Attendees" value={String(totalSold)} trend="" icon={Users} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-black">Recent Events</h2>
            <div className=""><Link to="/organizer/events" className="flex items-center gap-1.5 text-sm font-bold text-[#3F7D3D] hover:underline" data-testid="link-view-all-events">
              View all events <ArrowRight className="w-4 h-4" />
            </Link></div>
          </div>
          <OrganizerEventTableHeader />
          <div>
            {events.slice(0, 4).map(event => <OrganizerEventRow key={event.id} event={event} />)}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base text-black">Last 30 Days: Ticket Sales</h2>
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-center gap-4 text-[11px] font-bold text-gray-500 mb-3">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400" />Tickets</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-400" />Revenue</span>
            </div>
            <div className="w-full h-24 relative">
              <div className="absolute -left-1 top-0 h-full flex flex-col justify-between text-[9px] font-bold text-gray-300">
                <span>Peak</span><span>0</span>
              </div>
              <svg className="w-full h-full pl-5" viewBox="0 0 300 100" preserveAspectRatio="none">
                <path d={stats.points("tickets", 300, 100)} fill="none" stroke="#4ade80" strokeWidth="3" />
                <path d={stats.points("revenue", 300, 100)} fill="none" stroke="#fb923c" strokeWidth="2.5" />
              </svg>
            </div>
            <div className="flex items-center justify-between text-[9px] font-bold text-gray-300 pl-5 mt-1">
              {[0, 7, 14, 21, 29].map(index => <span key={index}>{stats.days[index].label}</span>)}
            </div>
            <Link to="/organizer/analytics" className="mt-4 flex items-center justify-center gap-1.5 text-sm font-bold text-[#3F7D3D] hover:underline" data-testid="link-view-analytics">
              View full analytics <ArrowRight className="w-4 h-4" />
            </Link>

            <div>
              <hr/>
            </div>

            {topEvent && (
            <div className="">
              <h2 className="font-bold text-base text-black mb-3">Top Performing Event</h2>
              <p className="font-bold text-sm text-black mb-1">{topEvent.title}</p>
              <p className="text-xs text-gray-500 font-medium">{topEvent.ticketsSold} Tickets Sold</p>
              <p className="text-xs text-gray-500 font-medium mb-3">{naira(topEvent.revenue)} Revenue</p>
              <Link
                to={`/organizer/events/${topEvent.id}/preview`}
                className="flex items-center gap-1.5 text-sm font-bold text-[#3F7D3D] hover:underline"
                data-testid="link-top-event-details"
              >
                View details <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
          </div>

          

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base text-black">Quick Actions</h2>
              <Zap className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex  gap-2">
              <Link to="/organizer/events/new" className="flex items-center gap-2 bg-[#EAF5EA] text-[#3F7D3D] rounded-lg px-3.5 py-2 text-xs font-bold hover:bg-[#dcefdc]" data-testid="button-quick-add-event">
                <FilePlus2 className="w-3.5 h-3.5" /> Add New Event
              </Link>
              <Link to="/organizer/ticket-sales" className="flex items-center gap-2 bg-[#EAF5EA] text-[#3F7D3D] rounded-lg px-3.5 py-2 text-xs font-bold hover:bg-[#dcefdc]" data-testid="button-quick-tickets">
                <Ticket className="w-3.5 h-3.5" /> Manage Tickets
              </Link>
            </div>
          </div>
        </div>
      </div>
    </OrganizerShell>
  );
}
