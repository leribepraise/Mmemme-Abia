import { TrendingDown, TrendingUp } from "lucide-react";

export default function OrganizerStatCard({ title, value, trend, isPositive = true, icon: Icon, plain = false }) {
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  return (
    <div
      className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
      data-testid={`card-stat-${title.toLowerCase().replaceAll(" ", "-")}`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-bold text-gray-500">{title}</h3>
        {Icon && (
          <span className="w-7 h-7 rounded-lg bg-[#EAF5EA] text-[#3F7D3D] flex items-center justify-center shrink-0">
            <Icon className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-gray-900 mb-3">{value}</p>
      {plain ? (
        <p className="text-xs font-bold text-gray-400">{trend}</p>
      ) : (
        <div className="flex items-center gap-1.5 text-xs font-bold">
          <TrendIcon className={`w-3.5 h-3.5 ${isPositive ? "text-green-500" : "text-red-500"}`} />
          <span className={isPositive ? "text-green-500" : "text-red-500"}>{trend}</span>
          <span className="text-gray-400 font-medium">from last month</span>
        </div>
      )}
    </div>
  );
}
