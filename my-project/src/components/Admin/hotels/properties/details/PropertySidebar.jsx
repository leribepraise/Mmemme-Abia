import { Image as ImageIcon, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { DetailCard } from "./PropertyDetailParts";

const PropertySidebar = ({ map, gallery, galleryExtra }) => (
  <div className="space-y-4">
    <DetailCard title="Location">
      <div className="flex h-32 items-center justify-center rounded-lg bg-emerald-50">
        <div className="flex flex-col items-center gap-1">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f3d1b] text-white shadow">
            <MapPin className="h-4 w-4" />
          </span>
          <span className="text-xs font-medium text-slate-600">
            {map.label}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => toast("Map view isn't built yet")}
        className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50"
      >
        <MapPin className="h-4 w-4" />
        View on Map
      </button>
    </DetailCard>

    <DetailCard
      title="Property Gallery"
      action={
        <button
          type="button"
          onClick={() => toast("Full gallery isn't built yet")}
          className="text-xs font-medium text-slate-400 hover:text-[#1a6a2a]"
        >
          {gallery.length + galleryExtra} Photos
        </button>
      }
    >
      <div className="grid grid-cols-3 gap-2">
        {gallery.slice(0, 5).map((src, i) => (
          <div
            key={i}
            className="relative aspect-square overflow-hidden rounded-lg bg-emerald-50"
          >
            {src ? (
              <img src={src} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-emerald-300">
                <ImageIcon className="h-5 w-5" />
              </div>
            )}
            {i === 4 && galleryExtra > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm font-semibold text-white">
                +{galleryExtra}
              </div>
            )}
          </div>
        ))}
      </div>
    </DetailCard>
  </div>
);

export default PropertySidebar;
