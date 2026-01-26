import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ConversationItemProps {
  id: string;
  name: string;
  profilePic?: string | null;

  unread: number;
  online: boolean;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationItem({
  name,
  profilePic,

  unread,
  online,
  isActive,
  onClick,
}: ConversationItemProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ backgroundColor: "hsl(0 0% 8%)" }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group",
        isActive && "bg-background-hover",
      )}
    >
      {/* Active indicator */}
      <motion.div
        initial={false}
        animate={{
          scaleY: isActive ? 1 : 0,
          opacity: isActive ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-primary rounded-full"
      />

      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className={cn(
            "w-11 h-11 rounded-full overflow-hidden ring-2 ring-offset-2 ring-offset-background transition-all",
            online ? "ring-primary" : "ring-transparent",
            isActive && "ring-primary/50",
          )}
        >
          <img
            src={profilePic?.trim() ? profilePic : "/avatar_icon.png"}
            alt={name}
            className="w-full h-full object-contain bg-black"

          />
        </div>

      </div>

      {/* Name + Last message / Status */}
{/* Name + Status + Last message */}
<div className="flex-1 min-w-0 text-left">
  <p
    className={cn(
      "font-medium text-sm truncate",
      isActive ? "text-foreground" : "text-foreground-muted",
    )}
  >
    {name}
  </p>

  <p
    className={cn(
      "text-xs truncate",
      online ? "text-green-500" : "text-foreground-subtle"
    )}
  >
    {online ? "Online" : "Offline"}
  </p>


</div>


      {/* Unread badge */}
      {unread > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex-shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
        >
          <span className="text-[10px] font-semibold text-primary-foreground">
            {unread > 9 ? "9+" : unread}
          </span>
        </motion.div>
      )}

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-primary/5 to-transparent" />
    </motion.button>
  );
}
