import React from "react";

export default function HeroSection() {
  return (
    <div className="relative flex min-h-[380px] w-full flex-col justify-end overflow-hidden rounded-3xl bg-gray-900 p-8 text-white shadow-sm md:p-12">
      {/* Background Image */}
      <img
        src="/tourism.jpg"
        alt="Explore Abia"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Text Content */}
      <div className="relative z-10 max-w-xl">
        <h1 className="text-3xl font-black leading-tight tracking-tight text-white md:text-5xl">
          Explore the Beauty of <span className="text-[#F36B25]">Abia</span>
        </h1>
        <p className="mt-4 text-sm font-medium text-gray-200 md:text-base">
          From natural wonders to historic sites and hidden gems, explore the
          best destinations in God's Own State.
        </p>
      </div>
    </div>
  );
}