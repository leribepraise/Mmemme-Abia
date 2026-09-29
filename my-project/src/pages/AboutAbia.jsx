import React from "react";
import {
  Landmark,
  Users,
  CircleDollarSign,
  House,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const AboutAbia = () => {
  const features = [
    {
      icon: Landmark,
      title: "Rich Culture",
      description: "Deep traditions and vibrant heritage",
    },
    {
      icon: Users,
      title: "Great People",
      description: "Warm, hospitable and hardworking",
    },
    {
      icon: CircleDollarSign,
      title: "Strong Economy",
      description: "Home to industries and innovations",
    },
    {
      icon: House,
      title: "Beautiful Places",
      description: "Scenic spots and tourist attractions",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <section className="mx-auto mt-4 max-w-[1400px] px-4 sm:px-6 lg:px-12">
        <div className="relative h-[230px] overflow-hidden rounded-2xl sm:h-[300px]">
          <img
            src="/abia-hero.jpg"
            alt="Aerial view of Abia State"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/35" />

          {/* Hero text */}
          <div className="absolute left-8 top-1/2 max-w-[430px] -translate-y-1/2 text-white sm:left-12">
            <h1 className="text-3xl font-bold leading-[1.05] sm:text-4xl">
              Proudly Abia.
              <br />
              Uniquely Amazing.
            </h1>

            <p className="mt-3 max-w-[360px] text-xs leading-5 text-white/90 sm:text-sm">
              Discover the culture, people and experiences that make Abia State
              truly exceptional.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-12 lg:py-10">
        <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-16">
          {/* Text */}
          <div>
            <h2 className="text-xl font-bold text-gray-900">Our Story</h2>

            <p className="mt-4 max-w-[500px] text-xs leading-6 text-gray-500 sm:text-sm">
              Abia State is a land of rich heritage, industrious people,
              thriving businesses, vibrant culture and breathtaking
              destinations. From our world-famous craftsman hub in Aba to our
              peaceful communities and delicious cuisine, Abia has so much to
              offer.
            </p>

            <Link
              to="/tourism"
              className="mt-5 inline-flex items-center rounded-md border border-[#3F783D] px-4 py-2 text-[11px] font-medium text-[#3F783D] transition hover:bg-[#3F783D] hover:text-white"
            >
              Explore Abia
            </Link>
          </div>

          {/* Image */}
          <div className="overflow-hidden rounded-2xl">
            <img
              src="/abia-story.jpg"
              alt="Beautiful location in Abia State"
              className="h-[220px] w-full object-cover sm:h-[270px]"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-gray-100">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 md:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className={`flex flex-col items-center px-5 py-7 text-center ${
                  index !== 0 ? "border-l border-gray-100" : ""
                }`}
              >
                <div className="mb-3 text-[#3F783D]">
                  <Icon size={17} strokeWidth={1.8} />
                </div>

                <h3 className="text-[11px] font-semibold text-gray-800">
                  {feature.title}
                </h3>

                <p className="mt-1 max-w-[150px] text-[9px] leading-4 text-gray-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* <footer className="bg-[#fafafa]">
        <div className="mx-auto grid max-w-[1400px] gap-8 px-8 py-8 sm:grid-cols-3 sm:px-12">
          
          <div>
            <h3 className="text-[11px] font-semibold text-gray-900">Account</h3>

            <div className="mt-3 space-y-2">
              <FooterLink to="/profile/tickets">My Tickets</FooterLink>

              <FooterLink to="/profile/saved">Saved Events</FooterLink>

              <FooterLink to="/profile/payment-history">
                Payment History
              </FooterLink>

              <FooterLink to="/profile">Profile</FooterLink>

              <FooterLink to="/profile/settings">Settings</FooterLink>
            </div>
          </div>

         
          <div>
            <h3 className="text-[11px] font-semibold text-gray-900">
              Organizer
            </h3>

            <div className="mt-3 space-y-2">
              <FooterLink to="/become-organizer">
                Become an Organizer
              </FooterLink>

              <FooterLink to="/organizer/dashboard">
                Organizer Dashboard
              </FooterLink>

              <FooterLink to="/organizer/create-event">Create Event</FooterLink>

              <FooterLink to="/pricing">Pricing</FooterLink>

              <FooterLink to="/resources">Resources</FooterLink>
            </div>
          </div>

           
          <div>
            <h3 className="text-[11px] font-semibold text-gray-900">Support</h3>

            <div className="mt-3 space-y-2">
              <FooterLink to="/faqs">FAQs</FooterLink>

              <FooterLink to="/contact">Contact Us</FooterLink>

              <FooterLink to="/terms">Terms & Conditions</FooterLink>

              <FooterLink to="/privacy">Privacy Policy</FooterLink>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

const FooterLink = ({ to, children }) => {
  return (
    <Link
      to={to}
      className="block text-[9px] text-gray-400 transition hover:text-[#3F783D]"
    >
      {children}
    </Link>
  );
};

export default AboutAbia;
