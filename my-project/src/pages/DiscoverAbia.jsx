import React from "react";
import DiscoverHero from "../components/discover/DiscoverHero";
import OurStorySection from "../components/discover/OurStorySection";
import WhatYouCanDo from "../components/discover/WhatYouCanDo";
import DiscoverCTA from "../components/discover/DiscoverCTA";

const DiscoverAbia = () => {
  return (
    <div className="min-h-screen bg-[#F5F7F3] px-4 md:px-8 py-6">
      <div className="max-w-6xl mx-auto space-y-10">
        <DiscoverHero />
        <OurStorySection />
        <WhatYouCanDo />
        <DiscoverCTA />
      </div>
    </div>
  );
};

export default DiscoverAbia;
