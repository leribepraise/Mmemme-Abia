import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import useAdminOrganizerDetail from "./useAdminOrganizerDetail";
import OrganizerProfileHeader from "./OrganizerProfileHeader";
import OrganizerDetailTabs from "./OrganizerDetailTabs";
import BusinessInfoCard from "./BusinessInfoCard";
import OrganizerStatsRow from "./OrganizerStatsRow";
import RecentActivityCard from "./RecentActivityCard";
import BusinessGalleryCard from "./BusinessGalleryCard";
import VerificationStatusCard from "./VerificationStatusCard";
import OrganizerApprovalView from "../approval/OrganizerApprovalView";

const AdminOrganizerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");
  const {
    notFound,
    organizer,
    stats,
    activities,
    gallery,
    verify,
    reject,
    reopen,
    toggleSuspend,
  } = useAdminOrganizerDetail(id);

  const backButton = (
    <button
      type="button"
      onClick={() => navigate("/admin/organizers")}
      className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900"
    >
      <ArrowLeft size={14} />
      Back to Organizers
    </button>
  );

  if (notFound) {
    return (
      <div className="space-y-4 p-4 sm:p-6">
        {backButton}
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-medium text-gray-800">
            Organizer not found
          </p>
          <p className="mt-1 text-xs text-gray-500">
            No organizer matches "{id}". It may have been deleted.
          </p>
        </div>
      </div>
    );
  }

  // Pending (and Rejected) organizers get the approval layout instead of the Overview
  if (organizer.status === "Pending" || organizer.status === "Rejected") {
    return (
      <OrganizerApprovalView
        organizer={organizer}
        onApprove={verify}
        onReject={reject}
        onReopen={reopen}
      />
    );
  }

  const handleVerify = () => {
    verify();
    toast.success(`${organizer.name} verified`);
  };

  const handleReactivate = () => {
    toggleSuspend();
    toast.success(`${organizer.name} reactivated`);
  };

  return (
    <div className="space-y-4 p-4 sm:p-6">
      {backButton}

      <OrganizerProfileHeader organizer={organizer} />
      <OrganizerDetailTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "Overview" ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <BusinessInfoCard business={organizer.business} />
            <OrganizerStatsRow stats={stats} />
            <RecentActivityCard activities={activities} />
          </div>

          <div className="space-y-4">
            <BusinessGalleryCard gallery={gallery} name={organizer.name} />
            <VerificationStatusCard
              status={organizer.status}
              onVerify={handleVerify}
              onReactivate={handleReactivate}
              onViewDocuments={() => setActiveTab("Documents")}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
          The {activeTab} tab isn't built yet.
        </div>
      )}
    </div>
  );
};

export default AdminOrganizerDetails;
