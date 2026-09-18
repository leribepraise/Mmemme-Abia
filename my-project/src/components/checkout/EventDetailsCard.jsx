import React from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import SectionHeader from "./SectionHeader";

const EventDetailsCard = ({ event = {} }) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
      <SectionHeader number="1" title="Event Details" />

      <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start">
        {/* EVENT IMAGE */}
        <div className="h-44 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 md:w-64">
          <img
            src={event?.image || "/checkout.jpg"}
            alt={event?.title || event?.text || "Event Banner"}
            className="h-full w-full object-cover transition duration-300 hover:scale-105"
          />
        </div>

        {/* DETAILS COLUMN */}
        <div className="space-y-4">
          <h3 className="text-lg font-extrabold text-gray-900 md:text-xl">
            {event?.title || event?.text || "Event Name"}
          </h3>

          <div className="space-y-3.5 text-sm font-bold text-gray-700 md:text-base">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 shrink-0 text-[#265F27]" />
              <span>{event?.date || "Event date coming soon"}</span>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 shrink-0 text-[#265F27]" />
              <span>{event?.time || "Event time coming soon"}</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-[#265F27]" />
              <span>{event?.location || event?.text2 || "Location unavailable"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsCard;