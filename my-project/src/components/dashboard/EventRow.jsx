import React from "react";
import { useLocation } from "wouter";
import { MoreHorizontal } from "lucide-react";
import { naira, fmtDate } from "@/lib/utils";

// Helper function for dynamic status badges
const getStatusBadgeStyle = (status = "") => {
  switch (status.toLowerCase()) {
    case "published":
    case "active":
    case "live":
      return "bg-green-50 text-[#265F27] border-green-200";
    case "draft":
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "ended":
    case "completed":
    case "closed":
      return "bg-gray-100 text-gray-600 border-gray-200";
    case "cancelled":
      return "bg-red-50 text-red-600 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export function EventRow({ event = {} }) {
  const [, setLocation] = useLocation();

  const formattedDate = event.date ? fmtDate(event.date) : "—";
  const formattedRevenue = event.revenue ? naira(event.revenue) : "—";
  const ticketsSold = event.ticketsSold ?? "—";
  const ticketCapacity = event.ticketCapacity ?? "—";

  return (
    <div
      className="group flex items-center justify-between gap-4 border-b border-gray-100 bg-white p-4 text-sm transition hover:bg-gray-50/80 md:px-6 md:text-base"
      data-testid={`row-event-${event.id}`}
    >
      {/* TITLE & VENUE */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-extrabold text-gray-900">
          {event.title || "Untitled Event"}
        </h3>
        <span className="mt-0.5 block truncate text-xs font-semibold text-gray-500 md:text-sm">
          {event.venue || "No location specified"}
        </span>
      </div>

      {/* DATE */}
      <div className="hidden min-w-[100px] text-xs font-semibold text-gray-600 md:block md:text-sm">
        {formattedDate}
      </div>

      {/* TICKETS SOLD / CAPACITY */}
      <div className="min-w-[90px] text-center text-xs font-bold text-gray-800 md:text-sm">
        {ticketsSold} / {ticketCapacity}
      </div>

      {/* REVENUE */}
      <div className="min-w-[100px] text-right text-xs font-extrabold text-gray-900 md:text-sm">
        {formattedRevenue}
      </div>

      {/* STATUS BADGE */}
      <div className="min-w-[90px] flex justify-center">
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-extrabold capitalize ${getStatusBadgeStyle(
            event.status
          )}`}
        >
          {event.status || "Unknown"}
        </span>
      </div>

      {/* ACTION BUTTON */}
      <button
        type="button"
        className="flex h-9 w-9 cursor-pointer shrink-0 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        onClick={() => setLocation(`/events/${event.id}/edit`)}
        aria-label={`Edit ${event.title || "event"}`}
        data-testid={`button-edit-event-${event.id}`}
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>
    </div>
  );
}

export default EventRow;