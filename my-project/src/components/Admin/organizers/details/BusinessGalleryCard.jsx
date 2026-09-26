import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { DetailCard } from "./OrganizerDetailParts";

const Slot = ({ src, alt, className = "" }) =>
  src ? (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`object-cover ${className}`}
    />
  ) : (
    <div
      className={`flex items-center justify-center bg-gray-100 text-gray-300 ${className}`}
    >
      <ImageIcon size={26} aria-hidden="true" />
    </div>
  );

const BusinessGalleryCard = ({ gallery, name }) => {
  // Index 0 is the cover, 1..n are the thumbnails
  const all = [gallery.cover, ...gallery.thumbs];
  const [active, setActive] = useState(0);

  return (
    <DetailCard title="Business Gallery">
      <Slot
        src={all[active]}
        alt={`${name} photo`}
        className="aspect-[16/10] w-full rounded-lg"
      />

      <div className="mt-2.5 grid grid-cols-4 gap-2">
        {gallery.thumbs.map((src, i) => {
          const index = i + 1;
          return (
            <button
              key={index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show photo ${index + 1}`}
              aria-pressed={active === index}
              className={`overflow-hidden rounded-lg ring-2 transition ${
                active === index
                  ? "ring-[#1a6a2a]"
                  : "ring-transparent hover:ring-gray-300"
              }`}
            >
              <Slot
                src={src}
                alt={`${name} thumbnail ${index + 1}`}
                className="aspect-[4/3] w-full"
              />
            </button>
          );
        })}
      </div>
    </DetailCard>
  );
};

export default BusinessGalleryCard;
