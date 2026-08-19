import React from "react";
import { ShieldCheck } from "lucide-react";

const SafetyBanner = () => {
  return (
    <div className="bg-[#EAF5EA] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-5">
      <div className="flex items-center gap-4">
        <div className="bg-white p-3 rounded-full">
          <ShieldCheck className="w-8 h-8 text-[#48782E]" />
        </div>

        <div>
          <h3 className="font-bold text-lg">Your Safety is Our Priority</h3>

          <p className="text-gray-600 text-sm max-w-xl">
            All our drivers and transport partners are verified and trained to
            ensure you have safe and comfortable journeys.
          </p>
        </div>
      </div>

      <button className="border border-[#48782E] text-[#48782E] hover:bg-[#48782E] hover:text-white px-5 py-3 rounded-lg font-semibold transition">
        Learn More
      </button>
    </div>
  );
};

export default SafetyBanner;
