import React, { useState } from "react";
import { CalendarDays, MapPin, Ticket } from "lucide-react";

import SectionHeader from "./common/SectionHeader";

const MyTickets = () => {
  const [activeTab, setActiveTab] = useState("Upcoming");

  // Static for now.
  // Later, this will come from sessionStorage/backend.
  const tickets = [
    {
      id: 1,
      title: "Shere Bangla Live Concert",
      image: "/shere-bangla.jpg",
      date: "Fri, 25 Oct 2026",
      time: "6:00 PM",
      venue: "Umudike Sports Arena",
      location: "Umuahia",
      ticketType: "VIP Ticket",
      quantity: 2,
      status: "Upcoming",
      qrImage: "/qr-ticket-1.jpg",
    },
    {
      id: 2,
      title: "Abia Business Summit 2026",
      image: "/business-summit.jpg",
      date: "Sat, 26 Oct 2026",
      time: "9:00 AM",
      venue: "Abia Convention Center",
      location: "Aba",
      ticketType: "Regular",
      quantity: 1,
      status: "Upcoming",
      qrImage: "/qr-ticket-2.jpg",
    },
    {
      id: 3,
      title: "Abia Cultural Festival",
      image: "/cultural-festival.jpg",
      date: "Thu, 31 Oct 2026",
      time: "10:00 AM",
      venue: "Ohafia Township Stadium",
      location: "Ohafia",
      ticketType: "General Admission",
      quantity: 3,
      status: "Upcoming",
      qrImage: "/qr-ticket-3.jpg",
    },
    {
      id: 4,
      title: "Abia Food & Drink Carnival",
      image: "/food-carnival.jpg",
      date: "Sat, 02 Nov 2026",
      time: "11:00 PM",
      venue: "Azumini Blue River Park",
      location: "Azumini",
      ticketType: "Regular",
      quantity: 2,
      status: "Upcoming",
      qrImage: "/qr-ticket-4.jpg",
    },
  ];

  const tabs = ["Upcoming", "Past", "Cancelled"];

  const filteredTickets = tickets.filter(
    (ticket) => ticket.status === activeTab,
  );

  return (
    <div className="mx-auto w-full max-w-[1100px]">
      <SectionHeader
        title="My Tickets"
      />

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
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                  <CalendarDays size={13} />
                  <span>
                    {ticket.date} · {ticket.time}
                  </span>
                </div>

                {/* Location */}
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                  <MapPin size={13} />
                  <span>
                    {ticket.venue}, {ticket.location}
                  </span>
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

              {/* QR / View Ticket */}
              <div className="flex shrink-0 items-center justify-center border-t border-gray-100 pt-4 lg:h-[100px] lg:w-[100px] lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
                <button className="flex flex-col items-center gap-1">
                  <div className="h-[55px] w-[55px] overflow-hidden bg-gray-100">
                    <img
                      src={ticket.qrImage}
                      alt="Ticket QR code"
                      className="h-full w-full object-cover"
                    />
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
