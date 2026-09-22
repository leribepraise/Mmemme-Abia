// import React, { useEffect, useState } from "react";
// import { Heart, MapPin, Trash2 } from "lucide-react";
// import { NavLink } from "react-router-dom";

// import SectionHeader from "./common/SectionHeader";

// const SavedItems = () => {
//   const [savedEvents, setSavedEvents] = useState([]);

//   // Load saved events
//   const loadSavedEvents = () => {
//     const storedEvents = JSON.parse(
//       sessionStorage.getItem("savedEvents") || "[]",
//     );

//     setSavedEvents(storedEvents);
//   };

//   useEffect(() => {
//     // Load when component first opens
//     loadSavedEvents();

//     // Listen for changes made from EventCard
//     window.addEventListener("savedEventsUpdated", loadSavedEvents);

//     return () => {
//       window.removeEventListener("savedEventsUpdated", loadSavedEvents);
//     };
//   }, []);

//   // Remove an event from saved items
//   const handleRemove = (eventId) => {
//     const updatedEvents = savedEvents.filter((event) => event.id !== eventId);

//     sessionStorage.setItem("savedEvents", JSON.stringify(updatedEvents));

//     setSavedEvents(updatedEvents);

//     // Notify other components
//     window.dispatchEvent(new Event("savedEventsUpdated"));
//   };

//   return (
//     <div className="mx-auto w-full max-w-[1100px]">
//       <SectionHeader
//         title="Saved Items"
//         description="Places and experiences you've saved."
//       />

//       {savedEvents.length === 0 ? (
//         /* Empty State */
//         <div className="rounded-xl bg-white p-8 text-center shadow-sm">
//           <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
//             <Heart size={28} className="text-[#3F783D]" />
//           </div>

//           <h2 className="mt-4 font-semibold text-gray-800">
//             No saved events yet
//           </h2>

//           <p className="mt-1 text-sm text-gray-500">
//             Save events you want to visit later and they will appear here.
//           </p>
//         </div>
//       ) : (
//         /* Saved Events */
//         <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
//           {savedEvents.map((event) => (
//             <div
//               key={event.id}
//               className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
//             >
//               {/* Image */}
//               <div className="relative h-[170px] w-full">
//                 <NavLink to={`/events/${event.id}`} className="block h-full">
//                   <img
//                     src={event.image}
//                     alt={event.text}
//                     className="h-full w-full object-cover"
//                   />
//                 </NavLink>

//                 {/* Date */}
//                 <div className="absolute left-3 top-3 rounded-xl bg-[#FF6A00] px-2.5 py-1 text-center text-white shadow-sm">
//                   <span className="block text-sm font-bold leading-tight">
//                     {event.dateDay || "28"}
//                   </span>

//                   <span className="block text-[10px] font-semibold uppercase tracking-wider">
//                     {event.dateMonth || "OCT"}
//                   </span>
//                 </div>

//                 {/* Remove */}
//                 <button
//                   type="button"
//                   onClick={() => handleRemove(event.id)}
//                   aria-label="Remove saved event"
//                   className="absolute right-3 top-3 rounded-full bg-white/95 p-2 text-red-500 shadow-md transition hover:bg-red-50"
//                 >
//                   <Heart size={16} fill="currentColor" />
//                 </button>
//               </div>

//               {/* Content */}
//               <NavLink to={`/events/${event.id}`} className="block">
//                 <div className="p-4">
//                   <h3 className="truncate text-[15px] font-semibold text-gray-900">
//                     {event.text}
//                   </h3>

//                   <div className="mt-3 flex items-center justify-between gap-3">
//                     <div className="flex min-w-0 items-center gap-1 text-xs text-gray-500">
//                       <MapPin size={14} className="shrink-0" />

//                       <span className="truncate">{event.text2}</span>
//                     </div>

//                     <span className="shrink-0 text-sm font-semibold text-[#3C6E16]">
//                       {event.text3}
//                     </span>
//                   </div>
//                 </div>
//               </NavLink>

//               {/* Remove Button */}
//               <div className="border-t border-gray-100 px-4 py-3">
//                 <button
//                   type="button"
//                   onClick={() => handleRemove(event.id)}
//                   className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-100 py-2 text-xs font-medium text-red-500 transition hover:bg-red-50"
//                 >
//                   <Trash2 size={14} />
//                   Remove from Saved
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SavedItems;

import React, { useEffect, useState } from "react";
import { Heart, MapPin, Trash2, Star } from "lucide-react";
import { NavLink } from "react-router-dom";

import SectionHeader from "./common/SectionHeader";

