import React from "react";
import { MoreVertical } from "lucide-react";
import useChat from "../../../data/useChat";

const ChatHeader = ({ conversation }) => {
  const { getConversationDisplay, getOtherParticipant, isUserTyping } =
    useChat();

  const display = getConversationDisplay(conversation);
  const other = getOtherParticipant(conversation);
  const typing = isUserTyping(conversation);

  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <img
          src={display.avatar || "/avatar-placeholder.png"}
          alt={display.name}
          className="w-10 h-10 rounded-full object-cover"
        />

        <div>
          <p className="font-bold text-sm text-[#172033]">{display.name}</p>
          <p className="text-xs text-gray-400">
            {typing
              ? "Typing..."
              : conversation.type === "direct"
                ? other?.email || (other?.online ? "Online" : "Offline")
                : `${conversation.participantIds.length} members`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="text-[#3F783D] text-sm font-semibold border border-[#3F783D] rounded-lg px-3 py-1.5 hover:bg-[#EAF4EB] transition">
          Mark as Read
        </button>

        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
