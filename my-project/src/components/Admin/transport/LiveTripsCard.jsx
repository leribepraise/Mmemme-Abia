import { Circle } from "lucide-react";

const LiveTripsCard = ({ trips }) => (
  <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-sm font-semibold text-slate-900">Live Trips</h2>
      <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
        <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500" />
        {trips.length} Active
      </span>
    </div>

    <div className="relative h-56 overflow-hidden rounded-lg bg-emerald-50">
      {/* Static illustrative route line — not a real map */}
      <svg
        viewBox="0 0 400 220"
        className="absolute inset-0 h-full w-full text-emerald-300"
        preserveAspectRatio="none"
      >
        <path
          d="M40 60 C 150 30, 200 180, 340 110"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="6 6"
        />
      </svg>

      {trips.map((trip) => (
        <div
          key={trip.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ top: trip.position.top, left: trip.position.left }}
        >
          <div className="flex items-center gap-2 rounded-lg bg-white px-2.5 py-1.5 shadow-md">
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
            <div className="whitespace-nowrap text-left">
              <p className="text-xs font-semibold text-slate-900">
                {trip.vehicle}
              </p>
              <p className="text-[10px] text-slate-500">
                {trip.status} • {trip.minsLeft} mins left
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default LiveTripsCard;
