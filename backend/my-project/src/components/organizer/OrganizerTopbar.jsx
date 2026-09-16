import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronDown, MessageSquare } from "lucide-react";
import { seedMessages, seedOrganizer } from "@/data/organizerData";
import { load } from "@/lib/utils";
import { useAuth } from "@/components/context/AuthContext";

export default function OrganizerTopbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const organizer = load("mmemme-organizer", seedOrganizer);
  const unreadMessages = seedMessages.filter((m) => m.unread).length;

  return (
    <div className="flex items-center gap-3 shrink-0" data-testid="topbar-organizer-utility">
      <button
        onClick={() => navigate("/organizer/messages")}
        className="relative w-9 h-9 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 hover:text-[#3F7D3D]"
        aria-label="Messages"
        data-testid="button-topbar-messages"
      >
        <MessageSquare className="w-4 h-4" />
        {unreadMessages > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#F36B25] text-white text-[9px] font-black min-w-[16px] h-[16px] flex items-center justify-center rounded-full px-1">
            {unreadMessages}
          </span>
        )}
      </button>
      <button
        className="relative w-9 h-9 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 hover:text-[#3F7D3D]"
        aria-label="Notifications"
        data-testid="button-topbar-notifications"
      >
        <Bell className="w-4 h-4" />
        <span className="absolute -top-1 -right-1 bg-[#F36B25] text-white text-[9px] font-black min-w-[16px] h-[16px] flex items-center justify-center rounded-full px-1">
          3
        </span>
      </button>
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1.5"
          data-testid="button-topbar-avatar"
        >
          <div className="w-9 h-9 rounded-full bg-[#3F7D3D] text-white flex items-center justify-center font-black text-xs overflow-hidden shrink-0">
            {organizer.avatar}
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
        {open && (
          <div
            className="absolute right-0 top-11 w-44 bg-white rounded-xl border border-gray-100 shadow-lg py-1.5 z-20"
            data-testid="menu-topbar-avatar"
          >
            <button
              onClick={() => { setOpen(false); navigate("/organizer/settings"); }}
              className="w-full text-left px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Account Settings
            </button>
            <button
              onClick={() => { setOpen(false); logout(); navigate("/organizer/login"); }}
              className="w-full text-left px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
