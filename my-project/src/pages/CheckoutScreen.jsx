// import React, { useState } from "react";
// import {
//   Calendar,
//   Clock,
//   MapPin,
//   Plus,
//   Minus,
//   Lock,
//   CheckCircle,
//   HeadphonesIcon,
// } from "lucide-react";

// export default function CheckoutScreen() {
//   // Basic state to manage ticket quantities for the demo
//   const [tickets, setTickets] = useState([
//     { id: "regular", name: "Regular", basePrice: 3000, qty: 2 },
//     { id: "vip", name: "VIP", basePrice: 10000, qty: 1 },
//     { id: "vvip", name: "VVIP", basePrice: 20000, qty: 0 },
//   ]);

//   const updateQty = (id, delta) => {
//     setTickets(
//       tickets.map((t) => {
//         if (t.id === id) {
//           const newQty = Math.max(0, t.qty + delta);
//           return { ...t, qty: newQty };
//         }
//         return t;
//       }),
//     );
//   };

//   const formatCurrency = (amount) => `N${amount.toLocaleString()}`;

//   // Shared component for the numbered section headers
//   const SectionHeader = ({ number, title }) => (
//     <div className="flex items-center gap-3 mb-6">
//       <div className="bg-[#48782E] text-white w-6 h-6 flex items-center justify-center rounded-md text-sm font-bold">
//         {number}
//       </div>
//       <h2 className="text-[20px] font-semibold text-gray-900">{title}</h2>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans text-gray-800">
//       <div className="max-w-6xl mx-auto">
//         {/* Header & Breadcrumbs */}
//         <div className="mb-8">
//           <div className="text-sm text-gray-400 mb-4 flex gap-2">
//             <span>Events</span> &gt; <span>Abia Business Summit 2026</span> &gt;{" "}
//             <span className="text-gray-300">Checkout</span>
//           </div>
//           <h1 className="text-[40px] font-bold mb-2 text-black">Checkout</h1>
//           <p className="text-[#3D3E3E] font-semibold">
//             You're almost there! Complete your booking.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* LEFT COLUMN - MAIN CONTENT */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* 1. Event Details Card */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//               <SectionHeader number="1" title="Event Details" />
//               <div className="flex flex-col md:flex-row gap-6">
//                 <div className="w-full md:w-64 h-40 bg-gray-200 rounded-lg overflow-hidden shrink-0">
//                   <img
//                     src="/checkout.jpg"
//                     alt="Event Banner"
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="space-y-4">
//                   <h3 className="font-semibold text-[18px] text-black">
//                     Abia Business Summit 2026
//                   </h3>
//                   <div className="space-y-3 text-[18px] font-semibold text-[#3D3E3E]">
//                     <div className="flex items-center font-semibold text-[18px] gap-3">
//                       <Calendar className="w-5 h-5 text-gray-400 font-semibold text-[18px]" />
//                       <span>Fri, 25 Oct - Sun, 27 Oct, 2026</span>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <Clock className="w-5 h-5 text-gray-400" />
//                       <span>6:00 PM - 11:00 PM (WAT)</span>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <MapPin className="w-5 h-5 text-gray-400" />
//                       <span>Umueze Sports Arena, Umuahia, Abia</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* 2. Ticket Selection Card */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//               <SectionHeader number="2" title="Ticket Selection" />

//               <div className="grid grid-cols-12 text-[18px] font-semibold text-[#3D3E3E] mb-4 border-b border-gray-100 pb-2">
//                 <div className="col-span-4">Ticket Type</div>
//                 <div className="col-span-4 text-center">Quantity</div>
//                 <div className="col-span-4 text-right pr-12">Price</div>
//               </div>

