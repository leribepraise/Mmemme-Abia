import React from "react";
import Breadcrumb from "../components/tour/categoryCardPages/historicalSitesPage/Breadcrumb";
import HeroBanner from "../components/tour/categoryCardPages/historicalSitesPage/HeroBanner";
import CategoryTabs from "../components/tour/categoryCardPages/historicalSitesPage/CategoryTabs";
import SiteGridReligious from "../components/tour/categoryCardPages/religiousSitesPage/SiteGridReligious";
import PlanJourneyCard from "../components/tour/categoryCardPages/religiousSitesPage/PlanJourneyCard";
import BestTimeCard from "../components/tour/categoryCardPages/religiousSitesPage/BestTimeCard";
import NearbyActivitiesCard from "../components/tour/categoryCardPages/religiousSitesPage/NearbyActivitiesCard";
import NeedGuideCard from "../components/tour/categoryCardPages/religiousSitesPage/NeedGuideCard";
import {
  BookOpen,
  ShoppingBag,
  PartyPopper,
  UtensilsCrossed,
} from "lucide-react";

const religiousActivities = [
  {
    icon: BookOpen,
    title: "Cultural Tours",
    subtitle: "Explore local heritage",
  },
  {
    icon: ShoppingBag,
    title: "Local Markets",
    subtitle: "Shop for crafts & souvenirs",
  },
  {
    icon: PartyPopper,
    title: "Community Events",
    subtitle: "Join local celebrations",
  },
  {
    icon: UtensilsCrossed,
    title: "Local Cuisine",
    subtitle: "Enjoy Abia delicacies",
  },
];

const ReligiousSitesPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F7F3] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Breadcrumb items={["Home", "Tourism", "Religious Sites"]} />

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <HeroBanner
              title="Religious Sites"
              description="Explore places of worship and spiritual heritage that reflect the faith and history of Abia."
              features={[
                { title: "Spiritual Heritage", subtitle: "Centuries of faith" },
                {
                  title: "Peace & Reflection",
                  subtitle: "Find calm and inspiration",
                },
                {
                  title: "Cultural Significance",
                  subtitle: "Faith, art and history",
                },
                {
                  title: "Guided Experiences",
                  subtitle: "Tours and pilgrimages",
                },
              ]}
            />
            <CategoryTabs
              tabs={[
                "All Sites",
                "Churches",
                "Mosques",
                "Other Faiths",
                "Pilgrimage Centers",
              ]}
            />
            <SiteGridReligious />
          </div>

          <div className="w-full lg:w-80 shrink-0 space-y-5">
            <PlanJourneyCard />
            <BestTimeCard
              title="All Year Round"
              subtitle="Religious sites are open throughout the year."
            />
            <NearbyActivitiesCard activities={religiousActivities} />
            <NeedGuideCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReligiousSitesPage;
