import React from "react";
import SEO from "../components/SEO/SEO";
import TranportHero from "../components/Transport/TransportHero";
import TransportTabs from "../components/Transport/TransportTabs";
import TravelBenefits from "../components/Transport/TravelBenefits";
import TravelServices from "../components/Transport/TravelServices";
import PopularRoutes from "../components/Transport/PopularRoutes";
import SafetyBanner from "../components/Transport/SafetyBanner";

const Transport = () => {
  return (
    <div className="min-h-screen bg-[#F5F7F3] p-4 md:p-6">
      <SEO
        title="Transport in Abia | Travel Around Abia | Mmemme"
        description="Discover transportation options and travel information for moving around Abia State with Mmemme."
      />
      <div className="max-w-7xl mx-auto space-y-6">
        <TranportHero />
        <TransportTabs />
        <TravelBenefits />
        <TravelServices />
        <PopularRoutes />
        <SafetyBanner />
      </div>
    </div>
  );
};

export default Transport;
