import { Download, Images, MapPin, User } from "lucide-react";
import toast from "react-hot-toast";
import { DetailCard } from "./DestinationDetailParts";

const ITEM =
  "flex w-full items-center gap-2.5 px-1 py-2 text-left text-sm text-slate-700 transition-colors hover:text-[#1a6a2a]";

const QuickActionsCard = () => (
  <DetailCard title="Quick Actions">
    <div className="space-y-0.5">
      <button
        type="button"
        onClick={() => toast("Organizer profile isn't linked yet")}
        className={ITEM}
      >
        <User className="h-4 w-4 text-slate-400" />
        View Organizer Profile
      </button>
      <button
        type="button"
        onClick={() => toast("Map view isn't built yet")}
        className={ITEM}
      >
        <MapPin className="h-4 w-4 text-slate-400" />
        View on Map
      </button>
      <button
        type="button"
        onClick={() => toast("Similar listings isn't built yet")}
        className={ITEM}
      >
        <Images className="h-4 w-4 text-slate-400" />
        View Similar Listings
      </button>
      <button
        type="button"
        onClick={() => toast("Downloading documents isn't built yet")}
        className={ITEM}
      >
        <Download className="h-4 w-4 text-slate-400" />
        Download Documents
      </button>
    </div>
  </DetailCard>
);

export default QuickActionsCard;
