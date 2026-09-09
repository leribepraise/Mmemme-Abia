import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, CalendarDays, Check, Edit3, LayoutList, MapPin } from "lucide-react";
import OrganizerShell from "@/components/organizer/OrganizerPublicShell";
import { seedEvents, seedOrganizer } from "@/data/organizerData";
import { naira, fmtDate, load, save } from "@/lib/utils";

const STATUS_STYLE = {
  Published: "bg-green-100 text-green-700",
  Draft: "bg-amber-100 text-amber-700",
  Completed: "bg-blue-100 text-blue-700",
};

const STEPS = ["Basic Info", "Date & Venue", "Tickets & Pricing", "Media", "Preview & Publish"];

function Stepper() {
  return (
    <div className="flex items-center mb-2">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const isLast = step === STEPS.length;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-[#3F7D3D] text-white`}>
                {isLast ? step : <Check className="w-3.5 h-3.5" />}
              </div>
              <span className={`text-[10px] font-bold whitespace-nowrap ${isLast ? "text-black" : "text-gray-400"}`}>{label}</span>
            </div>
            {!isLast && <div className="flex-1 h-px mx-2 mb-4 bg-[#3F7D3D]" />}
          </div>
        );
      })}
    </div>
  );
}

export default function OrganizerEventPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const events = load("mmemme-events", seedEvents);
  const event = events.find(e => e.id === id) || events[0];
  const organizer = load("mmemme-organizer", seedOrganizer);

  const publish = () => {
    save("mmemme-events", events.map(e => (e.id === event.id ? { ...e, status: "Published" } : e)));
    navigate("/organizer/events");
  };

  return (
    <OrganizerShell
      breadcrumb={["Home", "Organizer", "My Events", "Preview"]}
      title="Preview Your Event"
      subtitle="See how your event will appear to the public."
      actions={
        <button
          onClick={() => navigate(`/organizer/events/${event.id}/edit`)}
          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50"
          data-testid="button-preview-edit"
        >
          <Edit3 className="w-4 h-4" /> Edit event
        </button>
      }
    >
      <Stepper />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-56 bg-gray-100">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${STATUS_STYLE[event.status] || "bg-gray-100 text-gray-600"}`}>
              {event.status}
            </span>
            <span className="text-[11px] text-gray-400 font-medium">Organized by {organizer.organization}</span>
          </div>
          <h2 className="text-xl font-extrabold text-black">{event.title}</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">{event.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-50">
            <div className="flex items-center gap-3">
              <CalendarDays className="w-5 h-5 text-[#3F7D3D]" />
              <div><p className="font-bold text-sm text-black">{fmtDate(event.date)}</p><p className="text-[11px] text-gray-400">Event date</p></div>
            </div>
            <div className="flex items-center gap-3">
              <LayoutList className="w-5 h-5 text-[#3F7D3D]" />
              <div><p className="font-bold text-sm text-black">{event.eventType}</p><p className="text-[11px] text-gray-400">Format</p></div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#3F7D3D]" />
              <div><p className="font-bold text-sm text-black">{event.venue}</p><p className="text-[11px] text-gray-400">Venue</p></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-lg text-black mb-3">About the Event</h2>
          <p className="text-sm text-gray-600 leading-6">
            {event.description} Join us for a thoughtful, well-run experience by {organizer.organization}. Ticket holders will receive event updates in their inbox.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {event.tags.map(tag => (
              <span key={tag} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700">{tag}</span>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-base text-black mb-4">Event Summary</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm"><span className="text-gray-500">Total Tickets</span><strong className="text-black">{event.ticketCapacity.toLocaleString()}</strong></div>
            <div className="flex items-center justify-between text-sm"><span className="text-gray-500">Ticket Price</span><strong className="text-black">{naira(5000)}</strong></div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => navigate(`/organizer/events/${event.id}/edit`)}
          className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-600 border border-gray-200 bg-white hover:bg-gray-50"
          data-testid="button-preview-back"
        >
          Back
        </button>
        <button
          onClick={publish}
          className="flex items-center gap-2 bg-[#F36B25] hover:bg-[#d95d1d] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors"
          data-testid="button-preview-publish"
        >
          Publish Event <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </OrganizerShell>
  );
}
