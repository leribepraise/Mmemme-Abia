import { useEffect, useMemo, useRef, useState } from "react";
import {
  IoAttachOutline,
  IoCheckmarkDoneOutline,
  IoChevronDownOutline,
  IoEllipsisVertical,
  IoHappyOutline,
  IoSearchOutline,
  IoSendOutline,
} from "react-icons/io5";
import OrganizerShell from "@/components/organizer/OrganizerPublicShell";
import { load, save } from "@/lib/utils";

const initialConversations = [
  {
    id: "chidinma",
    name: "Chidinma Okafor",
    role: "Inquiry about Shore Bango Concert",
    message: "Hello, I want to know if VIP tickets are still available",
    time: "2m ago",
    initials: "CO",
    avatarTone: "bg-[#1f2b26]",
    unread: true,
    status: "online",
    body: "Hello,\n\nI want to know if VIP tickets are still available for the Shore Live Concert.\n\nAlso, do they include front row seats?\n\nThanks.",
  },
  {
    id: "tosin",
    name: "Tosin Adewale",
    role: "Group Booking Request",
    message: "Good day, we are interested in booking 15 tickets...",
    time: "1h ago",
    initials: "TA",
    avatarTone: "bg-[#77533e]",
    unread: true,
    status: "offline",
    body: "Good day, we are interested in booking 15 tickets for the concert. Please share the group booking details.",
  },
  {
    id: "emeka",
    name: "Emeka Nwosu",
    role: "Refund Request",
    message: "I was unable to attend the event due to...",
    time: "3h ago",
    initials: "EN",
    avatarTone: "bg-[#30414a]",
    unread: true,
    status: "offline",
    body: "I was unable to attend the event due to an emergency. Please let me know how I can request a refund.",
  },
  {
    id: "peace",
    name: "Peace Umeh",
    role: "Event Location",
    message: "Please can you share the exact location...",
    time: "Yesterday",
    initials: "PU",
    avatarTone: "bg-[#43849c]",
    unread: false,
    status: "offline",
    body: "Please can you share the exact location for the event?",
  },
  {
    id: "daniel",
    name: "Daniel Onyema",
    role: "Sponsorship Opportunity",
    message: "We would love to partner with you for our...",
    time: "Yesterday",
    initials: "DO",
    avatarTone: "bg-[#6b4130]",
    unread: false,
    status: "offline",
    body: "We would love to partner with you for our next event. Who should we speak with about sponsorship?",
  },
];

const starterThread = (conversation) => [
  { id: `${conversation.id}-1`, sender: "user", text: conversation.body, time: "Today 10:20 AM" },
  ...(conversation.id === "chidinma"
    ? [
        {
          id: `${conversation.id}-2`,
          sender: "admin",
          text: "Hello Chidinma,\n\nThanks for reaching out.\n\nYes, VIP tickets are still available and they include front row access, meet & greet, and VIP lounge.\n\nLet us know if you'd like us to reserve any for you.",
          time: "10:25 AM",
        },
        {
          id: `${conversation.id}-3`,
          sender: "user",
          text: "Great! Please reserve 2 VIP tickets for me.\n\nI will make payment now.",
          time: "10:38 AM",
        },
        { id: `${conversation.id}-4`, sender: "admin", text: "Awesome!", time: "10:41 AM" },
      ]
    : []),
];

