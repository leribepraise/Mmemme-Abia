import React from "react";
import {
  Home,
  Calendar,
  PlusSquare,
  FileText,
  Ticket,
  Users,
  MessageSquare,
  BarChart2,
  CreditCard,
  Settings,
  LogOut,
  TrendingUp,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

export default function AnalyticsDashboard() {
  // Reusable Sidebar Item
  const NavItem = ({ icon: Icon, label, active = false, badge = null }) => (
    <button
      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-bold transition-colors ${
        active
          ? "bg-[#48782E] text-white"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={`w-5 h-5 ${active ? "text-white" : "text-gray-400"}`}
        />
        <span>{label}</span>
      </div>
      {badge && (
        <span className="bg-[#F36B25] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );

  // Reusable KPI Card
  const KPICard = ({ title, value, trend, isPositive }) => (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="text-sm font-bold text-gray-500 mb-2">{title}</h3>
      <p className="text-2xl font-black text-gray-900 mb-3">{value}</p>
      <div className="flex items-center gap-1.5 text-xs font-bold">
        <TrendingUp
          className={`w-3.5 h-3.5 ${isPositive ? "text-green-500" : "text-red-500"}`}
        />
        <span className={isPositive ? "text-green-500" : "text-red-500"}>
          {trend}
        </span>
        <span className="text-gray-400 font-medium">from last month</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 flex font-sans text-gray-800">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col h-screen sticky top-0 shrink-0">
        <div className="p-6">
          <h2 className="text-xs font-black text-gray-900 tracking-widest uppercase mb-6">
            Organizer
          </h2>
          <nav className="space-y-1">
            <NavItem icon={Home} label="Dashboard" />
            <NavItem icon={Calendar} label="My Events" />
            <NavItem icon={PlusSquare} label="Create Event" />
            <NavItem icon={FileText} label="Drafts" />
            <NavItem icon={Ticket} label="Tickets Sales" />
            <NavItem icon={Users} label="Attendees" />
            <NavItem icon={MessageSquare} label="Messages" badge="2" />
            <NavItem icon={BarChart2} label="Analytics" active={true} />
            <NavItem icon={CreditCard} label="Payouts" />
            <NavItem icon={Settings} label="Settings" />
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-gray-50">
          <button className="flex items-center gap-3 text-red-500 hover:text-red-600 font-bold text-sm transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
            <div>
              <div className="text-xs text-gray-400 mb-2 flex gap-2">
                <span>Home</span> &gt; <span>Organizer</span> &gt;{" "}
                <span className="text-gray-800 font-semibold">Analytics</span>
              </div>
              <h1 className="text-2xl font-extrabold text-black">
                Analytics Overview
              </h1>
              <p className="text-sm text-gray-500 font-medium mt-1">
                Track your event performance and growth.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50">
                This Month <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              <button className="bg-[#48782E] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-[#3a6125] transition-colors">
                Export Report
              </button>
            </div>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Total Views"
              value="12,845"
              trend="↗ + 12.5%"
              isPositive={true}
            />
            <KPICard
              title="Tickets Sold"
              value="1,245"
              trend="↗ + 23.7%"
              isPositive={true}
            />
            <KPICard
              title="Revenue"
              value="N24,560,000"
              trend="↗ + 26.4%"
              isPositive={true}
            />
            <KPICard
              title="Conversion Rate"
              value="3.62%"
              trend="↗ + 0.8%"
              isPositive={true}
            />
          </div>

          {/* Main Chart Section (Visual Mockup) */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <h2 className="font-bold text-lg text-black">Overview</h2>
              <div className="flex items-center gap-6 text-xs font-bold text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>Views
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                  Tickets Sold
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-700"></div>
                  Revenue (N)
                </div>
              </div>
              <div className="flex bg-gray-50 rounded-lg p-1 border border-gray-100">
                <button className="px-4 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 rounded-md">
                  Daily
                </button>
                <button className="px-4 py-1.5 text-xs font-bold text-black bg-white shadow-sm rounded-md">
                  Weekly
                </button>
                <button className="px-4 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 rounded-md">
                  Monthly
                </button>
              </div>
            </div>

            {/* Fake SVG Chart */}
            <div className="w-full h-64 relative border-l border-b border-gray-100">
              {/* Y-Axis Labels */}
              <div className="absolute -left-8 top-0 h-full flex flex-col justify-between text-[10px] font-bold text-gray-400 pb-6">
                <span>10K</span>
                <span>8K</span>
                <span>6K</span>
                <span>4K</span>
                <span>2K</span>
                <span>0</span>
              </div>
              {/* X-Axis Labels */}
              <div className="absolute -bottom-6 left-0 w-full flex justify-between text-[10px] font-bold text-gray-400 px-4">
                <span>May 1</span>
                <span>May 8</span>
                <span>May 15</span>
                <span>May 22</span>
                <span>May 29</span>
              </div>

              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="w-full h-px bg-gray-50"></div>
                ))}
              </div>

              {/* Fake Lines using SVG */}
              <svg
                className="w-full h-full absolute inset-0 preserve-3d"
                viewBox="0 0 1000 200"
                preserveAspectRatio="none"
              >
                {/* Views (Light Green) */}
                <path
                  d="M0,120 Q150,80 300,70 T600,120 T900,60 L1000,80"
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="3"
                />
                <path
                  d="M0,120 Q150,80 300,70 T600,120 T900,60 L1000,80 L1000,200 L0,200 Z"
                  fill="url(#grad-green)"
                  opacity="0.2"
                />

                {/* Tickets Sold (Orange) */}
                <path
                  d="M0,160 Q150,120 300,100 T600,130 T900,90 L1000,110"
                  fill="none"
                  stroke="#fb923c"
                  strokeWidth="3"
                />

                {/* Revenue (Dark Green) */}
                <path
                  d="M0,180 Q150,170 300,160 T600,175 T900,150 L1000,165"
                  fill="none"
                  stroke="#15803d"
                  strokeWidth="3"
                />

                {/* Data Points */}
                <circle
                  cx="300"
                  cy="70"
                  r="4"
                  fill="white"
                  stroke="#4ade80"
                  strokeWidth="2"
                />
                <circle
                  cx="600"
                  cy="120"
                  r="4"
                  fill="white"
                  stroke="#4ade80"
                  strokeWidth="2"
                />
                <circle
                  cx="900"
                  cy="60"
                  r="4"
                  fill="white"
                  stroke="#4ade80"
                  strokeWidth="2"
                />

                <defs>
                  <linearGradient
                    id="grad-green"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#4ade80" stopOpacity="1" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Performing Events */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-lg text-black mb-6">
                Top Performing Events
              </h2>

              <div className="space-y-6">
                {[
                  {
                    title: "Shane Bangs Live Concert",
                    date: "Sat, 25 Oct, 2026",
                    loc: "Umuahia Sports Arena, Umuahia",
                    tix: 450,
                    rev: "N9,450,000",
                    image: "Event Thumbnail.png",
                  },
                  {
                    title: "Abia Cultural Festival",
                    date: "Sat, 31 Oct, 2026",
                    loc: "Ohafia Township Stadium",
                    tix: 320,
                    rev: "N6,720,000",
                    image: "Event Thumbnail-1.png",
                  },
                  {
                    title: "Abia Food & Drink Carnival",
                    date: "Sat, 08 Nov, 2026",
                    loc: "Arochukwu Park, Arochukwu",
                    tix: 210,
                    rev: "N3,360,000",
                    image: "Event Thumbnail-2.png",
                  },
                  {
                    title: "Abia Business Summit 2026",
                    date: "Wed, 25 Nov, 2026",
                    loc: "Aba Convention Center, Aba",
                    tix: 180,
                    rev: "N3,050,000",
                    image: "Event Thumbnail-3.png",
                  },
                ].map((event, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                        <img
                          src={event.image}
                          alt="Event"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-black mb-0.5">
                          {event.title}
                        </h4>
                        <p className="text-[10px] text-gray-500 font-medium">
                          {event.date}
                        </p>
                        <p className="text-[10px] text-gray-400">{event.loc}</p>
                      </div>
                    </div>
                    <div className="flex gap-8 text-right">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold mb-1">
                          Tickets
                        </p>
                        <p className="font-bold text-sm text-black">
                          {event.tix}
                        </p>
                      </div>
                      <div className="w-24">
                        <p className="text-[10px] text-gray-400 font-bold mb-1">
                          Revenue
                        </p>
                        <p className="font-bold text-sm text-black">
                          {event.rev}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-6 flex items-center gap-1.5 text-sm font-bold text-[#48782E] hover:underline">
                View all events <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right Side Stats */}
            <div className="space-y-6">
              {/* Tickets by Category */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-base text-black mb-6">
                  Tickets by Category
                </h2>
                <div className="flex items-center gap-6">
                  {/* CSS Conic Gradient Donut Chart Mockup */}
                  <div
                    className="relative w-28 h-28 shrink-0 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        "conic-gradient(#F36B25 0% 45%, #48782E 45% 80%, #4ade80 80% 90%, #3b82f6 90% 98%, #d1d5db 98% 100%)",
                    }}
                  >
                    <div className="w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center">
                      <span className="font-black text-lg text-black leading-none">
                        1,245
                      </span>
                      <span className="text-[8px] font-bold text-gray-400 mt-1 uppercase">
                        Total Tickets
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2.5">
                    {[
                      {
                        label: "Music",
                        color: "bg-[#F36B25]",
                        pct: "45%",
                        val: "(560)",
                      },
                      {
                        label: "Cultural",
                        color: "bg-[#48782E]",
                        pct: "35%",
                        val: "(310)",
                      },
                      {
                        label: "Food & Drink",
                        color: "bg-[#4ade80]",
                        pct: "15%",
                        val: "(190)",
                      },
                      {
                        label: "Business",
                        color: "bg-[#3b82f6]",
                        pct: "10%",
                        val: "(125)",
                      },
                      {
                        label: "Others",
                        color: "bg-gray-300",
                        pct: "5%",
                        val: "(60)",
                      },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${stat.color}`}
                          ></div>
                          <span className="font-bold text-gray-600">
                            {stat.label}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-black mr-1">
                            {stat.pct}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {stat.val}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Traffic Sources */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-base text-black mb-6">
                  Traffic Sources
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      label: "Social Media",
                      pct: "42%",
                      width: "42%",
                      color: "bg-green-700",
                    },
                    {
                      label: "Direct",
                      pct: "28%",
                      width: "28%",
                      color: "bg-[#F36B25]",
                    },
                    {
                      label: "Search Engines",
                      pct: "18%",
                      width: "18%",
                      color: "bg-[#48782E]",
                    },
                    {
                      label: "Email Campaigns",
                      pct: "8%",
                      width: "8%",
                      color: "bg-blue-400",
                    },
                    {
                      label: "Others",
                      pct: "4%",
                      width: "4%",
                      color: "bg-gray-300",
                    },
                  ].map((source, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-gray-700">{source.label}</span>
                        <span className="text-gray-400">{source.pct}</span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${source.color} rounded-full`}
                          style={{ width: source.width }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Promotional Banner */}
          <div className="bg-[#EAF5EA] rounded-2xl p-6 border border-[#c4e5c4] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-black mb-1">
                Grow Your Events
              </h3>
              <p className="text-sm font-medium text-gray-600 mb-4">
                Promote your events to a wider audience and increase ticket
                sales.
              </p>
              <button className="bg-[#F36B25] hover:bg-[#d95d1d] text-white text-sm font-bold py-2.5 px-6 rounded-lg transition-colors shadow-sm">
                Boost Event
              </button>
            </div>
            {/* Fake Indomie Logo Placeholder */}
            <div className="">
              <img src="partner6.png" />  
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
