import React, { useRef } from "react";
import { Plus } from "lucide-react";

const PhotosGrid = ({ photos, isOwnProfile, onAddPhoto }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onAddPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  if (photos.length === 0 && !isOwnProfile) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {photos.map((photo, i) => (
          <div
            key={i}
            className="aspect-square rounded-lg overflow-hidden bg-gray-100"
          >
            <img
              src={photo}
              alt={`Photo ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {isOwnProfile && (
          <>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-full bg-[#3F783D] hover:bg-[#356433] flex items-center justify-center transition self-center justify-self-start w-14 h-14"
            >
              <Plus className="w-6 h-6 text-white" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PhotosGrid;
