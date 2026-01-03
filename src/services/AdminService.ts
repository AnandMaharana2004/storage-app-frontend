import { AdminUser, AdminStats, AdminUserDetail, FileItem } from "../types";
import { delay, mockDb, getFileType } from "./mockDb";

// Local mock storage for admin users to simulate persistence
let adminUsers: AdminUser[] = [
  {
    id: "1",
    name: "Alex Developer",
    email: "alex@cloudzoon.com",
    role: "User",
    status: "Active",
    usage: "1.2 GB",
    joinedAt: "2023-10-12",
  },
  {
    id: "2",
    name: "Anand Maharana",
    email: "anandmaharana427@gmail.com",
    role: "Admin",
    status: "Active",
    usage: "15.4 GB",
    joinedAt: "2023-01-05",
  },
  {
    id: "3",
    name: "Sarah Connor",
    email: "sarah@sky.net",
    role: "User",
    status: "Active",
    usage: "3.1 GB",
    joinedAt: "2024-02-14",
  },
  {
    id: "4",
    name: "John Doe",
    email: "john@example.com",
    role: "User",
    status: "Suspended",
    usage: "0.5 GB",
    joinedAt: "2023-12-25",
  },
];

export const adminService = {
  /**
   * Fetch global system stats
   */
  fetchStats: async (): Promise<AdminStats> => {
    await delay(800);
    return {
      totalUsers: "1,284",
      totalFiles: "42,930",
      storageUsed: "2.4 TB",
      securityAlerts: 0,
    };
  },

  /**
   * Fetch list of users with optional filtering
   */
  fetchUsers: async (query?: string): Promise<AdminUser[]> => {
    await delay(600);
    if (!query) return [...adminUsers];
    const lowQuery = query.toLowerCase();
    return adminUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(lowQuery) ||
        u.email.toLowerCase().includes(lowQuery),
    );
  },

  /**
   * Fetch deep details for a single user
   */
  fetchUserDetail: async (userId: string): Promise<AdminUserDetail> => {
    await delay(700);
    const user = adminUsers.find((u) => u.id === userId);
    if (!user) throw new Error("User not found");

    const isAnand = user.email.includes("anand");

    return {
      ...user,
      plan: isAnand ? "Enterprise" : "Pro",
      fileCount: isAnand ? 4210 : 842,
      storageLimit: isAnand ? "1 TB" : "50 GB",
      storageUsedBytes: isAnand ? 15400000000 : 1200000000,
      storageLimitBytes: isAnand ? 1000000000000 : 50000000000,
      activeSessions: [
        {
          id: "s1",
          deviceName: 'MacBook Pro 14"',
          browser: "Chrome",
          ipAddress: "192.168.1.1",
          lastActive: "Just now",
          location: "San Francisco, CA",
        },
        {
          id: "s2",
          deviceName: "iPhone 15 Pro",
          browser: "Safari",
          ipAddress: "172.20.10.4",
          lastActive: "2 hours ago",
          location: "San Francisco, CA",
        },
        {
          id: "s3",
          deviceName: "Work PC",
          browser: "Edge",
          ipAddress: "10.0.0.42",
          lastActive: "Yesterday",
          location: "New York, NY",
        },
      ],
    };
  },

  /**
   * Fetch files for a specific user
   */
  fetchUserFiles: async (userId: string): Promise<FileItem[]> => {
    await delay(900);
    // In a real app, we'd query by ownerId.
    // Here we return mock files but shuffled/modified for the user.
    return mockDb.files.map((f) => ({
      ...f,
      id: `u-${userId}-${f.id}`,
    }));
  },

  /**
   * Toggle user status (Suspend/Activate)
   */
  updateUserStatus: async (
    userId: string,
    status: "Active" | "Suspended",
  ): Promise<void> => {
    await delay(400);
    adminUsers = adminUsers.map((u) =>
      u.id === userId ? { ...u, status } : u,
    );
  },

  /**
   * Update user role
   */
  updateUserRole: async (
    userId: string,
    role: "Admin" | "User",
  ): Promise<void> => {
    await delay(400);
    adminUsers = adminUsers.map((u) => (u.id === userId ? { ...u, role } : u));
  },

  /**
   * Logout user from all sessions
   */
  forceLogout: async (userId: string): Promise<void> => {
    await delay(1000);
  },
};
