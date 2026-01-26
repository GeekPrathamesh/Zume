import { createContext } from "react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;
export const Authcontext = createContext();
export const Authprovider = ({ children }) => {
  const [token, settoken] = useState(localStorage.getItem("token"));
  const [authUser, setauthUser] = useState(null);
  const [onlineUsers, setonlineUsers] = useState([]);
  const [socket, setsocket] = useState(null);

  //check if user is authenticated or not
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setauthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //login function to handle user authentication and socket connection
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        setauthUser(data.userData);
        connectSocket(data.userData);
        axios.defaults.headers.common["token"] = data.token;
        localStorage.setItem("token", data.token);
        settoken(data.token); 

        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //logout function
  const logout = () => {
    localStorage.removeItem("token");
    settoken(null);
    setauthUser(null);
    setonlineUsers([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("logout successfully");
    if (socket) socket.disconnect();

  };

  // user profile update function to handle user profile updates
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setauthUser(data.user);
        toast.success("data updated successfully");
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
      checkAuth();
    }
  }, []);

  //connect to socket function to handle socket connection and online users
const connectSocket = (userData) => {
  if (!userData?._id || socket?.connected) return;

  const newSocket = io(backendUrl, {
    query: { userId: userData._id.toString() }
  });

  setsocket(newSocket);

  newSocket.off("getonlineusers");
  newSocket.on("getonlineusers", (userIds) => {
    setonlineUsers(userIds);
  });
};


  const value = { axios, authUser, onlineUsers, socket ,login,logout,updateProfile};
  return <Authcontext.Provider value={value}>{children} </Authcontext.Provider>;
};
