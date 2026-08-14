// import React, { useState } from "react";
// import {
//   Search,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   CalendarDays,
//   Heart,
//   MapPin,
//   Grid2X2,
//   List,
// } from "lucide-react";
// import Updateed from "../components/home/Updateed";
// import Patners from "../components/home/Patners";
// import { NavLink } from "react-router-dom";

// const events = [
//   { date: "28", month: "OCT", price: "N3,000" },
//   { date: "25", month: "OCT", price: "N2,500" },
//   { date: "02", month: "NOV", price: "N2,000" },
//   { date: "31", month: "OCT", price: "Free" },
//   { date: "31", month: "OCT", price: "N1,500" },
//   { date: "31", month: "OCT", price: "Free" },
// ];
// const eventss = [
//   {
//     image: "/Frame1.png",
//     text: "Hotel Oris Live Concert",
//     icon: "",
//     text2: "Umuahia, Abia",
//     text3: "N2,500",
//     addLink: "/event",
//   },
//   {
//     image: "/Frame2.png",
//     text: "Abia Business Summit 2026",
//     icon: "",
//     text2: "Aba, Abia",
//     text3: "N3,000",
//     addLink: false,
//   },
//   {
//     image: "/Frame3.png",
//     text: "Abia Cultural Festival",
//     icon: "",
//     text2: "Ohafia, Abia",
//     text3: "Free",
//     addLink: false,
//   },
//   {
//     image: "/Frame4.png",
//     text: "Abia Food & Drinks Carnival",
//     icon: "",
//     text2: "Arochukwu, Abia",
//     text3: "N2,000",
//     addLink: false,
//   },
//   {
//     image: "/football.png",
//     text: "Abia Unity Footbal Cup",
//     icon: "",
//     text2: "Aba, Abia",
//     text3: "N1,500",
//     addLink: false,
//   },
//   {
//     image: "/football2.png",
//     text: "Women in Tech Conference",
//     icon: "",
//     text2: "Umuahia, Abia",
//     text3: "Free",
//     addLink: false,
//   },
// ];

// const Events = () => {
//   const [slider, setSlider] = useState(0);
//   const cal = 3000 - slider;
//   return (
//     <div className="min-h-screen bg-[#f5f7f3] px-4 py-5 text-black md:px-6">
//       {/* PAGE HEADER */}
//       <div className="mb-4">
//         <h1 className="text-[25px] font-semibold">Explore Events</h1>

//         <p className="text-[18px] text-[#3D3E3E]">
//           Discover amazing events happening across Abia State.
//         </p>
//       </div>

//       {/* MAIN CONTENT */}
//       <div className="grid gap-4 lg:grid-cols-[225px_1fr]">
//         {/* ================= FILTER SIDEBAR ================= */}
//         <aside className="h-fit rounded-xl bg-white p-3 shadow-md">
//           {/* Filter heading */}
//           <div className="mb-4 flex items-center justify-between">
//             <h2 className="text-[18px] font-bold">Filters</h2>

//             <button className="text-[12px] font-normal text-green-700">
//               Clear all
//             </button>
//           </div>

//           {/* SEARCH */}
//           <div className="mb-3">
//             <label className="mb-1 block text-[16px] font-medium">Search</label>

//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search events..."
//                 className="h-8 w-full rounded-md border border-gray-300 bg-white px-2 pr-7 text-[9px] outline-none focus:border-green-700 placeholder:font-semibold"
//               />

//               <Search
//                 size={13}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
//               />
//             </div>
//           </div>

//           {/* LOCATION */}
//           <div className="mb-3">
//             <label className="mb-1 block text-[9px] font-semibold">
//               Location
//             </label>

//             <div className="relative">
//               <select className="h-8 w-full appearance-none rounded-md border border-gray-300 bg-white px-2 text-[9px] text-gray-500 outline-none focus:border-green-700 font-semibold">
//                 <option>All locations</option>
//                 <option>Aba</option>
//                 <option>Umuahia</option>
//                 <option>Arochukwu</option>
//               </select>

//               <ChevronDown
//                 size={13}
//                 className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
//               />
//             </div>
//           </div>

//           {/* DATE */}
//           <div className="mb-3">
//             <label className="mb-1 block text-[9px] font-semibold">Date</label>

//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Select date"
//                 className="h-8 w-full rounded-md border border-gray-300 bg-white px-2 pr-7 text-[9px] text-gray-500 outline-none focus:border-green-700 placeholder:font-semibold"
//               />

//               <CalendarDays
//                 size={12}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
//               />
//             </div>
//           </div>

//           {/* CATEGORIES */}
//           <div className="mb-3">
//             <label className="mb-1 block text-[9px] font-semibold">
//               Categories
//             </label>

//             <div className="relative">
//               <select className="h-8 w-full appearance-none rounded-md border border-gray-300 bg-white px-2 text-[9px] text-gray-500 outline-none focus:border-green-700 font-semibold">
//                 <option>All categories</option>
//                 <option>Music</option>
//                 <option>Sports</option>
//                 <option>Business</option>
//                 <option>Technology</option>
//                 <option>Food</option>
//               </select>

//               <ChevronDown
//                 size={13}
//                 className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
//               />
//             </div>
//           </div>

//           {/* PRICE RANGE */}
//           <div className="mb-4">
//             <label className="mb-2 block text-[9px] font-semibold">
//               Price Range
//             </label>

