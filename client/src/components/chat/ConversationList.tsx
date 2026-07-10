import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Settings, Plus, User, LogOut } from "lucide-react";
import { ConversationItem } from "./ConversationItem";
import { useMessage } from "@/context/useMessage";
import { useAuth } from "@/context/useAuth";
import { useNavigate } from "react-router-dom";

interface ConversationListProps {
  activeId: string;
  onSelect: (id: string) => void;
  onEditProfile?: () => void;
  onLogout?: () => void;
}

export function ConversationList({
  activeId,
  onSelect,
  onEditProfile,
  onLogout,
}: ConversationListProps) {
  const {
    Users,
    selectedUser,
    setselectedUser,
    getUsers,
    unseenMessages,
    setunseenMessages,
  } = useMessage();
  
  const { onlineUsers, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    getUsers();
    function handleClickOutside(event: MouseEvent) {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setShowSettingsMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredUsers = Users.filter((u) =>
    u.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-full flex flex-col bg-background-elevated border-r border-border-subtle"
    >
      {/* Header */}
      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 safe-area-top">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-lg sm:text-xl font-semibold text-foreground">
            Messages
          </h1>
          <div className="flex items-center gap-1 sm:gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 sm:p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-hover transition-all"
            >
              <Plus className="w-5 h-5" />
            </motion.button>

            <div ref={settingsRef} className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="p-2.5 sm:p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-hover transition-all"
              >
                <Settings className="w-5 h-5" />
              </motion.button>

              <AnimatePresence>
                {showSettingsMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 glass-panel rounded-2xl shadow-gold-subtle overflow-hidden z-50 border border-primary/10 p-1"
                  >
                    {/* Edit Profile */}
                    <motion.button
                      whileHover={{ backgroundColor: "hsl(var(--background-hover))" }}
                      onClick={() => {
                        setShowSettingsMenu(false);
                        if (onEditProfile) onEditProfile();
                        navigate("/profile");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground-muted hover:text-foreground rounded-xl transition-colors"
                    >
                      <User className="w-4 h-4 text-primary" />
                      Edit Profile
                    </motion.button>

                    <div className="h-px bg-border-subtle my-1" />

                    {/* Logout */}
                    <motion.button
                      whileHover={{ backgroundColor: "hsl(var(--background-hover))" }}
                      onClick={() => {
                        setShowSettingsMenu(false);
                        if (onLogout) onLogout();
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2.5 bg-background-panel rounded-xl text-sm text-foreground placeholder:text-foreground-subtle border border-border-subtle focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-1 safe-area-bottom scrollbar-themed">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-foreground-subtle">
            <p className="text-sm">No conversations found</p>
          </div>
        ) : (
          filteredUsers.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <ConversationItem
                id={user._id}
                name={user.fullName}
                profilePic={user.profilePic}
                online={onlineUsers.includes(user._id)}
                unread={unseenMessages?.[user._id] || 0}
                isActive={activeId === user._id}
                onClick={() => {
                  setselectedUser(user);
                  setunseenMessages(prev => ({ ...(prev || {}), [user._id]: 0 }));
                }}
              />
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
