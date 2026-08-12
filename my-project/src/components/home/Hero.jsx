// import React from "react";
// import { IoArrowBack, IoArrowForward, IoPlay } from "react-icons/io5";

// const Hero = () => {
//   return (
//     <>
//       <section className="mx-8 pt-10 flex flex-col md:flex-row justify-center">
//         <div className="max-w-1/2 space-y-3 z-10">
//           <h1 className="font-semibold text-[48px] leading-tight">
//             Discover. Experience. Celebrate
//             <span className="text-[#3f783d]"> Abia</span>
//             <span className="text-[#F46F1A]">.</span>
//           </h1>
//           <p className="font-normal text-[18px] leading-tight">
//             Your go-to platform for discovering amazing events happening around
//             Abia State and beyond.
//           </p>
//           <div className="flex gap-3">
//             <a className="bg-[#F46F1A] text-white inline-flex justify-center items-center py-[15px] px-[25px] rounded-md gap-5 pl-4 font-bold">
//               <span>Explore Events</span>
//               <span>
//                 <IoArrowForward />
//               </span>
//             </a>
//             <a className="border-[#3C6E16] border-2 text-[#3C6E16] inline-flex justify-center items-center py-[15px] px-[25px] rounded-md gap-5 pl-4 font-bold">
//               <span>How it Works</span>
//               <span>
//                 <IoPlay />
//               </span>
//             </a>
//             {/* <button className="border-2 border-[#3f783d] text-[#3f783d] py-1 px-4 rounded-md font-medium text-[15px]">
//               How it Works
//             </button> */}
//           </div>
//         </div>
//         <div className="relative rounded-xl overflow-hidden h-80 w-3xl z-10">
//           <img
//             src="./davido.png"
//             alt=""
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute top-4 left-4 flex flex-col gap-2">
//             <div className="flex justify-between items-center gap-80">
//               <div>
//                 <p className="inline-block bg-[#F46F1A] text-[#ffffff] px-[20px] py-[10px] rounded-full w-fit text-[12px]">
//                   Featured Event
//                 </p>
//               </div>
//               <div className="flex gap-5">
//                 <span className="text-white bg-black/80 p-3 rounded-full">
//                   <IoArrowBack />
//                 </span>
//                 <span className="text-black bg-white p-3 rounded-full">
//                   <IoArrowForward />
//                 </span>
//               </div>
//             </div>
//             <p className="text-[#fff] px-1 py-1 rounded-full font-bold text-[30px] w-50 leading-tight">
//               Hotel Oris Live Concert
//             </p>
//             <p className="text-[12px] text-white font-semibold px-1">
//               25th - 27th oct, 2026
//             </p>
//             <p className="text-[12px] text-white font-semibold px-1">
//               Umueze Sports Arena, Umuahia
//             </p>
//             <div className="flex items-center gap-2">
//               <img src="/group.png" alt="" />
//               <p className="text-[#ffffff] font-medium text-[12px]">
//                 15.7k + Attending
//               </p>
//             </div>
//             <div>
//               {/* <img src="/people.png" alt="" className="w-auto h-30"/> */}
//             </div>
//             <p className="inline-block bg-[#F46F1A] text-[#fff] px-6 py-2 rounded-md w-fit text-[14px] font-semibold">
//               Get Ticket
//             </p>
//           </div>
//         </div>
//         <div>
//           <div className="absolute right-1 top-30 w-fit h-fit rounded-full">
//             <img src="/Ellipse 7.png" />
//           </div>

//           <div className="absolute right-5 top-80 w-fit h-fit rounded-full">
//             <img src="/Vector 2.png" alt="" className="h-4 w-auto" />
//           </div>

//           <div className="absolute right-210 top-60 w-fit h-fit rounded-full">
//             <img src="/Vector 2.png" alt="" className="h-4 w-auto" />
//           </div>

//           <div className="absolute right-1 top-95 w-fit h-fit rounded-full">
//             <img src="/Ellipse 9.png" alt="" />
//           </div>

//           <div className="absolute right-306 top-50 w-fit h-fit rounded-full">
//             <img src="/Ellipse 7 (1).png" alt="" />
//           </div>

//           <div className="absolute right-306 top-90 w-fit h-fit rounded-full">
//             <img src="/Line 4 (1).png" alt="" />
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default Hero;

import React from "react";
import { IoArrowBack, IoArrowForward, IoPlay } from "react-icons/io5";

