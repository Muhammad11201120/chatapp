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
  isSendingMessage: false,
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
    const { selectedUser } = get();
    if (!selectedUser?._id) return;
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

    // Append optimistic message using functional update to avoid stale state
    set((state) => ({ messages: state.messages.concat(optimisticMessage) }));

    try {
      const response = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        message
      );
      // Replace optimistic temp message with server response
      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === tempId ? response.data : m
        ),
      }));
    } catch (error) {
      // Keep the message visible and flag as error for UI
      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === tempId ? { ...m, isError: true } : m
        ),
      }));
      toast.error(error?.response?.data?.message || "حدث خطأ في الخادم.");
    } finally {
      set({ isSendingMessage: false });
    }
  },
  subscribeToNewMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.on("newMessage", (newMessage) => {
      const isMessageFormSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (isMessageFormSelectedUser) return;
      const currentMessages = get().messages;
      set({ messages: [...currentMessages, newMessage] });
      if (isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");
        notificationSound.currentTime = 0;
        notificationSound
          .play()
          .catch((error) => console.log("Audio play failed:", error));
      }
    });
  },
  unsubscribeFromNewMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
  },
}));
