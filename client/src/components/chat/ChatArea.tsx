import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Paperclip, Send, ArrowLeft } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { useMessage } from "@/context/useMessage";
import { useAuth } from "@/context/useAuth";

interface ChatAreaProps {
  onBack?: () => void;
  onToggleProfile?: () => void;
  showBackButton?: boolean;
}

export function ChatArea({ onBack, onToggleProfile, showBackButton }: ChatAreaProps) {
  const {
    messages,
    selectedUser,
    getMessegesforselected,
    sendMessage,
    setunseenMessages,
  } = useMessage();

  const { authUser, onlineUsers } = useAuth();

  const [inputValue, setInputValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages when user changes
  useEffect(() => {
    if (selectedUser) {
      getMessegesforselected(selectedUser._id);
      setunseenMessages(prev => ({ ...(prev || {}), [selectedUser._id]: 0 }));
    }
  }, [selectedUser]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    await sendMessage({ text: inputValue.trim() });
    setInputValue("");
  };

  const handleImageSend = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === "string") {
        await sendMessage({ image: reader.result });
      }
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  if (!selectedUser) return null;

  return (
    <motion.div
      key={selectedUser._id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col bg-background"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle">
        {showBackButton && (
          <button onClick={onBack} className="p-2 rounded-lg hover:bg-background-hover">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <button onClick={onToggleProfile} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={selectedUser.profilePic || "/avatar_icon.png"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col items-start">
            <h2 className="text-sm font-medium">{selectedUser.fullName}</h2>
            <p className="text-xs text-foreground-subtle">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        <AnimatePresence>
          {messages.map((msg) => (
            <MessageBubble
              key={msg._id}
              content={msg.text}
              image={msg.image}
              isSender={msg.senderId === authUser?._id}
              seen={msg.seen}
            />
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border-subtle flex items-center gap-2">
        <input
          type="file"
          hidden
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageSend}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-xl hover:bg-background-hover"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-xl bg-background-panel"
        />

        <button
          onClick={handleSend}
          className="p-2 rounded-xl bg-primary text-white"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
