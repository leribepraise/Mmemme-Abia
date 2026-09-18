import React from "react";

export function MiniChart({ large = false }) {
  const points = [
    { x: 0, y: 139, label: "May 01" },
    { x: 125, y: 116, label: "May 08" },
    { x: 260, y: 119, label: "May 15" },
    { x: 400, y: 86, label: "May 22" },
    { x: 520, y: 46, label: "May 29" },
  ];

  return (
    <div
      className={`relative w-full rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-6 ${
        large ? "h-72 md:h-80" : "h-48 md:h-56"
      }`}
      data-testid="chart-sales-overview"
    >
      {/* BACKGROUND GRID LINES */}
      <div className="absolute inset-x-4 top-4 bottom-10 flex flex-col justify-between opacity-50 md:inset-x-6 md:top-6">
        <div className="w-full border-b border-dashed border-gray-200" />
        <div className="w-full border-b border-dashed border-gray-200" />
        <div className="w-full border-b border-dashed border-gray-200" />
        <div className="w-full border-b border-dashed border-gray-200" />
      </div>

      {/* CHART SVG AREA */}
      <div className="relative h-full w-full pb-6">
        <svg
          viewBox="0 0 520 180"
          preserveAspectRatio="none"
          className="h-full w-full overflow-visible"
          aria-label="Sales over time chart"
        >
          {/* PRIMARY REVENUE LINE (Green #265F27) */}
          <path
            d="M0 139 C55 105, 75 148, 125 116 S205 94, 260 119 S345 65, 400 86 S470 59, 520 46"
            fill="none"
            stroke="#265F27"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* SECONDARY LINE (Orange #F97316) */}
          <path
            d="M0 155 C55 133, 75 157, 125 141 S205 122, 260 144 S345 96, 400 116 S470 90, 520 76"
            fill="none"
            stroke="#F97316"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* TERTIARY COMPARISON LINE (Gray) */}
          <path
            d="M0 166 C55 151, 75 166, 125 155 S205 143, 260 157 S345 126, 400 137 S470 123, 520 115"
            fill="none"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeDasharray="4 4"
            strokeLinecap="round"
          />

          {/* PRIMARY LINE DATA DOTS */}
          {points.map((pt) => (
            <circle
              key={pt.x}
              cx={pt.x}
              cy={pt.y}
              r="5"
              fill="#265F27"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>

      {/* TIMELINE LABELS */}
      <div className="absolute inset-x-4 bottom-3 flex justify-between text-xs font-bold text-gray-500 md:inset-x-6">
        {points.map((pt) => (
          <span key={pt.label}>{pt.label}</span>
        ))}
      </div>
    </div>
  );
}

export default MiniChart;