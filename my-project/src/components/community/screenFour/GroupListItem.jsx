import React from "react";
import { NavLink } from "react-router-dom";

const GroupListItem = ({ group, onToggleJoin }) => {
  return (
    <div className="flex items-center gap-4 px-4 py-4 border-b border-gray-100 last:border-0">
      <NavLink
        to={`/community/groups/${group.id}`}
        className="flex items-center gap-4 flex-1 min-w-0"
      >
        <img
          src={group.image}
          alt={group.name}
          className="w-12 h-12 rounded-lg object-cover shrink-0"
        />

        <div className="min-w-0">
          <h3 className="font-bold text-sm text-[#172033]">{group.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {group.memberCount.toLocaleString()} members · {group.visibility}
          </p>
          <p className="text-sm text-gray-600 mt-0.5 truncate">
            {group.description}
          </p>
        </div>
      </NavLink>

      <button
        onClick={() => onToggleJoin(group.id)}
        className={`shrink-0 text-sm font-semibold px-4 py-1.5 rounded-lg border transition ${
          group.isJoined
            ? "border-gray-300 text-gray-600 hover:bg-gray-50"
            : "border-[#3F783D] text-[#3F783D] hover:bg-[#EAF4EB]"
        }`}
      >
        {group.isJoined ? "Joined" : "Join"}
      </button>
    </div>
  );
};

export default GroupListItem;
