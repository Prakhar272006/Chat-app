import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers:[],


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
  },
  logout: async (data) => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
    }
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
  }
}));
