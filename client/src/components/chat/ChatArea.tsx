import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Paperclip, Send, ArrowLeft, Loader2 } from "lucide-react";
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

  const { authUser, onlineUsers, socket } = useAuth();

  const [inputValue, setInputValue] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isRecipientTyping, setIsRecipientTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch messages when user changes
  useEffect(() => {
    if (selectedUser) {
      getMessegesforselected(selectedUser._id);
      setunseenMessages(prev => ({ ...(prev || {}), [selectedUser._id]: 0 }));
    }
  }, [selectedUser]);

  // Real-time Typing Handlers via Socket
  useEffect(() => {
    if (!socket || !selectedUser) return;

    const handleTypingEvent = (data: { senderId: string }) => {
      if (data.senderId === selectedUser._id) {
        setIsRecipientTyping(true);
      }
    };

    const handleStopTypingEvent = (data: { senderId: string }) => {
      if (data.senderId === selectedUser._id) {
        setIsRecipientTyping(false);
      }
    };

    socket.on("typing", handleTypingEvent);
    socket.on("typing_stopped", handleStopTypingEvent);

    // Reset local typing indicator state on selectedUser switch
    setIsRecipientTyping(false);
    setIsTyping(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    return () => {
      socket.off("typing", handleTypingEvent);
      socket.off("typing_stopped", handleStopTypingEvent);
    };
  }, [socket, selectedUser]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isRecipientTyping, isUploading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    if (!socket || !selectedUser) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", { receiverId: selectedUser._id });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { receiverId: selectedUser._id });
      setIsTyping(false);
    }, 2000);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    if (socket && selectedUser) {
      socket.emit("stop_typing", { receiverId: selectedUser._id });
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setIsTyping(false);

    await sendMessage({ text: inputValue.trim() });
    setInputValue("");
  };

  const handleImageSend = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = async () => {
      if (typeof reader.result === "string") {
        try {
          setIsUploading(true);
          
          if (socket && selectedUser) {
            socket.emit("stop_typing", { receiverId: selectedUser._id });
          }
          setIsTyping(false);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

          await sendMessage({ image: reader.result });
        } catch (error) {
          console.error("Image upload failed:", error);
        } finally {
          setIsUploading(false);
        }
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

        {/* Recipient Typing Animation */}
        {isRecipientTyping && (
          <div className="flex items-start gap-3 mb-2 animate-fade-in">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img
                src={selectedUser.profilePic || "/avatar_icon.png"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        {/* Sender Uploading Image Loader */}
        {isUploading && (
          <div className="flex justify-end mb-2">
            <div className="bg-yellow-400/10 text-yellow-400 max-w-[75%] rounded-2xl px-4 py-2.5 border border-yellow-400/25 text-sm flex items-center gap-2.5 shadow-md shadow-yellow-400/5 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />
              <span>Uploading image...</span>
            </div>
          </div>
        )}

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
          onChange={handleInputChange}
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
