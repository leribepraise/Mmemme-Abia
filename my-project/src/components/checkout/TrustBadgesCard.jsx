import React from "react";
import { Lock, CheckCircle, HeadphonesIcon } from "lucide-react";

const TrustBadgesCard = () => {
  const badges = [
    {
      icon: Lock,
      title: "Secured Checkout",
      description: "Your payment is protected by standard end-to-end encryption.",
    },
    {
      icon: CheckCircle,
      title: "Instant Confirmation",
      description: "You'll receive your ticket and digital receipt immediately.",
    },
    {
      icon: HeadphonesIcon,
      title: "24/7 Support",
      description: "Our customer service team is here to help you anytime.",
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
      <div className="space-y-6">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <React.Fragment key={badge.title}>
              <div className="flex items-start gap-4">
                {/* ICON BADGE CONTAINER */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#265F27]/10 text-[#265F27]">
                  <Icon className="h-5 w-5" />
                </div>

                {/* TEXT CONTENT */}
                <div>
                  <h4 className="text-base font-extrabold text-gray-900 md:text-lg">
                    {badge.title}
                  </h4>
                  <p className="mt-1 text-sm font-semibold text-gray-500 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>

              {/* SECTION DIVIDER */}
              {index < badges.length - 1 && (
                <div className="h-px w-full bg-gray-100" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default TrustBadgesCard;