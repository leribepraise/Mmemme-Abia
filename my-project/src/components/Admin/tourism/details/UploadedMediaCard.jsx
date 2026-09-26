import { Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { DetailCard } from "./DestinationDetailParts";

const UploadedMediaCard = ({ media }) => {
  const thumbs = media?.thumbs ?? [];
  const extra = media?.extra ?? 0;

  return (
    <DetailCard
      title="Uploaded Media"
      action={
        <button
          type="button"
          onClick={() => toast("View All isn't built yet")}
          className="text-sm font-medium text-[#1a6a2a] hover:underline"
        >
          View All
        </button>
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {thumbs.map((src, i) => (
          <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-emerald-50">
            {src ? (
              <img
                src={src}
                alt={`Uploaded media ${i + 1}`}
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

export default UploadedMediaCard;