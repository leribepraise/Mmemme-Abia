import React from "react";

const NotFoundIllustration = () => {
  return (
    <div className="relative w-full max-w-3xl h-[280px] md:h-[330px] flex items-center justify-center">
      {/* Left Background Illustration */}
      <div className="absolute left-0 md:left-8 top-30 opacity-70">
        <img src="/404-location.png" alt="" className="w-28 md:w-36" />
      </div>

      {/* Right Background Illustration */}
      <div className="absolute right-0 md:right-8 top-16 opacity-70">
        <img src="/404-landmark.png" alt="" className="w-28 md:w-36" />
      </div>

      {/* 404 */}
      <div className="relative flex items-center justify-center">
        <h1 className="text-[130px] md:text-[180px] font-extrabold leading-none text-[#2F713E] tracking-tight">
          4
        </h1>

        {/* Orange Zero */}
        <div className="relative">
          <h1 className="text-[130px] md:text-[180px] font-extrabold leading-none text-[#FF5A00] tracking-tight">
            0
          </h1>

          {/* Girl */}
          <img
            src="/404-girl.png"
            alt="Lost traveler"
            className="absolute left-1/2 -translate-x-1/2 bottom-[-5px] w-36 md:w-48"
          />
        </div>

        <h1 className="text-[130px] md:text-[180px] font-extrabold leading-none text-[#2F713E] tracking-tight">
          4
        </h1>
      </div>
    </div>
  );
};

export default NotFoundIllustration;
