import { Image as ImageIcon, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { DetailCard } from "./DestinationDetailParts";

const DestinationSidebar = ({ gallery, map }) => {
  const thumbs = gallery?.thumbs ?? [];
  const extra = gallery?.extra ?? 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {thumbs.map((src, i) => (
          <div
            key={i}
            className={`overflow-hidden rounded-lg bg-emerald-50 ${
              i === 0 ? "col-span-3 aspect-[16/9]" : "aspect-square"
            }`}
          >
            {src ? (
              <img
                src={src}
                alt={`Gallery photo ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-emerald-300">
                <ImageIcon className="h-5 w-5" />
              </div>
            )}
          </div>
        ))}
        {extra > 0 && (
          <div className="flex aspect-square items-center justify-center rounded-lg bg-slate-800 text-sm font-semibold text-white">
            +{extra}
          </div>
        )}
      </div>

      <DetailCard>
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
    </div>
  );
};

export default DestinationSidebar;
