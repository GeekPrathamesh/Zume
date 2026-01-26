import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, LogOut } from "lucide-react";
import { useAuth } from "@/context/useAuth";
import { useMessage } from "@/context/useMessage";

interface ProfilePanelProps {
  user: {
    _id: string;
    fullName: string;
    email?: string;
    bio?: string;
    profilePic?: string;
  };
  onClose: () => void;
}

export function ProfilePanel({ user, onClose }: ProfilePanelProps) {
  const { onlineUsers } = useAuth();
  const { messages } = useMessage();
  const [media, setMedia] = useState<string[]>([]);

  const isOnline = onlineUsers.includes(user._id);

  // collect all images from chat
  useEffect(() => {
    const imgs = messages.filter(m => m.image).map(m => m.image as string);
    setMedia(imgs);
  }, [messages]);

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 20, opacity: 0 }}
      className="h-full flex flex-col bg-background-elevated border-l border-border-subtle"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-subtle">
        <h3 className="font-medium">Profile</h3>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-background-hover">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User Info */}
      <div className="flex flex-col items-center text-center p-6">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-background-panel mb-3">
          <img
            src={user.profilePic || "/avatar_icon.png"}
            className="w-full h-full object-cover"
            alt="avatar"
          />
        </div>

        <h2 className="text-lg font-semibold flex items-center gap-2">
          {isOnline && <span className="w-2 h-2 bg-green-500 rounded-full" />}
          {user.fullName}
        </h2>

        <p className="text-sm text-foreground-subtle">{user.bio}</p>
      </div>

      {/* Media Section */}
      <div className="px-4">
        <p className="text-xs mb-2 text-foreground-muted">Media</p>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
          {media.map((img, i) => (
            <img
              key={i}
              src={img}
              onClick={() => window.open(img)}
              className="rounded-md cursor-pointer object-cover"
            />
          ))}
        </div>
      </div>

      {/* Footer */}
     
    </motion.div>
  );
}
