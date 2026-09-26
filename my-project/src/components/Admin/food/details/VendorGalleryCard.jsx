import { Image as ImageIcon } from "lucide-react";
import { DetailCard } from "./FoodDetailParts";

const VendorGalleryCard = ({ gallery }) => {
  const thumbs = gallery?.thumbs ?? [];
  const extra = gallery?.extra ?? 0;

  return (
    <DetailCard title="Gallery">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {thumbs.map((src, i) => (
          <div
            key={i}
            className="relative aspect-[4/3] overflow-hidden rounded-lg bg-emerald-50"
          >
            {src ? (
              <img
                src={src}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-emerald-300">
                <ImageIcon className="h-6 w-6" />
              </div>
            )}
            {i === thumbs.length - 1 && extra > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm font-semibold text-white">
                +{extra}
              </div>
            )}
          </div>
        ))}
      </div>
    </DetailCard>
  );
};

export default VendorGalleryCard;
