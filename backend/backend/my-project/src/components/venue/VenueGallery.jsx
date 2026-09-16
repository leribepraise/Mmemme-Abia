import React from "react";

const VenueGallery = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-2 rounded-2xl overflow-hidden">
      <div className="md:col-span-3">
        <img
          src="/hotel.png"
          className="w-full h-[220px] md:h-[420px] object-cover"
        />
      </div>

      <div className="md:col-span-2 grid grid-cols-2 gap-2">
        <img
          src="/hotel.png"
          className="w-full h-[104px] md:h-[204px] object-cover"
        />
        <img
          src="/hotel.png"
          className="w-full h-[104px] md:h-[204px] object-cover"
        />
        <img
          src="/hotel.png"
          className="w-full h-[104px] md:h-[204px] object-cover"
        />

        <div className="relative">
          <img
            src="/hotel.png"
            className="w-full h-[104px] md:h-[204px] object-cover"
          />

          <div className="absolute inset-0 bg-black/45 flex items-center justify-center text-white font-semibold">
            View All Photos
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueGallery;
