const OrganizersStats = ({ stats }) => (
  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
    {stats.map((s) => (
      <div key={s.id} className="rounded-xl bg-white p-4 shadow-sm">
        <p className="text-xs text-gray-600">{s.label}</p>
        <div className="mt-3 flex items-end justify-between gap-2">
          <span className="text-2xl font-bold text-gray-900">
            {s.value.toLocaleString()}
          </span>
          <span
            className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
              s.trend === "up"
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-500"
            }`}
          >
            {s.change}
          </span>
        </div>
      </div>
    ))}
  </div>
);

export default OrganizersStats;
