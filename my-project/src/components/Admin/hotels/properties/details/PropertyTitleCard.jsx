import {
  Coffee,
  MapPin,
  Star,
  UtensilsCrossed,
  Waves,
  Wifi,
  Clock,
  CarFront,
} from "lucide-react";
import { VerifiedBadge } from "./PropertyDetailParts";

const AMENITY_ICONS = {
  "Free Wi-Fi": Wifi,
  Parking: CarFront,
  Restaurant: UtensilsCrossed,
  "Swimming Pool": Waves,
  "24/7 Front Desk": Clock,
  "Shared Kitchen": Coffee,
};

const initials = (name) =>
  String(name)
    .split(" ")
    .filter((w) => /^[A-Za-z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const PropertyTitleCard = ({ property }) => (
  <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
    <div className="flex flex-wrap items-center gap-2">
      <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
        {property.name}
      </h1>
      <span className="rounded-md bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-600">
        {property.type}
      </span>
    </div>

    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-500">
      <span className="flex items-center gap-1.5">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0f3d1b] text-[9px] font-semibold text-white">
          {initials(property.host)}
        </span>
        <span className="font-medium text-slate-800">{property.host}</span>
        {property.hostVerified && <VerifiedBadge />}
      </span>
      <span className="flex items-center gap-1">
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        <span className="font-semibold text-slate-900">{property.rating}</span>
        <span className="text-slate-400">({property.reviewCount} reviews)</span>
      </span>
      <span className="flex items-center gap-1">
        <MapPin className="h-3.5 w-3.5" />
        {property.location}
      </span>
      <span className="text-slate-400">{property.distanceFromCenter}</span>
    </div>

    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-slate-100 pt-3">
      {property.amenities.map((a) => {
        const Icon = AMENITY_ICONS[a] || Wifi;
        return (
          <span
            key={a}
            className="flex items-center gap-1.5 text-xs text-slate-600"
          >
            <Icon className="h-3.5 w-3.5 text-[#1a6a2a]" />
            {a}
          </span>
        );
      })}
    </div>
  </section>
);

export default PropertyTitleCard;
