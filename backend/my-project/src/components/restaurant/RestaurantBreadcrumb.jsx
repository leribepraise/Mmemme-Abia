import React from "react";
import { ChevronRight } from "lucide-react";

const RestaurantBreadcrumb = () => {
  return (
    <div className="px-4 md:px-5 pt-3 pb-2">
      <div className="flex items-center flex-wrap gap-1 text-[9px] text-gray-500">
        <span>Home</span>

        <ChevronRight className="w-3 h-3" />

        <span>Food</span>

        <ChevronRight className="w-3 h-3" />

        <span>Restaurants</span>

        <ChevronRight className="w-3 h-3" />

        <span className="text-gray-700 font-medium">
          Enyimba Garden Restaurant
        </span>
      </div>
    </div>
  );
};

export default RestaurantBreadcrumb;
