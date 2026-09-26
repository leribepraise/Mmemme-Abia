import {
  Mail,
  MapPin,
  MessageSquare,
  MoreVertical,
  Phone,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import toast from "react-hot-toast";
import { CategoryBadge } from "./FoodDetailParts";

const VendorTitleCard = ({ vendor }) => (
  <section className="relative rounded-xl bg-white px-4 pb-4 pt-9 shadow-sm sm:px-5">
    <div className="absolute -top-8 left-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#0f3d1b] shadow-sm sm:left-5">
      {vendor.logo ? (
        <img
          src={vendor.logo}
          alt={vendor.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <UtensilsCrossed className="h-6 w-6 text-white/80" />
      )}
    </div>

    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
          {vendor.name}
        </h1>
        <p className="text-xs text-slate-400">@{vendor.handle}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <CategoryBadge category={vendor.category} />
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5" />
            {vendor.location}
          </span>
          <span className="flex items-center gap-1 text-xs">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-slate-900">
              {vendor.rating}
            </span>
            <span className="text-slate-400">
              ({vendor.reviewCount} reviews)
            </span>
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => toast(`Calling ${vendor.phone} isn't built yet`)}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <Phone className="h-3.5 w-3.5" />
          Call
        </button>
        <button
          type="button"
          onClick={() => toast("Messaging isn't built yet")}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Message
        </button>
        <button
          type="button"
          onClick={() => toast(`Emailing ${vendor.email} isn't built yet`)}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <Mail className="h-3.5 w-3.5" />
          Email
        </button>
        <button
          type="button"
          aria-label="More options"
          onClick={() => toast("More options aren't built yet")}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
    </div>
  </section>
);

export default VendorTitleCard;
