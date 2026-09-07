import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Filter, MapPin, MoreHorizontal, Search } from "lucide-react";
import OrganizerShell from "@/components/organizer/OrganizerShell";
import { seedEvents } from "@/data/organizerData";
import { load, save } from "@/lib/utils";

const STATUS_STYLE = {
  Published: "bg-green-100 text-green-700",
  Draft: "bg-amber-100 text-amber-700",
  Completed: "bg-blue-100 text-blue-700",
};

const TABS = ["All Events", "Published", "Draft", "Completed"];
const PAGE_SIZE = 5;

export default function OrganizerEvents() {
  const navigate = useNavigate();
  const { search: urlSearch } = useLocation();
  const draftPreset = new URLSearchParams(urlSearch).get("status") === "Draft";

  const [events, setEvents] = useState(() => load("mmemme-events", seedEvents));
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState(draftPreset ? "Draft" : "All Events");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Status");
  const [date, setDate] = useState("All Dates");
  const [page, setPage] = useState(1);

  const categories = useMemo(() => ["All Categories", ...new Set(events.map(e => e.category))], [events]);
  const dates = useMemo(() => ["All Dates", ...new Set(events.map(e => e.date))], [events]);
  const statuses = useMemo(() => ["All Status", ...new Set(events.map(e => e.status))], [events]);
  
  const counts = useMemo(() => ({
    "All Events": events.length,
    Published: events.filter(e => e.status === "Published").length,
    Draft: events.filter(e => e.status === "Draft").length,
    Completed: events.filter(e => e.status === "Completed").length,
  }), [events]);

  const filtered = useMemo(
    () =>
      events.filter(
        e =>
          (e.title.toLowerCase().includes(search.toLowerCase()) || e.venue.toLowerCase().includes(search.toLowerCase())) &&
          (tab === "All Events" || e.status === tab) &&
          (category === "All Categories" || e.category === category),
      ),
    [events, search, tab, category],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const persist = (next) => { setEvents(next); save("mmemme-events", next); };
  const toggleStatus = (id) => persist(events.map(e => (e.id === id ? { ...e, status: e.status === "Published" ? "Draft" : "Published" } : e)));

  return (
    <OrganizerShell
      breadcrumb={["Home", "Organizer", "My Events"]}
      title="My Events"
      subtitle="Manage all your events in one place."
      actions={
        <button
          onClick={() => navigate("/organizer/events/new")}
          className="bg-[#F36B25] hover:bg-[#d95d1d] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-1.5"
          data-testid="button-create-event"
        >
          + Create New Event
        </button>
      }
    >
      <div className="flex flex-wrap items-center gap-5 border-b border-gray-200 -mt-2">
        {TABS.map(item => (
          <button
            key={item}
            onClick={() => { setTab(item); setPage(1); }}
            className={`relative pb-2.5 text-sm font-bold transition-colors ${tab === item ? "text-black" : "text-gray-400 hover:text-gray-600"}`}
            data-testid={`button-tab-${item.toLowerCase().replace(" ", "-")}`}
          >
            {item} ({counts[item] ?? 0})
            {tab === item && <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[#3F7D3D]" />}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search events..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#3F7D3D]"
              data-testid="input-search-events"
            />
          </div>
          <select
            value={category}
            onChange={e => { setCategory(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-600 focus:outline-none"
            data-testid="select-filter-category"
          >
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <select
            value={status}
            onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-600 focus:outline-none"
            data-testid="select-filter-category"
          >
            {statuses.map(c => <option key={c}>{c}</option>)}
          </select>
          <select
            value={date}
            onChange={e => { setDate(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-600 focus:outline-none"
            data-testid="select-filter-category"
          >
            {dates.map(c => <option key={c}>{c}</option>)}
          </select>
          <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50" data-testid="button-more-filters">
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
        </div>

        {paged.length ? (
          <div className="divide-y divide-gray-50">
            {paged.map(event => (
              <div key={event.id} className="flex items-center gap-4 py-4" data-testid={`row-my-event-${event.id}`}>
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <img src={event.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-sm text-black truncate">{event.title}</h3>
                  <p className="flex items-center gap-1 text-[11px] text-gray-500 font-medium truncate">
                    <MapPin className="w-3 h-3 shrink-0" /> {event.venue}
                  </p>
                </div>
                <div className="w-24 shrink-0 hidden sm:block">
                  <p className="text-xs font-bold text-gray-700">{event.category}</p>
                </div>
                <div className="w-28 shrink-0 hidden md:block text-xs text-gray-500 font-medium">
                  {event.ticketsSold}/{event.ticketCapacity} <br /> Tickets sold
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${STATUS_STYLE[event.status] || "bg-gray-100 text-gray-600"}`}>
                  {event.status}
                </span>
                <button
                  onClick={() => navigate(event.status === "Draft" ? `/organizer/events/${event.id}/edit` : `/organizer/events/${event.id}/preview`)}
                  className="border border-gray-200 rounded-lg px-3.5 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 shrink-0"
                  data-testid={`button-view-event-${event.id}`}
                >
                  {event.status === "Draft" ? "Edit" : "View"}
                </button>
                <button
                  onClick={() => toggleStatus(event.id)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 shrink-0"
                  aria-label="More actions"
                  data-testid={`button-more-event-${event.id}`}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-gray-700">No events match your search</h3>
            <p className="text-sm text-gray-400 mt-1">Try a different term or clear your filters.</p>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="flex items-center justify-center gap-1.5 mt-6 pt-4 border-t border-gray-50">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-7 h-7 rounded-md border border-gray-200 text-gray-400 disabled:opacity-40 flex items-center justify-center"
              data-testid="button-page-prev"
            >
              &lsaquo;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-7 h-7 rounded-md text-xs font-bold flex items-center justify-center ${n === page ? "bg-[#3F7D3D] text-white" : "text-gray-500 hover:bg-gray-100"}`}
                data-testid={`button-page-${n}`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-7 h-7 rounded-md border border-gray-200 text-gray-400 disabled:opacity-40 flex items-center justify-center"
              data-testid="button-page-next"
            >
              &rsaquo;
            </button>
          </div>
        )}
      </div>
    </OrganizerShell>
  );
}
