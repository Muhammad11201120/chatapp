import { create } from "zustand";

export const useAuthStore = create((set) => ({
  authUser: { name: "muhammed", _id: 123, age: 4 },
  isLogin: false,
  login: () => {
    console.log("login");
    set({isLogin:true});
  },
}));
