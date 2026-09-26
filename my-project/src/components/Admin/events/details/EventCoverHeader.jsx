import { CalendarDays, MoreVertical } from "lucide-react";
import toast from "react-hot-toast";
import { StatusPill } from "./EventDetailParts";

const EventCoverHeader = ({ event }) => (
  <div className="relative h-44 overflow-hidden rounded-xl bg-slate-200 sm:h-60 lg:h-72">
    {event.cover ? (
      <img
        src={event.cover}
        alt={event.title}
        className="h-full w-full object-cover"
      />
    ) : (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0f3d1b] to-[#1f6b33]">
        <CalendarDays className="h-12 w-12 text-white/70" />
      </div>
    )}

    <div className="absolute right-3 top-3 flex items-center gap-2">
      <StatusPill status={event.status} />
      <button
        type="button"
        aria-label="Event options"
        onClick={() => toast("Event options aren't built yet")}
        className="flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-slate-600 shadow-sm transition-colors hover:bg-white"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
    </div>
  </div>
);

export default EventCoverHeader;
