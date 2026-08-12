// import React from "react";

// const Footer = () => {
//   return (
//     <>
//       <section className="h-80 mx-0 w-auto bg-[#3F783D] p-10 mt-10">
//         <div className="grid grid-cols-6 gap-x-12 mb-5">
//           <div>
//             <img src="/logo.png" alt="" className="w-auto h-10" />
//             <p className="font-normal text-[#FFFFFF] pt-10">
//               Mmemme Abia is your go-to platform for discovering, booking and
//               enjoying the best events across Abia State.
//             </p>
//           </div>
//           <div className="">
//             <p className="font-bold text-[16px] text-white">Quick Links</p>
//             <p className="font-normal text-[#FFFFFF]">Explore Events</p>
//             <p className="font-normal text-[#FFFFFF]">Categories</p>
//             <p className="font-normal text-[#FFFFFF]">Venues</p>
//             <p className="font-normal text-[#FFFFFF]">Calendar</p>
//             <p className="font-normal text-[#FFFFFF]">Blog</p>
//             <p className="font-normal text-[#FFFFFF]">Contact Us</p>
//           </div>
//           <div>
//             <p className="font-bold text-[16px] text-white">Account</p>
//             <p className="font-normal text-[#FFFFFF]">My Tickets</p>
//             <p className="font-normal text-[#FFFFFF]">Saved Events</p>
//             <p className="font-normal text-[#FFFFFF]">Profile</p>
//             <p className="font-normal text-[#FFFFFF]">Settings</p>
//             <p className="font-normal text-[#FFFFFF]">Help Center</p>
//             <p className="font-normal text-[#FFFFFF]">Log in/ Sign UP</p>
//           </div>
//           <div>
//             <p className="font-bold text-[16px] text-white">Organizer</p>
//             <p className="font-normal text-[#FFFFFF]">Become an Organizer</p>
//             <p className="font-normal text-[#FFFFFF]">Organizer Dashboard</p>
//             <p className="font-normal text-[#FFFFFF]">Create Event</p>
//             <p className="font-normal text-[#FFFFFF]">Pricing</p>
//             <p className="font-normal text-[#FFFFFF]">Resources</p>
//           </div>
//           <div>
//             <p className="font-bold text-[16px] text-white">Support</p>
//             <p className="font-normal text-[#FFFFFF]">FAQs</p>
//             <p className="font-normal text-[#FFFFFF]">Contact Support</p>
//             <p className="font-normal text-[#FFFFFF]">Terms & Conditions</p>
//             <p className="font-normal text-[#FFFFFF]">Privacy Policy</p>
//           </div>
//           <div>
//             <p className="font-bold text-[16px] text-white">Download App</p>
//             <p className="font-normal text-[#FFFFFF] pb-5">
//               Get the Mmemme Abia app for better experience.
//             </p>
//             <div className="flex flex-col gap-y-3 pb-5">
//               <img src="/goolge.png" />
//               <img src="/apple.png" />
//             </div>
//           </div>
//         </div>
//         <hr className="w-285 mx-1 text-[#FFFFFF]" />
//         <div>
//           <p className="text-[#ffffff] font-normal text-[16px]">
//             &copy; 2026 Mmemme Abia. All rights reserved.
//           </p>
//         </div>
//       </section>
//     </>
//   );
// };

// export default Footer;

import React from "react";

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
            <p className="font-normal text-[#FFFFFF]">Explore Events</p>
            <p className="font-normal text-[#FFFFFF]">Categories</p>
            <p className="font-normal text-[#FFFFFF]">Venues</p>
            <p className="font-normal text-[#FFFFFF]">Calendar</p>
            <p className="font-normal text-[#FFFFFF]">Blog</p>
            <p className="font-normal text-[#FFFFFF]">Contact Us</p>
          </div>

          {/* ACCOUNT */}
          <div>
            <p className="font-bold text-[16px] text-white">Account</p>
            <p className="font-normal text-[#FFFFFF]">My Tickets</p>
            <p className="font-normal text-[#FFFFFF]">Saved Events</p>
            <p className="font-normal text-[#FFFFFF]">Profile</p>
            <p className="font-normal text-[#FFFFFF]">Settings</p>
            <p className="font-normal text-[#FFFFFF]">Help Center</p>
            <p className="font-normal text-[#FFFFFF]">Log in/ Sign UP</p>
          </div>

          {/* ORGANIZER */}
          <div>
            <p className="font-bold text-[16px] text-white">Organizer</p>
            <p className="font-normal text-[#FFFFFF]">Become an Organizer</p>
            <p className="font-normal text-[#FFFFFF]">Organizer Dashboard</p>
            <p className="font-normal text-[#FFFFFF]">Create Event</p>
            <p className="font-normal text-[#FFFFFF]">Pricing</p>
            <p className="font-normal text-[#FFFFFF]">Resources</p>
          </div>

          {/* SUPPORT */}
          <div>
            <p className="font-bold text-[16px] text-white">Support</p>
            <p className="font-normal text-[#FFFFFF]">FAQs</p>
            <p className="font-normal text-[#FFFFFF]">Contact Support</p>
            <p className="font-normal text-[#FFFFFF]">Terms & Conditions</p>
            <p className="font-normal text-[#FFFFFF]">Privacy Policy</p>
          </div>

          {/* DOWNLOAD APP */}
          <div>
            <p className="font-bold text-[16px] text-white">Download App</p>

            <p className="font-normal text-[#FFFFFF] pb-5">
              Get the Mmemme Abia app for better experience.
            </p>

            <div className="flex flex-col gap-y-3 pb-5">
              <img src="/goolge.png" />
              <img src="/apple.png" />
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
