const RADIUS = 60;
const STROKE = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const TransportOverviewDonut = ({ segments, total }) => {
  let offset = 0;

  return (
    <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">
          Transport Overview
        </h2>
        <span className="text-xs text-slate-400">All Time Breakdown</span>
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
        <div className="relative h-40 w-40 shrink-0">
          <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
            {segments.map((seg) => {
              const dash = (seg.value / 100) * CIRCUMFERENCE;
              const gap = CIRCUMFERENCE - dash;
              const circle = (
                <circle
                  key={seg.id}
                  cx="80"
                  cy="80"
                  r={RADIUS}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={STROKE}
                  strokeDasharray={`${dash} ${gap}`}
                  strokeDashoffset={-offset}
                />
              );
              offset += dash;
              return circle;
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-semibold text-slate-900">
              {total}
            </span>
            <span className="text-[10px] text-slate-400">TOTAL BOOKINGS</span>
          </div>
        </div>

        <ul className="space-y-1.5">
          {segments.map((seg) => (
            <li
              key={seg.id}
              className="flex items-center gap-2 text-xs text-slate-600"
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: seg.color }}
              />
              <span className="w-16">{seg.label}</span>
              <span className="font-medium text-slate-800">{seg.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TransportOverviewDonut;
