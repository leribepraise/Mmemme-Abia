import React from "react";
import { ChevronRight } from "lucide-react";

import SectionHeader from "./common/SectionHeader";

const MyTickets = () => {
  return (
    <div className="mx-auto max-w-[1100px]">
      <SectionHeader
        title="My Tickets"
        description="View and manage your event tickets."
      />

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Abia Cultural Festival</h2>

            <p className="mt-1 text-xs text-gray-500">
              October 31 · Ohafia, Abia
            </p>
          </div>

          <span className="w-fit rounded bg-green-50 px-3 py-1 text-xs text-green-600">
            Confirmed
          </span>
        </div>

        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-gray-500">Ticket #MM-10245</span>

          <button className="flex items-center gap-1 text-xs font-medium text-[#3F783D]">
            View Ticket
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyTickets;
