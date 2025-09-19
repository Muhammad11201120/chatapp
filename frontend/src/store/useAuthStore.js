import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  checkAuth: async () => {
    try {
      //check if user is authenticated
      const response = await axiosInstance.get("/auth/check-auth");
      //if user is authenticated, set the auth user
      set({ authUser: response.data });
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
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },
}));
