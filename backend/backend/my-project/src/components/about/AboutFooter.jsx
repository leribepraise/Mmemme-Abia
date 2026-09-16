import React from "react";

const AboutFooter = () => {
  const account = [
    "My Tickets",
    "Saved Events",
    "Payment History",
    "Profile",
    "Settings",
  ];

  const organizer = [
    "Become an Organizer",
    "Organizer Dashboard",
    "Create Event",
    "Pricing",
    "Resources",
  ];

  const support = [
    "FAQs",
    "Contact Us",
    "Terms & Conditions",
    "Privacy Policy",
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-[#1F2937] mb-5">Account</h3>

          <div className="space-y-3">
            {account.map((item) => (
              <p
                key={item}
                className="text-sm text-[#6B7280] hover:text-[#48782E] cursor-pointer"
              >
                {item}
              </p>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-[#1F2937] mb-5">Organizer</h3>

          <div className="space-y-3">
            {organizer.map((item) => (
              <p
                key={item}
                className="text-sm text-[#6B7280] hover:text-[#48782E] cursor-pointer"
              >
                {item}
              </p>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-[#1F2937] mb-5">Support</h3>

          <div className="space-y-3">
            {support.map((item) => (
              <p
                key={item}
                className="text-sm text-[#6B7280] hover:text-[#48782E] cursor-pointer"
              >
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutFooter;
