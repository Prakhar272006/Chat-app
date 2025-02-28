import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
const SOCKET_URL = "http://localhost:3000"

export const useAuthStore = create((set,get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers:[],
  socket:null,


 checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data });
      // console.log("response: ", response.data); // Log the response
      // console.log("authUser set to: ", response.data); // Log the authUser state
    } catch (error) {
      console.log("error in checking auth: ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
        get().connectSocket()

  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      // console.log("res: ", res); // Add this line to log the response
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error) {
      // console.log("error: ", error); // Add this line to log the error
      // console.log("error.response: ", error.response); // Add this line to log the error response
      // console.log("error.response.data: ", error.response.data); // Add this line to log the error response data
      // console.log("error.response.data.message: ", error.response.data.message); // Add this line to log the error message
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
    get().connectSocket()

  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error("Error logging in");
    } finally {
      set({ isLoggingIn: false });
    }
    get().connectSocket()
  },
  logout: async (data) => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
    }
    get().disconnectSocket()
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error: ", error); // Add this line to log the error
      toast.error("Error updating profile");
    }finally{
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket:()=>{
    const {authUser} = get()
    if(!authUser || get().socket?.connected) return
    const socket = io(SOCKET_URL,{
      query:{
        userId:authUser._id
      }
    })
    socket.connect()
    set({socket:socket})
    socket.on("getOnlineUsers",(userId)=>{
      set({onlineUsers:userId})
    })
  },
  disconnectSocket:()=>{
    if(get().socket?.connected){
      get().socket.disconnect()
    }
  }
}));
