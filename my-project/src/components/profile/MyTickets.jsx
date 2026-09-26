import { useCollection } from "@/hooks/useApi";
import React, { useState, useEffect } from "react";
import { CalendarDays, MapPin, Ticket } from "lucide-react";

import SectionHeader from "./common/SectionHeader";
import TicketQRCode from "./common/qrCodeFolder/TicketQRCode";

const getBookedDate = (id) => {
  const timestamp = id?.split("-")[1];
  if (!timestamp) return "";

  const date = new Date(Number(timestamp));
  return isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

const getTicketSummary = (ticketArray) => {
  if (!Array.isArray(ticketArray) || ticketArray.length === 0) {
    return { ticketType: "Ticket", quantity: 0 };
  }

  const activeTiers = ticketArray.filter((t) => t.qty > 0);

  if (activeTiers.length === 0) {
    return { ticketType: "Ticket", quantity: 0 };
  }

  const ticketType = activeTiers.map((t) => t.name).join(" + ");
  const quantity = activeTiers.reduce((sum, t) => sum + t.qty, 0);

  return { ticketType, quantity };
};

const MyTickets = () => {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const { data: issuedTickets } = useCollection('/tickets/');
  const tickets = issuedTickets.map(ticket => ({ ...ticket, title: ticket.ticket_number, image: '/event.jpg', date: '', venue: '', location: '', ticketType: 'Admission', quantity: 1, status: ticket.status === 'ACTIVE' ? 'Upcoming' : ticket.status === 'USED' ? 'Past' : 'Cancelled' }));
  const tabs = ["Upcoming", "Past", "Cancelled"];

  const filteredTickets = tickets.filter(
    (ticket) => ticket.status === activeTab,
  );

  return (
    <div className="mx-auto w-full max-w-[1100px]">
      <SectionHeader title="My Tickets" />

      {/* Tabs */}
      <div className="mb-4 border-b border-gray-200">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-3 text-sm font-medium transition ${
                activeTab === tab
                  ? "text-[#267A26]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}

              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#267A26]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets */}
      <div className="space-y-3">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm sm:p-4 lg:flex-row lg:items-center"
            >
              {/* Event Image */}
              <div className="h-[120px] w-full shrink-0 overflow-hidden rounded-lg sm:h-[140px] sm:w-[190px]">
                <img
                  src={ticket.image}
                  alt={ticket.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Ticket Information */}
              <div className="flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <h3 className="text-base font-bold text-gray-900 sm:text-lg">
                    {ticket.title}
                  </h3>

                  <span className="w-fit rounded-full bg-green-50 px-3 py-1 text-[10px] font-medium text-green-600">
                    {ticket.status}
                  </span>
                </div>

                {/* Date */}
                {ticket.date && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                    <CalendarDays size={13} />
                    <span>Booked on {ticket.date}</span>
                  </div>
                )}

                {/* Location */}
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                  <MapPin size={13} />
                  <span>{ticket.venue}</span>
                </div>

                {/* Ticket Type */}
                <div className="mt-2 flex items-center gap-2 text-xs font-medium text-orange-500">
                  <Ticket size={13} />
                  <span>
                    {ticket.ticketType} · {ticket.quantity}{" "}
                    {ticket.quantity === 1 ? "Ticket" : "Tickets"}
                  </span>
                </div>
              </div>

              {/* View Ticket */}
              {/* View Ticket */}
              <div className="flex shrink-0 items-center justify-center border-t border-gray-100 pt-4 lg:h-[100px] lg:w-[100px] lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
                <button className="flex flex-col items-center gap-1">
                  <div className="flex h-[55px] w-[55px] items-center justify-center rounded bg-white">
                    <TicketQRCode value={ticket.qr_code} />
                  </div>

                  <span className="text-[9px] font-semibold text-[#174A20]">
                    View Ticket
                  </span>
                </button>
              </div>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl bg-white p-8 text-center shadow-sm">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
              <Ticket className="text-[#267A26]" size={25} />
            </div>

            <h3 className="font-semibold text-gray-800">
              No {activeTab.toLowerCase()} tickets
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              You don't have any {activeTab.toLowerCase()} tickets yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;
