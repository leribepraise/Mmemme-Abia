import { useNavigate } from "react-router-dom";
import { Edit3, Eye, Trash2, Users, CalendarDays } from "lucide-react";
import { fmtDate } from "@/lib/utils";

const STATUS_STYLE = {
  Published: "bg-green-100 text-green-700",
  Draft: "bg-gray-100 text-gray-600",
  Completed: "bg-blue-100 text-blue-700",
};

export default function OrganizerEventCard({ event, onDelete, onToggle }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" data-testid={`card-event-${event.id}`}>
      <div className="h-32 bg-gray-100">
        <img src={event.image} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-sm text-black leading-snug">{event.title}</h3>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${STATUS_STYLE[event.status] || "bg-gray-100 text-gray-600"}`}>
            {event.status}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-gray-500 font-medium mb-4">
          <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {fmtDate(event.date)}</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {event.ticketsSold} sold</span>
        </div>
        <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
          <button
            onClick={() => navigate(`/organizer/events/${event.id}/preview`)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg py-2"
            data-testid={`button-preview-event-${event.id}`}
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
          <button
            onClick={() => navigate(`/organizer/events/${event.id}/edit`)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg py-2"
            data-testid={`button-edit-event-${event.id}`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
          <button
            onClick={() => onToggle(event.id)}
            className="px-2.5 py-2 rounded-lg text-xs font-bold text-[#48782E] hover:bg-[#EAF5EA]"
            data-testid={`button-status-event-${event.id}`}
          >
            {event.status === "Published" ? "Unpublish" : "Publish"}
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="p-2 rounded-lg text-red-500 hover:bg-red-50"
            aria-label="Delete event"
            data-testid={`button-delete-event-${event.id}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
