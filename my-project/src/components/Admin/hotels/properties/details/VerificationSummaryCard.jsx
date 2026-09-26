import { CalendarClock, Hotel, MapPin } from "lucide-react";
import { StatusPill, VerifiedBadge } from "./PropertyDetailParts";

const VerificationSummaryCard = ({ property }) => (
  <section className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
    <div className="flex min-w-0 items-center gap-4">
      <div className="h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-200 sm:h-16 sm:w-20">
        {property.cover ? (
          <img
            src={property.cover}
            alt={property.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0f3d1b] to-[#1f6b33]">
            <Hotel className="h-6 w-6 text-white/70" />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
            {property.name}
          </h2>
          <span className="rounded-md bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-600">
            {property.type}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          <span>{property.host}</span>
          {property.hostVerified && <VerifiedBadge />}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {property.location}
          </span>
          <span className="flex items-center gap-1">
            <CalendarClock className="h-3.5 w-3.5" />
            Submitted: {property.submittedAt}
          </span>
        </div>
      </div>
    </div>
    <StatusPill status={property.status} />
  </section>
);

export default VerificationSummaryCard;
