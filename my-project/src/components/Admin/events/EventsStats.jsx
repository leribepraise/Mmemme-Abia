const EventsStats = ({ stats }) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
    {stats.map((stat) => {
      const Icon = stat.icon;
      const negative = stat.change.startsWith("-");
      return (
        <div
          key={stat.id}
          className="flex items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.iconBox}`}
            >
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-slate-500">{stat.label}</p>
              <p className="text-xl font-semibold text-slate-900">
                {stat.value}
              </p>
            </div>
          </div>
          <span
            className={
              negative
                ? "rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-500"
                : "rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600"
            }
          >
            {stat.change}
          </span>
        </div>
      );
    })}
  </div>
);

export default EventsStats;
