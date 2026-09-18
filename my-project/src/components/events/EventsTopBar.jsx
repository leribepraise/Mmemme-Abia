import React from "react";
import { ChevronDown, Grid2X2, List } from "lucide-react";

const EventsTopBar = () => {
  return (
    <div className="mb-3 flex h-10 items-center justify-between rounded-lg bg-white px-4 shadow-sm">
      <p className="text-[16px] font-medium">20 Events found</p>

      <div className="flex items-center gap-3">
        <div className="relative">
          <select className="h-7 appearance-none rounded-md border pl-2 pr-7 text-[12px]">
            <option>Sort by: Most Relevant</option>
          </select>

          <ChevronDown
            size={12}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          />
        </div>

        <Grid2X2 size={16} className="text-green-700" />

        <List size={18} />
      </div>
    </div>
  );
};

export default EventsTopBar;
