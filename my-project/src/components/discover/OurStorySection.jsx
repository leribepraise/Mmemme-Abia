import React from "react";
import { Search, Lightbulb } from "lucide-react";
import FeatureCard from "./FeatureCard";

const OurStorySection = () => {
  return (
    <section className="space-y-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div>
          <p className="text-[#F97316] text-xs font-bold uppercase mb-2">
            Our Story
          </p>

          <h2 className="text-3xl font-bold leading-tight text-[#1F2937]">
            Built to Help Abia
            <br />
            Be Discovered.
          </h2>
        </div>

        <p className="text-[#6B7280] leading-7 border-l border-gray-200 pl-6">
          Abia is filled with places to explore, events to attend, cultures to
          experience and businesses to connect with. Yet discovering these
          experiences can often mean searching across different platforms,
          social media pages and word-of-mouth recommendations.
        </p>

        <p className="text-[#6B7280] leading-7 border-l border-gray-200 pl-6">
          Mmemme Abia was created to bring these journeys together into one
          trusted, easy-to-use platform that showcases the very best of our
          state.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <FeatureCard
          bg="bg-[#FFF6EF]"
          title="Discovering Abia Shouldn't Be Hard."
          subtitle="The Problem We Are Solving"
          icon={Search}
          iconColor="text-[#F97316]"
          iconBorder="border-[#F97316]"
          items={[
            "Scattered information",
            "Difficult event discovery",
            "Limited visibility for local businesses",
            "Hard to find trusted services",
            "Lack of a central community hub",
          ]}
        />

        <FeatureCard
          bg="bg-[#F1F8F1]"
          title="One Platform. Everything Abia."
          subtitle="Our Solution"
          icon={Lightbulb}
          iconColor="text-[#48782E]"
          iconBorder="border-[#48782E]"
          items={[
            "All experiences in one place",
            "Easy discovery & booking",
            "More visibility for local businesses",
            "Trusted services and providers",
            "A stronger, connected Abia community",
          ]}
        />
      </div>
    </section>
  );
};

export default OurStorySection;
