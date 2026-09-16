import React from "react";
import { Landmark, Users, ShieldCheck, Mountain } from "lucide-react";

const AboutStats = () => {
  const stats = [
    {
      icon: Landmark,
      title: "Rich Culture",
      text: "Deep tradition and vibrant heritage.",
    },
    {
      icon: Users,
      title: "Great People",
      text: "Warm, hospitable and hardworking.",
    },
    {
      icon: ShieldCheck,
      title: "Strong Economy",
      text: "Home to industries and innovation.",
    },
    {
      icon: Mountain,
      title: "Beautiful Places",
      text: "Scenic spots and tourist attractions.",
    },
  ];

  return (
    <div className="border-t border-gray-200 pt-10">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`text-center px-4 py-6 ${
                index !== stats.length - 1 ? "lg:border-r border-gray-200" : ""
              }`}
            >
              <Icon className="w-6 h-6 text-[#48782E] mx-auto mb-4" />

              <h3 className="font-semibold text-sm text-[#1F2937]">
                {item.title}
              </h3>

              <p className="text-xs text-[#6B7280] mt-2 leading-relaxed">
                {item.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AboutStats;
