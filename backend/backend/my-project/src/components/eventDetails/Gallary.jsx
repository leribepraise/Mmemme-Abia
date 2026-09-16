const EventGallery = ({
  selectedImage,
  setSelectedImage,
  galleryImages,
  event,
}) => {
  return (
    <div className="md:col-span-7 space-y-3">
      <div className="relative rounded-2xl overflow-hidden shadow-sm h-64 md:h-80 bg-slate-900">
        <img
          src={selectedImage}
          alt={event?.text || "Event"}
          className="w-full h-full object-cover"
        />

        <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-xl">
          <span className="block text-sm font-bold text-orange-600">28</span>

          <span className="block text-xs font-bold">OCT</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {galleryImages.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(img)}
            className={`rounded-xl overflow-hidden border-2 ${
              selectedImage === img ? "border-orange-500" : "border-transparent"
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className="h-16 w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventGallery;
