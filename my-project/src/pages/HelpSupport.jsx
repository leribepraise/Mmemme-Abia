import React from "react";
import {
  IoSearchOutline,
  IoCardOutline,
  IoTicketOutline,
  IoBedOutline,
  IoPeopleOutline,
  IoMailOutline,
  IoCallOutline,
  IoChatbubbleOutline,
  IoHelpCircleOutline,
  IoWalletOutline,
  IoCloseCircleOutline,
  IoDocumentTextOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";

const topics = [
  {
    title: "Booking & Payments",
    description: "Learn about payments, refunds, and bookings.",
    icon: <IoCardOutline />,
  },
  {
    title: "Events & Tickets",
    description: "Questions about tickets, events and entry.",
    icon: <IoTicketOutline />,
  },
  {
    title: "Stay & Reservations",
    description: "Hotels, hostels and accommodation help.",
    icon: <IoBedOutline />,
  },
  {
    title: "Account & Settings",
    description: "Manage your account and preferences.",
    icon: <IoPeopleOutline />,
  },
];

const quickLinks = [
  {
    text: "How to book",
    icon: <IoHelpCircleOutline />,
  },
  {
    text: "Payment methods",
    icon: <IoWalletOutline />,
  },
  {
    text: "Cancellation policy",
    icon: <IoCloseCircleOutline />,
  },
  {
    text: "Refund policy",
    icon: <IoShieldCheckmarkOutline />,
  },
  {
    text: "Terms & Conditions",
    icon: <IoDocumentTextOutline />,
  },
];

const HelpSupport = () => {
  return (
    <div className="min-h-screen bg-[#f8faf9] px-6 py-7 text-gray-800">
      {/* HERO */}
      <section className="mx-auto max-w-2xl text-center">
        <h1 className="text-2xl font-bold md:text-[32px] text-[#191C1D]">
          How Can We Help You?
        </h1>

        <p className="mt-2 font-normal text-[16px] text-[#3D3E3E]">
          Find answers to common questions or reach out to our support team.
        </p>

        {/* SEARCH */}
        <div className="mx-auto mt-5 flex h-12 max-w-xl items-center rounded-md border border-[#C1C9BB] bg-white shadow-sm">
          <IoSearchOutline className="ml-3 text-[md] text-gray-500" />

          <input
            type="text"
            placeholder="Search for help..."
            className="h-full flex-1 bg-transparent px-2 text-[16px] outline-none placeholder:text-[#6B7280] placeholder:text-[16px] placeholder:font-normal"
          />

          <button className="mr-1 rounded-[8px] bg-[#3F783D] px-4 py-1.5 text-[16px] font-normal text-white hover:bg-[#356e39]">
            Search
          </button>
        </div>
      </section>

      {/* POPULAR TOPICS */}
      <section className="mx-auto mt-7 max-w-6xl">
        <h2 className="mb-3 text-[20px] font-semibold text-[#191C1D]">
          Popular Topics
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {topics.map((topic) => (
            <div
              key={topic.title}
              className="rounded-[16px] border border-[#E1E3E4] bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#baf3bc] text-lg text-[#3f7f43]">
                {topic.icon}
              </div>

              <h3 className="text-[14px] font-semibold">{topic.title}</h3>

              <p className="mt-1 text-[12px] font-medium leading-4 text-gray-500">
                {topic.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* LOWER SECTION */}
      <section className="mx-auto mt-7 grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-[285px_300px_1fr]">
        {/* CONTACT SUPPORT */}
        <div className="rounded-[16px] border border-[#E1E3E4] bg-white p-4 shadow-sm">
          <h2 className="text-[20px] font-semibold text-[#191C1D]">
            Still Need Help?
          </h2>

          <p className="mt-1 text-[12px] text-[#3D3E3E] font-medium">
            Our support team is here for you 24/7.
          </p>

          {/* EMAIL */}
          <div className="mt-4 rounded-lg bg-gray-100 p-3">
            <div className="flex items-center gap-2">
              <IoMailOutline className="text-sm text-[#3f7f43]" />

              <span className="text-[14px] font-semibold text-[#191C1D]">
                Email Us
              </span>
            </div>

            <p className="mt-1 pl-6 text-[12px] text-[#3D3E3E] font-medium">
              hello@mmemmeabia.com
            </p>
          </div>

          {/* CALL */}
          <div className="mt-2 rounded-lg bg-gray-100 p-3">
            <div className="flex items-center gap-2">
              <IoCallOutline className="text-sm text-[#3f7f43]" />

              <span className="text-[14px] font-semibold text-[#191C1D]">
                Call Us
              </span>
            </div>

            <p className="mt-1 pl-6 text-[12px] text-[#3D3E3E] font-medium">
              +234 813 245 6789
            </p>
          </div>

          {/* LIVE CHAT */}
          <button className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-md bg-[#3F783D] py-2 text-[16px] font-normal text-white transition hover:bg-[#356e39]">
            <IoChatbubbleOutline />
            Live Chat
          </button>
        </div>

        {/* QUICK LINKS */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-[20px] font-semibold">Quick Links</h2>

          <div className="mt-4 space-y-4">
            {quickLinks.map((link) => (
              <button
                key={link.text}
                className="flex items-center gap-2 text-left text-[14px] text-[#3D3E3E] font-semibold hover:text-[#3f7f43]"
              >
                <span className="text-sm text-gray-500">{link.icon}</span>

                <span>{link.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* SUPPORT IMAGE */}
        <div className="flex items-end justify-center rounded-xl bg-transparent p-3 md:justify-center">
          <img
            src="/help.jpg"
            alt="Customer support"
            className="h-36 w-auto object-contain"
          />
        </div>
      </section>
    </div>
  );
};

export default HelpSupport;
