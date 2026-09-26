import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import useAdminNotes from "../../../../../hooks/useAdminNotes";
import useAdminEventDetail from "../useAdminEventDetail";
import EventNotFound from "../EventNotFound";
import EventReviewSummaryCard from "./EventReviewSummaryCard";
import AdminReviewCard from "./AdminReviewCard";
import ReviewChecklistCard from "./ReviewChecklistCard";
import AdditionalNotesCard from "./AdditionalNotesCard";

const AdminEventReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { event, notFound, approve, reject } = useAdminEventDetail(id);
  const { addNote } = useAdminNotes("events", id);
  const [reviewNote, setReviewNote] = useState("");
  const [additionalNote, setAdditionalNote] = useState("");

  if (notFound) return <EventNotFound />;

  const combinedNote = () =>
    [reviewNote.trim(), additionalNote.trim()].filter(Boolean).join("\n\n");

  const saveNoteIfAny = (type) => {
    const text = combinedNote();
    if (text) addNote({ type, text });
  };

  const backToDetails = () => navigate(`/admin/events/${id}`);

  const handleApprove = () => {
    saveNoteIfAny("Review: approved");
    approve();
    backToDetails();
  };

  const handleReject = () => {
    saveNoteIfAny("Review: rejected");
    reject();
    backToDetails();
  };

  const handleRequestChanges = () => {
    saveNoteIfAny("Review: changes requested");
    toast.success("Change request recorded");
    backToDetails();
  };

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <Link
        to={`/admin/events/${id}`}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1a6a2a] hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Event Details
      </Link>

      <div>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Review Event
        </h1>
        <p className="text-sm text-slate-500">
          Review the event details and take action.
        </p>
      </div>

      <EventReviewSummaryCard event={event} />
      <AdminReviewCard
        note={reviewNote}
        onNoteChange={setReviewNote}
        onApprove={handleApprove}
        onReject={handleReject}
        onRequestChanges={handleRequestChanges}
      />
      <ReviewChecklistCard />
      <AdditionalNotesCard
        note={additionalNote}
        onNoteChange={setAdditionalNote}
      />
    </div>
  );
};

export default AdminEventReview;
