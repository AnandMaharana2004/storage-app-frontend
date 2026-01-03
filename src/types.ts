export interface FileItem {
  id: string;
  name: string;
  type:
    | "image"
    | "pdf"
    | "archive"
    | "code"
    | "video"
    | "doc"
    | "other"
    | "audio";
  size: string;
  date: string;
  thumbnail?: string;
  isStarred?: boolean;
  sharedBy?: string;
  deletedAt?: string;
  parentFolderId?: string;
  url: string;
}

export interface FolderItem {
  id: string;
  name: string;
  itemCount: number;
  color: string;
  parentFolderId?: string;
}

export interface StorageStats {
  used: number;
  total: number;
  type: "Free" | "Pro" | "Enterprise";
}

export enum ViewMode {
  Grid = "GRID",
  List = "LIST",
}

export type SidebarTab =
  | "my-files"
  | "recent"
  | "starred"
  | "shared"
  | "trash"
  | "profile"
  | "admin"
  | "admin-user-details";

export interface UploadItem {
  id: string;
  name: string;
  progress: number;
  status: "uploading" | "completed" | "error";
}

export interface DeviceSession {
  id: string;
  deviceName: string;
  browser: string;
  ipAddress: string;
  lastActive: string;
  location: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "User";
  status: "Active" | "Suspended";
  usage: string;
  joinedAt: string;
}

export interface AdminUserDetail extends AdminUser {
  plan: "Free" | "Pro" | "Enterprise";
  fileCount: number;
  storageLimit: string;
  storageUsedBytes: number;
  storageLimitBytes: number;
  activeSessions: DeviceSession[];
}

export interface AdminStats {
  totalUsers: string;
  totalFiles: string;
  storageUsed: string;
  securityAlerts: number;
}
