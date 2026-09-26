import { useState } from "react";
import toast from "react-hot-toast";
import useAdminNotes from "@/hooks/useAdminNotes";
import VerificationSummaryCard from "./VerificationSummaryCard";
import VerificationTabs from "./VerificationTabs";
import BusinessInformationCard from "./BusinessInformationCard";
import VerificationDocumentsCard from "./VerificationDocumentsCard";
import VendorGalleryCard from "./VendorGalleryCard";
import VerificationChecklistCard from "./VerificationChecklistCard";
import VendorApprovalActionCard from "./VendorApprovalActionCard";
import PreviousActionsCard from "./PreviousActionsCard";

const TabPlaceholder = ({ tab }) => (
  <div className="rounded-xl bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
    The {tab} tab isn't built yet.
  </div>
);

const FoodVendorVerificationView = ({ vendor, approve, reject, reopen }) => {
  const { notes, addNote } = useAdminNotes("food", vendor.id);
  const [tab, setTab] = useState("Documents");

  const handleApprove = (note) => {
    if (note) addNote({ type: "Approved", text: note });
    approve();
  };
  const handleReject = (note) => {
    if (note) addNote({ type: "Rejected", text: note });
    reject();
  };
  const handleRequestInfo = (note) => {
    if (note) addNote({ type: "Info requested", text: note });
    toast.success("Information request recorded");
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Vendor Verification
        </h1>
        <p className="text-sm text-slate-500">
          Review vendor details and documents before approval.
        </p>
      </div>

      <VerificationSummaryCard vendor={vendor} />
      <VerificationTabs active={tab} onChange={setTab} />

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-4">
          {tab === "Details" && (
            <BusinessInformationCard business={vendor.business} />
          )}
          {tab === "Documents" && (
            <>
              <BusinessInformationCard business={vendor.business} />
              <VerificationDocumentsCard documents={vendor.documents} />
              <VendorGalleryCard gallery={vendor.gallery} />
            </>
          )}
          {tab === "Photos" && <VendorGalleryCard gallery={vendor.gallery} />}
          {tab === "Activity" && <TabPlaceholder tab="Activity" />}
        </div>

        <div className="space-y-4">
          <VerificationChecklistCard checklist={vendor.checklist} />
          <VendorApprovalActionCard
            status={vendor.status}
            onApprove={handleApprove}
            onReject={handleReject}
            onRequestInfo={handleRequestInfo}
            onReopen={reopen}
          />
          <PreviousActionsCard
            seedActions={vendor.previousActions}
            notes={notes}
          />
        </div>
      </div>
    </div>
  );
};

export default FoodVendorVerificationView;
