import ShareEvent from "./ShareEvent";
import SimilarEventCard from "./SimilarEventCard";

const SimilarEvents = () => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
      <ShareEvent />

      <h3 className="text-[20px] font-semibold text-[#000000] tracking-wider">
        Similar Events
      </h3>

      <div className="space-y-3">
        <SimilarEventCard
          image="/event5.jpg"
          alt="Abia Food & Drinks"
          date="02 Nov"
          title="Abia Food & Drinks Carnival"
          location="Arochukwu, Abia"
          price="Free"
        />

        <SimilarEventCard
          image="/event6.jpg"
          alt="Abia Cultural Festival"
          date="31 Oct"
          title="Abia Cultural Festival"
          location="Ohafia, Abia"
          price="Free"
        />
      </div>
    </div>
  );
};

export default SimilarEvents;
