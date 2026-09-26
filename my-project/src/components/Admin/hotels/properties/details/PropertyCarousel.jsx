import { useState } from "react";
import { ChevronLeft, ChevronRight, Hotel } from "lucide-react";
import { StatusPill } from "./PropertyDetailParts";

const PropertyCarousel = ({ images, status }) => {
  const slides = images.length ? images : [null];
  const [index, setIndex] = useState(0);

  const go = (delta) =>
    setIndex((i) => (i + delta + slides.length) % slides.length);

  return (
    <div>
      <div className="relative h-52 overflow-hidden rounded-xl bg-slate-200 sm:h-72 lg:h-80">
        {slides[index] ? (
          <img
            src={slides[index]}
            alt="Property"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0f3d1b] to-[#1f6b33]">
            <Hotel className="h-12 w-12 text-white/70" />
          </div>
        )}

        <div className="absolute right-3 top-3">
          <StatusPill status={status} />
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm hover:bg-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm hover:bg-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {slides.slice(0, 4).map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`aspect-[4/3] overflow-hidden rounded-lg bg-emerald-50 ring-2 transition-all ${
                i === index ? "ring-[#1a6a2a]" : "ring-transparent"
              }`}
            >
              {src && (
                <img src={src} alt="" className="h-full w-full object-cover" />
              )}
            </button>
          ))}
          {slides.length > 5 && (
            <button
              type="button"
              onClick={() => setIndex(4)}
              className="flex aspect-[4/3] items-center justify-center rounded-lg bg-slate-800 text-sm font-semibold text-white"
            >
              +{slides.length - 4}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyCarousel;
