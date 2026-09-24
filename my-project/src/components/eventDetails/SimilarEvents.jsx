import { useCollection } from "@/hooks/useApi";
import { eventCard } from "@/lib/catalog";
import ShareEvent from "./ShareEvent";
import SimilarEventCard from "./SimilarEventCard";

const SimilarEvents = () => {
  const { data: events } = useCollection("/events/", eventCard);
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
      <ShareEvent />

      <h3 className="text-[20px] font-semibold text-[#000000] tracking-wider">
        Similar Events
      </h3>

      <div className="space-y-3">
        {events.slice(0, 2).map(event => <SimilarEventCard key={event.id} image={event.image} alt={event.text} title={event.text} date={event.date} location={event.text2} price={event.text3} />)}
      </div>
    </div>
  );
};

export default SimilarEvents;
