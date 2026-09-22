import React, { useRef, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import useChat from "../../../data/useChat";

const ChatWindow = ({ conversation }) => {
  const { currentUserId, sendMessage } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages.length]);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <ChatHeader conversation={conversation} />

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {conversation.messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.senderId === currentUserId}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={(text) => sendMessage(conversation.id, text)} />
    </div>
  );
};

export default ChatWindow;
