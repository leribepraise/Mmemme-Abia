import { Image as ImageIcon } from "lucide-react";
import { DetailCard } from "./EventDetailParts";

const EventMediaGallery = ({ gallery }) => {
  const thumbs = gallery?.thumbs ?? [];
  const extra = gallery?.extra ?? 0;

  return (
    <DetailCard title="Media Gallery">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {thumbs.map((src, i) => (
          <div
            key={i}
            className="aspect-[4/3] overflow-hidden rounded-lg bg-emerald-50"
          >
            {src ? (
              <img
                src={src}
                alt={`Event media ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-emerald-300">
                <ImageIcon className="h-6 w-6" />
              </div>
            )}
          </div>
        ))}
        {extra > 0 && (
          <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-slate-800 text-sm font-semibold text-white">
            +{extra}
          </div>
        )}
      </div>
    </DetailCard>
  );
};

export default EventMediaGallery;
