import React from "react";
import { Check, Sparkles } from "lucide-react";

const FeatureCard = ({
  bg = "bg-white border border-gray-100 shadow-sm",
  title = "Feature Highlight",
  subtitle = "Category",
  icon: Icon = Sparkles,
  iconColor = "text-[#265F27]",
  iconBorder = "border-[#265F27]/20 bg-[#265F27]/10",
  items = [],
}) => {
  return (
    <div
      className={`relative flex flex-col justify-between gap-6 rounded-2xl p-6 md:p-8 sm:flex-row sm:items-start ${bg}`}
    >
      {/* CONTENT AREA */}
      <div className="flex-1">
        {/* SUBTITLE BADGE */}
        {subtitle && (
          <p className="mb-2 text-xs font-black tracking-wider uppercase text-[#F97316]">
            {subtitle}
          </p>
        )}

        {/* FEATURE TITLE */}
        <h3 className="mb-5 text-xl font-black text-gray-900 md:text-2xl">
          {title}
        </h3>

        {/* BULLET POINTS LIST */}
        {items.length > 0 && (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#265F27]/10">
                  <Check className={`h-3.5 w-3.5 stroke-[3] ${iconColor}`} />
                </div>
                <span className="text-sm font-semibold text-gray-700 md:text-base">
                  {item}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FEATURE ICON BADGE */}
      {Icon && (
        <div className="self-end sm:self-start">
          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 transition hover:scale-105 ${iconBorder}`}
          >
            <Icon className={`h-8 w-8 ${iconColor}`} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureCard;