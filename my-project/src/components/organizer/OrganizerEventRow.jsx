import { useNavigate } from "react-router-dom";
import { naira, fmtDate } from "@/lib/utils";

const STATUS_STYLE = {
  Published: "bg-green-100 text-green-700",
  Draft: "bg-amber-100 text-amber-700",
  Completed: "bg-blue-100 text-blue-700",
};

const GRID = "grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center";

export function OrganizerEventTableHeader() {
  return (
    <div className={`${GRID} text-[10px] font-bold text-gray-400 uppercase pb-3 border-b border-gray-100`}>
      <span>Event</span>
      <span className="w-20 text-right">Date</span>
      <span className="w-16 text-right">Tickets</span>
      <span className="w-24 text-right">Revenue</span>
      <span className="w-16 text-right">Status</span>
    </div>
  );
}

export default function OrganizerEventRow({ event }) {
  const navigate = useNavigate();
  return (
    <div
      className={`${GRID} border-b border-gray-50 last:border-0 py-3.5 cursor-pointer hover:bg-gray-50/60 -mx-2 px-2 rounded-lg`}
      onClick={() => navigate(`/organizer/events/${event.id}/edit`)}
      data-testid={`row-event-${event.id}`}
    >
      <div className="flex gap-3 items-center min-w-0">
        <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden shrink-0">
          <img src={event.image} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-sm text-black mb-0.5 truncate">{event.title}</h4>
          <p className="text-[10px] text-gray-500 font-medium truncate">{event.venue}</p>
        </div>
      </div>
      <span className="w-20 text-right text-[11px] text-gray-500 font-medium">{fmtDate(event.date)}</span>
      <span className="w-16 text-right text-sm font-bold text-black">
        {event.ticketsSold}/{event.ticketCapacity}
      </span>
      <span className="w-24 text-right text-sm font-bold text-black">
        {event.revenue ? naira(event.revenue) : "—"}
      </span>
      <div className="w-16 flex items-center justify-end gap-2">
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${STATUS_STYLE[event.status] || "bg-gray-100 text-gray-600"}`}>
          {event.status}
        </span>
      </div>
    </div>
  );
}
