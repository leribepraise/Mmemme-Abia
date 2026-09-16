import React from "react";

const DiscoverHero = () => {
  return (
    <section className="grid lg:grid-cols-2 gap-8 items-center">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          <span className="text-[#48782E]">Discover Abia.</span>
          <br />
          <span className="text-[#F97316]">Experience More.</span>
          <br />
          <span className="text-[#1F2937]">Connect Better.</span>
        </h1>

        <p className="mt-6 text-[#6B7280] leading-7 max-w-md">
          Mmemme Abia brings the people, places, events, culture and experiences
          of Abia State together in one beautiful digital platform.
        </p>

        <div className="flex flex-wrap gap-3 mt-8">
          <button className="bg-[#F97316] hover:bg-[#df5f18] text-white px-6 py-3 rounded-lg font-semibold">
            Explore Abia
          </button>

          <button className="border border-[#48782E] text-[#48782E] hover:bg-[#48782E] hover:text-white px-6 py-3 rounded-lg font-semibold transition">
            Explore Events
          </button>
        </div>
      </div>

      <div className="rounded-2xl">
        <img
          src="/aboutus.png"
          alt="Discover Abia"
          className="w-full h-full object-cover rotate-5"
        />
      </div>
    </section>
  );
};

export default DiscoverHero;
