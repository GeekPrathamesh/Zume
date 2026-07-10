import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ConversationList } from "./ConversationList";
import { ChatArea } from "./ChatArea";
import { ProfilePanel } from "./ProfilePanel";
import { PanelRightClose, PanelRightOpen, MessageSquare, LogOut, User as UserIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMessage } from "@/context/useMessage";
import { useAuth } from "@/context/useAuth";
import { useNavigate } from "react-router-dom";

interface ChatLayoutProps {
  onEditProfile?: () => void;
  onLogout?: () => void;
}

export function ChatLayout({ onEditProfile, onLogout }: ChatLayoutProps) {
  const {
    Users,
    selectedUser,
    setselectedUser,
  } = useMessage();
  const { authUser, logout } = useAuth();
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);
  const [showUserMenuMobile, setShowUserMenuMobile] = useState(false);
  const [showUserMenuDesktop, setShowUserMenuDesktop] = useState(false);
  
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  
  const isMobile = useIsMobile();

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowUserMenuMobile(false);
      }
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(event.target as Node)) {
        setShowUserMenuDesktop(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectConversation = (userId: string) => {
    const user = Users.find((u) => u._id === userId) || null;
    setselectedUser(user);
    if (isMobile) setShowProfile(false);
  };

  const handleBack = () => {
    setselectedUser(null);
    setShowProfile(false);
  };

  const renderUserDropdown = (showMenu: boolean, setShowMenu: (val: boolean) => void, ref: React.RefObject<HTMLDivElement>) => (
    <div ref={ref} className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center focus:outline-none transition-transform active:scale-95"
      >
        <img
          src={authUser?.profilePic || "/avatar_icon.png"}
          className="w-9 h-9 ring-2 ring-yellow-400/30 hover:ring-yellow-400/60 rounded-full object-cover"
          alt="User Profile"
        />
      </button>
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 glass-panel rounded-2xl shadow-gold-subtle p-2 z-50 overflow-hidden border border-primary/10"
          >
            <div className="px-4 py-3 border-b border-border-subtle bg-background/50">
              <p className="text-[10px] font-semibold text-primary tracking-widest uppercase mb-1">Signed in as</p>
              <p className="text-sm font-semibold text-foreground truncate">{authUser?.fullName}</p>
              <p className="text-xs text-foreground-muted truncate mt-0.5">{authUser?.email}</p>
            </div>
            
            <div className="p-1 space-y-0.5">
              <button
                onClick={() => {
                  setShowMenu(false);
                  if (onEditProfile) onEditProfile();
                  navigate("/profile");
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground-muted hover:text-foreground hover:bg-background-hover rounded-xl transition-colors"
              >
                <UserIcon className="w-4 h-4 text-primary" />
                Edit Profile
              </button>

              <div className="h-px bg-border-subtle my-1" />

              <button
                onClick={() => {
                  setShowMenu(false);
                  if (onLogout) onLogout();
                  logout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // ================= MOBILE =================
  if (isMobile) {
    return (
      <div className="h-[100dvh] w-full flex flex-col bg-background overflow-hidden">
        {/* Top Bar */}
        <div className="h-14 px-4 flex items-center justify-between border-b bg-background/90 backdrop-blur-md sticky top-0 z-30">
          <h1 className="text-lg font-semibold tracking-wide">LumoChat</h1>
          {renderUserDropdown(showUserMenuMobile, setShowUserMenuMobile, mobileMenuRef)}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {!selectedUser ? (
              <motion.div
                key="conversations"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <ConversationList
                  activeId=""
                  onSelect={handleSelectConversation}
                  onEditProfile={onEditProfile}
                  onLogout={onLogout}
                />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full relative"
              >
                <ChatArea
                  onBack={handleBack}
                  onToggleProfile={() => setShowProfile(!showProfile)}
                  showBackButton
                />

                <AnimatePresence>
                  {showProfile && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowProfile(false)}
                        className="absolute inset-0 bg-black/60 z-20"
                      />
                      <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                        className="absolute inset-y-0 right-0 w-full max-w-[320px] z-30"
                      >
                        <ProfilePanel
                          user={selectedUser}
                          onClose={() => setShowProfile(false)}
                        />
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // ================= DESKTOP =================
  return (
    <div className="h-[100dvh] w-full flex flex-col bg-background">
      {/* Top Header */}
      <div className="relative z-30 h-14 px-6 flex items-center justify-between border-b bg-background/80 backdrop-blur-md">
        <h1 className="text-lg font-semibold tracking-wide">LumoChat</h1>
        {renderUserDropdown(showUserMenuDesktop, setShowUserMenuDesktop, desktopMenuRef)}
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Conversation List */}
        <div className="w-72 lg:w-[25%] flex-shrink-0 border-r">
          <ConversationList
            activeId={selectedUser?._id || ""}
            onSelect={handleSelectConversation}
            onEditProfile={onEditProfile}
            onLogout={onLogout}
          />
        </div>

        {/* Chat Area */}
        <div className="flex-1 relative">
          {selectedUser ? (
            <>
              <ChatArea
                onToggleProfile={() => setShowProfile(!showProfile)}
              />
              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    className="absolute inset-y-0 right-0 w-[320px] border-l bg-background z-20"
                  >
                    <ProfilePanel
                      user={selectedUser}
                      onClose={() => setShowProfile(false)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfile(!showProfile)}
                className="absolute top-4 right-4 p-2.5 rounded-xl bg-background-panel text-foreground-muted hover:text-foreground hover:bg-background-hover transition-all z-10"
              >
                {showProfile ? (
                  <PanelRightClose className="w-5 h-5" />
                ) : (
                  <PanelRightOpen className="w-5 h-5" />
                )}
              </motion.button>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-background-panel flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-foreground-subtle" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-foreground-muted">
                    No conversation selected
                  </h3>
                  <p className="text-sm text-foreground-subtle mt-1">
                    Choose a chat from the sidebar
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
