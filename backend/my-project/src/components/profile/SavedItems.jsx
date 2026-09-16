import React from "react";
import { Heart } from "lucide-react";

import SectionHeader from "./common/SectionHeader";

const SavedItems = () => {
  return (
    <div className="mx-auto max-w-[1100px]">
      <SectionHeader
        title="Saved Items"
        description="Places and experiences you've saved."
      />

      <div className="rounded-xl bg-white p-8 text-center shadow-sm">
        <Heart size={35} className="mx-auto text-[#3F783D]" />

        <h2 className="mt-3 font-semibold">
          Your saved places will appear here
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Save places and experiences you want to visit later.
        </p>
      </div>
    </div>
  );
};

export default SavedItems;
