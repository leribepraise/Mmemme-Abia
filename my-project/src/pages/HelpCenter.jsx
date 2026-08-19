import React from "react";
import {
  ShieldCheck,
  FileQuestion,
  CircleAlert,
  Headphones,
} from "lucide-react";

import HelpSearch from "../components/help/HelpSearch";
import HelpCard from "../components/help/HelpCard";

const HelpCenter = () => {
  const helpItems = [
    {
      icon: ShieldCheck,
      title: "Community Guidelines",
      subtitle: "Rules for a safe community",
      color: "text-[#48782E]",
      bg: "bg-green-100",
    },
    {
      icon: FileQuestion,
      title: "Frequently Asked Questions",
      subtitle: "Find answers to common questions",
      color: "text-[#48782E]",
      bg: "bg-green-100",
    },
    {
      icon: CircleAlert,
      title: "Report a Problem",
      subtitle: "Report posts or users",
      color: "text-red-500",
      bg: "bg-red-100",
    },
    {
      icon: Headphones,
      title: "Contact Support",
      subtitle: "Chat or submit a ticket",
      color: "text-[#48782E]",
      bg: "bg-green-100",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7F3] px-6 py-8 md:px-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-[40px] font-bold text-[#1B1B1B] mb-8">
          Help Center
        </h1>

        <HelpSearch />

        <div className="space-y-4">
          {helpItems.map((item, index) => (
            <HelpCard key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
