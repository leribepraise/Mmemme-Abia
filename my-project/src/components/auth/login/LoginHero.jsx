import React from "react";

const LoginHero = () => {
  return (
    <div className="relative h-[320px] md:h-full">
      <img
        src="/Mask group.png"
        alt="Mmemme Tower"
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 flex flex-col justify-between px-6 py-8 md:p-8">
        <div>
          <p className="text-[#2C931C] text-[12px] font-semibold uppercase tracking-wide mb-3">
            Welcome Back
          </p>

          <h1 className="text-2xl md:text-[36px] leading-tight md:leading-none font-bold text-[#111827]">
            Sign in to <br />
            Mmemme
            <span className="text-[#2C931C]"> Abia</span>
          </h1>

          <p className="mt-3 md:mt-5 text-[#4B5563] text-sm md:text-[16px] font-normal max-w-[220px] md:max-w-[260px] leading-5 md:leading-6">
            Access your account to discover, book and manage amazing events.
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 flex items-center gap-3 w-fit">
          <div className="flex -space-x-2">
            <img
              src="/User1.png"
              className="w-8 h-8 rounded-full border-2 border-white"
            />
            <img
              src="/User2.png"
              className="w-8 h-8 rounded-full border-2 border-white"
            />
            <img
              src="/User3.png"
              className="w-8 h-8 rounded-full border-2 border-white"
            />
          </div>

          <div>
            <p className="text-[10px] font-bold text-[#1B1B1B]">
              Trusted by 10k+
            </p>
            <p className="text-[10px] text-[#666666]">
              event lovers across Abia State.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginHero;
