import { useState } from "react";

const W = 600;
const H = 240;
const PAD = { top: 16, right: 16, bottom: 30, left: 44 };

const niceMax = (max) => {
  const step = 10 ** Math.floor(Math.log10(max));
  return Math.ceil((max * 1.05) / step) * step;
};

const formatValue = (v, prefix) =>
  `${prefix}${v >= 1000 ? `${+(v / 1000).toFixed(1)}k` : v}`;

const buildPaths = (values, yMax) => {
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const baseY = PAD.top + innerH;

  const points = values.map((v, i) => ({
    x: PAD.left + (i / (values.length - 1)) * innerW,
    y: baseY - (v / yMax) * innerH,
  }));

  let line = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p = points[i - 1];
    const c = points[i];
    const mx = (p.x + c.x) / 2;
    line += ` C ${mx} ${p.y}, ${mx} ${c.y}, ${c.x} ${c.y}`;
  }

  const last = points[points.length - 1];
  const area = `${line} L ${last.x} ${baseY} L ${points[0].x} ${baseY} Z`;

  return { points, line, area, baseY };
};

const PlatformActivity = ({ labels, series }) => {
  const tabs = Object.keys(series);
  const [active, setActive] = useState(tabs[0]);

  const { label, prefix, values } = series[active];
  const yMax = niceMax(Math.max(...values));
  const { points, line, area, baseY } = buildPaths(values, yMax);
  const ticks = [0, yMax / 2, yMax];
  const innerH = H - PAD.top - PAD.bottom;

  return (
    <section className="h-full rounded-xl bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-[#0f172a]">
          Platform Activity
        </h2>

        <div
          role="tablist"
          aria-label="Chart data"
          className="flex rounded-lg bg-slate-100 p-0.5"
        >
          {tabs.map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active === key}
              onClick={() => setActive(key)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                active === key
                  ? "bg-[#14481f] text-white"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {series[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* The chart scrolls sideways inside its own box on very narrow screens */}
      <div className="mt-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full min-w-[420px]"
          role="img"
          aria-label={`${label} activity chart`}
        >
          <defs>
            <linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#15803d" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#15803d" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Gridlines + y-axis labels */}
          {ticks.map((t) => {
            const y = baseY - (t / yMax) * innerH;
            return (
              <g key={t}>
                <line
                  x1={PAD.left}
                  x2={W - PAD.right}
                  y1={y}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="3 4"
                />
                <text
                  x={PAD.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="#94a3b8"
                >
                  {formatValue(t, prefix)}
                </text>
              </g>
            );
          })}

          {/* Area, line and dots */}
          <path d={area} fill="url(#activityFill)" />
          <path
            d={line}
            fill="none"
            stroke="#15803d"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {points.map((p, i) => (
            <circle key={labels[i]} cx={p.x} cy={p.y} r="3.5" fill="#15803d" />
          ))}

          {/* X-axis labels */}
          {points.map((p, i) => (
            <text
              key={labels[i]}
              x={p.x}
              y={H - 8}
              textAnchor="middle"
              fontSize="12"
              fill="#94a3b8"
            >
              {labels[i]}
            </text>
          ))}
        </svg>
      </div>
    </section>
  );
};

export default PlatformActivity;
