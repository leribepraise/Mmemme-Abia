// import React from "react";

// const Gallary = () => {
//   const [selectedImage, setSelectedImage] = useState("/event.jpg");

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
//       {/* LEFT CONTENT (BANNER + GALLERY + INFO) */}
//       <div className="lg:col-span-8 space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
//           {/* IMAGE GALLERY */}
//           <div className="md:col-span-7 space-y-3">
//             {" "}
//             {/* Main Banner */}{" "}
//             <div className="relative rounded-2xl overflow-hidden shadow-sm h-64 md:h-80 w-full bg-slate-900">
//               <img
//                 src={selectedImage}
//                 alt="Abia Business Summit"
//                 className="w-full h-full object-cover"
//               />{" "}
//               {/* Date Badge */}{" "}
//               <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-center shadow-md border border-white/40">
//                 <span className="block text-sm font-bold text-orange-600 uppercase">
//                   28
//                 </span>{" "}
//                 <span className="block text-xs font-extrabold text-slate-800 tracking-wider">
//                   {" "}
//                   OCT{" "}
//                 </span>
//               </div>{" "}
//             </div>
//             {/* Thumbnails */}
//             <div className="grid grid-cols-4 gap-2.5">
//               {galleryImages.map((img, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => setSelectedImage(img)}
//                   className={`relative rounded-xl overflow-hidden h-16 border-2 transition cursor-pointer ${
//                     selectedImage === img
//                       ? "border-orange-500 scale-95"
//                       : "border-transparent opacity-80 hover:opacity-100"
//                   }`}
//                 >
//                   <img
//                     src={img}
//                     alt={`Thumbnail ${idx + 1}`}
//                     className="w-full h-full object-cover"
//                   />
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Gallary;
const EventGallery = ({ selectedImage, setSelectedImage, galleryImages }) => {
  return (
    <div className="md:col-span-7 space-y-3">
      <div className="relative rounded-2xl overflow-hidden shadow-sm h-64 md:h-80 bg-slate-900">
        <img
          src={selectedImage}
          alt="Event"
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
            <img src={img} className="h-16 w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventGallery;
