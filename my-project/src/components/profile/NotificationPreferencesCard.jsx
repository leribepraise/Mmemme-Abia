import React, { useState } from "react";
import {
  Bell,
  CalendarCheck,
  Ticket,
  Gift,
  MessageCircle,
  Mail,
} from "lucide-react";

const NotificationPreferencesCard = () => {
  const [prefs, setPrefs] = useState({
    eventUpdates: true,
    bookingConfirmations: true,
    promotions: true,
    community: true,
    newsletter: true,
  });

  const items = [
    {
      key: "eventUpdates",
      icon: CalendarCheck,
      title: "Event Updates",
      subtitle: "New events, reminders and changes",
    },
    {
      key: "bookingConfirmations",
      icon: Ticket,
      title: "Booking Confirmations",
      subtitle: "Updates on your bookings and tickets",
    },
    {
      key: "promotions",
      icon: Gift,
      title: "Promotions & Offers",
      subtitle: "Exclusive deals and discounts",
    },
    {
      key: "community",
      icon: MessageCircle,
      title: "Community Activities",
      subtitle: "Messages, discussions and new posts",
    },
    {
      key: "newsletter",
      icon: Mail,
      title: "Newsletter",
      subtitle: "Monthly updates and travel tips",
    },
  ];

  const toggle = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start gap-3 mb-5">
        <Bell className="w-5 h-5 text-gray-700 shrink-0 mt-0.5" />

        <div>
          <h3 className="font-bold text-base text-[#172033]">
            Notification Preferences
          </h3>
          <p className="text-sm text-gray-500">
            Choose what kind of notifications you want to receive.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {items.map(({ key, icon: Icon, title, subtitle }) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Icon className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />

              <div>
                <p className="text-sm font-semibold text-[#172033]">{title}</p>
                <p className="text-xs text-gray-400">{subtitle}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggle(key)}
              className={`w-11 h-6 rounded-full transition shrink-0 relative ${
                prefs[key] ? "bg-[#3F783D]" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  prefs[key] ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPreferencesCard;
