export const VENDOR_TABS = [
  "Overview",
  "Menu",
  "Orders",
  "Reviews",
  "Gallery",
  "Documents",
  "Activity",
];

const VendorDetailTabs = ({ active, onChange }) => (
  <div className="overflow-x-auto border-b border-slate-200">
    <div role="tablist" className="flex min-w-max gap-6">
      {VENDOR_TABS.map((tab) => {
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

export default VendorDetailTabs;
