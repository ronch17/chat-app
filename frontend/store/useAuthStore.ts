import { create } from "zustand";
import { axiosInstance } from "../src/lib/axios";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:5000";

type AuthUser = {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
};

type AuthStore = {
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[];
  checkAuth: () => Promise<void>;
  signup: () => Promise<void>;
  logout: () => Promise<void>;
  login: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  socket: Socket | null;
  connectSocket: () => Promise<void>;
  disconnectSocket: () => Promise<void>;
};

type SignupInput = {
  fullName: string;
  email: string;
  password: string;
};

type LoginInputData = {
  email: string;
  password: string | number;
};

type UpdateProfileData = {
  profilePic?: string;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      console.log("response data:", res.data);
      set({ authUser: res.data });

      get().connectSocket();
    } catch (error) {
      console.error(
        "Error in checkAuth:",
        error.response?.data || error.message,
      );
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: SignupInput) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error, "Rons Signup error");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data: LoginInputData) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully :)");

      get().connectSocket();
    } catch (error) {
      console.error(error, "Error in login function");
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");

      get().disconnectSocket();
    } catch (error) {
      console.log(error, "Error in logout fn");
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data: FormData) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log(error, "Error in updateProfile");
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (usersIds) => {
      set({ onlineUsers: usersIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket?.disconnect();
  },
}));
