// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { AdminUser, AdminStats } from '../types';
// import { adminService } from '../services/AdminService';

// interface AdminContextType {
//   stats: AdminStats | null;
//   users: AdminUser[];
//   isLoading: boolean;
//   error: string | null;
//   refreshAdminData: () => Promise<void>;
//   searchUsers: (query: string) => Promise<void>;
//   toggleUserStatus: (userId: string) => Promise<void>;
// }

// const AdminContext = createContext<AdminContextType | undefined>(undefined);

// export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [stats, setStats] = useState<AdminStats | null>(null);
//   const [users, setUsers] = useState<AdminUser[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const refreshAdminData = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const [newStats, newUsers] = await Promise.all([
//         adminService.fetchStats(),
//         adminService.fetchUsers()
//       ]);
//       setStats(newStats);
//       setUsers(newUsers);
//     } catch (err: any) {
//       setError(err.message || "Failed to load admin dashboard data.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const searchUsers = async (query: string) => {
//     try {
//       const filtered = await adminService.fetchUsers(query);
//       setUsers(filtered);
//     } catch (err) {
//       console.error("User search failed", err);
//     }
//   };

//   const toggleUserStatus = async (userId: string) => {
//     const user = users.find(u => u.id === userId);
//     if (!user) return;

//     const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';

//     // Optimistic update
//     setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));

//     try {
//       await adminService.updateUserStatus(userId, newStatus);
//     } catch (err) {
//       setError("Failed to update user status");
//       refreshAdminData(); // Revert
//     }
//   };

//   useEffect(() => {
//     refreshAdminData();
//   }, []);

//   return (
//     <AdminContext.Provider value={{
//       stats,
//       users,
//       isLoading,
//       error,
//       refreshAdminData,
//       searchUsers,
//       toggleUserStatus
//     }}>
//       {children}
//     </AdminContext.Provider>
//   );
// };

// export const useAdmin = () => {
//   const context = useContext(AdminContext);
//   if (context === undefined) {
//     throw new Error('useAdmin must be used within an AdminProvider');
//   }
//   return context;
// };

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { AdminUser, AdminStats, AdminUserDetail, FileItem } from "../types";
import { adminService } from "../services/AdminService";

interface AdminContextType {
  stats: AdminStats | null;
  users: AdminUser[];
  selectedUser: AdminUserDetail | null;
  selectedUserFiles: FileItem[];
  isLoading: boolean;
  isLoadingDetail: boolean;
  isLoadingFiles: boolean;
  error: string | null;
  refreshAdminData: () => Promise<void>;
  searchUsers: (query: string) => Promise<void>;
  toggleUserStatus: (userId: string) => Promise<void>;
  fetchUserDetails: (userId: string) => Promise<void>;
  forceLogoutUser: (userId: string) => Promise<void>;
  clearSelectedUser: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUserDetail | null>(
    null,
  );
  const [selectedUserFiles, setSelectedUserFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshAdminData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [newStats, newUsers] = await Promise.all([
        adminService.fetchStats(),
        adminService.fetchUsers(),
      ]);
      setStats(newStats);
      setUsers(newUsers);
    } catch (err: any) {
      setError(err.message || "Failed to load admin dashboard data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUserDetails = useCallback(async (userId: string) => {
    setIsLoadingDetail(true);
    setIsLoadingFiles(true);
    setError(null);
    try {
      const [detail, files] = await Promise.all([
        adminService.fetchUserDetail(userId),
        adminService.fetchUserFiles(userId),
      ]);
      setSelectedUser(detail);
      setSelectedUserFiles(files);
    } catch (err: any) {
      setError("Failed to fetch user profile details.");
    } finally {
      setIsLoadingDetail(false);
      setIsLoadingFiles(false);
    }
  }, []);

  const forceLogoutUser = useCallback(
    async (userId: string) => {
      setIsLoadingDetail(true);
      try {
        await adminService.forceLogout(userId);
        // Refresh details to reflect "no active sessions"
        if (selectedUser?.id === userId) {
          setSelectedUser((prev) =>
            prev ? { ...prev, activeSessions: [] } : null,
          );
        }
      } catch (err) {
        setError("Failed to logout user.");
      } finally {
        setIsLoadingDetail(false);
      }
    },
    [selectedUser],
  );

  const searchUsers = useCallback(async (query: string) => {
    try {
      const filtered = await adminService.fetchUsers(query);
      setUsers(filtered);
    } catch (err) {
      console.error("User search failed", err);
    }
  }, []);

  const toggleUserStatus = useCallback(
    async (userId: string) => {
      const user = users.find((u) => u.id === userId);
      if (!user) return;
      const newStatus = user.status === "Active" ? "Suspended" : "Active";
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)),
      );
      try {
        await adminService.updateUserStatus(userId, newStatus);
        // Update details if currently viewing this user
        if (selectedUser?.id === userId) {
          setSelectedUser((prev) =>
            prev ? { ...prev, status: newStatus } : null,
          );
        }
      } catch (err) {
        setError("Failed to update user status");
        refreshAdminData();
      }
    },
    [users, selectedUser, refreshAdminData],
  );

  const clearSelectedUser = useCallback(() => {
    setSelectedUser(null);
    setSelectedUserFiles([]);
  }, []);

  useEffect(() => {
    refreshAdminData();
  }, [refreshAdminData]);

  const contextValue = useMemo(
    () => ({
      stats,
      users,
      selectedUser,
      selectedUserFiles,
      isLoading,
      isLoadingDetail,
      isLoadingFiles,
      error,
      refreshAdminData,
      searchUsers,
      toggleUserStatus,
      fetchUserDetails,
      forceLogoutUser,
      clearSelectedUser,
    }),
    [
      stats,
      users,
      selectedUser,
      selectedUserFiles,
      isLoading,
      isLoadingDetail,
      isLoadingFiles,
      error,
      refreshAdminData,
      searchUsers,
      toggleUserStatus,
      fetchUserDetails,
      forceLogoutUser,
      clearSelectedUser,
    ],
  );

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined)
    throw new Error("useAdmin must be used within an AdminProvider");
  return context;
};
