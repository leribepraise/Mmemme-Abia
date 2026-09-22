import React, { useState, useMemo } from "react";
import MembersSubTabs from "./MembersSubTabs";
import PersonListItem from "../screenFive.jsx/PersonListItem";
import { groupMembers } from "../../../data/groupMembers";

const MEMBERS_PER_PAGE = 10;

const GroupMembersTab = () => {
  const [members, setMembers] = useState(groupMembers);
  const [activeSubTab, setActiveSubTab] = useState("All");
  const [visibleCount, setVisibleCount] = useState(MEMBERS_PER_PAGE);

  const handleToggleFollow = (memberId) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId ? { ...m, isFollowing: !m.isFollowing } : m,
      ),
    );
  };

  const filteredMembers = useMemo(() => {
    if (activeSubTab === "Following") {
      return members.filter((m) => m.isFollowing);
    }
    if (activeSubTab === "Nearby") {
      return members.filter((m) => m.isNearby);
    }
    return members;
  }, [members, activeSubTab]);

  const visibleMembers = filteredMembers.slice(0, visibleCount);
  const hasMore = visibleCount < filteredMembers.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <MembersSubTabs
        activeSubTab={activeSubTab}
        onSubTabChange={(tab) => {
          setActiveSubTab(tab);
          setVisibleCount(MEMBERS_PER_PAGE);
        }}
      />

      <div className="mt-3">
        {visibleMembers.length > 0 ? (
          visibleMembers.map((member) => (
            <PersonListItem
              key={member.id}
              person={member}
              onToggleFollow={handleToggleFollow}
              activeTab={activeSubTab === "All" ? "All" : "Following"}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 py-10">
            {activeSubTab === "Following"
              ? "You're not following anyone in this group yet."
              : activeSubTab === "Nearby"
                ? "No nearby members found."
                : "No members found."}
          </p>
        )}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setVisibleCount((prev) => prev + MEMBERS_PER_PAGE)}
            className="text-[#3F783D] text-sm font-semibold hover:underline"
          >
            Load more...
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupMembersTab;
