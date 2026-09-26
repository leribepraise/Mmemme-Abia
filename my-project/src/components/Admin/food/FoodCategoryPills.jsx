const FoodCategoryPills = ({ pills, active, onSelect }) => (
  <div className="flex gap-2 overflow-x-auto pb-1">
    {pills.map((pill) => {
      const isActive = pill === active;
      return (
        <button
          key={pill}
          type="button"
          onClick={() => onSelect(pill)}
          className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            isActive
              ? "bg-[#0f3d1b] text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {pill}
        </button>
      );
    })}
  </div>
);

export default FoodCategoryPills;
