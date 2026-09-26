import { FiUsers, FiMic, FiCoffee, FiShield } from "react-icons/fi";

const AboutEvent = ({ event }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h2 className="text-[20px] font-semibold text-slate-900 mb-6">
        About the Event
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
        <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50">
          <FiUsers className="w-6 h-6 text-emerald-600 mb-1.5" />
          <span className="text-[18px] font-semibold text-[#000000]">
            {event.capacity}
          </span>
          <span className="text-[16px] font-medium text-[#000000]">
            Capacity
          </span>
        </div>

        <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50">
          <FiUsers className="w-6 h-6 text-emerald-600 mb-1.5" />
          <span className="text-[18px] font-semibold text-[#000000]">
            {event.ticket_types.reduce((sum, t) => sum + t.quantity_available, 0)}
          </span>
          <span className="text-xs text-slate-500">
            Available tickets
          </span>
        </div>

        <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50">
          <FiMic className="w-6 h-6 text-emerald-600 mb-1.5" />
          <span className="text-[18px] font-semibold text-[#000000]">
            {event.category}
          </span>
          <span className="text-xs text-slate-500">
            Category
          </span>
        </div>

        <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50">
          <FiCoffee className="w-6 h-6 text-emerald-600 mb-1.5" />
          <span className="text-[18px] font-semibold text-[#000000]">
            {event.city}
          </span>
          <span className="text-xs text-slate-500">
            City
          </span>
        </div>

        <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50 col-span-2 sm:col-span-1">
          <FiShield className="w-6 h-6 text-emerald-600 mb-1.5" />
          <span className="text-[18px] font-semibold text-[#000000]">
            {event.organizer?.verified ? "Verified" : "Unverified"}
          </span>
          <span className="text-xs text-slate-500">
            Provider
          </span>
        </div>
      </div>
    </div>
  );
};

export default AboutEvent;