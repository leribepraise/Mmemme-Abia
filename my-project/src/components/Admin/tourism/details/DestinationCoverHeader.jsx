import { Share2, TreePine } from "lucide-react";
import toast from "react-hot-toast";
import { StatusPill } from "./DestinationDetailParts";

const DestinationCoverHeader = ({ destination }) => (
  <div className="relative h-52 overflow-hidden rounded-xl bg-slate-200 sm:h-72 lg:h-80">
    {destination.cover ? (
      <img
        src={destination.cover}
        alt={destination.name}
        className="h-full w-full object-cover"
      />
    ) : (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-900 to-emerald-700">
        <TreePine className="h-12 w-12 text-white/70" />
      </div>
    )}

    <span className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
      {destination.category}
    </span>

    <div className="absolute right-3 top-3">
      <StatusPill status={destination.status} />
    </div>

    <button
      type="button"
      aria-label="Share"
      onClick={() => toast("Sharing isn't built yet")}
      className="absolute right-3 top-12 flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-slate-600 shadow-sm transition-colors hover:bg-white"
    >
      <Share2 className="h-4 w-4" />
    </button>
  </div>
);

export default DestinationCoverHeader;
