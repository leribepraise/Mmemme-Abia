import React from "react";
import { Compass, CalendarDays, Users, Sparkles, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Welcome = ({ userData }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F7F9F7] px-4 py-5 sm:px-6">
      {/* MAIN CARD */}
      <div className="mx-auto w-full max-w-[720px] rounded-2xl bg-white px-5 py-6 shadow-sm sm:px-8 sm:py-7">
        {/* TOP IMAGE */}
        <div className="mx-auto h-[230px] w-full max-w-[360px] overflow-hidden">
          <img
            src="/design/welcome.png"
            alt="Welcome to Mmemme Abia"
            className="h-full w-full object-contain"
          />
        </div>

        {/* WELCOME TEXT */}
        <div className="mx-auto mt-1 max-w-[500px] text-center">
          <h1 className="text-[18px] font-bold leading-tight text-[#172033] sm:text-xl">
            Welcome to <span className="text-[#3F783D]">Mmemme Abia!</span>
          </h1>

          <p className="mx-auto mt-1 max-w-[420px] text-sm leading-5 text-gray-500 sm:text-sm">
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

            <h3 className="mt-2 text-sm font-bold text-[#172033]">
              Discover
            </h3>

            <p className="mx-auto mt-1 max-w-[95px] text-xs leading-5 text-gray-400">
              Explore top locations, hidden gems and beautiful destinations.
            </p>
          </div>

          {/* EXPERIENCE */}
          <div className="text-center">
            <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-md bg-[#FFF0E6]">
              <CalendarDays size={13} className="text-[#F36B0A]" />
            </div>

            <h3 className="mt-2 text-sm font-bold text-[#172033]">
              Experience
            </h3>

            <p className="mx-auto mt-1 max-w-[95px] text-xs leading-5 text-gray-400">
              Book experiences, attend events and create lasting memories.
            </p>
          </div>

          {/* CONNECT */}
          <div className="text-center">
            <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-md bg-[#EAF4EB]">
              <Users size={13} className="text-[#3F783D]" />
            </div>

            <h3 className="mt-2 text-sm font-bold text-[#172033]">
              Connect
            </h3>

            <p className="mx-auto mt-1 max-w-[95px] text-xs leading-5 text-gray-400">
              Join a community of explorers and locals.
            </p>
          </div>

          {/* ENJOY MORE */}
          <div className="text-center">
            <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-md bg-[#F4ECFB]">
              <Sparkles size={13} className="text-[#8B5CF6]" />
            </div>

            <h3 className="mt-2 text-sm font-bold text-[#172033]">
              Enjoy More
            </h3>

            <p className="mx-auto mt-1 max-w-[95px] text-xs leading-5 text-gray-400">
              Unlock exclusive benefits and personalized recommendations.
            </p>
          </div>
        </div>

        <button type="button" onClick={() => navigate('/dashboard')} className="mx-auto mt-8 block w-full max-w-lg rounded-lg bg-[#f36b0a] py-3 text-sm font-semibold text-white">Go to Dashboard →</button>
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
