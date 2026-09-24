import React from "react";

const GroupCoverHeader = ({ group, onToggleJoin }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="h-52 w-full">
        <img
          src={group.coverImage}
          alt={group.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="px-5 pb-4">
        <div className="flex items-start justify-between -mt-8 gap-4">
          <img
            src={group.image}
            alt={group.name}
            className="w-16 h-16 rounded-full object-cover border-4 border-white shrink-0"
          />

          <div className="flex items-center gap-2 mt-9 shrink-0">
            <button
              onClick={() => onToggleJoin(group.id)}
              className={`text-sm font-semibold px-4 py-1.5 rounded-lg border transition ${
                group.isJoined
                  ? "border-gray-300 text-gray-600 hover:bg-gray-50"
                  : "border-[#3F783D] text-[#3F783D] hover:bg-[#EAF4EB]"
              }`}
            >
              {group.isJoined ? "✓ Joined" : "Join"}
            </button>

            <button className="bg-[#3F783D] hover:bg-[#356433] text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition">
              Invite
            </button>
          </div>
        </div>

        <h1 className="font-bold text-xl text-[#172033] mt-2">{group.name}</h1>

        <p className="text-sm text-gray-500">
          {group.visibility} Group · {group.memberCount.toLocaleString()}{" "}
          members
        </p>

        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
          {group.description}
        </p>
      </div>
    </div>
  );
};

export default GroupCoverHeader;
