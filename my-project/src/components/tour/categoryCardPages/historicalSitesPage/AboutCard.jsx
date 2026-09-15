import React from "react";

const AboutCard = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-bold text-base text-[#172033] mb-2">
        About Historical Sites
      </h3>

      <p className="text-sm text-gray-500 leading-relaxed mb-4">
        Abia is home to fascinating historical sites that tell the story of our
        people, culture, and colonial past.
      </p>

      <button className="border border-[#3F783D] text-[#3F783D] hover:bg-[#EAF4EB] font-semibold text-sm px-4 py-2 rounded-lg transition">
        Learn More
      </button>
    </div>
  );
};

export default AboutCard;
