import { FiCalendar, FiMapPin } from "react-icons/fi";

const EventHighlights = () => {
  return (
    <div className="md:col-span-5 space-y-4">
      <h1 className="text-[40px] font-bold">Abia Business Summit 2026</h1>

      <div className="space-y-3 text-sm">
        <div className="flex gap-3">
          <FiCalendar />

          <div>
            <p>Fri, 25 Oct - Sun, 27 Oct, 2026</p>
            <p>6:00 PM - 11:00 PM</p>
          </div>
        </div>

        <div className="flex gap-3">
          <FiMapPin />

          <div>
            <p>Umueze Sports Arena</p>
            <p>Umuahia, Abia</p>

            <button className="text-green-700 text-sm">View on map</button>
          </div>
        </div>
      </div>

      {/* organizer */}

      <div className="border-t pt-3 flex items-center gap-3">
        <img src="/asia.jpg" className="w-10 h-10" />

        <div>
          <p className="text-xs">Organized By</p>

          <h3 className="font-semibold">All Africa Leaders</h3>
        </div>
      </div>

      <p className="text-lg">Get ready for an unforgettable nights...</p>
    </div>
  );
};

export default EventHighlights;
