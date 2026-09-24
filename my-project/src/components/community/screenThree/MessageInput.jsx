import React, { useState } from "react";
import { Paperclip, Smile, Send } from "lucide-react";

const MessageInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-200">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Type your message..."
        className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#3F783D]"
      />

      <button className="text-gray-400 hover:text-gray-600">
        <Paperclip className="w-5 h-5" />
      </button>

      <button className="text-gray-400 hover:text-gray-600">
        <Smile className="w-5 h-5" />
      </button>

      <button
        onClick={handleSend}
        className="bg-[#3F783D] hover:bg-[#356433] text-white font-semibold px-5 py-2.5 rounded-lg transition"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
