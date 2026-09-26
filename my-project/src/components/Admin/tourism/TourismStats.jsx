const TourismStats = ({ stats }) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
    {stats.map(({ id, label, value, change, icon: Icon, iconBox }) => (
      <div key={id} className="rounded-xl bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBox}`}
          >
            <Icon className="h-4.5 w-4.5" />
          </span>
          <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500">
            {change}
          </span>
        </div>
        <p className="mt-3 text-xl font-semibold text-slate-900 sm:text-2xl">
          {value}
        </p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    ))}
  </div>
);

export default TourismStats;
