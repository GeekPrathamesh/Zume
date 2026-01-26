import {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Authcontext } from "./Authcontext";
import toast from "react-hot-toast";

export const Messagecontext = createContext();
export const MessageProvider = ({ children }) => {
  const [messages, setmessages] = useState([]);
  const [Users, setUsers] = useState([]);
  const [selectedUser, setselectedUser] = useState(null);
  const [unseenMessages, setunseenMessages] = useState(null);

  const { axios, socket } = useContext(Authcontext);

  //function to get the all users
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setunseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.messages);
    }
  };

  //function to get messages for the selected user
  const getMessegesforselected = async (userId) => {
    try {
      const {data} =await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setmessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //function to send message to selected user
  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,messageData);
      if (data.success) {
        setmessages((prevMessages) => [...prevMessages, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //function to subscribe to messages for selected user
  const subscribeToMessages = () => {
    if (!socket) return;
    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setmessages((prevMessages) => [...prevMessages, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setunseenMessages((prevUnseenmessages) => ({
          ...prevUnseenmessages,
          [newMessage.senderId]: prevUnseenmessages[newMessage.senderId]
            ? prevUnseenmessages[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };

  //function to unsubscribe from messages
  const unsubscribeToMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeToMessages();
  }, [socket, selectedUser]);

  const value = {
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
    <Messagecontext.Provider value={value}>{children}</Messagecontext.Provider>
  );
};
