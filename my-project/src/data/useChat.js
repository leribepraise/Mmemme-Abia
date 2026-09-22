import { useState, useCallback } from "react";
import {
  conversations as initialConversations,
  users as initialUsers,
  currentUserId,
} from "./communityData";

const useChat = () => {
  const [conversations, setConversations] = useState(initialConversations);
  const [users] = useState(initialUsers);
  const [typingUserIds, setTypingUserIds] = useState(["u2"]);

  const sendMessage = useCallback((conversationId, text) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: `m${Date.now()}`,
                  senderId: currentUserId,
                  text,
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          : c,
      ),
    );
  }, []);

  const setUserTyping = useCallback((userId, isTyping) => {
    setTypingUserIds((prev) =>
      isTyping
        ? [...new Set([...prev, userId])]
        : prev.filter((id) => id !== userId),
    );
  }, []);

  const getOtherParticipant = useCallback(
    (conversation) => {
      if (conversation.type === "group") return null;
      const otherId = conversation.participantIds.find(
        (id) => id !== currentUserId,
      );
      return users.find((u) => u.id === otherId);
    },
    [users],
  );

  const getConversationDisplay = useCallback(
    (conversation) => {
      if (conversation.type === "group") {
        return { name: conversation.name, avatar: conversation.avatar };
      }
      const other = getOtherParticipant(conversation);
      return {
        name: other?.name,
        avatar: other?.avatar,
        online: other?.online,
      };
    },
    [getOtherParticipant],
  );

  const getLastMessage = useCallback((conversation) => {
    return conversation.messages[conversation.messages.length - 1] || null;
  }, []);

  const isUserTyping = useCallback(
    (conversation) => {
      const other = getOtherParticipant(conversation);
      return other ? typingUserIds.includes(other.id) : false;
    },
    [getOtherParticipant, typingUserIds],
  );

  // Finds an existing direct conversation with the given user, or
  // creates a new empty one. Returns the conversation's id.
  const findOrCreateDirectConversation = useCallback(
    (otherUserId) => {
      const existing = conversations.find(
        (c) =>
          c.type === "direct" &&
          c.participantIds.includes(currentUserId) &&
          c.participantIds.includes(otherUserId),
      );

      if (existing) return existing.id;

      const newId = `c${Date.now()}`;

      setConversations((prev) => [
        ...prev,
        {
          id: newId,
          type: "direct",
          participantIds: [currentUserId, otherUserId],
          name: null,
          avatar: null,
          messages: [],
        },
      ]);

      return newId;
    },
    [conversations],
  );

  return {
    currentUserId,
    conversations,
    users,
    typingUserIds,
    sendMessage,
    setUserTyping,
    getOtherParticipant,
    getConversationDisplay,
    getLastMessage,
    isUserTyping,
    findOrCreateDirectConversation,
  };
};

export default useChat;
