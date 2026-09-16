import { useState } from "react";
import { Link } from "react-router-dom";
import { FiBookmark, FiMinus, FiPlus } from "react-icons/fi";

const TicketCard = ({ tickets, updateQuantity, event }) => {
  const isFree = event?.text3?.toLowerCase() === "free";

  const [isSaved, setIsSaved] = useState(() => {
    const savedEvents = sessionStorage.getItem("savedEvents");

    if (!savedEvents) return false;

    try {
      const parsedEvents = JSON.parse(savedEvents);

      return parsedEvents.some((savedEvent) => savedEvent.id === event?.id);
    } catch {
      return false;
    }
  });

  const handleSaveEvent = () => {
    if (!event) return;

    const savedEvents = sessionStorage.getItem("savedEvents");

    let events = [];

    try {
      events = savedEvents ? JSON.parse(savedEvents) : [];

      if (!Array.isArray(events)) {
        events = [];
      }
    } catch {
      events = [];
    }

    const alreadySaved = events.some(
      (savedEvent) => savedEvent.id === event.id,
    );

    if (alreadySaved) {
      const updatedEvents = events.filter(
        (savedEvent) => savedEvent.id !== event.id,
      );

      sessionStorage.setItem("savedEvents", JSON.stringify(updatedEvents));

      setIsSaved(false);
    } else {
      const eventToSave = {
        id: event.id,
        title: event.text,
        image: event.image,
        location: event.text2,
        price: event.text3,
      };

      sessionStorage.setItem(
        "savedEvents",
        JSON.stringify([eventToSave, ...events]),
      );

      setIsSaved(true);
    }
  };

  const tierData = [
    { key: "regular", label: "Regular", price: event?.text3 || "N0" },
    { key: "vip", label: "VIP", price: "N10,000" },
    { key: "vvip", label: "VVIP", price: "N20,000" },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
      <div className="bg-[#E4FCE4] -mx-5 -mt-5 p-4 rounded-t-2xl border-b border-emerald-100">
        <span className="text-[12px] font-medium text-[#000000] uppercase tracking-wider">
          From
        </span>

        <p className="text-[18px] font-bold text-[#3C6E16]">
          {event?.text3 || "N0"}
        </p>
      </div>

      <div>
        <h3 className="text-[12px] font-semibold text-[#000000] tracking-wider mb-3">
          Available Tickets
        </h3>

        <div className="space-y-3.5 divide-y divide-slate-100">
          {tierData.map((tier) => (
            <div key={tier.key} className="pt-2 flex flex-col justify-between">
              <div className="flex justify-between">
                <h4 className="font-bold text-[18px]">{tier.label}</h4>
                <p className="font-bold text-[18px]">
                  {isFree ? "Free" : tier.price}
                </p>
              </div>

              <div className="flex justify-between">
                <p className="text-[12px] font-medium">
                  {isFree
                    ? "Free entry — quantity fixed"
                    : "Choose the number of tickets to buy"}
                </p>

                <div
                  className={`flex items-center border rounded-lg p-0.5 ${
                    isFree ? "opacity-40" : ""
                  }`}
                >
                  <button
                    onClick={() => updateQuantity(tier.key, "decrease")}
                    disabled={isFree}
                    className="p-1 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <FiMinus className="w-3 h-3" />
                  </button>

                  <span className="px-2 text-sm font-bold">
                    {tickets[tier.key]}
                  </span>

                  <button
                    onClick={() => updateQuantity(tier.key, "increase")}
                    disabled={isFree}
                    className="p-1 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <FiPlus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <Link
          to="/checkout"
          state={{
            event,
            tickets,
          }}
          className="block"
        >
          <button className="w-full bg-[#F46F1A] hover:bg-[#e05600] text-white font-bold py-3 rounded-xl cursor-pointer mb-2">
            Buy Tickets
          </button>
        </Link>

        <button
          onClick={handleSaveEvent}
          className={`w-full border py-2.5 rounded-xl flex items-center justify-center space-x-2 cursor-pointer ${
            isSaved
              ? "border-orange-500 text-orange-600 bg-orange-50"
              : "border-emerald-600 text-emerald-700"
          }`}
        >
          <span>{isSaved ? "Saved Event" : "Save Event"}</span>

          <FiBookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <div className="flex -space-x-2">
          <img
            src="/Ellipse1.png"
            className="h-6 w-6 rounded-full ring-2 ring-white object-cover"
          />
          <img
            src="/Ellipse2.png"
            className="h-6 w-6 rounded-full ring-2 ring-white object-cover"
          />
          <img
            src="/Ellipse3.png"
            className="h-6 w-6 rounded-full ring-2 ring-white object-cover"
          />
        </div>

        <p className="text-[12px] font-semibold">15.7k people are interested</p>
      </div>
    </div>
  );
};

export default TicketCard;
