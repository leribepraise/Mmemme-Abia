import React from "react";
import { Compass, CalendarDays, Users, Sparkles, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Welcome = ({ userData }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F7F9F7] px-4 py-5 sm:px-6">
      {/* MAIN CARD */}
      <div className="mx-auto w-full max-w-[720px] rounded-2xl bg-white px-5 py-6 shadow-sm sm:px-8 sm:py-7">
        {/* TOP IMAGE */}
        <div className="mx-auto h-[105px] w-full max-w-[360px] overflow-hidden">
          <img
            src="/welcome-top.png"
            alt="Welcome to Mmemme Abia"
            className="h-full w-full object-contain"
          />
        </div>

        {/* WELCOME TEXT */}
        <div className="mx-auto mt-1 max-w-[500px] text-center">
          <h1 className="text-[18px] font-bold leading-tight text-[#172033] sm:text-xl">
            Welcome to <span className="text-[#3F783D]">Mmemme Abia!</span>
          </h1>

          <p className="mx-auto mt-1 max-w-[420px] text-[8px] leading-3 text-gray-500 sm:text-[9px]">
            You're all set to explore the best of Abia State. Discover amazing
            places, book experiences, attend exciting events and create
            unforgettable memories.
          </p>
        </div>

        {/* FEATURES */}
        <div className="mx-auto mt-6 grid max-w-[540px] grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-3">
          {/* DISCOVER */}
          <div className="text-center">
            <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-md bg-[#EAF4EB]">
              <Compass size={13} className="text-[#3F783D]" />
            </div>

            <h3 className="mt-2 text-[8px] font-bold text-[#172033]">
              Discover
            </h3>

            <p className="mx-auto mt-1 max-w-[95px] text-[6px] leading-3 text-gray-400">
              Explore top locations, hidden gems and beautiful destinations.
            </p>
          </div>

          {/* EXPERIENCE */}
          <div className="text-center">
            <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-md bg-[#FFF0E6]">
              <CalendarDays size={13} className="text-[#F36B0A]" />
            </div>

            <h3 className="mt-2 text-[8px] font-bold text-[#172033]">
              Experience
            </h3>

            <p className="mx-auto mt-1 max-w-[95px] text-[6px] leading-3 text-gray-400">
              Book experiences, attend events and create lasting memories.
            </p>
          </div>

          {/* CONNECT */}
          <div className="text-center">
            <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-md bg-[#EAF4EB]">
              <Users size={13} className="text-[#3F783D]" />
            </div>

            <h3 className="mt-2 text-[8px] font-bold text-[#172033]">
              Connect
            </h3>

            <p className="mx-auto mt-1 max-w-[95px] text-[6px] leading-3 text-gray-400">
              Join a community of explorers and locals.
            </p>
          </div>

          {/* ENJOY MORE */}
          <div className="text-center">
            <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-md bg-[#F4ECFB]">
              <Sparkles size={13} className="text-[#8B5CF6]" />
            </div>

            <h3 className="mt-2 text-[8px] font-bold text-[#172033]">
              Enjoy More
            </h3>

            <p className="mx-auto mt-1 max-w-[95px] text-[6px] leading-3 text-gray-400">
              Unlock exclusive benefits and personalized recommendations.
            </p>
          </div>
        </div>

        {/* GIFT BOX */}
        <div className="mx-auto mt-6 max-w-[540px] rounded-xl border border-[#E2EEE3] bg-[#F1F8F2] px-4 py-3">
          <div className="flex items-center justify-center gap-1.5">
            <Gift size={10} className="text-[#3F783D]" />

            <p className="text-[7px] text-gray-600">
              As a welcome gift, enjoy{" "}
              <span className="font-bold text-[#3F783D]">10% off</span> your
              first booking!
            </p>
          </div>

          {/* PROMO CODE */}
          <div className="mx-auto mt-2 flex h-5 max-w-[120px] items-center justify-center rounded-md bg-white">
            <span className="text-[7px] font-bold tracking-wide text-gray-600">
              WELCOME10
            </span>
          </div>
        </div>

        {/* CLAIM GIFT */}
        <button
          type="button"
          className="mx-auto mt-4 flex h-8 w-full max-w-[540px] cursor-pointer items-center justify-center rounded-lg bg-[#F36B0A] text-[8px] font-semibold text-white transition hover:bg-[#DF5F06] active:scale-[0.99]"
        >
          Claim Gift
        </button>

        {/* DASHBOARD */}
        {/* <button
          type="button"
          onClick={() => navigate("/login")}
          className="mx-auto mt-3 block cursor-pointer text-[7px] font-medium text-gray-500 transition hover:text-[#3F783D]"
        >
          Go to Dashboard
        </button> */}
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
          className="mx-auto mt-3 block cursor-pointer text-[7px] font-medium text-gray-500 transition hover:text-[#3F783D]"
        >
          Go to Dashboard
        </button>
      </div>

      {/* BOTTOM DECORATIVE IMAGE */}
      <div className="mx-auto h-24 w-full max-w-[1100px] overflow-hidden">
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
