export const ORGANIZER_DETAIL_TABS = [
  "Overview",
  "Events",
  "Properties",
  "Reviews",
  "Revenue",
  "Documents",
];

const OrganizerDetailTabs = ({ active, onChange }) => (
  <div className="overflow-x-auto border-b border-gray-200">
    <div className="flex min-w-max gap-6">
      {ORGANIZER_DETAIL_TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`-mb-px border-b-2 pb-2.5 text-xs font-medium transition-colors ${
            active === tab
              ? "border-[#f28c28] text-[#f28c28]"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  </div>
);

export default OrganizerDetailTabs;
