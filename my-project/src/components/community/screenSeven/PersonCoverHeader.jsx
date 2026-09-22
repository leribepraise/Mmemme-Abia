import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MoreHorizontal } from "lucide-react";

const PersonCoverHeader = ({ person, onToggleFollow }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="relative h-48 w-full">
        <img
          src={person.coverImage}
          alt=""
          className="w-full h-full object-cover"
        />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {person.isOnline && (
          <span className="absolute bottom-3 left-[52px] w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
        )}
      </div>

      <div className="px-5 pb-5">
        <div className="flex items-start justify-between -mt-10 gap-4">
          <img
            src={person.avatar}
            alt={person.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shrink-0"
          />

          <div className="flex items-center gap-2 mt-11 shrink-0">
            <button className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition">
              <MoreHorizontal className="w-4 h-4 text-gray-600" />
            </button>

            <button
              onClick={() => onToggleFollow(person.id)}
              className={`text-sm font-semibold px-5 py-2 rounded-lg transition ${
                person.isFollowing
                  ? "border border-gray-300 text-gray-600 hover:bg-gray-50"
                  : "bg-[#3F783D] hover:bg-[#356433] text-white"
              }`}
            >
              {person.isFollowing ? "Following" : "Follow"}
            </button>
          </div>
        </div>

        <h1 className="font-bold text-2xl text-[#172033] mt-2">
          {person.name}
        </h1>
        <p className="text-sm text-gray-400">@{person.username}</p>

        <div className="text-sm text-gray-600 mt-2 leading-relaxed">
          {person.bio.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        <div className="flex items-center gap-6 mt-4">
          <div>
            <span className="font-bold text-[#172033]">
              {person.postsCount}
            </span>
            <span className="text-sm text-gray-500 ml-1">Posts</span>
          </div>

          <div>
            <span className="font-bold text-[#172033]">
              {person.followersCount.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500 ml-1">Followers</span>
          </div>

          <div>
            <span className="font-bold text-[#172033]">
              {person.followingCount}
            </span>
            <span className="text-sm text-gray-500 ml-1">Following</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonCoverHeader;
