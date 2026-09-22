import React from "react";
import useChat from "../../../data/useChat";
import { formatRelativeTime } from "./timeUtils";

const ChatListItem = ({ conversation, isActive, onClick }) => {
  const { getConversationDisplay, getLastMessage, isUserTyping } = useChat();

  const display = getConversationDisplay(conversation);
  const lastMessage = getLastMessage(conversation);
  const typing = isUserTyping(conversation);

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition ${
        isActive ? "bg-[#EAF4EB]" : "hover:bg-gray-50"
      }`}
    >
      <div className="relative shrink-0">
        <img
          src={display.avatar || "/avatar-placeholder.png"}
          alt={display.name}
          className="w-11 h-11 rounded-full object-cover"
        />

        {conversation.type === "direct" && display.online && (
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-sm text-[#172033] truncate">
            {display.name}
          </p>
          <span className="text-xs text-gray-400 shrink-0">
            {lastMessage ? formatRelativeTime(lastMessage.timestamp) : ""}
          </span>
        </div>

        <p
          className={`text-xs truncate mt-0.5 ${
            typing ? "text-[#3F783D] font-medium" : "text-gray-500"
          }`}
        >
          {typing
            ? "Typing..."
            : lastMessage?.text.split("\n")[0] || "No messages yet"}
        </p>
      </div>

      {!isActive && typing && (
        <span className="w-2 h-2 rounded-full bg-[#3F783D] shrink-0" />
      )}
    </button>
  );
};

export default ChatListItem;
