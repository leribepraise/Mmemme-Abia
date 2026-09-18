import { useMemo, useState } from "react";
import { Filter, MoreHorizontal, Search } from "lucide-react";
import OrganizerShell from "@/components/organizer/OrganizerPublicShell";
import { seedEvents } from "@/data/organizerData";
import { fmtDate, load } from "@/lib/utils";

const TICKET_TYPES = ["VIP", "Regular", "VVIP"];
const CHECKIN_STYLE = { "Checked In": "text-green-600", "Not Checked In": "text-amber-600" };
const PAGE_SIZE = 5;
const BASE_NAMES = [
  "Chidinma Okafor", "Tosin Adesina", "Emeka Nwosu", "Peace Umoh", "Daniel Onyema",
  "Ifeoma Nwachukwu", "Uche Obiora", "Grace Effiong", "Kelechi Anya", "Amaka Chukwu",
  "Ngozi Eze", "Obinna Okeke", "Chiamaka Uche", "Fidelis Nnadi", "Blessing Iroegbu",
];

function buildAttendees(event) {
  const total = Math.min(event.ticketsSold || BASE_NAMES.length, 50) || BASE_NAMES.length;
  return Array.from({ length: total }, (_, i) => {
    const name = BASE_NAMES[i % BASE_NAMES.length];
    const suffix = i >= BASE_NAMES.length ? ` ${Math.floor(i / BASE_NAMES.length) + 1}` : "";
    return {
      name: `${name}${suffix}`,
      email: `${name.toLowerCase().replace(" ", ".")}${i}@gmail.com`,
      ticket: TICKET_TYPES[i % TICKET_TYPES.length],
      orderId: `ORD-${78234 + i}-${["XY7", "PLI", "HC2", "LL9", "OP5"][i % 5]}`,
      purchaseDate: fmtDate(event.date),
      checkedIn: i % 3 !== 1,
    };
  });
}

function paginationRange(current, total) {
  const pages = new Set([1, total, current, current - 1, current + 1]);
  return [...pages].filter(p => p >= 1 && p <= total).sort((a, b) => a - b);
}

export default function OrganizerAttendees() {
  const events = load("mmemme-events", seedEvents);
  const [eventId, setEventId] = useState(events[0]?.id);
  const event = events.find(e => e.id === eventId) || events[0];
  const [query, setQuery] = useState("");
  const [ticketType, setTicketType] = useState("All Ticket Types");
  const [page, setPage] = useState(1);

  const attendees = useMemo(() => buildAttendees(event), [event]);
  const filtered = attendees.filter(
    a =>
      `${a.name} ${a.email}`.toLowerCase().includes(query.toLowerCase()) &&
      (ticketType === "All Ticket Types" || a.ticket === ticketType),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const updateQuery = (value) => { setQuery(value); setPage(1); };
  const updateTicketType = (value) => { setTicketType(value); setPage(1); };

  return (
    <div className="pt-24">
      <OrganizerShell
        breadcrumb={["Home", "Organizer", "Attendees"]}
        title="Attendees"
        subtitle="View and manage who's attending your event."
        actions={
          <>
            <button
              onClick={() => window.alert("Attendee list exported.")}
              className="flex items-center gap-2 border border-gray-200 bg-white text-gray-700 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50"
              data-testid="button-export-attendees"
            >
              Export
            </button>
            <button
              onClick={() => window.alert("Message sent to attendees.")}
              className="bg-[#3F7D3D] hover:bg-[#336633] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors"
              data-testid="button-send-message"
            >
              Send Message
            </button>
          </>
        }
      >
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
            <img src={event.image} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <select
              value={eventId}
              onChange={e => { setEventId(e.target.value); setPage(1); }}
              className="font-bold text-base text-black bg-transparent focus:outline-none -ml-1 cursor-pointer"
              data-testid="select-attendees-event"
            >
              {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{fmtDate(event.date)} &middot; {event.venue}</p>
          </div>
          <div className="text-right shrink-0 px-5 border-l border-gray-100">
            <p className="text-xl font-black text-black">{event.ticketsSold}</p>
            <p className="text-xs text-gray-400 font-bold">Tickets Sold</p>
          </div>
          <div className="text-right shrink-0 pl-2">
            <p className="text-xl font-black text-black">{event.ticketCapacity}</p>
            <p className="text-xs text-gray-400 font-bold">Total Capacity</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mt-6">
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                value={query}
                onChange={e => updateQuery(e.target.value)}
                placeholder="Search attendees..."
                className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-[#3F7D3D]"
                data-testid="input-search-attendees"
              />
            </div>
            <select
              value={ticketType}
              onChange={e => updateTicketType(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-600 focus:outline-none bg-white"
              data-testid="select-filter-ticket-type"
            >
              <option>All Ticket Types</option>
              {TICKET_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            <button className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 bg-white" data-testid="button-attendee-filter">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="pb-4 pr-6">Attendee</th>
                  <th className="pb-4 pr-6">Ticket Type</th>
                  <th className="pb-4 pr-6">Order ID</th>
                  <th className="pb-4 pr-6">Purchase Date</th>
                  <th className="pb-4 pr-6">Check-in Status</th>
                  <th className="pb-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paged.map((a, i) => (
                  <tr key={a.orderId} className="hover:bg-gray-50/50 transition-colors" data-testid={`row-attendee-${i}`}>
                    <td className="py-4 pr-6">
                      <strong className="font-bold text-sm text-black block">{a.name}</strong>
                      <span className="text-xs text-gray-400">{a.email}</span>
                    </td>
                    <td className="py-4 pr-6 font-bold text-sm text-[#F36B25]">{a.ticket}</td>
                    <td className="py-4 pr-6 text-gray-500 font-mono text-xs">{a.orderId}</td>
                    <td className="py-4 pr-6 text-sm text-gray-600">{a.purchaseDate}</td>
                    <td className={`py-4 pr-6 font-bold text-xs ${a.checkedIn ? CHECKIN_STYLE["Checked In"] : CHECKIN_STYLE["Not Checked In"]}`}>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${a.checkedIn ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                        {a.checkedIn ? "Checked In" : "Not Checked In"}
                      </span>
                    </td>
                    <td className="py-4">
                      <button onClick={() => window.alert(`${a.name} ticket details opened.`)} className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors" data-testid={`button-view-attendee-${i}`}>
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40 flex items-center justify-center font-bold hover:bg-gray-50 transition-colors"
                aria-label="Previous page"
                data-testid="button-attendees-page-prev"
              >
                &lsaquo;
              </button>
              {paginationRange(currentPage, totalPages).map((n, i, arr) => (
                <span key={n} className="flex items-center gap-2">
                  {i > 0 && n - arr[i - 1] > 1 && <span className="text-sm text-gray-300 px-1">&hellip;</span>}
                  <button
                    onClick={() => setPage(n)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold flex items-center justify-center transition-colors ${n === currentPage ? "bg-[#3F7D3D] text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}`}
                    data-testid={`button-attendees-page-${n}`}
                  >
                    {n}
                  </button>
                </span>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40 flex items-center justify-center font-bold hover:bg-gray-50 transition-colors"
                aria-label="Next page"
                data-testid="button-attendees-page-next"
              >
                &rsaquo;
              </button>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Showing {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} to {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {event.ticketsSold} attendees
            </p>
          </div>
        </div>
      </OrganizerShell>
    </div>
  );
}