import React from "react";

export default function TopActivityItem({
  icon: Icon,
  colorClass,
  title,
  subtitle,
}) {
  return (
    <div className="flex items-center gap-4">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-bold text-xs text-black mb-0.5">{title}</h4>
        <p className="text-[10px] text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}
