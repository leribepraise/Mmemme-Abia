import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import usePropertyDetail from "./usePropertyDetail";
import PropertyNotFound from "./PropertyNotFound";
import PropertyVerificationView from "./PropertyVerificationView";
import PropertyCarousel from "./PropertyCarousel";
import PropertyTitleCard from "./PropertyTitleCard";
import PropertyDetailTabs from "./PropertyDetailTabs";
import AboutPropertyCard from "./AboutPropertyCard";
import RoomsPricingCard from "./RoomsPricingCard";
import PropertyReviewsCard from "./PropertyReviewsCard";
import PropertySidebar from "./PropertySidebar";

const TabPlaceholder = ({ tab }) => (
  <div className="rounded-xl bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
    The {tab} tab isn't built yet.
  </div>
);

const PropertyDetail = () => {
  const { id } = useParams();
  const { property, notFound, approve, reject, reopen } = usePropertyDetail(id);
  const [tab, setTab] = useState("Overview");

  if (notFound) return <PropertyNotFound />;

  const needsVerification =
    property.status === "Pending" || property.status === "Rejected";

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <Link
          to="/admin/hotels/properties"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1a6a2a] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Properties
        </Link>
        {!needsVerification && (
          <button
            type="button"
            onClick={() => toast("Editing isn't built yet")}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800"
          >
            <Share2 className="h-3.5 w-3.5" />
            Edit
          </button>
        )}
      </div>

      {needsVerification ? (
        <PropertyVerificationView
          property={property}
          approve={approve}
          reject={reject}
          reopen={reopen}
        />
      ) : (
        <>
          <PropertyCarousel
            images={property.carousel}
            status={property.status}
          />
          <PropertyTitleCard property={property} />
          <PropertyDetailTabs active={tab} onChange={setTab} />

          {tab === "Overview" ? (
            <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="min-w-0 space-y-4">
                <AboutPropertyCard property={property} />
                <RoomsPricingCard rooms={property.rooms} />
                <PropertyReviewsCard reviews={property.reviews} />
              </div>
              <PropertySidebar
                map={property.map}
                gallery={property.carousel}
                galleryExtra={property.galleryExtra}
              />
            </div>
          ) : (
            <TabPlaceholder tab={tab} />
          )}
        </>
      )}
    </div>
  );
};

export default PropertyDetail;