const SavedItems = () => {
  const [savedEvents, setSavedEvents] = useState([]);
  const [savedHotels, setSavedHotels] = useState([]);

  // Load saved events
  const loadSavedEvents = () => {
    const storedEvents = JSON.parse(
      sessionStorage.getItem("savedEvents") || "[]",
    );

    setSavedEvents(storedEvents);
  };

  // Load saved hotels
  const loadSavedHotels = () => {
    const storedHotels = JSON.parse(
      sessionStorage.getItem("savedHotels") || "[]",
    );

    setSavedHotels(storedHotels);
  };

  useEffect(() => {
    // Load when component first opens
    loadSavedEvents();
    loadSavedHotels();

    // Listen for changes from EventCard
    window.addEventListener("savedEventsUpdated", loadSavedEvents);

    // Listen for changes from HotelCard
    window.addEventListener("savedHotelsUpdated", loadSavedHotels);

    return () => {
      window.removeEventListener("savedEventsUpdated", loadSavedEvents);
      window.removeEventListener("savedHotelsUpdated", loadSavedHotels);
    };
  }, []);

  // Remove an event
  const handleRemoveEvent = (eventId) => {
    const updatedEvents = savedEvents.filter((event) => event.id !== eventId);

    sessionStorage.setItem("savedEvents", JSON.stringify(updatedEvents));

    setSavedEvents(updatedEvents);

    window.dispatchEvent(new Event("savedEventsUpdated"));
  };

  // Remove a hotel
  const handleRemoveHotel = (hotelId) => {
    const updatedHotels = savedHotels.filter((hotel) => hotel.id !== hotelId);

    sessionStorage.setItem("savedHotels", JSON.stringify(updatedHotels));

    setSavedHotels(updatedHotels);

    window.dispatchEvent(new Event("savedHotelsUpdated"));
  };

  const hasSavedItems = savedEvents.length > 0 || savedHotels.length > 0;

  return (
    <div className="mx-auto w-full max-w-[1100px]">
      <SectionHeader
        title="Saved Items"
        description="Places and experiences you've saved."
      />

      {!hasSavedItems ? (
        /* Empty State */
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
            <Heart size={28} className="text-[#3F783D]" />
          </div>

          <h2 className="mt-4 font-semibold text-gray-800">
            No saved items yet
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Save events and hotels you want to visit later and they will appear
            here.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* ================= EVENTS ================= */}

          {savedEvents.map((event) => (
            <div
              key={`event-${event.id}`}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {/* Image */}
              <div className="relative h-[170px] w-full">
                <NavLink to={`/events/${event.id}`} className="block h-full">
                  <img
                    src={event.image}
                    alt={event.text}
                    className="h-full w-full object-cover"
                  />
                </NavLink>

                {/* Date */}
                <div className="absolute left-3 top-3 rounded-xl bg-[#FF6A00] px-2.5 py-1 text-center text-white shadow-sm">
                  <span className="block text-sm font-bold leading-tight">
                    {event.dateDay || "28"}
                  </span>

                  <span className="block text-[10px] font-semibold uppercase tracking-wider">
                    {event.dateMonth || "OCT"}
                  </span>
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => handleRemoveEvent(event.id)}
                  aria-label="Remove saved event"
                  className="absolute right-3 top-3 rounded-full bg-white/95 p-2 text-red-500 shadow-md transition hover:bg-red-50"
                >
                  <Heart size={16} fill="currentColor" />
                </button>
              </div>

              {/* Content */}
              <NavLink to={`/events/${event.id}`} className="block">
                <div className="p-4">
                  <h3 className="truncate text-[15px] font-semibold text-gray-900">
                    {event.text}
                  </h3>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-1 text-xs text-gray-500">
                      <MapPin size={14} className="shrink-0" />

                      <span className="truncate">{event.text2}</span>
                    </div>

                    <span className="shrink-0 text-sm font-semibold text-[#3C6E16]">
                      {event.text3}
                    </span>
                  </div>
                </div>
              </NavLink>

              {/* Remove Button */}
              <div className="border-t border-gray-100 px-4 py-3">
                <button
                  type="button"
                  onClick={() => handleRemoveEvent(event.id)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-100 py-2 text-xs font-medium text-red-500 transition hover:bg-red-50"
                >
                  <Trash2 size={14} />
                  Remove from Saved
                </button>
              </div>
            </div>
          ))}

          {/* ================= HOTELS ================= */}

          {savedHotels.map((hotel) => (
            <div
              key={`hotel-${hotel.id}`}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {/* Image */}
              <div className="relative h-[170px] w-full">
                <NavLink to={`/hotels/${hotel.id}`} className="block h-full">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="h-full w-full object-cover"
                  />
                </NavLink>

                {/* Hotel Tag */}
                {hotel.tag && (
                  <span
                    className={`absolute left-3 top-3 rounded px-2 py-1 text-xs font-semibold ${hotel.text} ${hotel.bg}`}
                  >
                    {hotel.tag}
                  </span>
                )}

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => handleRemoveHotel(hotel.id)}
                  aria-label="Remove saved hotel"
                  className="absolute right-3 top-3 rounded-full bg-white/95 p-2 text-red-500 shadow-md transition hover:bg-red-50"
                >
                  <Heart size={16} fill="currentColor" />
                </button>
              </div>

              {/* Content */}
              <NavLink to={`/hotels/${hotel.id}`} className="block">
                <div className="p-4">
                  <h3 className="truncate text-[15px] font-semibold text-gray-900">
                    {hotel.name}
                  </h3>

                  <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
                    <MapPin size={14} className="shrink-0" />

                    <span className="truncate">{hotel.location}</span>
                  </div>

                  <div className="mt-2 flex items-center gap-1">
                    <Star
                      size={14}
                      className="fill-orange-500 text-orange-500"
                    />

                    <span className="text-sm font-semibold">
                      {hotel.rating}
                    </span>

                    <span className="text-xs text-gray-400">
                      ({hotel.reviews})
                    </span>
                  </div>

                  <p className="mt-2 text-base font-bold">
                    From ₦{hotel.price?.toLocaleString()}
                  </p>

                  <p className="text-xs text-gray-500">/ night</p>
                </div>
              </NavLink>

              {/* Remove Button */}
              <div className="border-t border-gray-100 px-4 py-3">
                <button
                  type="button"
                  onClick={() => handleRemoveHotel(hotel.id)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-100 py-2 text-xs font-medium text-red-500 transition hover:bg-red-50"
                >
                  <Trash2 size={14} />
                  Remove from Saved
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedItems;
