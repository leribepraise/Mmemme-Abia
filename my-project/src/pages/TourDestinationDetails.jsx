import React from "react";
import { useParams, NavLink } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { tourCard } from "@/lib/catalog";
import Breadcrumb from "../components/tour/categoryCardPages/historicalSitesPage/Breadcrumb";
import TourDestinationHero from "../components/tour/destinationPage/TourDestinationHero";
import TourDestinationInfo from "../components/tour/destinationPage/TourDestinationInfo";
import TourGallery from "../components/tour/destinationPage/TourGallery";
import TourPlanVisitCard from "../components/tour/destinationPage/TourPlanVisitCard";
import TourLocationCard from "../components/tour/destinationPage/TourLocationCard";

const TourDestinationDetails = () => {
  const { id } = useParams();
  const { data: tour, loading, error } = useApi(`/tourism/${id}/`, { map: tourCard });

  if (!tour) {
    return (
      <div className="min-h-screen bg-[#F5F7F3] p-4 md:p-8 text-center">
        <p className="text-lg font-semibold">{loading ? "Loading destination..." : error?.message || "Destination not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7F3] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Breadcrumb items={["Home", "Tourism", "Destinations", tour.name]} />

          <NavLink
            to="/tourism"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#3F783D] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Destinations
          </NavLink>
        </div>

        <TourDestinationHero tour={tour} />

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <TourDestinationInfo tour={tour} />
            <TourGallery images={tour.gallery} />
          </div>

          <div className="w-full lg:w-80 shrink-0 space-y-5">
            <TourPlanVisitCard tour={tour} />
            <TourLocationCard tour={tour} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDestinationDetails;
