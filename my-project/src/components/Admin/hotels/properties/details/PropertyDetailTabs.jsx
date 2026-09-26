export const PROPERTY_TABS = [
  "Overview",
  "Rooms",
  "Location",
  "Reviews",
  "Host",
  "Policies",
];

const PropertyDetailTabs = ({ active, onChange }) => (
  <div className="overflow-x-auto border-b border-slate-200">
    <div role="tablist" className="flex min-w-max gap-6">
      {PROPERTY_TABS.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab)}
            className={`-mb-px border-b-2 pb-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "border-[#1a6a2a] text-[#1a6a2a]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  </div>
);

export default PropertyDetailTabs;
    