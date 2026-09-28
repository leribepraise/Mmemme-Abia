import React from "react";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <section
        className="
          h-auto
          mx-0
          w-auto
          bg-[#3F783D]
          p-6 md:p-10
          mt-10
        "
      >
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-6
            gap-8
            lg:gap-x-12
            mb-5
          "
        >
          {/* LOGO */}
          <div>
            <img src="/logo.png" alt="" className="w-auto h-10" />

            <p className="font-normal text-[#FFFFFF] pt-5 lg:pt-10">
              Mmemme Abia is your go-to platform for discovering, booking and
              enjoying the best events across Abia State.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <p className="font-bold text-[16px] text-white">Quick Links</p>
            <NavLink to="/events">
              <p className="font-normal text-[#FFFFFF]">Explore Events</p>
            </NavLink>
            <Link to="/search?category=Events" className="block font-normal text-white">Categories</Link>
            <Link to="/search?category=Events" className="block font-normal text-white">Venues</Link>
            <Link to="/events" className="block font-normal text-white">Calendar</Link>
            <NavLink to="/blog">
              <p className="font-normal text-[#FFFFFF]">Blog</p>
            </NavLink>
            <NavLink to="/contact">
              <p className="font-normal text-[#FFFFFF]">Contact Us</p>
            </NavLink>
          </div>

          {/* ACCOUNT */}
          <div>
            <p className="font-bold text-[16px] text-white">Account</p>
            <NavLink to="/profile?section=My%20Tickets">
              <p className="font-normal text-[#FFFFFF]">My Tickets</p>
            </NavLink>
            <NavLink to="/profile?section=Saved%20Items">
              <p className="font-normal text-[#FFFFFF]">Saved Events</p>
            </NavLink>
            <NavLink to="/profile">
              <p className="font-normal text-[#FFFFFF]">Profile</p>
            </NavLink>
            <NavLink to="/profile?section=Settings">
              <p className="font-normal text-[#FFFFFF]">Settings</p>
            </NavLink>
            <NavLink to="/help">
              <p className="font-normal text-[#FFFFFF]">Help Center</p>
            </NavLink>
            <NavLink to="/login">
              <p className="font-normal text-[#FFFFFF]">Log in/ Sign up</p>
            </NavLink>
          </div>

          {/* ORGANIZER */}
          <div>
            <p className="font-bold text-[16px] text-white">Organizer</p>
            <Link
              to="/organizer/apply"
              className="font-normal text-[#FFFFFF] block hover:underline"
            >
              Become an Organizer
            </Link>
            <Link
              to="/organizer/dashboard"
              className="font-normal text-[#FFFFFF] block hover:underline"
            >
              Organizer Dashboard
            </Link>
            <Link
              to="/organizer/events/new"
              className="font-normal text-[#FFFFFF] block hover:underline"
            >
              Create Event
            </Link>
            <Link to="/terms#terms-2" className="block font-normal text-white">Pricing</Link>
            <Link to="/help" className="block font-normal text-white">Resources</Link>
          </div>

          {/* SUPPORT */}
          <div>
            <p className="font-bold text-[16px] text-white">Support</p>
            <NavLink to="/help" className="block font-normal text-[#FFFFFF]">FAQs</NavLink>
            <NavLink to="/contact" className="block font-normal text-[#FFFFFF]">Contact Support</NavLink>
            <NavLink to="/terms" className="font-normal text-[#FFFFFF]">Terms & Conditions</NavLink>
            <p className="font-normal text-[#FFFFFF]">Privacy Policy</p>
          </div>

          {/* DOWNLOAD APP */}
          <div>
            <p className="font-bold text-[16px] text-white">Download App</p>

            <p className="font-normal text-[#FFFFFF] pb-5">
              Get the Mmemme Abia app for better experience.
            </p>

            <div className="flex flex-col gap-y-3 pb-5">
              <Link to="/install" className="rounded-lg border border-white/70 px-4 py-3 text-center font-semibold text-white">Install Mmemme Abia</Link>
            </div>
          </div>
        </div>

        {/* RESPONSIVE CHANGE: w-285 → w-full */}
        <hr className="w-full mx-1 text-[#FFFFFF]" />

        <div>
          <p className="text-[#ffffff] font-normal text-[16px]">
            &copy; 2026 Mmemme Abia. All rights reserved.
          </p>
        </div>
      </section>
    </>
  );
};

export default Footer;
