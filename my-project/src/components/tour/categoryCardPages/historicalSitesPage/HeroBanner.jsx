import React from "react";
import { Landmark, ScrollText, MapPin, BookOpen } from "lucide-react";

const defaultIcons = [Landmark, ScrollText, MapPin, BookOpen];

const HeroBanner = ({ title, description, features }) => {
  return (
    <div className="relative bg-gradient-to-br from-[#0F1F0F] to-[#1A2B1A] rounded-2xl p-6 md:p-10 overflow-hidden">
      <div className="relative z-10 max-w-2xl">
        <h1 className="text-white font-bold text-3xl md:text-4xl">{title}</h1>

        <p className="text-gray-300 mt-3 text-sm md:text-base leading-relaxed">
          {description}
        </p>

        <hr className="border-white/10 my-6" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {features.map(({ title: fTitle, subtitle }, i) => {
            const Icon = defaultIcons[i % defaultIcons.length];
            return (
              <div key={fTitle} className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-white shrink-0" />
                <div>
                  <p className="text-white text-xs font-semibold">{fTitle}</p>
                  <p className="text-gray-400 text-[11px]">{subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
