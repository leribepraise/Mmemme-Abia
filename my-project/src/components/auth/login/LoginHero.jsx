import SiteImage from '@/components/SiteImage';
import React from "react";

const LoginHero = () => {
  return (
    <div className="relative h-48 sm:h-[320px] md:h-full">
      <SiteImage priority
        src="/Mask group.png"
        alt="Mmemme Tower"
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 flex flex-col justify-between px-5 py-5 sm:px-6 sm:py-8 md:p-8">
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

      </div>
    </div>
  );
};

export default LoginHero;
