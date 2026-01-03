import { delay, getPersentageStorage, SEED_CONTACTS } from "./mockDb";
import { StorageStats } from "../types";
import axiosInstance from "./axios";
import { fileService } from "./fileService";

export interface UserResponse {
  name: string;
  email: string;
  avatar: string;
  role: string;
  plan: string;
  storage: StorageStats;
  rootDir: string;
}

export const userService = {
  getCurrentUser: async (): Promise<UserResponse> => {
    const result = await axiosInstance.get("/users/me");
    const user = result.data.data;
    const refreshToken = await axiosInstance.post("/cdn/refresh-token");
    return {
      name: user.name,
      email: user.email,
      avatar: user.picture,
      role: user.role,
      plan: "free",
      rootDir: user.rootDirId,
      storage: {
        used: getPersentageStorage(
          user.maxStorageInBytes,
          user.usedStorageInBytes,
        ),
        total: 1,
        type: "Free",
      },
    };
  },

  signIn: async (email: string, password?: string): Promise<UserResponse> => {
    const result = await axiosInstance.post("/auth/login", { email, password });
    const user = result.data.data;
    return {
      name: user.name,
      email: user.email,
      avatar: user.picture,
      role: user.role,
      plan: user?.plan || "Free",
      rootDir: user.rootDirId,
      storage: {
        used: 1.25,
        total: 50.0,
        type: "Free",
      },
    };
  },

  // FIXED: Authenticate with Google, then fetch user data
  loginWithGoogle: async (token: {
    idToken: string;
  }): Promise<UserResponse> => {
    await axiosInstance.post("/auth/google/callback", {
      tokenId: token.idToken,
    });

    // After successful authentication, fetch complete user data
    return userService.getCurrentUser();
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post("/auth/logout", {
      all: false,
    });
  },

  updateProfile: async (updates: any): Promise<void> => {
    await axiosInstance.post("/users/update/name", {
      name: updates.name,
    });
  },

  checkEmailExists: async (email: string): Promise<boolean> => {
    await delay(500);
    return SEED_CONTACTS.some((c) => c.email === email);
  },

  registerUser: async (data: any): Promise<void> => {
    await delay(1500);
    if (data.otp !== "1234") throw new Error("Invalid code");
  },

  searchPeople: async (query: string) => {
    await delay(300);
    if (!query) return [];
    return SEED_CONTACTS.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase()),
    );
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await delay(1000);
    if (token === "expired") throw new Error("Reset link has expired.");
  },
};
