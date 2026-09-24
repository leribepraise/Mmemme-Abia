// import React from "react";
// import SectionHeader from "./SectionHeader";

// const AttendeeInfoCard = () => {
//   return (
//     <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
//       <SectionHeader number="3" title="Attendee Information" />

//       <div className="mt-6 space-y-6 max-w-lg">
//         {/* Full Name Field */}
//         <div>
//           <label className="mb-2 block text-sm font-extrabold text-gray-900 md:text-base">
//             Full Name <span className="text-red-500">*</span>
//           </label>

//           <input
//             type="text"
//             placeholder="Enter full name"
//             className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-900 placeholder-gray-400 transition focus:border-[#265F27] focus:outline-none focus:ring-2 focus:ring-[#265F27]/20 md:text-base"
//           />
//         </div>

//         {/* Email Field */}
//         <div>
//           <label className="mb-2 block text-sm font-extrabold text-gray-900 md:text-base">
//             Email Address <span className="text-red-500">*</span>
//           </label>

//           <input
//             type="email"
//             placeholder="Enter email address"
//             className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-900 placeholder-gray-400 transition focus:border-[#265F27] focus:outline-none focus:ring-2 focus:ring-[#265F27]/20 md:text-base"
//           />
//         </div>

//         {/* Checkbox Option */}
//         <div className="flex items-center gap-3 pt-1">
//           <input
//             type="checkbox"
//             id="buyForSomeone"
//             className="h-5 w-5 cursor-pointer rounded border-gray-300 text-[#265F27] accent-[#265F27] focus:ring-[#265F27]"
//           />

//           <label
//             htmlFor="buyForSomeone"
//             className="cursor-pointer text-sm font-bold text-gray-700 md:text-base"
//           >
//             I'm buying for someone else
//           </label>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttendeeInfoCard;

import React from "react";
import SectionHeader from "./SectionHeader";

const AttendeeInfoCard = ({ attendee, updateAttendee }) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
      <SectionHeader number="3" title="Attendee Information" />

      <div className="mt-6 space-y-6 max-w-lg">
        {/* Full Name Field */}
        <div>
          <label className="mb-2 block text-sm font-extrabold text-gray-900 md:text-base">
            Full Name <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            placeholder="Enter full name"
            value={attendee.fullName}
            onChange={(e) => updateAttendee("fullName", e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-900 placeholder-gray-400 transition focus:border-[#265F27] focus:outline-none focus:ring-2 focus:ring-[#265F27]/20 md:text-base"
          />
        </div>

        {/* Email Field */}
        <div>
          <label className="mb-2 block text-sm font-extrabold text-gray-900 md:text-base">
            Email Address <span className="text-red-500">*</span>
          </label>

          <input
            type="email"
            placeholder="Enter email address"
            value={attendee.email}
            onChange={(e) => updateAttendee("email", e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-900 placeholder-gray-400 transition focus:border-[#265F27] focus:outline-none focus:ring-2 focus:ring-[#265F27]/20 md:text-base"
          />
        </div>

        {/* Checkbox Option */}
        <div>
          <div className="flex items-center gap-3 pt-1">
            <input
              type="checkbox"
              id="buyForSomeone"
              checked={attendee.buyingForSomeoneElse}
              onChange={(e) =>
                updateAttendee("buyingForSomeoneElse", e.target.checked)
              }
              className="h-5 w-5 cursor-pointer rounded border-gray-300 text-[#265F27] accent-[#265F27] focus:ring-[#265F27]"
            />

            <label
              htmlFor="buyForSomeone"
              className="cursor-pointer text-sm font-bold text-gray-700 md:text-base"
            >
              I'm buying for someone else
            </label>
          </div>

          {/* Note shown only when checked */}
          {attendee.buyingForSomeoneElse && (
            <p className="mt-3 rounded-xl bg-[#F5F7F3] px-4 py-3 text-sm font-medium leading-6 text-gray-600">
              Note: This person will share the same ticket as yours.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendeeInfoCard;
