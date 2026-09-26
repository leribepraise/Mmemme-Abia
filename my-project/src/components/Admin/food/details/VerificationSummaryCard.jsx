import { CalendarClock, MapPin, UtensilsCrossed } from "lucide-react";
import { CategoryBadge, StatusPill } from "./FoodDetailParts";

const VerificationSummaryCard = ({ vendor }) => (
  <section className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0f3d1b]">
        {vendor.logo ? (
          <img
            src={vendor.logo}
            alt={vendor.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <UtensilsCrossed className="h-5 w-5 text-white/80" />
        )}
      </div>
      <div className="min-w-0">
        <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
          {vendor.name}{" "}
          <span className="text-sm font-normal text-slate-400">
            @{vendor.handle}
          </span>
        </h1>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <CategoryBadge category={vendor.category} />
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {vendor.location}
          </span>
          <span className="flex items-center gap-1">
            <CalendarClock className="h-3.5 w-3.5" />
            Submitted on: {vendor.submittedAt}
          </span>
        </div>
      </div>
    </div>
    <StatusPill status={vendor.status} />
  </section>
);

export default VerificationSummaryCard;
