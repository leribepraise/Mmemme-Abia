import React from "react";
import GroupCard from "./GroupCard";

const MyGroupsList = ({ groups }) => {
  if (groups.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 font-medium">
          You haven't joined any groups yet.
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Explore groups to connect with people who share your interests.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
    </div>
  );
};

export default MyGroupsList;
