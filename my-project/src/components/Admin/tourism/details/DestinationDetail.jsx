import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import useDestinationDetail from "./useDestinationDetail";
import DestinationNotFound from "./DestinationNotFound";
import TourismApprovalView from "./TourismApprovalView";
import DestinationCoverHeader from "./DestinationCoverHeader";
import DestinationTitleCard from "./DestinationTitleCard";
import DestinationTabs from "./DestinationTabs";
import DestinationAboutCard from "./DestinationAboutCard";
import DestinationReviewsCard from "./DestinationReviewsCard";
import DestinationSidebar from "./DestinationSidebar";

const TabPlaceholder = ({ tab }) => (
  <div className="rounded-xl bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
    The {tab} tab isn't built yet.
  </div>
);

const DestinationDetail = () => {
  const { id } = useParams();
  const { destination, notFound, approve, reject, reopen } =
    useDestinationDetail(id);
  const [tab, setTab] = useState("Overview");

  if (notFound) return <DestinationNotFound />;

  const needsApproval =
    destination.status === "Pending" || destination.status === "Rejected";

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <Link
        to="/admin/tourism"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1a6a2a] hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Listings
      </Link>

      {needsApproval ? (
        <TourismApprovalView
          destination={destination}
          approve={approve}
          reject={reject}
          reopen={reopen}
        />
      ) : (
        <>
          <DestinationCoverHeader destination={destination} />
          <DestinationTitleCard destination={destination} />
          <DestinationTabs active={tab} onChange={setTab} />

          {tab === "Overview" ? (
            <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="min-w-0 space-y-4">
                <DestinationAboutCard destination={destination} />
                <DestinationReviewsCard reviews={destination.reviews} />
              </div>
              <DestinationSidebar
                gallery={destination.gallery}
                map={destination.map}
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

export default DestinationDetail;
