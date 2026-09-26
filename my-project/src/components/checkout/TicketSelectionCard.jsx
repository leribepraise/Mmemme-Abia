// import React from "react";
// import { Plus, Minus, Trash2 } from "lucide-react";
// import SectionHeader from "./SectionHeader";

// const TicketSelectionCard = ({
//   tickets = [],
//   updateQty = () => {},
//   formatCurrency = (val) => `₦${val.toLocaleString()}`,
//   isFree = false,
// }) => {
//   return (
//     <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
//       <SectionHeader number="2" title="Ticket Selection" />

//       {/* TABLE HEADER - Hidden on small mobile screens for clean stacked display */}
//       <div className="mb-4 hidden grid-cols-12 border-b border-gray-100 pb-3 text-sm font-bold text-gray-500 sm:grid">
//         <div className="col-span-5">Ticket Type</div>
//         <div className="col-span-4 text-center">Quantity</div>
//         <div className="col-span-3 text-right">Price</div>
//       </div>

//       {/* TICKET ITEMS */}
//       <div className="mb-6 space-y-6">
//         {tickets.map((ticket) => {
//           const itemTotal = ticket.qty > 0 ? ticket.basePrice * ticket.qty : 0;

//           return (
//             <div
//               key={ticket.id}
//               className="flex flex-col gap-4 border-b border-gray-100 pb-6 sm:grid sm:grid-cols-12 sm:items-center last:border-0 last:pb-0"
//             >
//               {/* TICKET DETAILS */}
//               <div className="sm:col-span-5">
//                 <p className="text-base font-extrabold text-gray-900 md:text-lg">
//                   {ticket.name}
//                 </p>
//                 <p className="mt-0.5 text-sm font-semibold text-gray-500">
//                   {isFree ? "Free" : formatCurrency(ticket.basePrice)}
//                 </p>
//               </div>

//               {/* QUANTITY CONTROLS */}
//               <div className="flex items-center justify-between sm:col-span-4 sm:justify-center">
//                 <span className="text-xs font-bold text-gray-400 sm:hidden">
//                   Quantity
//                 </span>
//                 <div
//                   className={`flex items-center rounded-xl border border-gray-200 bg-gray-50/50 ${
//                     isFree ? "opacity-50" : ""
//                   }`}
//                 >
//                   <button
//                     type="button"
//                     onClick={() => updateQty(ticket.id, -1)}
//                     disabled={isFree || ticket.qty <= 0}
//                     className="cursor-pointer p-2 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
//                     aria-label="Decrease quantity"
//                   >
//                     <Minus className="h-4 w-4" />
//                   </button>

//                   <span className="min-w-[2.5rem] text-center text-sm font-extrabold text-gray-900">
//                     {ticket.qty}
//                   </span>

//                   <button
//                     type="button"
//                     onClick={() => updateQty(ticket.id, 1)}
//                     disabled={isFree}
//                     className="cursor-pointer p-2 text-[#265F27] transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40"
//                     aria-label="Increase quantity"
//                   >
//                     <Plus className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>

//               {/* PRICE & REMOVE ACTION */}
//               <div className="flex items-center justify-between sm:col-span-3 sm:justify-end sm:gap-4">
//                 <span className="text-base font-extrabold text-gray-900 md:text-lg">
//                   {isFree
//                     ? "Free"
//                     : itemTotal > 0
//                     ? formatCurrency(itemTotal)
//                     : formatCurrency(0)}
//                 </span>

//                 {true && (
//                   <button
//                     type="button"
//                     onClick={() => updateQty(ticket.id, -ticket.qty)}
//                     className="flex items-center gap-1 text-xs font-bold text-red-600 transition hover:underline sm:text-gray-400 sm:hover:text-red-600"
//                   >
//                     <Trash2 className="h-3.5 w-3.5 sm:hidden" />
//                     <span>Remove</span>
//                   </button>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* ADD MORE TICKETS */}
//       {true && (
//         <button
//           type="button"
//           className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#265F27] px-4 py-2.5 text-sm font-extrabold text-[#265F27] transition hover:bg-green-50/60"
//         >
//           <Plus className="h-4 w-4" />
//           Add another ticket
//         </button>
//       )}
//     </div>
//   );
// };

// export default TicketSelectionCard;

import React from "react";
import { Plus, Minus } from "lucide-react";
import SectionHeader from "./SectionHeader";

const TicketSelectionCard = ({
  tickets = [],
  updateQty = () => {},
  enabledTiers = {},
  toggleTier = () => {},
  formatCurrency = (val) => `₦${val.toLocaleString()}`,
  isFree = false,
}) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
      <SectionHeader number="2" title="Ticket Selection" />

      {/* TABLE HEADER - Hidden on small mobile screens for clean stacked display */}
      <div className="mb-4 hidden grid-cols-12 border-b border-gray-100 pb-3 text-sm font-bold text-gray-500 sm:grid">
        <div className="col-span-5">Ticket Type</div>
        <div className="col-span-4 text-center">Quantity</div>
        <div className="col-span-3 text-right">Price</div>
      </div>

      {/* TICKET ITEMS */}
      <div className="mb-6 space-y-6">
        {tickets.map((ticket) => {
          const itemTotal = ticket.qty > 0 ? ticket.basePrice * ticket.qty : 0;
          const isEnabled = enabledTiers[ticket.id];
          const stepperDisabled = !isEnabled;

          return (
            <div
              key={ticket.id}
              className="flex flex-col gap-4 border-b border-gray-100 pb-6 sm:grid sm:grid-cols-12 sm:items-center last:border-0 last:pb-0"
            >
              {/* TICKET DETAILS */}
              <div className="sm:col-span-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-extrabold text-gray-900 md:text-lg">
                      {ticket.name}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-gray-500">
                      {isFree ? "Free" : formatCurrency(ticket.basePrice)}
                    </p>
                  </div>

                  {true && (
                    <button
                      type="button"
                      onClick={() => toggleTier(ticket.id)}
                      className={`w-10 h-5.5 rounded-full transition shrink-0 relative ${
                        isEnabled ? "bg-[#265F27]" : "bg-gray-300"
                      }`}
                      aria-label={`Toggle ${ticket.name}`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full transition-transform ${
                          isEnabled ? "translate-x-4.5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  )}
                </div>
              </div>

              {/* QUANTITY CONTROLS */}
              <div className="flex items-center justify-between sm:col-span-4 sm:justify-center">
                <span className="text-xs font-bold text-gray-400 sm:hidden">
                  Quantity
                </span>
                <div
                  className={`flex items-center rounded-xl border border-gray-200 bg-gray-50/50 ${
                    stepperDisabled ? "opacity-50" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => updateQty(ticket.id, -1)}
                    disabled={stepperDisabled || ticket.qty <= 0}
                    className="cursor-pointer p-2 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <span className="min-w-[2.5rem] text-center text-sm font-extrabold text-gray-900">
                    {ticket.qty}
                  </span>

                  <button
                    type="button"
                    onClick={() => updateQty(ticket.id, 1)}
                    disabled={stepperDisabled}
                    className="cursor-pointer p-2 text-[#265F27] transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* PRICE */}
              <div className="flex items-center justify-between sm:col-span-3 sm:justify-end">
                <span className="text-base font-extrabold text-gray-900 md:text-lg">
                  {isFree ? "Free" : formatCurrency(itemTotal)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TicketSelectionCard;
