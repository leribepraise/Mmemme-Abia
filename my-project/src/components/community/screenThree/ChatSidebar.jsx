import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import ChatListItem from "./ChatListItem";
import useChat from "../../../data/useChat";

const ChatSidebar = ({ activeConversationId, onSelectConversation }) => {
  const { conversations, getConversationDisplay } = useChat();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = useMemo(() => {
    if (!searchTerm.trim()) return conversations;
    const query = searchTerm.toLowerCase();
    return conversations.filter((c) => {
      const display = getConversationDisplay(c);
      return display.name?.toLowerCase().includes(query);
    });
  }, [conversations, searchTerm, getConversationDisplay]);

  return (
    <div className="w-full lg:w-[280px] shrink-0 border-r border-gray-200 flex flex-col">
      <div className="p-3">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search chats..."
            className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-[#3F783D]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
        {filteredConversations.map((conversation) => (
          <ChatListItem
            key={conversation.id}
            conversation={conversation}
            isActive={conversation.id === activeConversationId}
            onClick={() => onSelectConversation(conversation.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
