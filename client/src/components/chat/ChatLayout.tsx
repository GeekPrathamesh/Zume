import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ConversationList } from "./ConversationList";
import { ChatArea } from "./ChatArea";
import { ProfilePanel } from "./ProfilePanel";
import { PanelRightClose, PanelRightOpen, MessageSquare } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

import { useMessage } from "@/context/useMessage";
import { useAuth } from "@/context/useAuth";
import { UserButton } from "@clerk/clerk-react";

interface ChatLayoutProps {
  onEditProfile?: () => void;
  onLogout?: () => void;
}

export function ChatLayout({ onEditProfile, onLogout }: ChatLayoutProps) {
  const {   messages,
    setmessages,
    Users,
    selectedUser,
    setselectedUser,
    getUsers,
    getMessegesforselected,
    sendMessage,
    unseenMessages,
    setunseenMessages,} = useMessage();
  const { onlineUsers } = useAuth();

  const [showProfile, setShowProfile] = useState(false);
  const isMobile = useIsMobile();

  const handleSelectConversation = (userId: string) => {
    const user = Users.find((u) => u._id === userId) || null;
    setselectedUser(user);
    if (isMobile) setShowProfile(false);
  };

  const handleBack = () => {
    setselectedUser(null);
    setShowProfile(false);
  };

  // ================= MOBILE =================
  if (isMobile) {
   // ================= MOBILE =================
if (isMobile) {
  return (
    <div className="h-[100dvh] w-full flex flex-col bg-background overflow-hidden">

      {/* Top Bar */}
      <div className="h-14 px-4 flex items-center justify-between border-b bg-background/90 backdrop-blur-md sticky top-0 z-30">
        <h1 className="text-lg font-semibold tracking-wide">Zuumm</h1>

        <UserButton
          afterSignOutUrl="/login"
          appearance={{
            elements: {
              avatarBox: "w-9 h-9 ring-2 ring-border rounded-full",
            },
          }}
        />
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

  }

  // ================= DESKTOP =================
 return (
  <div className="h-[100dvh] w-full flex flex-col bg-background">

    {/* Top Header */}
    <div className="h-14 px-4 flex items-center justify-between border-b bg-background/80 backdrop-blur-md">
      <h1 className="text-lg font-semibold tracking-wide">Zuumm</h1>
      <UserButton
        afterSignOutUrl="/login"
        appearance={{
          elements: {
            avatarBox: "w-9 h-9 ring-2 ring-border rounded-full",
          },
        }}
      />
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
