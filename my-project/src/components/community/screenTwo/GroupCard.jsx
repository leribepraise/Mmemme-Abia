import React from "react";
import { NavLink } from "react-router-dom";

const GroupCard = ({ group }) => {
  return (
    <NavLink to={`/community/groups/${group.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-sm transition">
        <img
          src={group.image}
          alt={group.name}
          className="w-16 h-16 rounded-xl object-cover shrink-0"
        />

        <div>
          <h3 className="font-bold text-base text-[#172033]">{group.name}</h3>

          <p className="text-xs text-gray-400 mt-0.5">
            {group.memberCount.toLocaleString()} members · {group.visibility}
          </p>

          <p className="text-sm text-gray-600 mt-1">{group.description}</p>
        </div>
      </div>
    </NavLink>
  );
};

export default GroupCard;
