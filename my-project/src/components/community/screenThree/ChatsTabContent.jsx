import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import useChat from "../../../data/useChat";

const ChatsTabContent = () => {
  const { conversations, findOrCreateDirectConversation } = useChat();
  const location = useLocation();

  const [activeConversationId, setActiveConversationId] = useState(
    conversations[0]?.id || null,
  );

  useEffect(() => {
    const targetUserId = location.state?.openChatWithUserId;
    if (targetUserId) {
      const conversationId = findOrCreateDirectConversation(targetUserId);
      setActiveConversationId(conversationId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId,
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 flex flex-col lg:flex-row h-[600px] overflow-hidden">
      <ChatSidebar
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
      />
      <ChatWindow conversation={activeConversation} />
    </div>
  );
};

export default ChatsTabContent;
