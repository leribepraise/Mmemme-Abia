import React from "react";
import Breadcrumb from "../components/tour/categoryCardPages/historicalSitesPage/Breadcrumb";
import HeroBanner from "../components/tour/categoryCardPages/historicalSitesPage/HeroBanner";
import CategoryTabs from "../components/tour/categoryCardPages/historicalSitesPage/CategoryTabs";
import SiteGrid from "../components/tour/categoryCardPages/historicalSitesPage/SiteGrid";
import AboutCard from "../components/tour/categoryCardPages/historicalSitesPage/AboutCard";
import PlanVisitCard from "../components/tour/categoryCardPages/historicalSitesPage/PlanVisitCard";
import NearbyActivitiesCard from "../components/tour/categoryCardPages/historicalSitesPage/NearbyActivitiesCard";
import {
  Leaf,
  UserRound,
  HeartHandshake,
  Compass,
  Landmark,
  PartyPopper,
  ShoppingBag,
} from "lucide-react";

const historicalActivities = [
  { icon: Compass, title: "Cultural Tours", subtitle: "Explore local history" },
  { icon: Landmark, title: "Local Museums", subtitle: "Discover artifacts" },
  {
    icon: PartyPopper,
    title: "Cultural Festivals",
    subtitle: "Experience traditions",
  },
  { icon: ShoppingBag, title: "Craft Markets", subtitle: "Buy local crafts" },
];

const HistoricalSitesPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F7F3] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Breadcrumb items={["Home", "Tourism", "Historical Sites"]} />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* HERO + MAIN CONTENT */}
          <div className="flex-1 space-y-6">
            <HeroBanner
              title="Historical Sites"
              description="Step into the past and discover the rich history and heritage of Abia State."
              features={[
                { title: "Rich Heritage", subtitle: "Explore our history" },
                { title: "Cultural Legacy", subtitle: "Preserve our past" },
                { title: "Historic Landmarks", subtitle: "Iconic locations" },
                { title: "Guided Learning", subtitle: "Expert insights" },
              ]}
            />

            <CategoryTabs
              tabs={[
                "All Sites",
                "Colonial Era",
                "Monuments",
                "Museums",
                "Archaeological Sites",
              ]}
            />

            <SiteGrid />
          </div>

          {/* SIDEBAR */}
          <div className="w-full lg:w-80 shrink-0 space-y-5">
            <AboutCard />
            <PlanVisitCard />
            <NearbyActivitiesCard activities={historicalActivities} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricalSitesPage;
