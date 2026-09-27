const StatsGrid = ({ stats }) => {
  return (
    <section
      aria-label="Key numbers"
      className="grid grid-cols-2 gap-3 lg:grid-cols-4"
    >
      {stats.map(({ id, label, value, change, icon: Icon }) => (
        <div key={id} className="rounded-xl bg-white p-4 shadow-sm">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-50 text-[#14481f]">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <p className="mt-3 text-xs text-slate-500">{label}</p>
          <div className="mt-1 flex flex-wrap items-end justify-between gap-x-2 gap-y-1">
            <p className="text-xl font-bold text-[#0f172a] sm:text-2xl">
              {value}
            </p>
            {change && <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
              {change}
            </span>}
          </div>
        </div>
      ))}
    </section>
  );
};

export default StatsGrid;
