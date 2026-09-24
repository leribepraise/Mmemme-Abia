import React from "react";
import PostCard from "./PostCard";

const PostFeed = ({ posts }) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 font-medium">No posts yet.</p>
        <p className="text-sm text-gray-400 mt-1">
          Be the first to share something with the community.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostFeed;
