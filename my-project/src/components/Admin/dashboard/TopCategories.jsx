const R = 38;
const CIRCUMFERENCE = 2 * Math.PI * R;

const TopCategories = ({ categories }) => {
  const total = categories.reduce((sum, c) => sum + c.value, 0);

  // Work out where each donut segment starts
  const segments = categories.reduce((acc, c) => {
    const len = (c.value / total) * CIRCUMFERENCE;
    const prev = acc[acc.length - 1];
    const offset = prev ? prev.offset + prev.len : 0;
    acc.push({ ...c, len, offset });
    return acc;
  }, []);

  return (
    <section className="h-full rounded-xl bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-sm font-semibold text-[#0f172a]">Top Categories</h2>

      <div className="mt-4 flex flex-col items-center justify-center gap-5 sm:flex-row lg:flex-col xl:flex-row">
        <svg
          viewBox="0 0 100 100"
          className="h-32 w-32 shrink-0"
          role="img"
          aria-label="Share of activity by category"
        >
          {segments.map((s) => (
            <circle
              key={s.name}
              cx="50"
              cy="50"
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth="14"
              strokeDasharray={`${s.len} ${CIRCUMFERENCE - s.len}`}
              strokeDashoffset={-s.offset}
              transform="rotate(-90 50 50)"
            />
          ))}
        </svg>

        <ul className="w-full max-w-[220px] space-y-2 text-xs">
          {categories.map((c) => (
            <li
              key={c.name}
              className="flex items-center justify-between gap-3"
            >
              <span className="flex items-center gap-2 text-slate-600">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: c.color }}
                  aria-hidden="true"
                />
                {c.name}
              </span>
              <span className="text-slate-500">{c.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TopCategories;
