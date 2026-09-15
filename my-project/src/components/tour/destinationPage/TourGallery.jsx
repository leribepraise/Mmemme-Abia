import React from "react";

const TourGallery = ({ images }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-lg text-[#172033]">Gallery</h2>
        <button className="text-[#3F783D] text-sm font-medium hover:underline">
          View all photos
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images?.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Gallery ${i + 1}`}
            className="w-full h-28 object-cover rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};

export default TourGallery;