function Avatar({ conversation, small = false }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${conversation.avatarTone} ${small ? "h-10 w-10 text-[11px]" : "h-11 w-11 text-xs"}`}
      aria-label={conversation.name}
      data-testid={`avatar-message-${conversation.id}`}
    >
      {conversation.initials}
    </div>
  );
}

export default function OrganizerMessages() {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState(initialConversations[0].id);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Inbox");
  const [savedThreads, setSavedThreads] = useState(() => load("mmemme-message-threads", {}));
  const [thread, setThread] = useState(() => {
    const stored = load("mmemme-message-threads", {});
    return stored[initialConversations[0].id] || starterThread(initialConversations[0]);
  });
  const fileInputRef = useRef(null);

  const selectedChat = conversations.find((conversation) => conversation.id === selectedId) || conversations[0];
  const visibleConversations = useMemo(() => {
    const query = search.trim().toLowerCase();
    return conversations.filter((conversation) => {
      if (activeTab === "Archive") return false;
      if (activeTab === "Support") return conversation.id === "emeka";
      return !query || `${conversation.name} ${conversation.role} ${conversation.message}`.toLowerCase().includes(query);
    });
  }, [activeTab, conversations, search]);

  useEffect(() => {
    const stored = savedThreads[selectedId];
    setThread(stored || starterThread(selectedChat));
  }, [savedThreads, selectedChat, selectedId]);

  const selectConversation = (conversation) => {
    setSelectedId(conversation.id);
    setConversations((current) => current.map((item) => item.id === conversation.id ? { ...item, unread: false } : item));
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    const nextThread = [
      ...thread,
      {
        id: `${selectedId}-${Date.now()}`,
        sender: "admin",
        text: message.trim(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];
    const nextThreads = { ...savedThreads, [selectedId]: nextThread };
    setThread(nextThread);
    setSavedThreads(nextThreads);
    save("mmemme-message-threads", nextThreads);
    setMessage("");
  };

  const markAsRead = () => {
    setConversations((current) => current.map((item) => item.id === selectedId ? { ...item, unread: false } : item));
  };

  const handleAttachment = (event) => {
    const fileName = event.target.files?.[0]?.name;
    if (fileName) setMessage((current) => `${current}${current ? " " : ""}[Attached: ${fileName}]`);
    event.target.value = "";
  };

  return (
    <div className="pt-24">
      <OrganizerShell
        breadcrumb={["Home", "Organizer", "Messages"]}
        title="Messages & Support"
        subtitle="Communicate with attendees and get support."
      >
        <div className="flex items-center gap-6 border-b border-[#e5e9e3] pb-1" role="tablist" aria-label="Message folders">
          {[
            { label: "Inbox", count: conversations.filter((conversation) => conversation.unread).length },
            { label: "Support", count: 1 },
            { label: "Archive", count: null },
          ].map((tab) => (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.label}
              onClick={() => setActiveTab(tab.label)}
              data-testid={`tab-messages-${tab.label.toLowerCase()}`}
              className={`relative flex items-center gap-2 pb-3 text-sm ${activeTab === tab.label ? "font-bold text-[#17221d]" : "font-medium text-[#7c827e]"}`}
            >
              {tab.label}
              {tab.count !== null && <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black ${activeTab === tab.label ? "bg-[#ee6e35] text-white" : "bg-[#e8ebe7] text-[#727873]"}`}>{tab.count}</span>}
              {activeTab === tab.label && <span className="absolute bottom-0 left-0 h-[2.5px] w-full rounded-full bg-[#3f7d3d]" />}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row mt-4">
          <label className="relative flex-1">
            <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-[#a1a7a2]" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search messages..."
              aria-label="Search messages"
              data-testid="input-search-messages"
              className="h-11 w-full rounded-xl border border-[#dfe5df] bg-white pl-10 pr-4 text-sm outline-none placeholder:text-[#a1a7a2] focus:border-[#3f7d3d]"
            />
          </label>
          <button type="button" onClick={() => setSearch("")} data-testid="button-filter-conversations" className="flex h-11 items-center justify-between gap-4 rounded-xl border border-[#dfe5df] bg-white px-4 text-sm font-bold text-[#68706a]">
            All Conversations <IoChevronDownOutline />
          </button>
        </div>

        <div className="grid min-h-[700px] grid-cols-1 gap-5 md:grid-cols-[340px_1fr] mt-4">
          <div className="overflow-hidden rounded-xl border border-[#e5ebe5] bg-white shadow-[0_2px_6px_rgba(35,58,40,.04)]">
            <div className="divide-y divide-[#f0f2ef]">
              {visibleConversations.length ? visibleConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => selectConversation(conversation)}
                  data-testid={`button-message-${conversation.id}`}
                  className={`flex w-full items-start gap-3.5 border-l-[4px] px-4 py-4 text-left transition ${selectedId === conversation.id ? "border-[#ee6e35] bg-[#f0faf1]" : "border-transparent bg-white hover:bg-[#fafcf9]"}`}
                >
                  <div className="relative">
                    <Avatar conversation={conversation} />
                    {conversation.status === "online" && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#4d9b54]" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="truncate text-sm font-bold text-[#17221d]">{conversation.name}</h3>
                      <span className="shrink-0 text-xs text-[#929892]">{conversation.time}</span>
                    </div>
                    <p className="truncate text-xs font-semibold text-[#414a44] mt-0.5">{conversation.role}</p>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p className="truncate text-xs text-[#8a918b]">{conversation.message}</p>
                      {conversation.unread && <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ee6e35] text-[10px] font-bold text-white">1</span>}
                    </div>
                  </div>
                </button>
              )) : (
                <div className="p-12 text-center text-sm text-[#89918a]">No conversations found.</div>
              )}
            </div>
          </div>

          <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#e5ebe5] bg-white shadow-[0_2px_6px_rgba(35,58,40,.04)]">
            <div className="flex items-center justify-between border-b border-[#edf0ed] px-5 py-4">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <Avatar conversation={selectedChat} />
                  {selectedChat.status === "online" && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#4d9b54]" />}
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#17221d]">{selectedChat.name}</h2>
                  <p className="text-xs text-[#929892]">{selectedChat.name.toLowerCase().replace(" ", ".")}@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={markAsRead} data-testid="button-mark-as-read" className="rounded-lg border border-[#9ab19b] px-3.5 py-2 text-xs font-bold text-[#3f7d3d] hover:bg-[#f0faf1]">Mark as Read</button>
                <button type="button" onClick={() => setSearch("")} aria-label="More conversation options" data-testid="button-message-options" className="text-lg text-[#9da59e] hover:text-[#536057]"><IoEllipsisVertical /></button>
              </div>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto bg-[#fbfcfb] p-6">
              {thread.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[78%] rounded-2xl px-4.5 py-3.5 ${msg.sender === "user" ? "rounded-tl-none border border-[#edf0ed] bg-white shadow-[0_1px_3px_rgba(35,58,40,.03)]" : "rounded-tr-none bg-[#eaf5ea]"}`}>
                    <p className="whitespace-pre-line text-sm leading-6 text-[#344139]">{msg.text}</p>
                    <div className={`mt-1.5 flex items-center gap-1.5 ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
                      <span className="text-[10px] text-[#a0a8a0]">{msg.time}</span>
                      {msg.sender === "admin" && <IoCheckmarkDoneOutline className="text-sm text-[#4e9453]" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#edf0ed] bg-white p-3.5">
              <div className="flex items-center gap-3 rounded-xl border border-[#dfe5df] bg-white px-4 py-1">
                <input
                  type="text"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  onKeyDown={(event) => { if (event.key === "Enter") sendMessage(); }}
                  placeholder="Type your message..."
                  aria-label="Type your message"
                  data-testid="input-message-compose"
                  className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-[#a1a7a2]"
                />
                <input ref={fileInputRef} type="file" onChange={handleAttachment} className="hidden" aria-label="Attach a file" />
                <button type="button" onClick={() => fileInputRef.current?.click()} aria-label="Attach a file" data-testid="button-attach-message" className="text-xl text-[#a0a8a0] hover:text-[#56615a]"><IoAttachOutline /></button>
                <button type="button" onClick={() => setMessage((current) => `${current}${current ? " " : ""}Thanks for the update.`)} aria-label="Add a helpful reply" data-testid="button-helpful-reply" className="text-xl text-[#a0a8a0] hover:text-[#56615a]"><IoHappyOutline /></button>
                <button type="button" onClick={sendMessage} data-testid="button-send-message" className="flex items-center gap-2 rounded-xl bg-[#3f7d3d] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#336633]">Send <IoSendOutline /></button>
              </div>
            </div>
          </div>
        </div>
      </OrganizerShell>
    </div>
  );
}