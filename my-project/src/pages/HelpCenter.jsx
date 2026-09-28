import React, {useState} from "react";
import {
  ShieldCheck,
  FileQuestion,
  CircleAlert,
  Headphones,
} from "lucide-react";

import HelpSearch from "../components/help/HelpSearch";
import HelpCard from "../components/help/HelpCard";

const HelpCenter = () => {
  const [query,setQuery]=useState("");
  const faqs=[["Where are my tickets?","Open your profile and select My Tickets. Select View Ticket to open the booking and its QR codes."],["How do I enable notifications?","Open Notifications and select Enable on this device. Allow notifications when your browser asks."],["Can I install the app?","Open Install App using the footer link. On iPhone or iPad, use Safari: Share, then Add to Home Screen."],["How do I contact support?","Use Contact Support below to send the team your question and booking reference."]];
  const helpItems = [
    {
      icon: ShieldCheck,
      title: "Community Guidelines", to: "/terms",
      subtitle: "Rules for a safe community",
      color: "text-[#48782E]",
      bg: "bg-green-100",
    },
    {
      icon: FileQuestion,
      title: "Frequently Asked Questions", to: "/help#faq",
      subtitle: "Find answers to common questions",
      color: "text-[#48782E]",
      bg: "bg-green-100",
    },
    {
      icon: CircleAlert,
      title: "Report a Problem", to: "/contact",
      subtitle: "Report posts or users",
      color: "text-red-500",
      bg: "bg-red-100",
    },
    {
      icon: Headphones,
      title: "Contact Support", to: "/contact",
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

        <HelpSearch value={query} onChange={setQuery} />

        <div className="space-y-4">
          {helpItems.filter(item=>`${item.title} ${item.subtitle}`.toLowerCase().includes(query.toLowerCase())).map((item, index) => (
            <HelpCard key={index} item={item} />
          ))}
        </div>
        <section id="faq" className="mt-8 space-y-4"><h2 className="text-xl font-bold">Frequently Asked Questions</h2>{faqs.filter(row=>row.join(" ").toLowerCase().includes(query.toLowerCase())).map(([question,answer])=><details key={question} className="rounded-xl bg-white p-5"><summary className="cursor-pointer font-semibold">{question}</summary><p className="mt-3 text-sm">{answer}</p></details>)}</section>
      </div>
    </div>
  );
};

export default HelpCenter;
