import React from "react";

const QuickFinderCard = ({ icon: Icon, title, text, color, bg, iconBg }) => {
  return (
    <div
      className={`flex items-start gap-3 sm:gap-4 rounded-2xl p-4 sm:p-6 md:p-8 ${bg}`}
    >
      {/* Icon */}
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 flex justify-center items-center rounded-full shrink-0 ${iconBg}`}
      >
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-sm sm:text-base">{title}</h3>

        <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
};

export default QuickFinderCard;