//               <div className="space-y-6 mb-6">
//                 {tickets.map((ticket) => (
//                   <div
//                     key={ticket.id}
//                     className="grid grid-cols-12 items-center border-b border-gray-50 pb-6 last:border-0 last:pb-0"
//                   >
//                     <div className="col-span-4">
//                       <p className="font-bold text-black text-[18px]">{ticket.name}</p>
//                       <p className="text-sm font-semibold mt-1">
//                         {formatCurrency(ticket.basePrice)}
//                       </p>
//                     </div>

//                     <div className="col-span-4 flex justify-center">
//                       <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
//                         <button
//                           onClick={() => updateQty(ticket.id, -1)}
//                           className="px-3 py-1 hover:bg-gray-50 text-gray-500 transition-colors"
//                         >
//                           <Minus className="w-4 h-4" />
//                         </button>
//                         <div className="px-4 py-1 font-bold text-black border-x border-gray-200 min-w-[2.5rem] text-center">
//                           {ticket.qty}
//                         </div>
//                         <button
//                           onClick={() => updateQty(ticket.id, 1)}
//                           className="px-3 py-1 hover:bg-gray-50 text-[#48782E] transition-colors"
//                         >
//                           <Plus className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </div>

//                     <div className="col-span-4 flex items-center justify-between pl-4">
//                       <span className="font-bold text-black">
//                         {ticket.qty > 0
//                           ? formatCurrency(ticket.basePrice * ticket.qty)
//                           : "N0"}
//                       </span>
//                       <button className="text-xs font-bold text-[#48782E] hover:underline">
//                         Remove
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <button className="flex items-center gap-2 text-[#48782E] font-bold text-sm px-4 py-2 border border-[#48782E] rounded-lg hover:bg-green-50 transition-colors">
//                 <Plus className="w-4 h-4" />
//                 Add another ticket
//               </button>
//             </div>

//             {/* 3. Attendee Information Card */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//               <SectionHeader number="3" title="Attendee Information" />

//               <div className="space-y-5 max-w-lg">
//                 <div>
//                   <label className="block text-sm font-bold text-gray-900 mb-2">
//                     Full Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="Enter full name"
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-bold text-gray-900 mb-2">
//                     Email Address <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="email"
//                     placeholder="Enter email address"
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200"
//                   />
//                 </div>

//                 <div className="flex items-center gap-3 pt-2">
//                   <input
//                     type="checkbox"
//                     id="buyForSomeone"
//                     className="w-4 h-4 text-[#48782E] rounded border-gray-300 focus:ring-[#48782E]"
//                   />
//                   <label
//                     htmlFor="buyForSomeone"
//                     className="text-sm font-semibold text-gray-600 cursor-pointer"
//                   >
//                     I'm buying for someone else
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT COLUMN - SUMMARY & TRUST BADGES */}
//           <div className="space-y-6">
//             {/* Order Summary Card */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//               <h2 className="text-lg font-bold text-black mb-6">
//                 Order Summary
//               </h2>

//               <div className="space-y-4 mb-6 text-sm font-semibold text-gray-600">
//                 <div className="flex justify-between">
//                   <span>Subtotal</span>
//                   <span className="text-black">N16,000</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Service Fee</span>
//                   <span className="text-black">N1,250</span>
//                 </div>
//               </div>

//               <div className="flex justify-between items-center border-t border-gray-100 pt-4 mb-8">
//                 <span className="font-bold text-black text-lg">Total</span>
//                 <span className="font-bold text-[#48782E] text-xl">
//                   N17,250
//                 </span>
//               </div>

//               <button className="w-full bg-[#F36B25] hover:bg-[#d95d1d] text-white font-bold py-3.5 rounded-lg transition-colors mb-6 shadow-sm">
//                 Proceed to Payment
//               </button>

