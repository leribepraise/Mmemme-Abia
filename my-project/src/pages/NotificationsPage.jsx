import React, { useState } from "react";
import FilterTabs from "../components/notifications/FilterTabs";
import NotificationGroup from "../components/notifications/NotificationGroup";
import { notifications } from "../data/notifications";

const NotificationsPage = () => {
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All"
      ? notifications
      : notifications.filter((n) => {
          const typeMap = {
            Updates: ["reminder", "welcome", "event"],
            Bookings: ["booking", "ticket"],
            Events: ["event", "reminder", "saved"],
            Offers: ["offer"],
            Community: ["community"],
          };
          return typeMap[filter]?.includes(n.type);
        });

  const todayNotifications = filtered.filter((n) => n.date === "Today");
  const earlierNotifications = filtered.filter((n) => n.date === "Earlier");

  return (
    <div className="min-h-screen bg-[#F5F7F3] p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="font-bold text-3xl text-[#172033]">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            Stay updated with what's happening on Mmemme Abia.
          </p>
        </div>

        <FilterTabs onFilterChange={setFilter} />

        <div className="space-y-6">
          <NotificationGroup title="Today" notifications={todayNotifications} />
          <NotificationGroup
            title="Earlier"
            notifications={earlierNotifications}
          />
        </div>

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

export default NotificationsPage;
