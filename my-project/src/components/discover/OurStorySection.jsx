import React from "react";
import { Search, Lightbulb } from "lucide-react";
import FeatureCard from "./FeatureCard";

const OurStorySection = () => {
  return (
    <section className="space-y-10 md:space-y-12">
      {/* SECTION HEADER GRID */}
      <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
        {/* HEADING COLUMN */}
        <div>
          <p className="mb-2 text-xs font-black tracking-wider uppercase text-[#F97316]">
            Our Story
          </p>

          <h2 className="text-3xl font-black tracking-tight text-gray-900 md:text-4xl lg:text-5xl lg:leading-tight">
            Built to Help Abia <br className="hidden sm:block" />
            Be Discovered.
          </h2>
        </div>

        {/* PARAGRAPH 1 */}
        <div className="border-l-2 border-[#265F27]/20 pl-6">
          <p className="text-base font-medium leading-relaxed text-gray-600 md:text-lg">
            Abia is filled with places to explore, events to attend, cultures to
            experience, and businesses to connect with. Yet discovering these
            experiences often means searching across scattered platforms,
            social media pages, and word-of-mouth recommendations.
          </p>
        </div>

        {/* PARAGRAPH 2 */}
        <div className="border-l-2 border-[#265F27]/20 pl-6">
          <p className="text-base font-medium leading-relaxed text-gray-600 md:text-lg">
            Mmemme Abia was created to bring these journeys together into one
            trusted, easy-to-use platform that showcases the very best of our
            state and connects our vibrant community.
          </p>
        </div>
      </div>

      {/* PROBLEM & SOLUTION FEATURE CARDS */}
      <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
        <FeatureCard
          bg="bg-orange-50/60 border border-orange-100/80 shadow-sm"
          title="Discovering Abia Shouldn't Be Hard."
          subtitle="The Problem We Are Solving"
          icon={Search}
          iconColor="text-[#F97316]"
          iconBorder="border-[#F97316]/30 bg-[#F97316]/10"
          items={[
            "Scattered and unverified information",
            "Difficult event discovery and ticket acquisition",
            "Limited visibility for local businesses and services",
            "Hard to locate trusted, reliable service providers",
            "Lack of a central digital community hub",
          ]}
        />

        <FeatureCard
          bg="bg-green-50/60 border border-green-100/80 shadow-sm"
          title="One Platform. Everything Abia."
          subtitle="Our Solution"
          icon={Lightbulb}
          iconColor="text-[#265F27]"
          iconBorder="border-[#265F27]/30 bg-[#265F27]/10"
          items={[
            "All Abia experiences consolidated in one place",
            "Seamless event discovery, ticketing, and booking",
            "Enhanced digital presence and visibility for local vendors",
            "Verified reviews for trusted local services",
            "A stronger, digitally connected Abia community",
          ]}
        />
      </div>
    </section>
  );
};

export default OurStorySection;