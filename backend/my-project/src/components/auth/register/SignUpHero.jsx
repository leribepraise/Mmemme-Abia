import React from "react";

const SignUpHero = () => {
  return (
    <div className="relative">
      <img
        src="/register1.png"
        alt="Mmemme Abia Community"
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/35"></div>

      <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
        <h2 className="text-[30px] font-bold leading-tight mb-8">
          Join thousands of people discovering and celebrating events in Abia.
        </h2>

        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-[#48782E] flex items-center justify-center text-[16px]">
              ✓
            </div>
            <span>Find amazing events</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-[#48782E] flex items-center justify-center text-[16px]">
              ✓
            </div>
            <span>Book securely</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-[#48782E] flex items-center justify-center text-[16px]">
              ✓
            </div>
            <span>Get your tickets instantly</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-[#48782E] flex items-center justify-center text-[16px]">
              ✓
            </div>
            <span>Never miss an update</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpHero;
