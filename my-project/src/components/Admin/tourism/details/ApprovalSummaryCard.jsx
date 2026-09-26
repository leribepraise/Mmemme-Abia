import { Building2, CalendarClock, MapPin, Tag } from "lucide-react";
import { StatusPill } from "./DestinationDetailParts";

const ApprovalSummaryCard = ({ destination }) => (
  <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 items-start gap-4">
        <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-200 sm:h-20 sm:w-24">
          {destination.cover ? (
            <img
              src={destination.cover}
              alt={destination.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-900 to-emerald-700 text-[10px] text-white/70">
              No image
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold text-slate-900">
            {destination.name}
          </h1>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
            <Tag className="h-3.5 w-3.5 text-[#1a6a2a]" />
            {destination.category}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <Building2 className="h-3.5 w-3.5 text-[#1a6a2a]" />
            Added by: {destination.addedBy.name} (Organizer)
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-1.5 text-xs text-slate-500 sm:items-end">
        <StatusPill status={destination.status} />
        <span className="mt-1 flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          {destination.location}
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarClock className="h-3.5 w-3.5" />
          Submitted: {destination.submittedAt}
        </span>
      </div>
    </div>
  </section>
);

export default ApprovalSummaryCard;
