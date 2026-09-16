import React, { useState } from "react";
import {
  IoSearchOutline,
  IoChevronDownOutline,
  IoSendOutline,
  IoAttachOutline,
  IoHappyOutline,
  IoEllipsisVertical,
  IoCheckmarkDoneOutline,
} from "react-icons/io5";
import { LuCircleHelp } from "react-icons/lu";

const conversations = [
  {
    id: 1,
    name: "Chidinma Okafor",
    role: "English about Some Badfears",
    message: "Hello, I want to know if VIP tickets are...",
    time: "2m ago",
    avatar:
      "https://i.pravatar.cc/100?img=47",
    unread: true,
    status: "online",
  },
  {
    id: 2,
    name: "Yasir Adelwa",
    role: "Booking Request",
    message: "Good day, we are interested in booking 10...",
    time: "1h ago",
    avatar:
      "https://i.pravatar.cc/100?img=12",
    unread: true,
    status: "online",
  },
  {
    id: 3,
    name: "Emeka Nwosu",
    role: "Refund Request",
    message: "Hi, I need help with a refund issue...",
    time: "3h ago",
    avatar:
      "https://i.pravatar.cc/100?img=11",
    unread: false,
    status: "offline",
  },
  {
    id: 4,
    name: "Peace Uchen",
    role: "Event Location",
    message: "Please can you share the event location...",
    time: "Yesterday",
    avatar:
      "https://i.pravatar.cc/100?img=32",
    unread: false,
    status: "offline",
  },
  {
    id: 5,
    name: "Daniel Onyema",
    role: "Organizational Opportunity",
    message: "We would like to partner with you...",
    time: "Yesterday",
    avatar:
      "https://i.pravatar.cc/100?img=68",
    unread: false,
    status: "offline",
  },
];

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(conversations[0]);
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "user",
      text: "Hello, I want to know if VIP tickets are still available for the Show Live Concert. Also, do they include front row seats?",
      time: "10:32 AM",
    },
    {
      id: 2,
      sender: "admin",
      text: "Hello Chidinma,\n\nThanks for reaching out.\n\nYes, VIP tickets are still available and they include front row access. Please note, a great, and VIP usage.\n\nLet us know if you'd like us to reserve any for you.",
      time: "10:34 AM",
    },
    {
      id: 3,
      sender: "user",
      text: "Great! Please reserve 2 VIP tickets for me.\n\nI'll wait for payment info.",
      time: "10:36 AM",
    },
    {
      id: 4,
      sender: "admin",
      text: "Awesome! 👍",
      time: "10:37 AM",
    },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "user",
      text: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#f5f7f3] px-4 py-5 md:px-6">
      {/* HEADER */}
      <div className="mb-5">
        <p className="text-[10px] text-gray-400">
          Home &gt; Organizer &gt; Messages
        </p>

        <div className="mt-1 flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-900">
            Messages & Support
          </h1>

          <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[9px] text-gray-600">
            12
          </span>
        </div>

        <p className="mt-1 text-xs text-gray-500">
          Communicate with attendees and get support.
        </p>
      </div>

      {/* TABS */}
      <div className="mb-4 flex items-center gap-5 border-b border-gray-200">
        <button className="relative flex items-center gap-1 pb-2 text-[11px] font-medium text-gray-900">
          Inbox
          <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>

          <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-gray-900" />
        </button>

        <button className="pb-2 text-[11px] text-gray-500">
          Support
        </button>

        <button className="pb-2 text-[11px] text-gray-500">
          Archive
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="mb-3 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400" />

          <input
            type="text"
            placeholder="Search messages..."
            className="h-8 w-full rounded-md border border-gray-200 bg-white pl-8 pr-3 text-[10px] outline-none placeholder:text-gray-400 focus:border-gray-300"
          />
        </div>

        <button className="flex h-8 items-center justify-between gap-3 rounded-md border border-gray-200 bg-white px-3 text-[10px] text-gray-600">
          All Conversations
          <IoChevronDownOutline className="text-xs" />
        </button>
      </div>

      {/* MAIN MESSAGES AREA */}
      <div className="grid min-h-[620px] grid-cols-1 gap-3 md:grid-cols-[280px_1fr]">
        
        {/* LEFT CONVERSATION LIST */}
        <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
          <div className="divide-y divide-gray-100">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedChat(conversation)}
                className={`flex w-full items-start gap-2 px-3 py-3 text-left transition ${
                  selectedChat.id === conversation.id
                    ? "bg-[#f2f8f1]"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {/* AVATAR */}
                <div className="relative shrink-0">
                  <img
                    src={conversation.avatar}
                    alt={conversation.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />

                  {conversation.status === "online" && (
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-white bg-green-500" />
                  )}
                </div>

                {/* CONTENT */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate text-[10px] font-semibold text-gray-900">
                      {conversation.name}
                    </h3>

                    <span className="shrink-0 text-[8px] text-gray-400">
                      {conversation.time}
                    </span>
                  </div>

                  <p className="truncate text-[9px] font-medium text-gray-600">
                    {conversation.role}
                  </p>

                  <div className="mt-0.5 flex items-center justify-between gap-2">
                    <p className="truncate text-[8px] text-gray-400">
                      {conversation.message}
                    </p>

                    {conversation.unread && (
                      <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-orange-500 text-[7px] text-white">
                        1
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* CHAT PANEL */}
        <div className="flex min-h-0 flex-col overflow-hidden rounded-md border border-gray-200 bg-white">
          
          {/* CHAT HEADER */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <img
                  src={selectedChat.avatar}
                  alt={selectedChat.name}
                  className="h-8 w-8 rounded-full object-cover"
                />

                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-white bg-green-500" />
              </div>

              <div>
                <h2 className="text-[11px] font-semibold text-gray-900">
                  {selectedChat.name}
                </h2>

                <p className="text-[8px] text-gray-400">
                  {selectedChat.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="rounded-md border border-gray-300 px-3 py-1 text-[8px] font-medium text-green-700 hover:bg-green-50">
                Mark as Read
              </button>

              <button className="text-gray-400 hover:text-gray-700">
                <IoEllipsisVertical className="text-sm" />
              </button>
            </div>
          </div>

          {/* CHAT BODY */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-[#fcfdfb] p-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user"
                    ? "justify-start"
                    : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-3 py-2 ${
                    msg.sender === "user"
                      ? "rounded-tl-none border border-gray-200 bg-white"
                      : "rounded-tr-none bg-[#e5f1e3]"
                  }`}
                >
                  <p className="whitespace-pre-line text-[10px] leading-5 text-gray-700">
                    {msg.text}
                  </p>

                  <div
                    className={`mt-1 flex items-center gap-1 ${
                      msg.sender === "admin"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <span className="text-[7px] text-gray-400">
                      {msg.time}
                    </span>

                    {msg.sender === "admin" && (
                      <IoCheckmarkDoneOutline className="text-[10px] text-green-600" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* MESSAGE INPUT */}
          <div className="border-t border-gray-200 bg-white p-3">
            <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder="Type your message..."
                className="h-9 flex-1 bg-transparent text-[10px] outline-none placeholder:text-gray-400"
              />

              <button className="text-gray-400 hover:text-gray-700">
                <IoAttachOutline className="text-sm" />
              </button>

              <button className="text-gray-400 hover:text-gray-700">
                <IoHappyOutline className="text-sm" />
              </button>

              <button
                onClick={sendMessage}
                className="flex items-center gap-1 rounded-md bg-[#37763c] px-3 py-1.5 text-[9px] font-medium text-white hover:bg-[#2e6633]"
              >
                Send
                <IoSendOutline className="text-[10px]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SUPPORT FLOATING ICON */}
      <button className="fixed bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#37763c] text-white shadow-lg">
        <LuCircleHelp className="text-lg" />
      </button>
    </div>
  );
};

export default Messages;