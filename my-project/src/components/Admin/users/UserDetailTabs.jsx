export const USER_DETAIL_TABS = [
  "Overview",
  "Bookings",
  "Payments",
  "Subscription",
  "Activity",
];

const UserDetailTabs = ({ active, onChange }) => (
  <div className="overflow-x-auto border-b border-gray-200">
    <div className="flex min-w-max gap-6">
      {USER_DETAIL_TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`-mb-px border-b-2 pb-2.5 text-xs font-medium transition-colors ${
            active === tab
              ? "border-[#1a6a2a] text-[#1a6a2a]"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  </div>
);

export default UserDetailTabs;
