import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import GroupListItem from "./GroupListItem";
import { allGroups } from "../../../data/allGroups";

const GROUPS_PER_PAGE = 7;

const AllGroupsPage = () => {
  const [groups, setGroups] = useState(allGroups);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(GROUPS_PER_PAGE);

  const handleToggleJoin = (groupId) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, isJoined: !g.isJoined } : g)),
    );
  };

  const filteredGroups = useMemo(() => {
    if (!searchTerm.trim()) return groups;
    const query = searchTerm.toLowerCase();
    return groups.filter((g) => g.name.toLowerCase().includes(query));
  }, [groups, searchTerm]);

  const visibleGroups = filteredGroups.slice(0, visibleCount);
  const hasMore = visibleCount < filteredGroups.length;

  return (
    <div className="min-h-screen bg-[#F5F7F3] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <h1 className="font-bold text-3xl text-[#172033]">All Groups</h1>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search groups..."
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[#3F783D]"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          {visibleGroups.length > 0 ? (
            visibleGroups.map((group) => (
              <GroupListItem
                key={group.id}
                group={group}
                onToggleJoin={handleToggleJoin}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 py-10">No groups found.</p>
          )}
        </div>

        {hasMore && (
          <div className="flex justify-end mt-3">
            <button
              onClick={() => setVisibleCount((prev) => prev + GROUPS_PER_PAGE)}
              className="text-[#3F783D] text-sm font-semibold hover:underline"
            >
              Load more...
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllGroupsPage;