//             <input
//               type="range"
//               min="0"
//               max="3000"
//               value={slider}
//               onChange={(e) => setSlider(Number(e.target.value))}
//               className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[#3C6E16] accent-[#3C6E16]"
//             />

//             <div className="mt-1 flex justify-between text-[8px] font-medium">
//               <span>₦{slider}</span>
//               <span>₦{cal.toLocaleString()}</span>
//             </div>
//           </div>

//           {/* APPLY BUTTON */}
//           <button className="w-full rounded-md bg-green-700 py-2 text-[9px] font-semibold text-white transition hover:bg-green-800">
//             Apply Filters
//           </button>
//         </aside>

//         {/* ================= RIGHT SIDE ================= */}
//         <main>
//           {/* TOP BAR */}
//           <div className="mb-3 flex h-10 items-center justify-between rounded-lg bg-white px-4 shadow-sm">
//             <p className="text-[10px] font-semibold">20 Events found</p>

//             <div className="flex items-center gap-3">
//               {/* SORT */}
//               <div className="relative">
//                 <select className="h-7 appearance-none rounded-md border border-gray-300 bg-white pl-2 pr-7 text-[9px] outline-none">
//                   <option>Sort by: Most Relevant</option>

//                   <option>Price: Low to High</option>

//                   <option>Price: High to Low</option>
//                 </select>

//                 <ChevronDown
//                   size={12}
//                   className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
//                 />
//               </div>

//               {/* GRID ICON */}
//               <button className="text-green-700">
//                 <Grid2X2 size={16} />
//               </button>

//               {/* LIST ICON */}
//               <button>
//                 <List size={18} />
//               </button>
//             </div>
//           </div>

//           {/* EVENT CARDS */}
//           <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
//             {eventss.map((event, index) => {
//               const card = (
//                 <div
//                   key={`first-${index}`}
//                   className="w-[313px] h-[240px] rounded-3xl bg-[#FEFEFE] transition duration-300 hover:bg-[#F1FCEE] hover:text-black hover:-translate-y-1 hover:shadow-md cursor-pointer shrink-0"
//                 >
//                   {<img src={event.image} className="w-full" />}
//                   <div className="p-3 space-y-3">
//                     <p className="font-semibold text-[16px]">{event.text}</p>{" "}
//                     <div className="flex justify-between">
//                       <p className="font-medium text-[12px]">{event.text2}</p>{" "}
//                       <p className="font-semibold text-[16px] text-[#3C6E16]">
//                         {event.text3}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               );
//               return event.addLink ? (
//                 <NavLink to={event.addLink} key={index}>
//                   {card}
//                 </NavLink>
//               ) : (
//                 <div key={index}>{card}</div>
//               );
//             })}
//           </div>

//           {/* PAGINATION */}
//           <div className="mt-6 flex justify-center gap-1">
//             {/* PREVIOUS */}
//             <button className="flex h-6 w-6 items-center justify-center rounded border border-gray-200 bg-white">
//               <ChevronLeft size={13} />
//             </button>

//             {/* PAGE 1 */}
//             <button className="h-6 w-6 rounded bg-green-700 text-[10px] font-semibold text-white">
//               1
//             </button>

//             {/* PAGE 2 */}
//             <button className="h-6 w-6 rounded border border-gray-200 bg-white text-[10px]">
//               2
//             </button>

//             {/* PAGE 3 */}
//             <button className="h-6 w-6 rounded border border-gray-200 bg-white text-[10px]">
//               3
//             </button>

//             {/* PAGE 4 */}
//             <button className="h-6 w-6 rounded border border-gray-200 bg-white text-[10px]">
//               4
//             </button>

//             {/* ELLIPSIS */}
//             <button className="h-6 w-8 rounded border border-gray-200 bg-white text-[10px]">
//               ...
//             </button>

//             {/* PAGE 20 */}
//             <button className="h-6 w-7 rounded border border-gray-200 bg-white text-[10px]">
//               20
//             </button>

//             {/* NEXT */}
//             <button className="flex h-6 w-6 items-center justify-center rounded border border-gray-200 bg-white">
//               <ChevronRight size={13} />
//             </button>
//           </div>
//         </main>
//       </div>
//       <Updateed />
//       <Patners />
//     </div>
//   );
// };

// export default Events;

import React, { useState } from "react";
import FilterSidebar from "../components/events/FilterSidebar";
import EventsTopBar from "../components/events/EventsTopBar";
import EventGrid from "../components/events/EventGrid";
import Pagination from "../components/events/Pagination";
import Updateed from "../components/home/Updateed";
import Patners from "../components/home/Patners";
import { eventss } from "../data/eventData";

const Events = () => {
  const [slider, setSlider] = useState(0);

  return (
    <div className="min-h-screen bg-[#f5f7f3] px-4 py-5 md:px-6">
      <div className="mb-4">
        <h1 className="text-[25px] font-semibold">Explore Events</h1>

        <p className="text-[18px] text-[#3D3E3E]">
          Discover amazing events happening across Abia State.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[225px_1fr]">
        <FilterSidebar slider={slider} setSlider={setSlider} />

        <main>
          <EventsTopBar />

          <EventGrid events={eventss} />

          <Pagination />
        </main>
      </div>

      <Updateed />
      <Patners />
    </div>
  );
};

export default Events;
