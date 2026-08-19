import React from "react";

const TranportHero = () => {
  return (
    <div
      className="relative rounded-3xl overflow-hidden h-[230px] md:h-[340px] bg-cover bg-center"
      style={{ backgroundImage: "url('/transport.png')" }}
    >
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10 h-full flex items-center px-6 md:px-10">
        <div className="max-w-md text-white">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Travel Smarter.
            <br />
            Explore Abia & Beyond.
          </h1>

          <p className="mt-4 text-sm md:text-base text-gray-200">
            Book rides, shuttles, rentals or send packages with trusted
            transport partners.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TranportHero;
