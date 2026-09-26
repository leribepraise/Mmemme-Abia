const TransportStats = ({ stats }) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
    {stats.map(({ id, label, value, change, icon: Icon, iconBox }) => (
      <div key={id} className="rounded-xl bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBox}`}
            >
              <Icon className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-xl font-semibold text-slate-900 sm:text-2xl">
                {value}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
            {change}
          </span>
        </div>
      </div>
    ))}
  </div>
);

export default TransportStats;
