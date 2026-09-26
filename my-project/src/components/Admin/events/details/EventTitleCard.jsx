import { Building2, CalendarDays, MapPin } from "lucide-react";
import { VerifiedBadge } from "./EventDetailParts";

const MetaItem = ({ icon: Icon, label, children }) => (
  <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs">
    <span className="flex items-center gap-1.5 text-[#1a6a2a]">
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </span>
    {children}
  </div>
);

const EventTitleCard = ({ event }) => (
  <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
    <div className="flex flex-wrap items-center gap-3">
      <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
        {event.title}
      </h1>
      <span className="rounded-md bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-600">
        {event.categoryLabel}
      </span>
    </div>

    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-100 pt-3">
      <MetaItem icon={Building2} label="Organizer:">
        <span className="font-semibold text-slate-900">
          {event.organizer.name}
        </span>
        {event.organizer.verified && <VerifiedBadge />}
      </MetaItem>
      <MetaItem icon={MapPin} label="Location:">
        <span className="font-semibold text-slate-900">{event.location}</span>
      </MetaItem>
      <MetaItem icon={CalendarDays} label="Date & Time:">
        <span className="font-semibold text-slate-900">{event.dateTime}</span>
      </MetaItem>
    </div>
  </section>
);

export default EventTitleCard;
