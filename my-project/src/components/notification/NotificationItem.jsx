import React from "react";
import { notificationIcons } from "../../data/notificationIcons";

const NotificationItem = ({ notification }) => {
  const config =
    notificationIcons[notification.type] || notificationIcons.reminder;
  const Icon = config.icon;

  return (
    <div className="flex gap-4 px-5 py-4 border-b border-gray-100 last:border-0">
      <div
        className={`w-10 h-10 shrink-0 rounded-lg ${config.bg} flex items-center justify-center`}
      >
        <Icon className={`w-5 h-5 ${config.color}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold text-sm text-[#172033]">
            {notification.title}
          </h3>
          <span className="text-xs text-gray-400 shrink-0">
            {notification.time}
          </span>
        </div>

        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
          {notification.message}
        </p>
      </div>

      {!notification.read && (
        <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0 self-center" />
      )}
    </div>
  );
};

export default NotificationItem;
