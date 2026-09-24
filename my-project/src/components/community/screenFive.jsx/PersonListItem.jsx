import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const PersonListItem = ({ person, onToggleFollow, activeTab }) => {
  const navigate = useNavigate();

  const handleMessage = () => {
    navigate("/community", { state: { openChatWithUserId: person.id } });
  };

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-4 border-b border-gray-100 last:border-0">
      <NavLink
        to={`/community/people/${person.id}`}
        className="flex items-center gap-3 flex-1 min-w-0"
      >
        <img
          src={person.avatar}
          alt={person.name}
          className="w-11 h-11 rounded-full object-cover shrink-0"
        />

        <div className="min-w-0">
          <p className="font-bold text-sm text-[#172033]">{person.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{person.location}</p>
        </div>
      </NavLink>

      {activeTab === "Following" ? (
        <button
          onClick={handleMessage}
          className="shrink-0 text-sm font-semibold px-4 py-1.5 rounded-lg border border-[#3F783D] text-[#3F783D] hover:bg-[#EAF4EB] transition"
        >
          Message
        </button>
      ) : (
        <button
          onClick={() => onToggleFollow(person.id)}
          className={`shrink-0 text-sm font-semibold px-4 py-1.5 rounded-lg border transition ${
            person.isFollowing
              ? "border-gray-300 text-gray-600 hover:bg-gray-50"
              : "border-[#3F783D] text-[#3F783D] hover:bg-[#EAF4EB]"
          }`}
        >
          {person.isFollowing ? "Following" : "Follow"}
        </button>
      )}
    </div>
  );
};

export default PersonListItem;
