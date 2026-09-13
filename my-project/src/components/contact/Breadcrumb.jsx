import React from "react";
import { ChevronRight } from "lucide-react";

const Breadcrumb = () => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <span>Home</span>
      <ChevronRight className="w-4 h-4" />
      <span className="font-semibold text-gray-900">Contact Us</span>
    </div>
  );
};

export default Breadcrumb;