//               <div className="text-center">
//                 <p className="text-sm font-semibold text-gray-500 mb-4">
//                   We accept
//                 </p>
//                 <div className="flex items-center justify-center gap-3 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
//                   {/* Placeholders for payment logos */}
//                   <span className="text-blue-800 font-black italic text-xl">
//                     VISA
//                   </span>
//                   <div className="flex">
//                     <div className="w-6 h-6 rounded-full bg-red-500 opacity-90 -mr-2"></div>
//                     <div className="w-6 h-6 rounded-full bg-yellow-500 opacity-90 mix-blend-multiply"></div>
//                   </div>
//                   <span className="font-bold tracking-tighter">VERVE</span>
//                   <span className="font-bold text-blue-500 text-sm flex items-center gap-1">
//                     <span className="text-[10px]">≡</span> paystack
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Trust Badges Card */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
//               <div className="flex gap-4">
//                 <div className="bg-green-50 p-2.5 rounded-lg h-fit text-[#48782E]">
//                   <Lock className="w-6 h-6" />
//                 </div>
//                 <div>
//                   <h4 className="font-bold text-gray-900 mb-1">
//                     Secured Checkout
//                   </h4>
//                   <p className="text-sm text-gray-500 font-medium leading-relaxed">
//                     Your payment is protected by a secured encryption
//                   </p>
//                 </div>
//               </div>

//               <div className="w-full h-px bg-gray-100"></div>

//               <div className="flex gap-4">
//                 <div className="bg-green-50 p-2.5 rounded-lg h-fit text-[#48782E]">
//                   <CheckCircle className="w-6 h-6" />
//                 </div>
//                 <div>
//                   <h4 className="font-bold text-gray-900 mb-1">
//                     Instant Confirmation
//                   </h4>
//                   <p className="text-sm text-gray-500 font-medium leading-relaxed">
//                     You'll receive your ticket immediately.
//                   </p>
//                 </div>
//               </div>

//               <div className="w-full h-px bg-gray-100"></div>

//               <div className="flex gap-4">
//                 <div className="bg-green-50 p-2.5 rounded-lg h-fit text-[#48782E]">
//                   <HeadphonesIcon className="w-6 h-6" />
//                 </div>
//                 <div>
//                   <h4 className="font-bold text-gray-900 mb-1">24/7 Support</h4>
//                   <p className="text-sm text-gray-500 font-medium leading-relaxed">
//                     We are here to help you anytime.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";

import EventDetailsCard from "../components/checkout/EventDetailsCard";
import TicketSelectionCard from "../components/checkout/TicketSelectionCard";
import AttendeeInfoCard from "../components/checkout/AttendeeInfoCard";
import OrderSummaryCard from "../components/checkout/OrderSummaryCard";
import TrustBadgesCard from "../components/checkout/TrustBadgesCard";

export default function CheckoutScreen() {
  const [tickets, setTickets] = useState([
    { id: "regular", name: "Regular", basePrice: 3000, qty: 2 },
    { id: "vip", name: "VIP", basePrice: 10000, qty: 1 },
    { id: "vvip", name: "VVIP", basePrice: 20000, qty: 0 },
  ]);

  const updateQty = (id, delta) => {
    setTickets(
      tickets.map((t) => {
        if (t.id === id) {
          const newQty = Math.max(0, t.qty + delta);
          return { ...t, qty: newQty };
        }
        return t;
      }),
    );
  };

  const formatCurrency = (amount) => `N${amount.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="text-sm text-gray-400 mb-4 flex gap-2">
            <span>Events</span>
            &gt;
            <span>Abia Business Summit 2026</span>
            &gt;
            <span className="text-gray-300">Checkout</span>
          </div>

          <h1 className="text-[40px] font-bold mb-2 text-black">Checkout</h1>

          <p className="text-[#3D3E3E] font-semibold">
            You're almost there! Complete your booking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <EventDetailsCard />

            <TicketSelectionCard
              tickets={tickets}
              updateQty={updateQty}
              formatCurrency={formatCurrency}
            />

            <AttendeeInfoCard />
          </div>

          <div className="space-y-6">
            <OrderSummaryCard />

            <TrustBadgesCard />
          </div>
        </div>
      </div>
    </div>
  );
}
