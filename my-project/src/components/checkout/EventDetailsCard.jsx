import { Calendar, Clock, MapPin } from "lucide-react";
import SectionHeader from "./SectionHeader";

const EventDetailsCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <SectionHeader number="1" title="Event Details" />

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 h-40 bg-gray-200 rounded-lg overflow-hidden shrink-0">
          <img
            src="/checkout.jpg"
            alt="Event Banner"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-[18px] text-black">
            Abia Business Summit 2026
          </h3>

          <div className="space-y-3 text-[18px] font-semibold text-[#3D3E3E]">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span>Fri, 25 Oct - Sun, 27 Oct, 2026</span>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <span>6:00 PM - 11:00 PM (WAT)</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span>Umueze Sports Arena, Umuahia, Abia</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsCard;
