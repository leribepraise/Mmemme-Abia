import React from "react";

const TourGallery = ({ images }) => {
  return (
    <div id="destination-gallery">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-lg text-[#172033]">Gallery</h2>
        <button disabled={!images?.length} onClick={()=>document.getElementById("destination-photo")?.showModal()} className="text-[#3F783D] text-sm font-medium hover:underline">
          View all photos
        </button>
      </div>

      <dialog id="destination-photo" className="m-auto max-h-[90vh] max-w-[90vw] rounded-xl p-4 backdrop:bg-black/60"><form method="dialog"><button className="mb-3 underline">Close gallery</button></form>{images?.map((src,i)=><img key={i} src={src} alt={`Destination photo ${i+1}`} className="mb-3 max-h-[70vh]"/>)}</dialog>
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
