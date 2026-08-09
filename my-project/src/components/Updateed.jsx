import React from "react";

const Updateed = () => {
  return (
    <>
      <section className="my-10">
        <div className="w-full h-30 rounded-[15px] bg-[#093517] flex justify-between items-center p-5 gap-8">
          <div className="max-w-xl">
            <p className="font-bold text-[30px] text-[#FFFFFF]">Stay Updated with Amazing Events</p>
            <p className="font-normal text-[18px] text-[#ffffff]">
              Subscribe to our newsletter and get the latest events, exclusive
              offers, and updates straight to your inbox.
            </p>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              name=""
              id=""
              className="w-60 h-10 bg-[#FFFFFF] rounded-[7px] pl-3"
              placeholder="Enter your email address"
            />
            <button
              type="submit"
              className="bg-[#F56608] rounded-[7px] py-[7px] px-[12px] text-[#FEFEFE] text-[14px]"
            >
              Subscribe
            </button>
          </div>
          <div>
            <img src="/image4.png" alt="" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Updateed;
