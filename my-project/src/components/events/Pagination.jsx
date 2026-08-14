import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = () => {
  return (
    <div className="mt-6 flex justify-center gap-1">
      <button className="flex h-6 w-6 items-center justify-center rounded border bg-white">
        <ChevronLeft size={13} />
      </button>

      <button className="h-6 w-6 rounded bg-green-700 text-[10px] text-white">
        1
      </button>

      <button className="h-6 w-6 rounded border bg-white text-[10px]">2</button>

      <button className="h-6 w-6 rounded border bg-white text-[10px]">3</button>

      <button className="h-6 w-6 rounded border bg-white text-[10px]">4</button>

      <button className="h-6 w-8 rounded border bg-white text-[10px]">
        ...
      </button>

      <button className="h-6 w-7 rounded border bg-white text-[10px]">
        20
      </button>

      <button className="flex h-6 w-6 items-center justify-center rounded border bg-white">
        <ChevronRight size={13} />
      </button>
    </div>
  );
};

export default Pagination;
