import React from "react";
import { NavLink } from "react-router-dom";

const PersonGroupItem = ({ group, viewerHasJoined, onJoin }) => {
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

      {!viewerHasJoined && (
        <button
          onClick={() => onJoin(group.id)}
          className="shrink-0 text-sm font-semibold px-4 py-1.5 rounded-lg border border-[#3F783D] text-[#3F783D] hover:bg-[#EAF4EB] transition"
        >
          Join
        </button>
      )}
    </div>
  );
};

export default PersonGroupItem;
