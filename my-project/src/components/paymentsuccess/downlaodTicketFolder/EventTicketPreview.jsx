import React, { forwardRef } from "react";

const EventTicketPreview = forwardRef(
  ({ event, tickets, total, orderId }, ref) => {
    return (
      <div
        ref={ref}
        className="bg-white w-[500px] p-6 rounded-xl border-2 border-dashed border-[#48782E]"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-[#172033]">Mmemme Abia</h2>
          <span className="text-xs font-semibold text-[#48782E]">
            EVENT TICKET
          </span>
        </div>

        <div className="flex gap-3 mb-4">
          <img
            src={event?.image || "/checkout.jpg"}
            alt={event?.text}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div>
            <h3 className="font-bold text-base">{event?.text || "Event"}</h3>
            <p className="text-sm text-gray-500">
              {event?.text2 || "Location unavailable"}
            </p>
          </div>
        </div>

        <hr className="border-dashed border-gray-300 my-4" />

        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <span className="text-gray-500">Order ID</span>
          <span className="font-semibold text-right">{orderId}</span>

          <span className="text-gray-500">Tickets</span>
          <span className="font-semibold text-right">
            {tickets?.length || 0}
          </span>

          <span className="text-gray-500">Total Paid</span>
          <span className="font-semibold text-right">
            ₦{(total || 0).toLocaleString()}
          </span>
        </div>

        <hr className="border-dashed border-gray-300 my-4" />

        <p className="text-center text-xs text-gray-400">
          Present this ticket at the event entrance
        </p>
      </div>
    );
  },
);

export default EventTicketPreview;
