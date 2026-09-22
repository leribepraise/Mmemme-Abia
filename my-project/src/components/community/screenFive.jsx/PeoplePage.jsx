import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import PeopleTabs from "./PeopleTabs";
import PersonListItem from "./PersonListItem";
import { allPeople } from "../../../data/communityPeople";

const PEOPLE_PER_PAGE = 10;

const PeoplePage = () => {
  const [people, setPeople] = useState(allPeople);
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(PEOPLE_PER_PAGE);

  const handleToggleFollow = (personId) => {
    setPeople((prev) =>
      prev.map((p) =>
        p.id === personId ? { ...p, isFollowing: !p.isFollowing } : p,
      ),
    );
  };

  const filteredPeople = useMemo(() => {
    let result = people;

    if (activeTab === "Following") {
      result = result.filter((p) => p.isFollowing);
    }

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(query));
    }

    return result;
  }, [people, activeTab, searchTerm]);

  const visiblePeople = filteredPeople.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPeople.length;

  return (
    <div className="min-h-screen bg-[#F5F7F3] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <h1 className="font-bold text-3xl text-[#172033]">People</h1>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for people..."
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[#3F783D]"
            />
          </div>
        </div>

        <PeopleTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="bg-white rounded-xl border border-gray-200 mt-4">
          {visiblePeople.length > 0 ? (
            visiblePeople.map((person) => (
              <PersonListItem
                key={person.id}
                person={person}
                onToggleFollow={handleToggleFollow}
                activeTab={activeTab}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 py-10">
              {activeTab === "Following"
                ? "You're not following anyone yet."
                : "No people found."}
            </p>
          )}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setVisibleCount((prev) => prev + PEOPLE_PER_PAGE)}
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

export default PeoplePage;
