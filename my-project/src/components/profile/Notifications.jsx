// import React from "react";
// import { CheckCircle, Clock } from "lucide-react";

// import SectionHeader from "./common/SectionHeader";
// import Notification from "./common/Notification";

// const Notifications = () => {
//   return (
//     <div className="mx-auto max-w-[1100px]">
//       <SectionHeader
//         title="Notifications"
//         description="Stay updated with your activities and bookings."
//       />

//       <div className="space-y-3">
//         <Notification
//           icon={<CheckCircle size={18} />}
//           title="Booking confirmed"
//           text="Your booking for Hotel Oris Live Concert has been confirmed."
//         />

//         <Notification
//           icon={<Clock size={18} />}
//           title="Upcoming event"
//           text="Abia Cultural Festival is coming up soon."
//         />
//       </div>
//     </div>
//   );
// };

// export default Notifications;
import React, { useState } from "react";
import SectionHeader from "./common/SectionHeader";
import FilterTabs from "../notification/FilterTabs";
import NotificationGroup from "../notification/NotificationGroup";
import { notifications } from "../../../src/data/notifications";

const Notifications = () => {
  const [filter, setFilter] = useState("All");

  const typeMap = {
    Updates: ["reminder", "welcome", "event"],
    Bookings: ["booking", "ticket"],
    Events: ["event", "reminder", "saved"],
    Offers: ["offer"],
    Community: ["community"],
  };

  const filtered =
    filter === "All"
      ? notifications
      : notifications.filter((n) => typeMap[filter]?.includes(n.type));

  const todayNotifications = filtered.filter((n) => n.date === "Today");
  const earlierNotifications = filtered.filter((n) => n.date === "Earlier");

  return (
    <div className="mx-auto max-w-[1100px]">
      <SectionHeader
        title="Notifications"
        description="Stay updated with your activities and bookings."
      />

      <div className="mt-6 space-y-6">
        <FilterTabs onFilterChange={setFilter} />

        <NotificationGroup title="Today" notifications={todayNotifications} />
        <NotificationGroup
          title="Earlier"
          notifications={earlierNotifications}
        />

        {earlierNotifications.length > 0 && (
          <div className="flex justify-center">
            <button className="flex items-center gap-1.5 text-[#3F783D] font-medium text-sm hover:underline">
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
