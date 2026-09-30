import React from "react";
import NotificationItem from "./NotificationItem";

const NotificationGroup = ({ title, notifications, onRead, onOpen, onDelete, busy }) => {
  if (!notifications.length) return null;

  return (
    <div>
      <h2 className="font-bold text-sm text-gray-500 mb-2">{title}</h2>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {notifications.map((n) => (
          <NotificationItem key={n.id} notification={n} onRead={onRead} onOpen={onOpen} onDelete={onDelete} busy={busy}/>
        ))}
      </div>
    </div>
  );
};

export default NotificationGroup;
