import React from "react";
import { Check } from "lucide-react";

const FeatureCard = ({
  bg,
  title,
  subtitle,
  icon: Icon,
  iconColor,
  iconBorder,
  items,
}) => {
  return (
    <div className={`${bg} rounded-2xl p-6 flex justify-between gap-6`}>
      <div className="flex-1">
        <p className="text-xs font-bold uppercase text-[#F97316] mb-2">
          {subtitle}
        </p>

        <h3 className="text-2xl font-bold text-[#1F2937] mb-5">{title}</h3>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm">
              <Check className={`w-4 h-4 ${iconColor}`} />
              <span className="text-[#374151]">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-end">
        <div
          className={`w-16 h-16 rounded-full border-4 ${iconBorder} flex items-center justify-center`}
        >
          <Icon className={`w-8 h-8 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
