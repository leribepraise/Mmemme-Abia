import { useNavigate } from "react-router-dom";
import { CalendarDays, Check, Edit3, Eye, Trash2, Users } from "lucide-react";
import { fmtDate } from "@/lib/utils";

export function EventCard({ event, onDelete, onToggle }) {
  const navigate = useNavigate();
  return (
    <div className="event-card" data-testid={`card-event-${event.id}`}>
      <img className="event-image" src={event.image} alt="" />
      <div>
        <strong>{event.title}</strong>
        <div className="event-meta">
          <span><CalendarDays size={12} style={{ verticalAlign: "middle" }} /> {fmtDate(event.date)}</span>
          <span><Users size={12} style={{ verticalAlign: "middle" }} /> {event.ticketsSold} sold</span>
          <span>{event.category}</span>
        </div>
      </div>
      <div className="card-actions">
        <span className={`status status-${event.status.toLowerCase()}`}>{event.status}</span>
        <button className="icon-btn" onClick={() => navigate(`/organizer/events/${event.id}/preview`)} aria-label="Preview event" data-testid={`button-preview-event-${event.id}`}>
          <Eye size={15} />
        </button>
        <button className="icon-btn" onClick={() => navigate(`/organizer/events/${event.id}/edit`)} aria-label="Edit event" data-testid={`button-edit-card-${event.id}`}>
          <Edit3 size={15} />
        </button>
        <button className="icon-btn" onClick={() => onToggle(event.id)} aria-label="Change event status" data-testid={`button-status-event-${event.id}`}>
          <Check size={15} />
        </button>
        <button className="icon-btn" onClick={() => onDelete(event.id)} aria-label="Delete event" data-testid={`button-delete-event-${event.id}`}>
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
