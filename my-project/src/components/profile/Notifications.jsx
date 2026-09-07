import React from "react";
import { CheckCircle, Clock } from "lucide-react";

import SectionHeader from "./common/SectionHeader";
import Notification from "./common/Notification";

const Notifications = () => {
  return (
    <div className="mx-auto max-w-[1100px]">
      <SectionHeader
        title="Notifications"
        description="Stay updated with your activities and bookings."
      />

      <div className="space-y-3">
        <Notification
          icon={<CheckCircle size={18} />}
          title="Booking confirmed"
          text="Your booking for Hotel Oris Live Concert has been confirmed."
        />

        <Notification
          icon={<Clock size={18} />}
          title="Upcoming event"
          text="Abia Cultural Festival is coming up soon."
        />
      </div>
    </div>
  );
};

export default Notifications;
