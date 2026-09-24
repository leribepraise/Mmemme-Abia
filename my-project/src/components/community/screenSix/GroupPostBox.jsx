import React, { useState } from "react";
import { Image as ImageIcon, ListChecks, Smile } from "lucide-react";

const GroupPostBox = ({ currentUser, onCreatePost }) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onCreatePost(text);
    setText("");
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <img
          src={currentUser?.avatar || "/avatar-placeholder.png"}
          alt=""
          className="w-9 h-9 rounded-full object-cover shrink-0"
        />

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Write something..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none placeholder:text-gray-400"
        />
      </div>

      <div className="flex items-center gap-5 mt-3 pl-12">
        <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ImageIcon className="w-4 h-4 text-green-600" />
          Photo/Video
        </button>

        <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <ListChecks className="w-4 h-4 text-orange-500" />
          Poll
        </button>

        <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <Smile className="w-4 h-4 text-yellow-500" />
          Feeling
        </button>
      </div>
    </div>
  );
};

export default GroupPostBox;
