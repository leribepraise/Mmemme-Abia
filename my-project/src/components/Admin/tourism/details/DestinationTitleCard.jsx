import { Bookmark, MapPin } from "lucide-react";
import useSavedDestination from "@/hooks/useSavedDestination";
import { RatingBadge } from "./DestinationDetailParts";

const DestinationTitleCard = ({ destination }) => {
  const { saved, toggleSaved } = useSavedDestination(destination.id);

  return (
    <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            {destination.name}
          </h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {destination.location}
            </span>
            <RatingBadge
              rating={destination.rating}
              reviewCount={destination.reviewCount}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={toggleSaved}
          className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border px-4 text-sm font-medium transition-colors ${
            saved
              ? "border-[#1a6a2a] bg-emerald-50 text-[#1a6a2a]"
              : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Bookmark className={`h-4 w-4 ${saved ? "fill-[#1a6a2a]" : ""}`} />
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </section>
  );
};

export default DestinationTitleCard;
