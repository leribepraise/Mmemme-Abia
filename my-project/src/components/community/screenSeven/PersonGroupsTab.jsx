import React, { useState } from "react";
import PersonGroupItem from "./PersonGroupItem";
import EmptyStateCard from "../screenSix/EmptyStateCard";
import { allGroups } from "../../../data/allGroups";

const PersonGroupsTab = ({ groupIds }) => {
  const [groups, setGroups] = useState(allGroups);

  const personGroups = groups.filter((g) => groupIds.includes(g.id));

  const handleJoin = (groupId) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, isJoined: true } : g)),
    );
  };

  if (personGroups.length === 0) {
    return <EmptyStateCard message="Not part of any groups yet." />;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {personGroups.map((group) => (
        <PersonGroupItem
          key={group.id}
          group={group}
          viewerHasJoined={group.isJoined}
          onJoin={handleJoin}
        />
      ))}
    </div>
  );
};

export default PersonGroupsTab;
