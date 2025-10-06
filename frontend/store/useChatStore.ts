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
  fullName: string;
  profilePic?: string;
};

type MessagesData = {
  _id: string;
  text?: string;
  image?: string;
  createdAt: string;
  receiverId: string;
  senderId: string;
};

type ChatStore = {
  messages: MessagesData[];
  users: User[];
  selectedUser: SelectedUser | null;
  isUserLoading: boolean;
  isMessagesLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: () => Promise<void>;
  sendMessage: (messageData: FormData) => Promise<void>;
  setSelectedUser: (selectedUser: string | null) => void;
};

export const useChatStore = create<ChatStore>((set, get) => ({
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

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    console.log(messages);
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser?._id}`,
        messageData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
