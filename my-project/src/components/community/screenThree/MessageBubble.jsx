import React from "react";
import { formatMessageTime } from "./timeUtils";

const MessageBubble = ({ message, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-xl px-4 py-2.5 ${
          isOwn ? "bg-[#EAF4EB]" : "bg-gray-100"
        }`}
      >
        {message.text.split("\n").map((line, i) => (
          <p key={i} className="text-sm text-gray-800 leading-relaxed">
            {line}
          </p>
        ))}

        <p className="text-[10px] text-gray-400 mt-1 text-right">
          {formatMessageTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
