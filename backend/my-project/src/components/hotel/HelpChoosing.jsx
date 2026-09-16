import React from "react";
import { Headphones } from "lucide-react";

const HelpChoosing = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <h3 className="font-bold text-lg">Need Help Choosing?</h3>
        <p className="text-gray-500 text-sm mt-1">
          Our travel experts are here to help you find the perfect stay.
        </p>
      </div>

      <button className="border border-green-600 text-green-700 px-5 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-green-50">
        <Headphones className="w-4 h-4" />
        Contact Support
      </button>
    </div>
  );
};

export default HelpChoosing;
