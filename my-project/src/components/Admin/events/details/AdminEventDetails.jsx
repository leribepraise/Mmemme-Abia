import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import useAdminEventDetail from "./useAdminEventDetail";
import EventNotFound from "./EventNotFound";
import EventCoverHeader from "./EventCoverHeader";
import EventTitleCard from "./EventTitleCard";
import EventDetailTabs from "./EventDetailTabs";
import EventDescriptionCard from "./EventDescriptionCard";
import EventMediaGallery from "./EventMediaGallery";
import EventOrganizerCard from "./EventOrganizerCard";
import EventKeyActions from "./EventKeyActions";

const TabPlaceholder = ({ tab }) => (
  <div className="rounded-xl bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
    The {tab} tab isn't built yet.
  </div>
);

const AdminEventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { event, notFound, approve, reject } = useAdminEventDetail(id);
  const [tab, setTab] = useState("Overview");

  if (notFound) return <EventNotFound />;

  const handleRequestChanges = () => {
    toast.success("Change request recorded");
  };

  const handleViewProfile = () => {
    if (event.organizer.organizerId) {
      navigate(`/admin/organizers/${event.organizer.organizerId}`);
    } else {
      toast("No organizer profile found for this event");
    }
  };

  const handleReview = () => navigate(`/admin/events/${id}/review`);

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <Link
        to="/admin/events"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1a6a2a] hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Events
      </Link>

      <EventCoverHeader event={event} />
      <EventTitleCard event={event} />
      <EventDetailTabs active={tab} onChange={setTab} />

      {tab === "Overview" ? (
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-4">
            <EventDescriptionCard event={event} />
            <EventMediaGallery gallery={event.gallery} />
            <EventOrganizerCard
              organizer={event.organizer}
              onViewProfile={handleViewProfile}
            />
          </div>
          <div className="lg:sticky lg:top-20">
            <EventKeyActions
              status={event.status}
              onApprove={approve}
              onReject={reject}
              onRequestChanges={handleRequestChanges}
              onReview={handleReview}
            />
          </div>
        </div>
      ) : (
        <TabPlaceholder tab={tab} />
      )}
    </div>
  );
};

export default AdminEventDetails;
