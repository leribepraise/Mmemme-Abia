import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Image as ImageIcon,
  Smile,
  Plus,
  X,
  Users,
  UserPlus,
  MessageSquarePlus,
} from "lucide-react";

const CreatePostBox = ({ currentUser }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const quickLinks = [
    { label: "All Groups", icon: Users, to: "/community/groups" },
    { label: "Follow More", icon: UserPlus, to: "/community/people" },
    {
      label: "New Chat",
      icon: MessageSquarePlus,
      to: "/community",
      state: { openChatsTab: true },
    },
  ];

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 p-3">
      <div className="flex items-center gap-3">
        <img
          src={currentUser?.profilePicture || "/avatar-placeholder.png"}
          alt=""
          className="w-9 h-9 rounded-full object-cover shrink-0"
        />

        <button
          onClick={() => navigate("/community/create-post")}
          className="flex-1 text-left text-sm text-gray-400 hover:bg-gray-50 rounded-full px-4 py-2 transition"
        >
          Share something with the community...
        </button>

        <button
          onClick={() => navigate("/community/create-post")}
          className="text-gray-400 hover:text-gray-600 shrink-0"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        <button className="text-gray-400 hover:text-gray-600 shrink-0">
          <Smile className="w-5 h-5" />
        </button>

        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="w-9 h-9 rounded-full border border-[#3F783D] text-[#3F783D] flex items-center justify-center hover:bg-[#EAF4EB] transition shrink-0"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute right-3 top-full mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10">
          {quickLinks.map(({ label, icon: Icon, to, state }) => (
            <NavLink
              key={label}
              to={to}
              state={state}
              onClick={() => setMenuOpen(false)}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              <Icon className="w-4 h-4 text-[#3F783D]" />
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreatePostBox;
