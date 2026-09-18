import React, { useState } from "react";
import { Bus, Clock, MapPin, CheckCircle } from "lucide-react";

const initialSchedules = [
  { id: 1, route: "Umuahia → Aba", time: "7:00 AM", price: 1500, seatsLeft: 12 },
  { id: 2, route: "Umuahia → Aba", time: "10:30 AM", price: 1500, seatsLeft: 4 },
  { id: 3, route: "Aba → Umuahia", time: "8:15 AM", price: 1500, seatsLeft: 9 },
  { id: 4, route: "Umuahia → Owerri", time: "9:00 AM", price: 2500, seatsLeft: 6 },
  { id: 5, route: "Owerri → Umuahia", time: "4:00 PM", price: 2500, seatsLeft: 0 },
];

const ShuttlePage = () => {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [seatCount, setSeatCount] = useState(1);
  const [bookedId, setBookedId] = useState(null);

  const handleBook = (id) => {
    setSchedules((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, seatsLeft: Math.max(0, s.seatsLeft - seatCount) } : s
      )
    );
    setBookedId(id);
    setTimeout(() => setBookedId(null), 3000);
  };

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
                      disabled={isFull}
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