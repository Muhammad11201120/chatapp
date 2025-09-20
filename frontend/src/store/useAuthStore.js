import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";
export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfilePic: false,
  socket: null,
  onlineUsers: [],
  checkAuth: async () => {
    try {
      //check if user is authenticated
      const response = await axiosInstance.get("/auth/check-auth");
      //if user is authenticated, set the auth user
      set({ authUser: response.data.user });
      get().connectSocket();
    } catch (error) {
      console.log(error);
      //if user is not authenticated, set the auth user to null
      set({ authUser: null });
    } finally {
      //set the is checking auth to false
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/auth/signup", data);
      set({ authUser: response.data });
      toast.success("تم التسجيل بنجاح !");
      get().connectSocket();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post("/auth/login", data);
      set({ authUser: response.data });
      toast.success("تم تسجيل الدخول بنجاح");
      get().connectSocket();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("تم تسجيل الخروج بنجاح");
      get().disconnectSocket();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },
  updateProfilePic: async (data) => {
    set({ isUpdatingProfilePic: true });
    try {
      const response = await axiosInstance.put("/auth/update-profile", data);
      set((state) => ({
        authUser: state.authUser
          ? { ...state.authUser, profilePic: response.data.profilePic }
          : null,
      }));
      toast.success("تم تحديث الصورة الشخصية بنجاح");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfilePic: false });
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      withCredentials: true, // this ensures cookies are sent with the connection
    });

    socket.connect();

    set({ socket });

    // listen for online users event
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
