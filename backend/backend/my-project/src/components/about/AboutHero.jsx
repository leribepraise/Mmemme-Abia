import React from "react";

const AboutHero = () => {
  return (
    <div
      className="relative rounded-3xl overflow-hidden h-[220px] md:h-[340px] bg-cover bg-center"
      style={{ backgroundImage: "url('/about-hero.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/45"></div>

      <div className="relative z-10 flex items-center h-full px-8 md:px-12">
        <div className="max-w-lg text-white">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Proudly Abia.
            <br />
            Uniquely Amazing.
          </h1>

          <p className="mt-5 text-sm md:text-base text-gray-200 leading-relaxed">
            Discover the culture, people and experiences that make Abia State
            truly exceptional.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutHero;