const Hero = () => {
  return (
    <>
      <section
        className="
          mx-8 pt-10 
          flex flex-col lg:flex-row 
          justify-center
        "
      >
        <div
          className="
            max-w-full lg:max-w-1/2 
            space-y-3 z-10
          "
        >
          <h1 className="font-semibold text-[48px] leading-tight">
            Discover. Experience. Celebrate
            <span className="text-[#3f783d]"> Abia</span>
            <span className="text-[#F46F1A]">.</span>
          </h1>

          <p className="font-normal text-[18px] leading-tight">
            Your go-to platform for discovering amazing events happening around
            Abia State and beyond.
          </p>

          {/* RESPONSIVE CHANGE: added flex-wrap */}
          <div className="flex gap-3 flex-wrap">
            <a className="bg-[#F46F1A] text-white inline-flex justify-center items-center py-[15px] px-[25px] rounded-md gap-5 pl-4 font-bold w-full md:w-fit">
              <span>Explore Events</span>
              <span>
                <IoArrowForward />
              </span>
            </a>

            <a className="border-[#3C6E16] border-2 text-[#3C6E16] inline-flex justify-center items-center py-[15px] px-[25px] rounded-md gap-5 pl-4 font-bold w-full md:w-fit">
              <span>How it Works</span>
              <span>
                <IoPlay />
              </span>
            </a>
          </div>
        </div>

        {/* RESPONSIVE CHANGE:
            full width on mobile/tablet,
            original width on laptop
        */}
        <div
          className="
            relative rounded-xl overflow-hidden h-80 
            w-full lg:w-3xl 
            z-10
            mt-5
          "
        >
          <img
            src="./davido.png"
            alt=""
            className="w-full h-full object-cover"
          />

          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {/* RESPONSIVE CHANGE:
                gap-4 on smaller screens,
                original gap-80 on laptop
            */}
            <div className="flex justify-between items-center gap-4 lg:gap-80">
              <div>
                <p className="inline-block bg-[#F46F1A] text-[#ffffff] px-[20px] py-[10px] rounded-full w-fit text-[12px]">
                  Featured Event
                </p>
              </div>

              <div className="flex gap-5">
                <span className="text-white bg-black/80 p-3 rounded-full">
                  <IoArrowBack />
                </span>

                <span className="text-black bg-white p-3 rounded-full">
                  <IoArrowForward />
                </span>
              </div>
            </div>

            <p className="text-[#fff] px-1 py-1 rounded-full font-bold text-[30px] w-50 leading-tight">
              Hotel Oris Live Concert
            </p>

            <p className="text-[12px] text-white font-semibold px-1">
              25th - 27th oct, 2026
            </p>

            <p className="text-[12px] text-white font-semibold px-1">
              Umueze Sports Arena, Umuahia
            </p>

            <div className="flex items-center gap-2">
              <img src="/group.png" alt="" />

              <p className="text-[#ffffff] font-medium text-[12px]">
                15.7k + Attending
              </p>
            </div>

            <div>
              {/* <img src="/people.png" alt="" className="w-auto h-30"/> */}
            </div>

            <p className="inline-block bg-[#F46F1A] text-[#fff] px-6 py-2 rounded-md w-fit text-[14px] font-semibold">
              Get Ticket
            </p>
          </div>
        </div>

        {/* RESPONSIVE CHANGE:
            Decorative absolute elements are hidden on mobile/tablet
            because their fixed positions would cause horizontal overflow.
            They appear again on laptop.
        */}
        <div className="hidden lg:block">
          <div className="absolute right-1 top-30 w-fit h-fit rounded-full">
            <img src="/Ellipse 7.png" />
          </div>

          <div className="absolute right-5 top-80 w-fit h-fit rounded-full">
            <img src="/Vector 2.png" alt="" className="h-4 w-auto" />
          </div>

          <div className="absolute right-210 top-60 w-fit h-fit rounded-full">
            <img src="/Vector 2.png" alt="" className="h-4 w-auto" />
          </div>

          <div className="absolute right-1 top-95 w-fit h-fit rounded-full">
            <img src="/Ellipse 9.png" alt="" />
          </div>

          <div className="absolute right-306 top-50 w-fit h-fit rounded-full">
            <img src="/Ellipse 7 (1).png" alt="" />
          </div>

          <div className="absolute right-306 top-90 w-fit h-fit rounded-full">
            <img src="/Line 4 (1).png" alt="" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
