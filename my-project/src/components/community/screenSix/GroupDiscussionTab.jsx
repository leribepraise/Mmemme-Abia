import React from "react";
import GroupPostBox from "./GroupPostBox";
import PostCard from "../screenOne/PostCard";
import EmptyStateCard from "./EmptyStateCard";

const GroupDiscussionTab = ({ currentUser, posts, onCreatePost }) => {
  return (
    <div>
      <GroupPostBox currentUser={currentUser} onCreatePost={onCreatePost} />

      <div className="mt-4">
        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyStateCard />
        )}
      </div>
    </div>
  );
};

export default GroupDiscussionTab;
