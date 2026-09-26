import { UtensilsCrossed } from "lucide-react";
import { StatusPill } from "./FoodDetailParts";

const VendorCoverHeader = ({ vendor }) => (
  <div className="relative h-40 overflow-hidden rounded-xl bg-slate-200 sm:h-52 lg:h-56">
    {vendor.cover ? (
      <img
        src={vendor.cover}
        alt={vendor.name}
        className="h-full w-full object-cover"
      />
    ) : (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0f3d1b] to-[#1f6b33]">
        <UtensilsCrossed className="h-12 w-12 text-white/70" />
      </div>
    )}
    <div className="absolute right-3 top-3">
      <StatusPill status={vendor.status} />
    </div>
  </div>
);

export default VendorCoverHeader;
