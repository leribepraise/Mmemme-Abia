import { useEffect } from "react";
import { api, allPages, money } from "@/lib/api";
import toast from "react-hot-toast";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FiBookmark, FiMinus, FiPlus } from "react-icons/fi";

const TicketCard = ({
  tickets,
  updateQuantity,
  enabledTiers,
  toggleTier,
  event,
}) => {
  const isFree = event?.text3?.toLowerCase() === "free";

  const [isSaved, setIsSaved] = useState(false);
  useEffect(() => { let active = true; allPages('/saved-events/').then(rows => { if (active) setIsSaved(rows.some(row => row.id === event.id)); }).catch(error => toast.error(error.message)); return () => { active = false; }; }, [event.id]);
  const handleSaveEvent = async () => {
    try { await api('/saved-events/', { method: isSaved ? 'DELETE' : 'POST', body: { event: event.id } }); setIsSaved(value => !value); }
    catch (error) { toast.error(error.message); }
  };
  const tierData = event.ticket_types.map(t => ({ key: t.id, label: t.name, price: Number(t.price) === 0 ? 'Free' : money(t.price) }));
  const hasAnyTicket = Object.values(tickets).some((qty) => qty > 0);

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
          {tierData.map((tier) => {
            const isEnabled = enabledTiers[tier.key];
            const stepperDisabled = !isEnabled;

            return (
              <div
                key={tier.key}
                className="pt-2 flex flex-col justify-between"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-[18px]">{tier.label}</h4>

                  <div className="flex items-center gap-3">
                    <p className="font-bold text-[18px]">
                      {tier.price}
                    </p>

                    {true && (
                      <button
                        type="button"
                        onClick={() => toggleTier(tier.key)}
                        className={`w-10 h-5.5 rounded-full transition shrink-0 relative ${
                          isEnabled ? "bg-[#3C6E16]" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full transition-transform ${
                            isEnabled ? "translate-x-4.5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <p className="text-[12px] font-medium">
                    {isFree
                      ? "Choose the number of tickets"
                      : isEnabled
                        ? "Choose the number of tickets to buy"
                        : "Turn on to select this ticket type"}
                  </p>

                  <div
                    className={`flex items-center border rounded-lg p-0.5 ${
                      stepperDisabled ? "opacity-40" : ""
                    }`}
                  >
                    <button
                      onClick={() => updateQuantity(tier.key, "decrease")}
                      disabled={stepperDisabled}
                      className="p-1 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <FiMinus className="w-3 h-3" />
                    </button>

                    <span className="px-2 text-sm font-bold">
                      {tickets[tier.key] || 0}
                    </span>

                    <button
                      onClick={() => updateQuantity(tier.key, "increase")}
                      disabled={stepperDisabled}
                      className="p-1 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <FiPlus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <Link
          to={hasAnyTicket ? "/checkout" : "#"}
          state={{
            event,
            tickets,
          }}
          className="block"
          onClick={(e) => {
            if (!hasAnyTicket) e.preventDefault();
          }}
        >
          <button
            disabled={!hasAnyTicket}
            className="w-full bg-[#F46F1A] hover:bg-[#e05600] text-white font-bold py-3 rounded-xl cursor-pointer mb-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
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

        <p className="text-[12px] font-semibold">Book securely with Mmemme Abia</p>
      </div>
    </div>
  );
};

export default TicketCard;
