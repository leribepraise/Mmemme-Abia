import { useState } from "react";
import toast from "react-hot-toast";
import useAdminNotes from "@/hooks/useAdminNotes";
import VerificationSummaryCard from "./VerificationSummaryCard";
import VerificationTabs from "./VerificationTabs";
import SubmittedDocumentsCard from "./SubmittedDocumentsCard";
import PropertyInformationCard from "./PropertyInformationCard";
import VerificationChecklistCard from "./VerificationChecklistCard";
import VerificationActionCard from "./VerificationActionCard";
import PropertyAdditionalNotesCard from "./PropertyAdditionalNotesCard";

const TabPlaceholder = ({ tab }) => (
  <div className="rounded-xl bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
    The {tab} tab isn't built yet.
  </div>
);

const PropertyVerificationView = ({ property, approve, reject, reopen }) => {
  const { notes, addNote } = useAdminNotes("properties", property.id);
  const [tab, setTab] = useState("Documents");
  const [checklistNote, setChecklistNote] = useState("");

  const withNote = (fn, type) => () => {
    const text = checklistNote.trim();
    if (text) addNote({ type, text });
    fn();
    setChecklistNote("");
  };

  const handleRequestInfo = () => {
    const text = checklistNote.trim();
    if (text) addNote({ type: "Info requested", text });
    toast.success("Information request recorded");
    setChecklistNote("");
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Property Verification
        </h1>
        <p className="text-sm text-slate-500">
          Review and verify property details and documents before approval.
        </p>
      </div>

      <VerificationSummaryCard property={property} />
      <VerificationTabs active={tab} onChange={setTab} />

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-4">
          {tab === "Details" && <PropertyInformationCard property={property} />}
          {tab === "Documents" && (
            <SubmittedDocumentsCard documents={property.documents} />
          )}
          {tab === "Verification Checklist" && (
            <TabPlaceholder tab="Verification Checklist" />
          )}
          {tab === "Activity" && <TabPlaceholder tab="Activity" />}
          <PropertyInformationCard property={property} />
        </div>

        <div className="space-y-4">
          <VerificationChecklistCard
            checklist={property.checklist}
            note={checklistNote}
            onNoteChange={setChecklistNote}
          />
          <VerificationActionCard
            status={property.status}
            onApprove={withNote(approve, "Approved")}
            onReject={withNote(reject, "Rejected")}
            onRequestInfo={handleRequestInfo}
            onReopen={reopen}
          />
          <PropertyAdditionalNotesCard notes={notes} />
        </div>
      </div>
    </div>
  );
};

export default PropertyVerificationView;
