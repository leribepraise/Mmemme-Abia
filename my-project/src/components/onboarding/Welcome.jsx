import React from "react";
import { Compass, CalendarDays, Users, Sparkles, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Welcome = ({ userData }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-10">
      {/* MAIN CARD */}
      <div className="rounded-3xl bg-white px-8 py-10 shadow-sm border border-gray-100">
        {/* TOP IMAGE */}
        <div className="mx-auto h-32 w-full max-w-[280px] overflow-hidden">
          <img
            src="/welcome-top.png"
            alt="Welcome to Mmemme Abia"
            className="h-full w-full object-contain"
          />
        </div>

        {/* WELCOME TEXT */}
        <div className="mx-auto mt-4 max-w-lg text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight text-[#172033]">
            Welcome to <span className="text-[#3F783D]">Mmemme Abia!</span>
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 leading-relaxed">
            You're all set to explore the best of Abia State. Discover amazing
            places, book experiences, attend exciting events, and create
            unforgettable memories.
          </p>
        </div>

        {/* FEATURES */}
        <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
          {/* DISCOVER */}
          <div className="rounded-2xl bg-gray-50 p-4 text-center border border-gray-100">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4EB]">
              <Compass size={20} className="text-[#3F783D]" />
            </div>
            <h3 className="mt-3 text-xs font-bold text-[#172033]">
              Discover
            </h3>
            <p className="mx-auto mt-1 text-xs text-gray-500 leading-relaxed">
              Explore top locations, hidden gems and beautiful destinations.
            </p>
          </div>

          {/* EXPERIENCE */}
          <div className="rounded-2xl bg-gray-50 p-4 text-center border border-gray-100">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0E6]">
              <CalendarDays size={20} className="text-[#F36B0A]" />
            </div>
            <h3 className="mt-3 text-xs font-bold text-[#172033]">
              Experience
            </h3>
            <p className="mx-auto mt-1 text-xs text-gray-500 leading-relaxed">
              Book experiences, attend events and create lasting memories.
            </p>
          </div>

          {/* CONNECT */}
          <div className="rounded-2xl bg-gray-50 p-4 text-center border border-gray-100">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4EB]">
              <Users size={20} className="text-[#3F783D]" />
            </div>
            <h3 className="mt-3 text-xs font-bold text-[#172033]">
              Connect
            </h3>
            <p className="mx-auto mt-1 text-xs text-gray-500 leading-relaxed">
              Join a community of explorers and locals.
            </p>
          </div>

          {/* ENJOY MORE */}
          <div className="rounded-2xl bg-gray-50 p-4 text-center border border-gray-100">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4ECFB]">
              <Sparkles size={20} className="text-[#8B5CF6]" />
            </div>
            <h3 className="mt-3 text-xs font-bold text-[#172033]">
              Enjoy More
            </h3>
            <p className="mx-auto mt-1 text-xs text-gray-500 leading-relaxed">
              Unlock exclusive benefits and personalized recommendations.
            </p>
          </div>
        </div>

        {/* GIFT BOX */}
        <div className="mx-auto mt-8 max-w-lg rounded-2xl border border-[#E2EEE3] bg-[#F1F8F2] px-5 py-4 text-center shadow-sm">
          <div className="flex items-center justify-center gap-2">
            <Gift size={16} className="text-[#3F783D]" />
            <p className="text-xs text-gray-700 font-medium">
              As a welcome gift, enjoy{" "}
              <span className="font-bold text-[#3F783D]">10% off</span> your
              first booking!
            </p>
          </div>

          {/* PROMO CODE */}
          <div className="mx-auto mt-3 flex h-9 max-w-[140px] items-center justify-center rounded-xl bg-white shadow-sm border border-emerald-100">
            <span className="text-xs font-black tracking-wider text-[#3F783D]">
              WELCOME10
            </span>
          </div>
        </div>

        {/* CLAIM GIFT */}
        <button
          type="button"
          onClick={() => {
            // Optional: handle claim gift action if needed
          }}
          className="mx-auto mt-6 flex h-12 w-full max-w-lg cursor-pointer items-center justify-center rounded-xl bg-[#F36B0A] text-sm font-bold text-white transition hover:bg-[#DF5F06] active:scale-[0.99] shadow-sm"
        >
          Claim Gift
        </button>

        {/* DASHBOARD LINK */}
        <button
          type="button"
          onClick={() => {
            const savedData = JSON.parse(sessionStorage.getItem("signupData"));

            if (!savedData) {
              console.log("No signup data found");
              navigate("/signup");
              return;
            }

            sessionStorage.setItem("user", JSON.stringify(savedData));
            navigate("/login");
          }}
          className="mx-auto mt-4 block cursor-pointer text-xs font-bold text-gray-500 transition hover:text-[#3F783D]"
        >
          Go to Dashboard &rarr;
        </button>
      </div>

      {/* BOTTOM DECORATIVE IMAGE */}
      <div className="mt-8 h-32 w-full overflow-hidden rounded-2xl shadow-sm">
        <img
          src="/onboarding-bottom.png"
          alt=""
          className="h-full w-full object-cover object-top"
        />
      </div>
    </div>
  );
};

export default Welcome;