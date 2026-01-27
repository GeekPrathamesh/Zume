import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import toast from "react-hot-toast";
import { useAuth } from "./useAuth";

// Types
type User = {
  _id: string;
    clerkId: string;
  fullName: string;
  profilePic?: string;
};


type Message = {
  _id: string;
  senderId: string;
  receiverId: string;  
  seen: boolean;
  text?: string;
  image?: string;
  createdAt?: string;
};



type MessageContextType = {
  messages: Message[];
  setmessages: React.Dispatch<React.SetStateAction<Message[]>>;
  Users: User[];
  selectedUser: User | null;
  setselectedUser: React.Dispatch<React.SetStateAction<User | null>>;
  getUsers: () => Promise<void>;
  getMessegesforselected: (userId: string) => Promise<void>;
  sendMessage: (messageData: any) => Promise<void>;
  unseenMessages: Record<string, number> | null;
  setunseenMessages: React.Dispatch<
    React.SetStateAction<Record<string, number> | null>
  >;
  
};

export const Messagecontext = createContext<MessageContextType | null>(null);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setmessages] = useState<Message[]>([]);
  const [Users, setUsers] = useState<User[]>([]);
  const [selectedUser, setselectedUser] = useState<User | null>(null);
  const [unseenMessages, setunseenMessages] = useState<Record<string, number> | null>(null);

const { axios, socket ,getToken } = useAuth();

  const getUsers = async () => {
    try {
            const token = await getToken();
      const { data } = await axios.get("/api/messages/users",{
      headers: {
        Authorization: `Bearer ${token}`,
      }});
      if (data.success) {
        setUsers(data.users);
        setunseenMessages(data.unseenMessages);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getMessegesforselected = async (userId: string) => {
    try {
      const token = await getToken();
          const { data } = await axios.get(`/api/messages/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

      if (data.success) {
        setmessages(data.messages);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const sendMessage = async (messageData: any) => {
    try {
       const token = await getToken();
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser?._id}`,
        messageData,{
  headers: { Authorization: `Bearer ${token}` }
}
      );
      if (data.success) {
        setmessages((prev) => [...prev, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const subscribeToMessages = () => {
    if (!socket) return;

    socket.on("newMessage", async(newMessage: Message) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setmessages((prev) => [...prev, newMessage]);
              const token = await getToken();

          await axios.put(
        `/api/messages/mark/${newMessage._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      } else {
        setunseenMessages((prev) => {
  const safePrev = prev || {};
  return {
    ...safePrev,
    [newMessage.senderId]: (safePrev[newMessage.senderId] || 0) + 1,
  };
});

      }
    });
  };

  const unsubscribeToMessages = () => {
    if (socket) socket.off("newMessage");
  };

useEffect(() => {
  if (!socket) return;

  const handler = async (newMessage: Message) => {
    if (selectedUser && newMessage.senderId === selectedUser._id) {
      const updated = { ...newMessage, seen: true };
      setmessages(prev => [...prev, updated]);

      const token = await getToken();
      await axios.put(
        `/api/messages/mark/${newMessage._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      setunseenMessages(prev => ({
        ...(prev || {}),
        [newMessage.senderId]: ((prev || {})[newMessage.senderId] || 0) + 1,
      }));
    }
  };

  socket.on("newMessage", handler);

  return () => {
    socket.off("newMessage", handler);
  };
}, [socket, selectedUser]);


  const value: MessageContextType = {
    messages,
    setmessages,
    Users,
    selectedUser,
    setselectedUser,
    getUsers,
    getMessegesforselected,
    sendMessage,
    unseenMessages,
    setunseenMessages,
  };

  return (
    <Messagecontext.Provider value={value}>
      {children}
    </Messagecontext.Provider>
  );
};
