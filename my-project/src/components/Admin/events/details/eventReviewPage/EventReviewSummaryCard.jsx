import { CalendarDays, MapPin } from "lucide-react";
import { StatusPill, VerifiedBadge } from "../EventDetailParts";

const EventReviewSummaryCard = ({ event }) => (
  <section className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
    <div className="flex min-w-0 items-center gap-4">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-200 sm:h-20 sm:w-20">
        {event.cover ? (
          <img
            src={event.cover}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0f3d1b] to-[#1f6b33] text-[10px] text-white/70">
            No image
          </div>
        )}
      </div>
      <div className="min-w-0">
        <h2 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
          {event.title}
        </h2>
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          <span>Organizer</span>
          <span className="font-medium text-slate-800">
            {event.organizer.name}
          </span>
          {event.organizer.verified && <VerifiedBadge />}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {event.dateTime}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {event.location}
          </span>
        </div>
      </div>
    </div>
    <StatusPill status={event.status} />
  </section>
);

export default EventReviewSummaryCard;
