import toast from "react-hot-toast";
import useAdminNotes from "@/hooks/useAdminNotes";
import ApprovalSummaryCard from "./ApprovalSummaryCard";
import ListingInformationCard from "./ListingInformationCard";
import UploadedMediaCard from "./UploadedMediaCard";
import ApprovalOrganizerCard from "./ApprovalOrganizerCard";
import PreviousCommentsCard from "./PreviousCommentsCard";
import ApprovalActionCard from "./ApprovalActionCard";
import QuickActionsCard from "./QuickActionsCard";

const TourismApprovalView = ({ destination, approve, reject, reopen }) => {
  const { notes, addNote } = useAdminNotes("tourism", destination.id);

  const handleApprove = (note) => {
    if (note) addNote({ type: "Approved", text: note });
    approve();
  };

  const handleReject = (note) => {
    if (note) addNote({ type: "Rejected", text: note });
    reject();
  };

  const handleRequestChanges = (note) => {
    if (note) addNote({ type: "Changes requested", text: note });
    toast.success("Change request recorded");
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Tourism Approval
        </h1>
        <p className="text-sm text-slate-500">
          Review and approve or reject tourism listings submitted by organizers.
        </p>
      </div>

      <ApprovalSummaryCard destination={destination} />

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-4">
          <ListingInformationCard destination={destination} />
          <UploadedMediaCard media={destination.media} />
          <ApprovalOrganizerCard organizer={destination.addedBy} />
          <PreviousCommentsCard
            seedComments={destination.comments}
            notes={notes}
          />
        </div>
        <div className="space-y-4">
          <ApprovalActionCard
            status={destination.status}
            onApprove={handleApprove}
            onReject={handleReject}
            onRequestChanges={handleRequestChanges}
            onReopen={reopen}
          />
          <QuickActionsCard />
        </div>
      </div>
    </div>
  );
};

export default TourismApprovalView;
