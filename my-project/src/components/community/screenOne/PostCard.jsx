import React, { useState } from "react";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-9 h-9 rounded-full object-cover"
          />

          <div>
            <p className="font-bold text-sm text-[#172033]">
              {post.author.name}
            </p>
            <p className="text-xs text-gray-400">
              {post.location} · {post.timeAgo}
            </p>
          </div>
        </div>

        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {post.text && (
        <p className="px-4 pb-3 text-sm text-gray-700 leading-relaxed">
          {post.text}
        </p>
      )}

      {post.image && (
        <img
          src={post.image}
          alt=""
          className="w-full max-h-[420px] object-cover"
        />
      )}

      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLike}
            className="flex items-center gap-1.5 text-sm"
          >
            <Heart
              className={`w-4 h-4 ${
                liked ? "text-red-500 fill-red-500" : "text-gray-400"
              }`}
            />
            <span className="text-gray-600">{likeCount}</span>
          </button>

          <button className="flex items-center gap-1.5 text-sm text-gray-600">
            <MessageCircle className="w-4 h-4 text-gray-400" />
            <span>{post.comments}</span>
          </button>
        </div>

        <span className="text-xs text-gray-400">
          {post.comments} comments · {post.shares} shares
        </span>
      </div>
    </div>
  );
};

export default PostCard;
