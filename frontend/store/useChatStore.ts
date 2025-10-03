import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../src/lib/axios";

type User = {
  _id: string;
  name: string;
  fullName: string;
  profilePic?: string;
};

type SelectedUser = {
  _id: string;
};

type ChatStore = {
  messages: string[];
  users: User[];
  selectedUser: SelectedUser | null;
  isUserLoading: boolean;
  isMessagesLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: () => Promise<void>;
  setSelectedUser: (selectedUser: string) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
