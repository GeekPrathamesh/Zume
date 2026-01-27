import { createContext, useEffect, useState, ReactNode } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL as string;

axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;
type User = {
  _id: string;
  clerkId: string;
  fullName: string;
  email: string;
  bio: string;
  profilePic: string;
};

type AuthContextType = {
  axios: typeof axios;
  authUser: User | null;
  socket: Socket | null;
  onlineUsers: string[];
  updateProfile: (body: any) => Promise<void>;
    getToken: () => Promise<string | null>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user: clerkUser } = useUser();
  const { getToken } = useAuth();
const navigate = useNavigate()

  const [authUser, setAuthUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  // 🔌 Socket connect using Clerk ID
  const connectSocket = () => {
    if (!clerkUser) return;

    const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
      auth: {
        clerkUserId: clerkUser.id,
      },
    });

    setSocket(newSocket);

    newSocket.on("getonlineusers", (users: string[]) => {
      setOnlineUsers(users);
    });
  };

  // 🔄 Sync Clerk → MongoDB
  const syncUserToBackend = async () => {
    try {
      
      const token = await getToken();
      const { data } = await axios.post(
        "/api/auth/clerk-sync",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setAuthUser(data.user);
      connectSocket();
    } catch (error) {
       toast.error("Server error. Please try again.");
    setAuthUser(null);
    navigate("/login");
    }
  };

  useEffect(() => {
    if (clerkUser) {
      syncUserToBackend();
    }

  }, [clerkUser]);

  // 📝 Update profile
  const updateProfile = async (body: any) => {
    const token = await getToken();
    const { data } = await axios.put("/api/auth/update-profile", body, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (data.success) {
      setAuthUser(data.user);
    }
  };

  return (
   <AuthContext.Provider
  value={{
    authUser,
    socket,
    onlineUsers,
    updateProfile,
    axios,
    getToken,  
  }}
>
  {children}
</AuthContext.Provider>

  );
};


// import { createContext, useEffect, useState, ReactNode } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { io, Socket } from "socket.io-client";
// import { useUser, useAuth } from "@clerk/clerk-react";
// const backendUrl = import.meta.env.VITE_BACKEND_URL as string;
// axios.defaults.baseURL = backendUrl;

// // Types
// type User = {
//   _id: string;
//   fullName: string;
//   email: string;
//   profilePic: string;
//   bio: string;
//   createdAt: string;
//   updatedAt: string;
//   isOnline: boolean;
// };

// type AuthContextType = {
//   axios: typeof axios;
//   authUser: User | null;
//   onlineUsers: string[];
//   socket: Socket | null;
//   login: (state: string, credentials: any) => Promise<void>;
//   logout: () => void;
//   updateProfile: (body: any) => Promise<void>;
// };

// export const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
//   const [authUser, setAuthUser] = useState<User | null>(null);
//   const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
//   const [socket, setSocket] = useState<Socket | null>(null);

//   // Check auth
//   const checkAuth = async () => {
//     try {
//       const { data } = await axios.get("/api/auth/check");
//       if (data.success) {
//         setAuthUser(data.user);
//         connectSocket(data.user);
//       }
//     } catch (error: any) {
//       toast.error(error.message);
//     }
//   };

//   // Login
//   const login = async (state: string, credentials: any) => {
//     try {
//       const { data } = await axios.post(`/api/auth/${state}`, credentials);
//       if (data.success) {
//         setAuthUser(data.userData);
//         connectSocket(data.userData);

//         axios.defaults.headers.common["token"] = data.token;
//         localStorage.setItem("token", data.token);
//         setToken(data.token);

//         toast.success(data.message);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error: any) {
//       toast.error(error.message);
//     }
//   };

//   // Logout
//   const logout = () => {
//     const out = confirm("Do you want to logout??");
//     if(out){    localStorage.removeItem("token");
//     setToken(null);
//     setAuthUser(null);
//     setOnlineUsers([]);
//     axios.defaults.headers.common["token"] = null as any;
//     toast.success("Logout successfully");
//     socket?.disconnect();}

//   };

//   // Update profile
//   const updateProfile = async (body: any) => {
//     try {
//       const { data } = await axios.put("/api/auth/update-profile", body);
//       if (data.success) {
//         setAuthUser(data.user);
//         toast.success("Data updated successfully");
//       }
//     } catch (error: any) {
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       axios.defaults.headers.common["token"] = token;
//       checkAuth();
//     }
//   }, []);

//   // Socket connection
//   const connectSocket = (userData: User) => {
//     if (!userData?._id || socket?.connected) return;

//     const newSocket = io(backendUrl, {
//       query: { userId: userData._id.toString() },
//     });

//     setSocket(newSocket);

//     newSocket.off("getonlineusers");
//     newSocket.on("getonlineusers", (userIds: string[]) => {
//       setOnlineUsers(userIds);
//     });
//   };

//   const value: AuthContextType = {
//     axios,
//     authUser,
//     onlineUsers,
//     socket,
//     login,
//     logout,
//     updateProfile,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
