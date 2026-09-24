import React from "react";

const EmptyStateCard = ({ message = "No recent posts to show." }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
};

export default EmptyStateCard;
