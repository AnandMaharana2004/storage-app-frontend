import { FileItem, FolderItem } from "../types";

// --- DATABASE TABLES (Simulated) ---

const SEED_FOLDERS: FolderItem[] = [
  { id: "1", name: "Design Assets", itemCount: 12, color: "blue" },
  { id: "2", name: "Marketing", itemCount: 8, color: "orange" },
  { id: "3", name: "Invoices", itemCount: 3, color: "emerald" },
];

const SEED_FILES: FileItem[] = [
  {
    id: "f1",
    name: "Project_Proposal.pdf",
    type: "pdf",
    size: "2.4 MB",
    date: "Just now",
    isStarred: true,
    url: "",
  },
  {
    id: "f2",
    name: "hero_banner_v2.jpg",
    type: "image",
    size: "3.1 MB",
    date: "2h ago",
    thumbnail: "https://picsum.photos/400/300?random=1",
    sharedBy: "Sarah Connor",
    parentFolderId: "1",
    url: "",
  },
  {
    id: "f3",
    name: "source_code_backup.zip",
    type: "archive",
    size: "8.5 MB",
    date: "5h ago",
    url: "",
  },
  {
    id: "f4",
    name: "App.tsx",
    type: "code",
    size: "4 KB",
    date: "1d ago",
    isStarred: true,
    url: "",
  },
  {
    id: "f5",
    name: "Q3_Financials.xlsx",
    type: "doc",
    size: "1.2 MB",
    date: "2d ago",
    sharedBy: "Finance Team",
    parentFolderId: "3",
    url: "",
  },
  {
    id: "f6",
    name: "Demo_Recording.mp4",
    type: "video",
    size: "450 MB",
    date: "1w ago",
    thumbnail: "https://picsum.photos/400/300?random=2",
    parentFolderId: "2",
    url: "",
  },
];

// Fix: Exporting SEED_CONTACTS so it can be used in userService.ts
export const SEED_CONTACTS = [
  {
    name: "Sarah Connor",
    email: "sarah@sky.net",
    avatar: "https://picsum.photos/50/50?random=10",
  },
  {
    name: "Finance Team",
    email: "finance@cloudzoon.com",
    avatar: "https://picsum.photos/50/50?random=15",
  },
];

export const mockDb = {
  folders: [...SEED_FOLDERS],
  files: [...SEED_FILES],
  users: [...SEED_CONTACTS],
  pendingUploads: new Map<string, any>(),
};

// --- HELPERS ---
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Fix: Added exported shouldFail helper to simulate network failures in services
export const shouldFail = () => Math.random() < 0.05;

export const getFileType = (mimeType: string): FileItem["type"] => {
  if (!mimeType) return "other";

  // Images
  if (mimeType.startsWith("image/")) return "image";

  // Videos
  if (mimeType.startsWith("video/")) return "video";

  // Audio
  if (mimeType.startsWith("audio/")) return "audio";

  // PDF
  if (mimeType === "application/pdf") return "pdf";

  // Archives
  if (
    mimeType.includes("zip") ||
    mimeType.includes("rar") ||
    mimeType.includes("7z") ||
    mimeType.includes("tar") ||
    mimeType.includes("gzip")
  ) {
    return "archive";
  }

  // Code files
  if (
    mimeType.includes("javascript") ||
    mimeType.includes("typescript") ||
    mimeType.includes("json") ||
    mimeType.includes("xml") ||
    mimeType.includes("html") ||
    mimeType.includes("css")
  ) {
    return "code";
  }

  // Text / Document files (browser-readable)
  if (
    mimeType.startsWith("text/") ||
    mimeType.includes("msword") ||
    mimeType.includes("officedocument") ||
    mimeType.includes("rtf")
  ) {
    return "doc";
  }

  // Fallback
  return "other";
};

export const formatFileSize = (bytes) => {
  if (bytes >= 1024 ** 3) {
    return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  } else if (bytes >= 1024 ** 2) {
    return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
  } else {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }
};

export function getPersentageStorage(
  maxStorageInBytes: number,
  usedStorageInBytes: number,
) {
  if (!maxStorageInBytes || maxStorageInBytes <= 0) return 0;

  const percentage = usedStorageInBytes / maxStorageInBytes;

  return Number(Math.min(Math.max(percentage, 0), 1).toFixed(4));
}

export function timeAgo(dateString: string): string {
  const now = new Date();
  const past = new Date(dateString);

  const diffMs = now.getTime() - past.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "In the future";

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  // Days (2–6)
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  // Weeks (1–4)
  const weeks = Math.floor(diffDays / 7);
  if (weeks < 5) {
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }

  // Months (1–11)
  const months = Math.floor(diffDays / 30);
  if (months < 12) {
    return months === 1 ? "1 month ago" : `${months} months ago`;
  }

  // Years
  const years = Math.floor(diffDays / 365);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}
