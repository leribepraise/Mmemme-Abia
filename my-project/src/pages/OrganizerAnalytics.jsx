import { useOrganizerStats } from '@/hooks/useOrganizerStats';
import { downloadJSON } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowRight, Banknote, ChevronDown, Eye, Percent, Ticket } from "lucide-react";
import OrganizerShell from "@/components/organizer/OrganizerShell";
import OrganizerStatCard from "@/components/organizer/OrganizerStatCard";
import { naira } from "@/lib/utils";

export default function OrganizerAnalytics() {
  const stats = useOrganizerStats();
  const navigate = useNavigate();
  const colors = ['#F36B25', '#3F7D3D', '#4ade80', '#3b82f6', '#d1d5db'];
  const TOP_EVENTS = [...stats.events].sort((a, b) => b.revenue - a.revenue).slice(0, 4).map(event => ({ ...event, loc: event.location, tix: event.ticketsSold, rev: naira(event.revenue) }));
  const categories = {};
  stats.events.forEach(event => { categories[event.category || 'Other'] = (categories[event.category || 'Other'] || 0) + event.ticketsSold; });
  let position = 0;
  const CATEGORY_BREAKDOWN = Object.entries(categories).map(([label, total], index) => {
    const percent = stats.sold ? total / stats.sold * 100 : 0;
    const start = position; position += percent;
    return { label, color: colors[index % colors.length], pct: `${percent.toFixed(1)}%`, val: `(${total})`, gradient: `${colors[index % colors.length]} ${start}% ${position}%` };
  });
  const TRAFFIC_SOURCES = [{ label: 'Tracking is not configured', pct: 'Unavailable', width: '0%', color: 'bg-green-700' }];
  return (
    <OrganizerShell
      breadcrumb={["Home", "Organizer", "Analytics"]}
      title="Analytics Overview"
      subtitle="Track your event performance and growth."
      actions={
        <>
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50" data-testid="select-analytics-period">
            All Time <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={() => downloadJSON("event-report", { events: stats.events, ticket_sales_last_30_days: stats.days })}
            className="bg-[#3F7D3D] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-[#336633] transition-colors"
            data-testid="button-export-report"
          >
            Export Report
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <OrganizerStatCard title="Total Views" value="Unavailable" trend="" icon={Eye} />
        <OrganizerStatCard title="Tickets Sold" value={stats.sold.toLocaleString()} trend="" icon={Ticket} />
        <OrganizerStatCard title="Revenue" value={naira(stats.revenue)} trend="" icon={Banknote} />
        <OrganizerStatCard title="Conversion Rate" value="Unavailable" trend="" icon={Percent} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h2 className="font-bold text-lg text-black">Last 30 Days (each series scaled to its peak)</h2>
          <div className="flex items-center gap-6 text-xs font-bold text-gray-500">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-400"></div>Views unavailable</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-400"></div>Tickets Sold</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-700"></div>Revenue (N)</div>
          </div>
        </div>
        <div className="w-full h-64 relative border-l border-b border-gray-100">
          <div className="absolute -left-8 top-0 h-full flex flex-col justify-between text-[10px] font-bold text-gray-400 pb-6">
            <span>Peak</span><span>0</span>
          </div>
          <div className="absolute -bottom-6 left-0 w-full flex justify-between text-[10px] font-bold text-gray-400 px-4">
            {[0, 7, 14, 21, 29].map(index => <span key={index}>{stats.days[index].label}</span>)}
          </div>
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="w-full h-px bg-gray-50"></div>)}
          </div>
          <svg className="w-full h-full absolute inset-0" viewBox="0 0 1000 200" preserveAspectRatio="none">
            <path d={stats.points('tickets')} fill="none" stroke="#fb923c" strokeWidth="3" />
            <path d={stats.points('revenue')} fill="none" stroke="#15803d" strokeWidth="3" />
            <defs>
              <linearGradient id="grad-green" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4ade80" stopOpacity="1" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-lg text-black mb-6">Top Performing Events</h2>
          <div className="space-y-6">
            {TOP_EVENTS.map((event, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                    <img src={event.image} alt="Event" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-black mb-0.5">{event.title}</h4>
                    <p className="text-[10px] text-gray-500 font-medium">{event.date}</p>
                    <p className="text-[10px] text-gray-400">{event.loc}</p>
                  </div>
                </div>
                <div className="flex gap-8 text-right">
                  <div><p className="text-[10px] text-gray-400 font-bold mb-1">Tickets</p><p className="font-bold text-sm text-black">{event.tix}</p></div>
                  <div className="w-24"><p className="text-[10px] text-gray-400 font-bold mb-1">Revenue</p><p className="font-bold text-sm text-black">{event.rev}</p></div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate("/organizer/events")} className="mt-6 flex items-center gap-1.5 text-sm font-bold text-[#3F7D3D] hover:underline" data-testid="link-analytics-events">
            View all events <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-base text-black mb-6">Tickets by Category</h2>
            <div className="flex items-center gap-6">
              <div
                className="relative w-28 h-28 shrink-0 rounded-full flex items-center justify-center"
                style={{ background: stats.sold ? `conic-gradient(${CATEGORY_BREAKDOWN.map(row => row.gradient).join(",")})` : "#d1d5db" }}
              >
                <div className="w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center">
                  <span className="font-black text-lg text-black leading-none">{stats.sold.toLocaleString()}</span>
                  <span className="text-[8px] font-bold text-gray-400 mt-1 uppercase">Total Tickets</span>
                </div>
              </div>
              <div className="flex-1 space-y-2.5">
                {CATEGORY_BREAKDOWN.map((stat, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stat.color }}></div>
                      <span className="font-bold text-gray-600">{stat.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-black mr-1">{stat.pct}</span>
                      <span className="text-[10px] text-gray-400">{stat.val}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-base text-black mb-6">Traffic Sources</h2>
            <div className="space-y-4">
              {TRAFFIC_SOURCES.map((source, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-gray-700">{source.label}</span>
                    <span className="text-gray-400">{source.pct}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full ${source.color} rounded-full`} style={{ width: source.width }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#EAF5EA] rounded-2xl p-6 border border-[#c4e5c4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg text-black mb-1">Grow Your Events</h3>
          <p className="text-sm font-medium text-gray-600 mb-4">Promote your events to a wider audience and increase ticket sales.</p>
          <button onClick={() => toast("Event promotion is not available yet.")} className="bg-[#F36B25] hover:bg-[#d95d1d] text-white text-sm font-bold py-2.5 px-6 rounded-lg transition-colors shadow-sm" data-testid="button-boost-event">
            Boost Event
          </button>
        </div>
      </div>
    </OrganizerShell>
  );
}