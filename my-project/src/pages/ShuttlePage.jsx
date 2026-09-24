import { useCollection } from "@/hooks/useApi";
import { useBooking } from "@/hooks/useBooking";
import { useSearchParams } from "react-router-dom";
import React, { useState } from "react";
import { Bus, Clock, MapPin, CheckCircle } from "lucide-react";



const ShuttlePage = () => {
  const [params] = useSearchParams();
  const { data: routes } = useCollection('/transport-routes/');
  const { data: departures } = useCollection('/departures/');
  const { book, busy } = useBooking();
  const schedules = departures.filter(d => {
    const route = routes.find(row => row.id === d.route);
    return (!params.get('route') || d.route === params.get('route')) && (!params.get('origin') || route?.origin.toLowerCase().includes(params.get('origin').toLowerCase())) && (!params.get('destination') || route?.destination.toLowerCase().includes(params.get('destination').toLowerCase())) && (!params.get('date') || d.departs_at.slice(0, 10) === params.get('date'));
  }).map(d => { const route = routes.find(r => r.id === d.route); return { ...d, route: route ? `${route.origin} → ${route.destination}` : d.vehicle, time: new Date(d.departs_at).toLocaleString(), price: Number(d.price), seatsLeft: d.quantity_available }; });
  const [seatCount, setSeatCount] = useState(Math.min(6, Math.max(1, Number(params.get('seats')) || 1)));
  const [bookedId, setBookedId] = useState(null);

  const handleBook = id => book("TRANSPORT", [{ id, quantity: seatCount }]);

  return (
    <div className="min-h-screen bg-[#F5F7F3] p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shuttle Schedules</h1>
          <p className="text-sm text-gray-500 mt-1">
            Book a seat on a shared shuttle between towns in Abia.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center gap-4">
          <label className="text-xs font-semibold text-gray-600">Seats needed</label>
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => setSeatCount((n) => Math.max(1, n - 1))}
              className="px-3 py-1.5 text-gray-500 hover:bg-gray-50"
            >
              −
            </button>
            <span className="px-4 text-sm font-bold">{seatCount}</span>
            <button
              onClick={() => setSeatCount((n) => Math.min(6, n + 1))}
              className="px-3 py-1.5 text-gray-500 hover:bg-gray-50"
            >
              +
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {!schedules.length && <p role="status">No matching departures are available.</p>}
          {schedules.map((s) => {
            const isFull = s.seatsLeft < seatCount;
            const justBooked = bookedId === s.id;
            return (
              <div
                key={s.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#48782E]/10 flex items-center justify-center">
                    <Bus className="w-5 h-5 text-[#48782E]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" /> {s.route}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <Clock className="w-3.5 h-3.5" /> {s.time} •{" "}
                      {s.seatsLeft > 0 ? `${s.seatsLeft} seats left` : "Fully booked"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-gray-900">
                    ₦{s.price.toLocaleString()}
                  </span>
                  {justBooked ? (
                    <span className="flex items-center gap-1 text-emerald-700 text-xs font-bold">
                      <CheckCircle className="w-4 h-4" /> Booked!
                    </span>
                  ) : (
                    <button
                      onClick={() => handleBook(s.id)}
                      disabled={isFull || busy}
                      className="bg-[#F97316] hover:bg-[#df5f18] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-5 py-2 rounded-lg text-xs transition"
                    >
                      {isFull ? "Full" : "Book Seat"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ShuttlePage;