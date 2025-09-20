import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoadding: false,
  isMessagesLadding: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),
  getAllContacts: async () => {
    set({ isUsersLoadding: true });
    try {
      const response = await axiosInstance.get("/messages/contacts");
      set({ allContacts: response.data });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isUsersLoadding: false });
    }
  },
  getChatParteners: async () => {
    set({ isUsersLoadding: true });
    try {
      const response = await axiosInstance.get("/messages/chats");
      set({ chats: response.data });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isUsersLoadding: false });
    }
  },
  getMessagesByUserId: async (userId) => {
    set({ isMessagesLadding: true });
    try {
      const response = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: response.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "حدث خطأ في الخادم.");
    } finally {
      set({ isMessagesLadding: false });
    }
  },
  sendMessage: async (message) => {
    const { selectedUser, messages } = get();
    set({ isSendingMessage: true });
    const { authUser } = useAuthStore.getState();
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: message.text,
      image: message.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };
    //immediatly update the messages with the optimistic message
    set({ messages: messages.concat(optimisticMessage) });

    try {
      const response = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        message
      );
      set({ messages: messages.concat(response.data) });
    } catch (error) {
      //remove the optimistic message
      set({ messages: message });
      toast.error(error?.response?.data?.message || "حدث خطأ في الخادم.");
    } finally {
      set({ isSendingMessage: false });
    }
  },
}));
