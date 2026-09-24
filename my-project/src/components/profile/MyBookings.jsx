import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  CalendarDays,
  Ticket,
  Users,
  MoreHorizontal,
  Hotel,
  Check,
} from "lucide-react";

import SectionHeader from "./common/SectionHeader";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [activeType, setActiveType] = useState("All");
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const loadBookings = () => {
    const savedBookings = sessionStorage.getItem("bookings");

    try {
      const parsedBookings = savedBookings ? JSON.parse(savedBookings) : [];

      if (Array.isArray(parsedBookings)) {
        setBookings(parsedBookings);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Error reading bookings:", error);
      setBookings([]);
    }
  };

  useEffect(() => {
    loadBookings();

    window.addEventListener("bookingsUpdated", loadBookings);

    return () => {
      window.removeEventListener("bookingsUpdated", loadBookings);
    };
  }, []);

  const getBookingType = (booking) => {
    if (booking.type) {
      return booking.type;
    }

    if (booking.tickets) {
      return "event";
    }

    if (booking.hotel) {
      return "hotel";
    }

    return "event";
  };

  const getBookingStatus = (booking) => {
    if (booking.status === "Confirmed" || booking.status === "Pending") {
      return "Upcoming";
    }

    if (booking.status === "Cancelled") {
      return "Cancelled";
    }

    if (booking.status === "Completed") {
      return "Completed";
    }

    return booking.status;
  };

  const getTicketQuantity = (booking) => {
    if (booking.quantity) {
      return booking.quantity;
    }

    if (booking.type === "event" && booking.tickets) {
      const totalTickets = Object.values(booking.tickets).reduce(
        (total, quantity) => total + Number(quantity || 0),
        0,
      );

      return `${totalTickets} ${totalTickets === 1 ? "Ticket" : "Tickets"}`;
    }

    if (booking.type === "hotel") {
      return "1 Room";
    }

    return "N/A";
  };

  const getDetailsLink = (booking) => {
    const type = getBookingType(booking);

    if (type === "event") {
      return booking.eventId ? `/events/${booking.eventId}` : null;
    }

    if (type === "hotel") {
      return booking.hotelId ? `/hotels/${booking.hotelId}` : null;
    }

    return null;
  };

  const filteredBookings = bookings.filter((booking) => {
    const type = getBookingType(booking);
    const status = getBookingStatus(booking);

    const matchesType =
      activeType === "All" ||
      (activeType === "Events" && type === "event") ||
      (activeType === "Hotels" && type === "hotel");

    const matchesStatus = activeFilter === "All" || status === activeFilter;

    const search = searchQuery.toLowerCase().trim();

    const matchesSearch =
      !search ||
      booking.title?.toLowerCase().includes(search) ||
      booking.location?.toLowerCase().includes(search) ||
      booking.id?.toLowerCase().includes(search);

    return matchesType && matchesStatus && matchesSearch;
  });

  const statusFilters = ["All", "Upcoming", "Completed", "Cancelled"];

  const typeFilters = ["All", "Events", "Hotels"];

  return (
    <div className="mx-auto w-full max-w-[1100px]">
      <SectionHeader
        title="My Bookings"
        description="View and manage all your bookings in one place."
      />

      {/* Status Filters + Search */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter}
              type="button"
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

        {/* Search + Filter */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bookings..."
              className="h-9 w-[170px] rounded-md border border-gray-200 bg-white pl-9 pr-3 text-xs outline-none transition focus:border-[#3F783D]"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilter((prev) => !prev)}
              className={`flex h-9 items-center gap-2 rounded-md border px-3 text-xs transition ${
                activeType !== "All"
                  ? "border-[#3F783D] bg-green-50 text-[#3F783D]"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <SlidersHorizontal size={13} />
              Filter
            </button>

            {showFilter && (
              <div className="absolute right-0 top-11 z-30 w-[160px] rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg">
                <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Booking Type
                </p>

                {typeFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => {
                      setActiveType(filter);
                      setShowFilter(false);
                    }}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs text-gray-600 transition hover:bg-gray-50"
                  >
                    <span>{filter}</span>

                    {activeType === filter && (
                      <Check size={13} className="text-[#3F783D]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking List */}
      <div className="space-y-3">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => {
            const type = getBookingType(booking);
            const detailsLink = getDetailsLink(booking);

            return (
              <div
                key={booking.id}
                className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center"
              >
                {/* Image */}
                <div className="relative h-[85px] w-full shrink-0 overflow-hidden rounded-md sm:h-[78px] sm:w-[118px]">
                  <img
                    src={booking.image || "/placeholder.png"}
                    alt={booking.title}
                    className="h-full w-full object-cover"
                  />

                  {/* Event Date */}
                  {type === "event" && (
                    <div className="absolute left-2 top-2 flex w-[25px] flex-col items-center rounded bg-white px-1 py-1 shadow-sm">
                      <span className="text-[10px] font-bold leading-none text-gray-800">
                        {booking.dateNumber || "--"}
                      </span>

                      <span className="mt-0.5 text-[7px] font-semibold text-gray-500">
                        {booking.month || "---"}
                      </span>
                    </div>
                  )}

                  {/* Hotel Badge */}
                  {type === "hotel" && (
                    <div className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm">
                      <Hotel size={13} className="text-[#3F783D]" />
                    </div>
                  )}
                </div>

                {/* Booking Information */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-bold text-gray-900">
                      {booking.title}
                    </h3>

                    <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[8px] font-medium capitalize text-gray-500">
                      {type}
                    </span>
                  </div>

                  <div className="mt-2 space-y-1">
                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                      <MapPin size={11} />
                      <span>{booking.location}</span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                      <CalendarDays size={11} />
                      <span>{booking.date || "Date unavailable"}</span>
                    </div>

                    {/* Booking ID + Quantity */}
                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Ticket size={11} />
                        <span>Booking ID: {booking.id}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Users size={11} />
                        <span>{getTicketQuantity(booking)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price + Status */}
                <div className="flex shrink-0 flex-row items-center justify-between gap-4 sm:h-full sm:w-[105px] sm:flex-col sm:items-end sm:justify-center">
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#3F783D]">
                      {booking.price || "Free"}
                    </p>

                    <p className="text-[9px] text-gray-400">
                      {booking.payment || "Paid"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[9px] font-medium ${
                      booking.status === "Confirmed"
                        ? "bg-green-50 text-green-600"
                        : booking.status === "Pending"
                          ? "bg-orange-50 text-orange-500"
                          : booking.status === "Completed"
                            ? "bg-blue-50 text-blue-500"
                            : "bg-red-50 text-red-500"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2 border-t border-gray-100 pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
                  {detailsLink ? (
                    <NavLink
                      to={detailsLink}
                      className={`flex h-8 items-center justify-center rounded border px-4 text-[10px] font-medium transition ${
                        booking.status === "Confirmed"
                          ? "border-[#3F783D] text-[#3F783D] hover:bg-green-50"
                          : "border-orange-300 text-orange-500 hover:bg-orange-50"
                      }`}
                    >
                      View Details
                    </NavLink>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="h-8 rounded border border-gray-200 px-4 text-[10px] font-medium text-gray-300"
                    >
                      View Details
                    </button>
                  )}

                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 text-gray-400 hover:bg-gray-50"
                  >
                    <MoreHorizontal size={15} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex min-h-[250px] flex-col items-center justify-center rounded-xl bg-white p-8 text-center shadow-sm">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
              <Ticket size={22} className="text-[#3F783D]" />
            </div>

            <h3 className="font-semibold text-gray-800">No bookings found</h3>

            <p className="mt-1 text-xs text-gray-500">
              You don't have any bookings matching your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
