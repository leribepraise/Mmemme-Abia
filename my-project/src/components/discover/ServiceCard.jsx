import React from "react";
import { Sparkles } from "lucide-react";

const ServiceCard = ({
  icon: Icon = Sparkles,
  title = "Service Title",
  text = "Description text goes here...",
  color = "text-[#265F27]",
}) => {
  return (
    <div className="group flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-gray-200 hover:shadow-md md:p-7">
      <div>
        {/* ICON CONTAINER BADGE */}
        {Icon && (
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#265F27]/10 transition-colors group-hover:bg-[#265F27] group-hover:text-white">
            <Icon className={`h-6 w-6 transition-colors group-hover:text-white ${color}`} />
          </div>
        )}

        {/* TITLE */}
        <h3 className="mb-3 text-lg font-extrabold tracking-tight text-gray-900 md:text-xl">
          {title}
        </h3>

        {/* DESCRIPTION TEXT */}
        <p className="text-sm font-semibold leading-relaxed text-gray-600 md:text-base">
          {text}
        </p>
      </div>
    </div>
  );
};

export default ServiceCard;