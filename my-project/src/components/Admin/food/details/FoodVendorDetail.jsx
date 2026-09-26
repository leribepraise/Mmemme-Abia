import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import useFoodVendorDetail from "./useFoodVendorDetail";
import VendorNotFound from "./VendorNotFound";
import FoodVendorVerificationView from "./FoodVendorVerificationView";
import VendorCoverHeader from "./VendorCoverHeader";
import VendorTitleCard from "./VendorTitleCard";
import VendorDetailTabs from "./VendorDetailTabs";
import AboutVendorCard from "./AboutVendorCard";
import MenuPreviewCard from "./MenuPreviewCard";
import RecentOrdersCard from "./RecentOrdersCard";
import VendorSidebar from "./VendorSidebar";
import BusinessInformationCard from "./BusinessInformationCard";
import VerificationDocumentsCard from "./VerificationDocumentsCard";

const TabPlaceholder = ({ tab }) => (
  <div className="rounded-xl bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
    The {tab} tab isn't built yet.
  </div>
);

const FoodVendorDetail = () => {
  const { id } = useParams();
  const { vendor, notFound, approve, reject, reopen } = useFoodVendorDetail(id);
  const [tab, setTab] = useState("Overview");

  if (notFound) return <VendorNotFound />;

  const needsVerification =
    vendor.status === "Pending" || vendor.status === "Rejected";

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <Link
        to="/admin/food"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1a6a2a] hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Vendors
      </Link>

      {needsVerification ? (
        <FoodVendorVerificationView
          vendor={vendor}
          approve={approve}
          reject={reject}
          reopen={reopen}
        />
      ) : (
        <>
          <VendorCoverHeader vendor={vendor} />
          <VendorTitleCard vendor={vendor} />
          <VendorDetailTabs active={tab} onChange={setTab} />

          {tab === "Overview" && (
            <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="min-w-0 space-y-4">
                <AboutVendorCard vendor={vendor} />
                <MenuPreviewCard items={vendor.menu} />
                <RecentOrdersCard orders={vendor.orders} />
              </div>
              <VendorSidebar gallery={vendor.gallery} map={vendor.map} />
            </div>
          )}

          {tab === "Documents" && (
            <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="min-w-0 space-y-4">
                <BusinessInformationCard business={vendor.business} />
                <VerificationDocumentsCard documents={vendor.documents} />
              </div>
              <VendorSidebar gallery={vendor.gallery} map={vendor.map} />
            </div>
          )}

          {tab !== "Overview" && tab !== "Documents" && (
            <TabPlaceholder tab={tab} />
          )}
        </>
      )}
    </div>
  );
};

export default FoodVendorDetail;
