import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import {
  getApprovalExtras,
  toApprovalInfo,
} from "@/data/adminOrganizerApproval";
import useAdminNotes from "@/hooks/useAdminNotes";
import VerificationAction from "@/components/Admin/shared/VerificationAction";
import AdditionalNotes from "@/components/Admin/shared/AdditionalNotes";
import ApprovalProfileCard from "./ApprovalProfileCard";
import ApprovalBusinessInfo from "./ApprovalBusinessInfo";
import ApprovalDocuments from "./ApprovalDocuments";
import ApprovalVerification from "./ApprovalVerification";
import ApprovalActivity from "./ApprovalActivity";

const OrganizerApprovalView = ({
  organizer,
  onApprove,
  onReject,
  onReopen,
}) => {
  const info = useMemo(() => toApprovalInfo(organizer), [organizer]);
  const extras = useMemo(() => getApprovalExtras(organizer), [organizer]);
  const { notes, addNote } = useAdminNotes("organizers", organizer.id);

  const handleApprove = () => {
    onApprove();
    toast.success(`${organizer.name} approved`);
  };

  const handleReject = (text) => {
    addNote({ type: "Rejected", text });
    onReject(text);
    toast.success(`${organizer.name} rejected`);
  };

  // Status stays Pending; the request is recorded as a note
  const handleRequestInfo = (text) => {
    addNote({ type: "Info requested", text });
    toast.success("Information request saved");
  };

  const handleReopen = () => {
    onReopen();
    toast.success("Review reopened");
  };

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div>
        <Link
          to="/admin/organizers"
          className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-[#1a6a2a]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Organizers
        </Link>
        <h1 className="mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">
          Organizer Approval
        </h1>
        <p className="text-sm text-slate-500">
          Review and verify organizer details before approving their
          registration.
        </p>
      </div>

      <ApprovalProfileCard info={info} status={organizer.status} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          <ApprovalBusinessInfo info={info} />
          <ApprovalDocuments documents={extras.documents} />
        </div>
        <div className="space-y-4 lg:col-span-2">
          <ApprovalVerification items={extras.verification} />
          <ApprovalActivity items={extras.timeline} />
          <VerificationAction
            entityLabel="Organizer"
            status={organizer.status}
            onApprove={handleApprove}
            onReject={handleReject}
            onRequestInfo={handleRequestInfo}
            onReopen={handleReopen}
          />
          <AdditionalNotes notes={notes} />
        </div>
      </div>
    </div>
  );
};

export default OrganizerApprovalView;
