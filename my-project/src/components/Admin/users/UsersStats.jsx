const UsersStats = ({ stats }) => {
  return (
    <section aria-label="User numbers" className="grid gap-3 sm:grid-cols-3">
      {stats.map(({ id, label, value, change, icon: Icon }) => (
        <div
          key={id}
          className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-50 text-[#14481f]">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-500">{label}</p>
            <div className="mt-0.5 flex items-end justify-between gap-2">
              <p className="text-xl font-bold text-[#0f172a] sm:text-2xl">
                {value}
              </p>
              <span className="text-[11px] font-semibold text-green-700">
                {change}
              </span>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default UsersStats;
