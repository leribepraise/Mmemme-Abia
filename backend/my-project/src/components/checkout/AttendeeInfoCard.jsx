import SectionHeader from "./SectionHeader";

const AttendeeInfoCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <SectionHeader number="3" title="Attendee Information" />

      <div className="space-y-5 max-w-lg">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            placeholder="Enter full name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>

          <input
            type="email"
            placeholder="Enter email address"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="buyForSomeone"
            className="w-4 h-4 text-[#48782E] rounded border-gray-300 focus:ring-[#48782E]"
          />

          <label
            htmlFor="buyForSomeone"
            className="text-sm font-semibold text-gray-600 cursor-pointer"
          >
            I'm buying for someone else
          </label>
        </div>
      </div>
    </div>
  );
};

export default AttendeeInfoCard;
