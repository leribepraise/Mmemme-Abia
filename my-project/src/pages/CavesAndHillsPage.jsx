import React from "react";
import Breadcrumb from "../components/tour/categoryCardPages/historicalSitesPage/Breadcrumb";
import CategoryTabs from "../components/tour/categoryCardPages/historicalSitesPage/CategoryTabs";
import HeroBannerImage from "../components/tour/categoryCardPages/cavesAndHillsPage/HeroBannerImage";
import SiteGridCaves from "../components/tour/categoryCardPages/cavesAndHillsPage/SiteGridCaves";
import PlanAdventureCard from "../components/tour/categoryCardPages/cavesAndHillsPage/PlanAdventureCard";
import BestTimeCard from "../components/tour/categoryCardPages/cavesAndHillsPage/BestTimeCard";
import NearbyActivitiesCard from "../components/tour/categoryCardPages/religiousSitesPage/NearbyActivitiesCard";

import { Mountain, Eye, Backpack } from "lucide-react";
import { Compass, Camera, Users } from "lucide-react";

const cavesActivities = [
  { icon: Compass, title: "Guided Tours", subtitle: "Explore with experts" },
  { icon: Camera, title: "Picnic Spots", subtitle: "Relax and enjoy" },
  { icon: Camera, title: "Photography", subtitle: "Capture the beauty" },
  { icon: Users, title: "Local Culture", subtitle: "Meet the locals" },
];

const CavesAndHillsPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F7F3] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Breadcrumb items={["Home", "Tourism", "Caves & Hills"]} />

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <HeroBannerImage
              image="/caves-hero.jpg"
              title="Caves & Hills"
              description="Adventure through breathtaking caves and scenic hills in Abia."
              features={[
                {
                  icon: Mountain,
                  title: "Natural Wonders",
                  subtitle: "Unique formations",
                },
                {
                  icon: Eye,
                  title: "Scenic Beauty",
                  subtitle: "Breathtaking views",
                },
                {
                  icon: Backpack,
                  title: "Adventure Ready",
                  subtitle: "For all explorers",
                },
                {
                  icon: Camera,
                  title: "Photography Spots",
                  subtitle: "Capture memories",
                },
              ]}
            />

            <CategoryTabs
              tabs={["Caves", "Hills", "Rock Formations", "Nature Reserves"]}
            />

            <SiteGridCaves />
          </div>

          <div className="w-full lg:w-80 shrink-0 space-y-5">
            <PlanAdventureCard />
            <BestTimeCard
              title="November – April"
              subtitle="Best weather for hiking and exploration."
            />
            <NearbyActivitiesCard activities={cavesActivities} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CavesAndHillsPage;
