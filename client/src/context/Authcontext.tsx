import { createContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL as string;

axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;

type User = {
  _id: string;
  fullName: string;
  email: string;
  bio: string;
  profilePic: string;
};

type AuthContextType = {
  axios: typeof axios;
  authUser: User | null;
  isCheckingAuth: boolean;
  socket: Socket | null;
  onlineUsers: string[];
  signup: (credentials: any) => Promise<boolean>;
  login: (credentials: any) => Promise<boolean>;
  logout: () => void;
  updateProfile: (body: any) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  // 🔌 Socket connect using user ID
  const connectSocket = (userId: string) => {
    // If socket is already connected, don't reconnect
    if (socket?.connected) return;

    const newSocket = io(backendUrl, {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("getonlineusers", (users: string[]) => {
      setOnlineUsers(users);
    });
  };

  // 🔄 Check auth status on application mount (HTTP-only cookie verified on server)
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");

      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user._id);
      } else {
        setAuthUser(null);
      }
    } catch (error) {
      console.log("Check Auth Status: Not authenticated");
      setAuthUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // 📝 Signup
  const signup = async (credentials: any) => {
    try {
      const { data } = await axios.post("/api/auth/signup", credentials);
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user._id);
        toast.success("Signed up successfully!");
        navigate("/");
        return true;
      } else {
        toast.error(data.message || "Registration failed.");
        return false;
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration error. Please try again.";
      toast.error(message);
      return false;
    }
  };

  // 🔑 Login
  const login = async (credentials: any) => {
    try {
      const { data } = await axios.post("/api/auth/login", credentials);
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user._id);
        toast.success("Logged in successfully!");
        navigate("/");
        return true;
      } else {
        toast.error(data.message || "Invalid credentials.");
        return false;
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Login error. Please try again.";
      toast.error(message);
      return false;
    }
  };

  // 🚪 Logout
  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout request error:", error);
    } finally {
      if (socket) {
        socket.disconnect();
      }
      setAuthUser(null);
      setSocket(null);
      setOnlineUsers([]);
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  // 📝 Update profile
  const updateProfile = async (body: any) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(data.message || "Failed to update profile.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        axios,
        authUser,
        isCheckingAuth,
        socket,
        onlineUsers,
        signup,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
