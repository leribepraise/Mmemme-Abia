// import React from "react";
// import { useParams } from "react-router-dom";
// import { hotels } from "../data/hotels";
// import BookingAlert from "../components/bookingComfire/BookingAlert";
// import BookSurmary from "../components/bookingComfire/BookSurmary";
// import WhatNext from "../components/bookingComfire/WhatNext";

// const BookingComfirmationPage = () => {
//   const { id } = useParams();
//   const hotel = hotels.find((h) => h.id === id);

//   if (!hotel) {
//     return (
//       <div className="grid place-items-center min-h-screen">
//         <p className="text-lg font-semibold">Booking not found</p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid place-items-center">
//       <div>
//         <div className="bg-white shadow-md rounded-[12px] border-2 border-[#C1C9BB] p-5 w-250">
//           <div className="grid grid-cols-2 justify-items-center p-5 min-w-10xl">
//             <BookingAlert hotel={hotel} />
//             <BookSurmary hotel={hotel} />
//           </div>
//           <hr />
//           <div className="p-10">
//             <WhatNext hotel={hotel} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingComfirmationPage;
import React from "react";
import { useParams } from "react-router-dom";
import { hotels } from "../data/hotels";
import BookingAlert from "../components/bookingComfire/BookingAlert";
import BookSurmary from "../components/bookingComfire/BookSurmary";
import WhatNext from "../components/bookingComfire/WhatNext";
import DownloadTicketButton from "../components/bookingComfire/bookTicketDownload/DownloadTicketButton";

const BookingComfirmationPage = () => {
  const { id } = useParams();
  const hotel = hotels.find((h) => h.id === id);

  if (!hotel) {
    return (
      <div className="grid place-items-center min-h-screen">
        <p className="text-lg font-semibold">Booking not found</p>
      </div>
    );
  }

  const bookingRef = `MMA${hotel.id.slice(0, 4).toUpperCase()}${Date.now()
    .toString()
    .slice(-4)}`;

  return (
    <div className="min-h-screen grid place-items-center px-4 py-8">
      <div className="w-full max-w-[1000px]">
        <div className="bg-white shadow-md rounded-[12px] border-2 border-[#C1C9BB] p-4 sm:p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center p-2 sm:p-5">
            <BookingAlert hotel={hotel} bookingRef={bookingRef} />
            <BookSurmary hotel={hotel} />
          </div>
          <hr />
          <div className="p-4 sm:p-6 md:p-10 flex flex-col items-center gap-5">
            <WhatNext hotel={hotel} />
            <DownloadTicketButton hotel={hotel} bookingRef={bookingRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingComfirmationPage;
