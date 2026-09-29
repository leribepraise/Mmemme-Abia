import SiteImage from '@/components/SiteImage';
import { api } from "@/lib/api";
import { useCollection } from "@/hooks/useApi";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";
import { Heart, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const EventCard = ({ event }) => {
  const { user } = useAuth();
  const { data: savedEvents, reload } = useCollection(user ? '/saved-events/' : null);
  const isSaved = savedEvents.some(saved => saved.id === event.id);
  const handleSave = async e => {
    e.preventDefault(); e.stopPropagation();
    if (!user) { toast.error('Please log in to save events.'); return; }
    try { await api('/saved-events/', { method: isSaved ? 'DELETE' : 'POST', body: { event: event.id } }); reload(); }
    catch (error) { toast.error(error.message); }
  };
  return (
    <div className="block">
      <div className="w-[313px] overflow-hidden rounded-2xl border border-gray-100 bg-[#FEFEFE] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
        {/* Image & Overlays */}
        <div className="relative h-[150px] w-full bg-slate-100">
          <NavLink to={`/events/${event.id}`} className="block h-full">
            <SiteImage
              src={event.image}
              alt={event.text}
              className="h-full w-full object-contain"
            />
          </NavLink>

          {/* Date Badge */}
          <div className="absolute left-3 top-3 rounded-xl bg-[#FF6A00] px-2.5 py-1 text-center text-white shadow-sm">
            <span className="block text-sm font-bold leading-tight">
              {event.dateDay || "28"}
            </span>

            <span className="block text-[10px] font-semibold uppercase tracking-wider">
              {event.dateMonth || "OCT"}
            </span>
          </div>

          {/* Heart Button */}
          <button
            type="button"
            onClick={handleSave}
            aria-label={isSaved ? "Remove from saved" : "Save event"}
            className={`absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-md transition-all hover:bg-white ${
              isSaved ? "text-red-500" : "text-gray-700 hover:text-red-500"
            }`}
          >
            <Heart
              className="h-4 w-4"
              fill={isSaved ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* Content Section */}
        <NavLink to={`/events/${event.id}`} className="block">
          <div className="flex flex-grow flex-col justify-between space-y-3 p-3.5">
            <p className="truncate text-[15px] font-semibold text-gray-900">
              {event.text}
            </p>

            <div className="flex items-center justify-between text-sm">
              <div className="flex min-w-0 items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3.5 w-3.5 shrink-0" />

                <span className="truncate">{event.text2}</span>
              </div>

              <p className="text-[15px] font-semibold text-[#3C6E16]">
                {event.text3}
              </p>
            </div>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default EventCard;
