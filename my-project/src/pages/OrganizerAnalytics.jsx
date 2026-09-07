import { ArrowRight, Banknote, ChevronDown, Eye, Percent, Ticket } from "lucide-react";
import OrganizerShell from "@/components/organizer/OrganizerShell";
import OrganizerStatCard from "@/components/organizer/OrganizerStatCard";
import { naira } from "@/lib/utils";

const TOP_EVENTS = [
  { title: "Shane Bangs Live Concert", date: "Sat, 25 Oct, 2026", loc: "Umuahia Sports Arena, Umuahia", tix: 450, rev: naira(9450000), image: "/Event Thumbnail.png" },
  { title: "Abia Cultural Festival", date: "Sat, 31 Oct, 2026", loc: "Ohafia Township Stadium", tix: 320, rev: naira(6720000), image: "/Event Thumbnail-1.png" },
  { title: "Abia Food & Drink Carnival", date: "Sat, 08 Nov, 2026", loc: "Arochukwu Park, Arochukwu", tix: 210, rev: naira(3360000), image: "/Event Thumbnail-2.png" },
  { title: "Abia Business Summit 2026", date: "Wed, 25 Nov, 2026", loc: "Aba Convention Center, Aba", tix: 180, rev: naira(3050000), image: "/Event Thumbnail-3.png" },
];

const CATEGORY_BREAKDOWN = [
  { label: "Music", color: "bg-[#F36B25]", pct: "45%", val: "(560)" },
  { label: "Cultural", color: "bg-[#3F7D3D]", pct: "35%", val: "(310)" },
  { label: "Food & Drink", color: "bg-[#4ade80]", pct: "15%", val: "(190)" },
  { label: "Business", color: "bg-[#3b82f6]", pct: "10%", val: "(125)" },
  { label: "Others", color: "bg-gray-300", pct: "5%", val: "(60)" },
];

const TRAFFIC_SOURCES = [
  { label: "Social Media", pct: "42%", width: "42%", color: "bg-green-700" },
  { label: "Direct", pct: "28%", width: "28%", color: "bg-[#F36B25]" },
  { label: "Search Engines", pct: "18%", width: "18%", color: "bg-[#3F7D3D]" },
  { label: "Email Campaigns", pct: "8%", width: "8%", color: "bg-blue-400" },
  { label: "Others", pct: "4%", width: "4%", color: "bg-gray-300" },
];

export default function OrganizerAnalytics() {
  return (
    <OrganizerShell
      breadcrumb={["Home", "Organizer", "Analytics"]}
      title="Analytics Overview"
      subtitle="Track your event performance and growth."
      actions={
        <>
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50" data-testid="select-analytics-period">
            This Month <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={() => window.alert("Report prepared for download.")}
            className="bg-[#3F7D3D] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-[#336633] transition-colors"
            data-testid="button-export-report"
          >
            Export Report
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <OrganizerStatCard title="Total Views" value="12,845" trend="+12.5%" icon={Eye} />
        <OrganizerStatCard title="Tickets Sold" value="1,245" trend="+23.7%" icon={Ticket} />
        <OrganizerStatCard title="Revenue" value={naira(24560000)} trend="+26.4%" icon={Banknote} />
        <OrganizerStatCard title="Conversion Rate" value="3.62%" trend="+0.8%" icon={Percent} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h2 className="font-bold text-lg text-black">Overview</h2>
          <div className="flex items-center gap-6 text-xs font-bold text-gray-500">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-400"></div>Views</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-400"></div>Tickets Sold</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-700"></div>Revenue (N)</div>
          </div>
        </div>
        <div className="w-full h-64 relative border-l border-b border-gray-100">
          <div className="absolute -left-8 top-0 h-full flex flex-col justify-between text-[10px] font-bold text-gray-400 pb-6">
            <span>10K</span><span>8K</span><span>6K</span><span>4K</span><span>2K</span><span>0</span>
          </div>
          <div className="absolute -bottom-6 left-0 w-full flex justify-between text-[10px] font-bold text-gray-400 px-4">
            <span>May 1</span><span>May 8</span><span>May 15</span><span>May 22</span><span>May 29</span>
          </div>
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="w-full h-px bg-gray-50"></div>)}
          </div>
          <svg className="w-full h-full absolute inset-0" viewBox="0 0 1000 200" preserveAspectRatio="none">
            <path d="M0,120 Q150,80 300,70 T600,120 T900,60 L1000,80" fill="none" stroke="#4ade80" strokeWidth="3" />
            <path d="M0,120 Q150,80 300,70 T600,120 T900,60 L1000,80 L1000,200 L0,200 Z" fill="url(#grad-green)" opacity="0.2" />
            <path d="M0,160 Q150,120 300,100 T600,130 T900,90 L1000,110" fill="none" stroke="#fb923c" strokeWidth="3" />
            <path d="M0,180 Q150,170 300,160 T600,175 T900,150 L1000,165" fill="none" stroke="#15803d" strokeWidth="3" />
            <circle cx="300" cy="70" r="4" fill="white" stroke="#4ade80" strokeWidth="2" />
            <circle cx="600" cy="120" r="4" fill="white" stroke="#4ade80" strokeWidth="2" />
            <circle cx="900" cy="60" r="4" fill="white" stroke="#4ade80" strokeWidth="2" />
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
          <button className="mt-6 flex items-center gap-1.5 text-sm font-bold text-[#3F7D3D] hover:underline" data-testid="link-analytics-events">
            View all events <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-base text-black mb-6">Tickets by Category</h2>
            <div className="flex items-center gap-6">
              <div
                className="relative w-28 h-28 shrink-0 rounded-full flex items-center justify-center"
                style={{ background: "conic-gradient(#F36B25 0% 45%, #3F7D3D 45% 80%, #4ade80 80% 90%, #3b82f6 90% 98%, #d1d5db 98% 100%)" }}
              >
                <div className="w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center">
                  <span className="font-black text-lg text-black leading-none">1,245</span>
                  <span className="text-[8px] font-bold text-gray-400 mt-1 uppercase">Total Tickets</span>
                </div>
              </div>
              <div className="flex-1 space-y-2.5">
                {CATEGORY_BREAKDOWN.map((stat, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${stat.color}`}></div>
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
          <button className="bg-[#F36B25] hover:bg-[#d95d1d] text-white text-sm font-bold py-2.5 px-6 rounded-lg transition-colors shadow-sm" data-testid="button-boost-event">
            Boost Event
          </button>
        </div>
      </div>
    </OrganizerShell>
  );
}
