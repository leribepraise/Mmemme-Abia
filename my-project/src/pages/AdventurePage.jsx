import React from "react";
import Breadcrumb from "../components/tour/categoryCardPages/historicalSitesPage/Breadcrumb";
import HeroBannerImage from "../components/tour/categoryCardPages/cavesAndHillsPage/HeroBannerImage";
import CategoryTabs from "../components/tour/categoryCardPages/historicalSitesPage/CategoryTabs";
import SiteGridAdventure from "../components/tour/categoryCardPages/adventurePage/SiteGridAdventure";
import PlanAdventureGreenCard from "../components/tour/categoryCardPages/adventurePage/PlanAdventureGreenCard";
import BestTimeCard from "../components/tour/categoryCardPages/religiousSitesPage/BestTimeCard";
import AdventureTipsCard from "../components/tour/categoryCardPages/adventurePage/AdventureTipsCard";
import NeedGearCard from "../components/tour/categoryCardPages/adventurePage/NeedGearCard";
import { Zap, TreePine, ShieldCheck, Eye } from "lucide-react";

const adventureTips = [
  "Wear comfortable clothing and shoes",
  "Carry enough water and snacks",
  "Follow your guide's instructions",
  "Respect nature and keep it clean",
  "Stay safe and have fun!",
];

const AdventurePage = () => {
  return (
    <div className="min-h-screen bg-[#F5F7F3] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Breadcrumb items={["Home", "Tourism", "Adventure"]} />

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <HeroBannerImage
              image="/adventure-hero.jpg"
              title="Adventure in Abia"
              description="For thrill seekers and nature lovers. Explore exciting adventures and outdoor experiences in Abia State."
              features={[
                {
                  icon: Zap,
                  title: "Thrilling Experiences",
                  subtitle: "Adventures for everyone",
                },
                {
                  icon: TreePine,
                  title: "Natural Playgrounds",
                  subtitle: "Mountains, rivers & caves",
                },
                {
                  icon: ShieldCheck,
                  title: "Safe & Guided",
                  subtitle: "Expert guides & safety",
                },
                {
                  icon: Eye,
                  title: "Unforgettable Views",
                  subtitle: "Capture great moments",
                },
              ]}
            />

            <CategoryTabs
              tabs={[
                "All Adventures",
                "Hiking & Trekking",
                "Water Activities",
                "Caving",
                "Rock Climbing",
              ]}
            />

            <SiteGridAdventure />
          </div>

          <div className="w-full lg:w-80 shrink-0 space-y-5">
            <PlanAdventureGreenCard />
            <BestTimeCard
              title="November - April"
              subtitle="Best weather conditions for outdoor activities."
            />
            <AdventureTipsCard tips={adventureTips} />
            <NeedGearCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdventurePage;
