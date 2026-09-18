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
          (category === "All Categories" || e.category === category) &&
          (status === "All Status" || e.status === status) &&
          (date === "All Dates" || e.date === date),
      ),
    [events, search, tab, category, status, date],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const persist = (next) => { setEvents(next); save("mmemme-events", next); };
  const toggleStatus = (id) => persist(events.map(e => (e.id === id ? { ...e, status: e.status === "Published" ? "Draft" : "Published" } : e)));

  return (
    <div className="pt-24">
      <OrganizerShell
        breadcrumb={["Home", "Organizer", "My Events"]}
        title="My Events"
        subtitle="Manage all your events in one place."
        actions={
          <button
            onClick={() => navigate("/organizer/events/new")}
            className="bg-[#F36B25] hover:bg-[#d95d1d] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
            data-testid="button-create-event"
          >
            + Create New Event
          </button>
        }
      >
        <div className="flex flex-wrap items-center gap-6 border-b border-gray-200 pb-1">
          {TABS.map(item => (
            <button
              key={item}
              onClick={() => { setTab(item); setPage(1); }}
              className={`relative pb-3 text-sm font-bold transition-colors ${tab === item ? "text-black" : "text-gray-400 hover:text-gray-600"}`}
              data-testid={`button-tab-${item.toLowerCase().replace(" ", "-")}`}
            >
              {item} ({counts[item] ?? 0})
              {tab === item && <span className="absolute bottom-0 left-0 h-[2.5px] w-full rounded-full bg-[#3F7D3D]" />}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mt-6">
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search events..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#3F7D3D] bg-white"
                data-testid="input-search-events"
              />
            </div>
            <select
              value={category}
              onChange={e => { setCategory(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-600 focus:outline-none bg-white cursor-pointer"
              data-testid="select-filter-category"
            >
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            <select
              value={status}
              onChange={e => { setStatus(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-600 focus:outline-none bg-white cursor-pointer"
              data-testid="select-filter-status"
            >
              {statuses.map(c => <option key={c}>{c}</option>)}
            </select>
            <select
              value={date}
              onChange={e => { setDate(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-600 focus:outline-none bg-white cursor-pointer"
              data-testid="select-filter-date"
            >
              {dates.map(c => <option key={c}>{c}</option>)}
            </select>
            <button className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 bg-white" data-testid="button-more-filters">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>

          {paged.length ? (
            <div className="divide-y divide-gray-100">
              {paged.map(event => (
                <div key={event.id} className="flex items-center gap-5 py-5 hover:bg-gray-50/50 transition-colors px-2 rounded-xl" data-testid={`row-my-event-${event.id}`}>
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <img src={event.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-base text-black truncate">{event.title}</h3>
                    <p className="flex items-center gap-1.5 text-xs text-gray-500 font-medium truncate mt-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" /> {event.venue}
                    </p>
                  </div>
                  <div className="w-32 shrink-0 hidden sm:block">
                    <p className="text-sm font-bold text-gray-700">{event.category}</p>
                  </div>
                  <div className="w-32 shrink-0 hidden md:block text-xs text-gray-500 font-medium">
                    <span className="font-bold text-gray-800 text-sm">{event.ticketsSold}/{event.ticketCapacity}</span> <br /> Tickets sold
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full shrink-0 ${STATUS_STYLE[event.status] || "bg-gray-100 text-gray-600"}`}>
                    {event.status}
                  </span>
                  <button
                    onClick={() => navigate(event.status === "Draft" ? `/organizer/events/${event.id}/edit` : `/organizer/events/${event.id}/preview`)}
                    className="border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 bg-white shrink-0 shadow-sm"
                    data-testid={`button-view-event-${event.id}`}
                  >
                    {event.status === "Draft" ? "Edit" : "View"}
                  </button>
                  <button
                    onClick={() => toggleStatus(event.id)}
                    className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 shrink-0 transition-colors"
                    aria-label="More actions"
                    data-testid={`button-more-event-${event.id}`}
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="font-bold text-base text-gray-700">No events match your search</h3>
              <p className="text-sm text-gray-400 mt-1">Try a different term or clear your filters.</p>
            </div>
          )}

          {filtered.length > 0 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-9 h-9 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40 flex items-center justify-center font-bold hover:bg-gray-50 transition-colors"
                  data-testid="button-page-prev"
                >
                  &lsaquo;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold flex items-center justify-center transition-colors ${n === page ? "bg-[#3F7D3D] text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}`}
                    data-testid={`button-page-${n}`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-9 h-9 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40 flex items-center justify-center font-bold hover:bg-gray-50 transition-colors"
                  data-testid="button-page-next"
                >
                  &rsaquo;
                </button>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                Showing page {page} of {totalPages}
              </p>
            </div>
          )}
        </div>
      </OrganizerShell>
    </div>
  );
}