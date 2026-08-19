import React from "react";

const OurStory = () => {
  return (
    <div className="grid lg:grid-cols-2 gap-10 items-center">
      {/* Left */}
      <div>
        <h2 className="text-2xl font-bold text-[#1F2937] mb-6">Our Story</h2>

        <p className="text-[#6B7280] leading-7 text-sm md:text-base">
          Abia State is a land of rich heritage, industrious people, thriving
          businesses, vibrant culture and breathtaking destinations. From our
          world-famous craftsmanship in Aba to our peaceful communities and
          delicious cuisine, Abia has so much to offer.
        </p>

        <button className="mt-8 border border-[#48782E] text-[#48782E] hover:bg-[#48782E] hover:text-white transition px-5 py-2 rounded-lg font-medium text-sm">
          Explore Abia
        </button>
      </div>

      {/* Right */}
      <div className="rounded-2xl overflow-hidden h-[220px] md:h-[300px] bg-gray-100">
        <img
          src="/about.jpg"
          alt="Abia Story"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default OurStory;
