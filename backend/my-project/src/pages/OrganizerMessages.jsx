import { useState } from "react";
import {
  IoSearchOutline,
  IoChevronDownOutline,
  IoSendOutline,
  IoAttachOutline,
  IoHappyOutline,
  IoEllipsisVertical,
  IoCheckmarkDoneOutline,
} from "react-icons/io5";
import OrganizerShell from "@/components/organizer/OrganizerPublicShell";
import { seedMessages } from "@/data/organizerData";

const conversations = seedMessages.map((m, i) => ({
  id: m.id,
  name: m.sender,
  role: m.subject,
  message: m.preview,
  time: m.time,
  avatar: `https://i.pravatar.cc/100?img=${[47, 12, 11, 32][i % 4]}`,
  unread: m.unread,
  status: i % 2 === 0 ? "online" : "offline",
  body: m.body,
}));

export default function OrganizerMessages() {
  const [selectedChat, setSelectedChat] = useState(conversations[0]);
  const [message, setMessage] = useState("");
  const [thread, setThread] = useState([
    { id: 1, sender: "user", text: selectedChat?.body || "", time: "10:32 AM" },
    { id: 2, sender: "admin", text: "Thanks for reaching out — we'll get back to you shortly with the details.", time: "10:34 AM" },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setThread(prev => [...prev, { id: Date.now(), sender: "user", text: message, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setMessage("");
  };

  return (
    <OrganizerShell breadcrumb={["Home", "Organizer", "Messages"]} title="Messages & Support" subtitle="Communicate with attendees and get support.">
      <div className="flex items-center gap-5 border-b border-gray-200">
        <button className="relative flex items-center gap-1.5 pb-2.5 text-xs font-bold text-gray-900">
          Inbox
          <span className="bg-orange-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
            {conversations.filter(c => c.unread).length}
          </span>
          <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[#3F7D3D]" />
        </button>
        <button className="flex items-center gap-1.5 pb-2.5 text-xs font-medium text-gray-500">
          Support
          <span className="bg-gray-200 text-gray-600 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">1</span>
        </button>
        <button className="pb-2.5 text-xs font-medium text-gray-500">Archive</button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400" />
          <input type="text" placeholder="Search messages..." className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-xs outline-none placeholder:text-gray-400 focus:border-[#3F7D3D]" data-testid="input-search-messages" />
        </div>
        <button className="flex h-9 items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 text-xs font-bold text-gray-600">
          All Conversations <IoChevronDownOutline />
        </button>
      </div>

      <div className="grid min-h-[560px] grid-cols-1 gap-4 md:grid-cols-[300px_1fr]">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="divide-y divide-gray-50">
            {conversations.map(conversation => (
              <button
                key={conversation.id}
                onClick={() => { setSelectedChat(conversation); setThread([{ id: 1, sender: "user", text: conversation.body, time: "10:32 AM" }]); }}
                className={`flex w-full items-start gap-2.5 px-4 py-3.5 text-left transition ${selectedChat?.id === conversation.id ? "bg-[#EAF5EA]" : "bg-white hover:bg-gray-50"}`}
                data-testid={`button-message-${conversation.id}`}
              >
                <div className="relative shrink-0">
                  <img src={conversation.avatar} alt={conversation.name} className="h-9 w-9 rounded-full object-cover" />
                  {conversation.status === "online" && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate text-xs font-bold text-gray-900">{conversation.name}</h3>
                    <span className="shrink-0 text-[10px] text-gray-400">{conversation.time}</span>
                  </div>
                  <p className="truncate text-[11px] font-medium text-gray-600">{conversation.role}</p>
                  <div className="mt-0.5 flex items-center justify-between gap-2">
                    <p className="truncate text-[10px] text-gray-400">{conversation.message}</p>
                    {conversation.unread && <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-orange-500 text-[8px] font-bold text-white">1</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={selectedChat?.avatar} alt={selectedChat?.name} className="h-9 w-9 rounded-full object-cover" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">{selectedChat?.name}</h2>
                <p className="text-[10px] text-gray-400">{selectedChat?.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-[10px] font-bold text-[#3F7D3D] hover:bg-[#EAF5EA]" data-testid="button-mark-as-read">
                Mark as Read
              </button>
              <button className="text-gray-400 hover:text-gray-700"><IoEllipsisVertical /></button>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50/50 p-5">
            {thread.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${msg.sender === "user" ? "rounded-tl-none border border-gray-100 bg-white" : "rounded-tr-none bg-[#EAF5EA]"}`}>
                  <p className="whitespace-pre-line text-xs leading-5 text-gray-700">{msg.text}</p>
                  <div className={`mt-1 flex items-center gap-1 ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
                    <span className="text-[9px] text-gray-400">{msg.time}</span>
                    {msg.sender === "admin" && <IoCheckmarkDoneOutline className="text-xs text-green-600" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 bg-white p-3">
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3">
              <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
                placeholder="Type your message..."
                className="h-10 flex-1 bg-transparent text-xs outline-none placeholder:text-gray-400"
                data-testid="input-message-compose"
              />
              <button className="text-gray-400 hover:text-gray-700"><IoAttachOutline /></button>
              <button className="text-gray-400 hover:text-gray-700"><IoHappyOutline /></button>
              <button onClick={sendMessage} className="flex items-center gap-1.5 rounded-lg bg-[#3F7D3D] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#336633]" data-testid="button-send-message">
                Send <IoSendOutline />
              </button>
            </div>
          </div>
        </div>
      </div>
    </OrganizerShell>
  );
}
