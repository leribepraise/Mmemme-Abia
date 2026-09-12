import React, { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  CalendarDays,
  Ticket,
  Users,
  MoreHorizontal,
} from "lucide-react";

import SectionHeader from "./common/SectionHeader";

const MyBookings = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  // Static booking data for now.
  // Later, this can come from sessionStorage or the backend.
  const bookings = [
    {
      id: "MMA32567",
      image: "/event1.jpg",
      title: "Hotel Oris Live Concert",
      location: "Umuahia Sports Arena, Umuahia",
      date: "Fri, Oct 25, 2025 - 7:00 PM",
      quantity: "2 Tickets",
      price: "₦2,500",
      payment: "Paid",
      status: "Confirmed",
      dateNumber: "25",
      month: "OCT",
    },
    {
      id: "MMA32919",
      image: "/cultural-festival.jpg",
      title: "Abia Cultural Festival",
      location: "Ohafia Township Stadium, Ohafia",
      date: "Fri, Oct 31, 2025 - 10:00 AM",
      quantity: "3 Tickets",
      price: "Free",
      payment: "Free Booking",
      status: "Confirmed",
      dateNumber: "31",
      month: "OCT",
    },
    {
      id: "MMA33102",
      image: "/event3-2.jpg",
      title: "Abia Food & Drinks Carnival",
      location: "Arochukwu Main Market, Arochukwu",
      date: "Sun, Nov 02, 2025 - 12:00 PM",
      quantity: "1 Ticket",
      price: "₦2,000",
      payment: "Paid",
      status: "Confirmed",
      dateNumber: "02",
      month: "NOV",
    },
    {
      id: "MMA33488",
      image: "/hotel.png",
      title: "Sweet Spirit Hotel Stay",
      location: "Umuahia, Abia State",
      date: "Sat, Nov 15 - Sun, Nov 16, 2025",
      quantity: "1 Room",
      price: "₦25,000",
      payment: "Paid",
      status: "Pending",
      dateNumber: "15",
      month: "NOV",
    },
    {
      id: "MMA33611",
      image: "/bus.jpg",
      title: "Ride to Enyimba Stadium",
      location: "Umuahia Park, Umuahia",
      date: "Thu, Nov 20, 2025 - 3:00 PM",
      quantity: "2 Seats",
      price: "₦1,200",
      payment: "Paid",
      status: "Pending",
      dateNumber: "20",
      month: "NOV",
    },
  ];

  const filters = ["All", "Upcoming", "Completed", "Cancelled"];

  const filteredBookings =
    activeFilter === "All"
      ? bookings
      : bookings.filter((booking) => booking.status === activeFilter);

  return (
    <div className="mx-auto w-full max-w-[1100px]">
      {/* Section Header */}
      <SectionHeader
        title="My Bookings"
        description="View and manage all your bookings in one place."
      />

      {/* Filters + Search */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                activeFilter === filter
                  ? "bg-[#3F783D] text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Search + Filter Button */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search bookings..."
              className="h-9 w-[170px] rounded-md border border-gray-200 bg-white pl-9 pr-3 text-xs outline-none transition focus:border-[#3F783D]"
            />
          </div>

          <button className="flex h-9 items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-xs text-gray-600 hover:bg-gray-50">
            <SlidersHorizontal size={13} />
            Filter
          </button>
        </div>
      </div>

      {/* Booking List */}
      <div className="space-y-3">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center"
            >
              {/* Event Image */}
              <div className="relative h-[85px] w-full shrink-0 overflow-hidden rounded-md sm:h-[78px] sm:w-[118px]">
                <img
                  src={booking.image}
                  alt={booking.title}
                  className="h-full w-full object-cover"
                />

                {/* Date Badge */}
                <div className="absolute left-2 top-2 flex w-[25px] flex-col items-center rounded bg-white px-1 py-1 shadow-sm">
                  <span className="text-[10px] font-bold leading-none text-gray-800">
                    {booking.dateNumber}
                  </span>

                  <span className="mt-0.5 text-[7px] font-semibold text-gray-500">
                    {booking.month}
                  </span>
                </div>
              </div>

              {/* Booking Information */}
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-bold text-gray-900">
                  {booking.title}
                </h3>

                <div className="mt-2 space-y-1">
                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                    <MapPin size={11} />
                    <span>{booking.location}</span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                    <CalendarDays size={11} />
                    <span>{booking.date}</span>
                  </div>

                  {/* Booking ID + Quantity */}
                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Ticket size={11} />
                      <span>Booking ID: {booking.id}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Users size={11} />
                      <span>{booking.quantity}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price + Status */}
              <div className="flex shrink-0 flex-row items-center justify-between gap-4 sm:h-full sm:w-[105px] sm:flex-col sm:items-end sm:justify-center">
                <div className="text-right">
                  <p className="text-sm font-bold text-[#3F783D]">
                    {booking.price}
                  </p>

                  <p className="text-[9px] text-gray-400">{booking.payment}</p>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-[9px] font-medium ${
                    booking.status === "Confirmed"
                      ? "bg-green-50 text-green-600"
                      : booking.status === "Pending"
                        ? "bg-orange-50 text-orange-500"
                        : "bg-red-50 text-red-500"
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-2 border-t border-gray-100 pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
                <button
                  className={`h-8 rounded border px-4 text-[10px] font-medium transition ${
                    booking.status === "Confirmed"
                      ? "border-[#3F783D] text-[#3F783D] hover:bg-green-50"
                      : "border-orange-300 text-orange-500 hover:bg-orange-50"
                  }`}
                >
                  View Details
                </button>

                <button className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 text-gray-400 hover:bg-gray-50">
                  <MoreHorizontal size={15} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex min-h-[250px] flex-col items-center justify-center rounded-xl bg-white p-8 text-center shadow-sm">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
              <Ticket size={22} className="text-[#3F783D]" />
            </div>

            <h3 className="font-semibold text-gray-800">No bookings found</h3>

            <p className="mt-1 text-xs text-gray-500">
              You don't have any {activeFilter.toLowerCase()} bookings yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
