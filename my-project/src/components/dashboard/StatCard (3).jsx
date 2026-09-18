import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function StatCard({ label = "", value = "0", trend = "", icon: Icon }) {
  // Determine if trend is negative or neutral for appropriate styling
  const isNegative = typeof trend === "string" && trend.trim().startsWith("-");
  const isNeutral = typeof trend === "string" && (trend.trim().startsWith("0") || trend === "");

  // Select trend icon based on trend value
  const TrendIcon = isNegative ? TrendingDown : isNeutral ? Minus : TrendingUp;

  // Format test id safely
  const testId = `card-stat-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div
      className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md"
      data-testid={testId}
    >
      {/* HEADER: LABEL & ICON BADGE */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="text-sm font-extrabold text-gray-500 md:text-base">
          {label}
        </span>
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#265F27]/10 text-[#265F27]">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* VALUE & TREND FOOTER */}
      <div>
        <div className="text-2xl font-black tracking-tight text-gray-900 md:text-3xl">
          {value}
        </div>

        {trend && (
          <div className="mt-2 flex items-center gap-1.5 text-xs font-extrabold md:text-sm">
            <span
              className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 ${
                isNegative
                  ? "bg-red-50 text-red-600"
                  : isNeutral
                  ? "bg-gray-100 text-gray-600"
                  : "bg-green-50 text-[#265F27]"
              }`}
            >
              <TrendIcon className="h-3.5 w-3.5 shrink-0" />
              <span>{trend}</span>
            </span>
            <span className="font-semibold text-gray-400">vs. last month</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;