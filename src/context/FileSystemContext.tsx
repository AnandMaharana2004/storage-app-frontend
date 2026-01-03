import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { FileItem, FolderItem, UploadItem } from "../types";
import { api } from "../services/api";
import { useUser } from "./UserContext";

interface FileSystemContextType {
  folders: FolderItem[];
  files: FileItem[];
  uploads: UploadItem[];
  currentFolderId: string | null;
  breadcrumbs: FolderItem[];
  isLoading: boolean;
  error: string | null;
  notification: string | null;
  loadedFolders: Set<string>;

  setCurrentFolderId: (id: string | null) => void;
  navigateUp: () => void;
  refreshData: () => Promise<void>;
  uploadFiles: (files: File[]) => void;
  createFolder: (name: string, parentFolderId: string) => void;
  renameFile: (fileId: string, newName: string) => Promise<void>;
  toggleStar: (fileId: string) => void;
  moveToTrash: (fileId: string) => void;
  restoreFromTrash: (fileId: string) => void;
  deleteForever: (fileId: string) => void;
  closeUploadProgress: () => void;
  isUploadMinimized: boolean;
  toggleUploadMinimize: () => void;
  clearNotification: () => void;
  loadFolderContents: (folderId: string) => Promise<boolean>;
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(
  undefined,
);

export const FileSystemProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // ✅ SIMPLIFIED: Single state for all folders and files
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  // ✅ Track which folders have been loaded to avoid re-fetching
  const [loadedFolders, setLoadedFolders] = useState<Set<string>>(new Set());

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [isUploadMinimized, setIsUploadMinimized] = useState(false);

  const { user } = useUser();

  // ✅ OPTIMIZED: Load folder contents and merge into existing state
  const loadFolderContents = useCallback(
    async (folderId: string): Promise<boolean> => {
      const folderKey = folderId || "root";

      // Check if already loaded
      if (loadedFolders.has(folderKey)) {
        return true;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await api.fetchFileSystem(folderId || user?.rootDir);

        // ✅ MERGE new folders into existing state (avoid duplicates)
        setFolders((prev) => {
          const existingIds = new Set(prev.map((f) => f.id));
          const newFolders = data.folders.filter((f) => !existingIds.has(f.id));
          return [...prev, ...newFolders];
        });

        // ✅ MERGE new files into existing state (avoid duplicates)
        setFiles((prev) => {
          const existingIds = new Set(prev.map((f) => f.id));
          const newFiles = data.files.filter((f) => !existingIds.has(f.id));
          return [...prev, ...newFiles];
        });

        // Mark this folder as loaded
        setLoadedFolders((prev) => new Set(prev).add(folderKey));

        return true;
      } catch (err: any) {
        console.error("❌ Error loading folder:", err);
        setError(err.message || "Failed to load folder contents");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [loadedFolders, user?.rootDir],
  );

  // ✅ Refresh current folder (re-fetch)
  const refreshData = useCallback(async () => {
    if (!user) return;

    const targetId = currentFolderId || user.rootDir;
    const folderKey = targetId || "root";

    // Remove from loaded set to force re-fetch
    setLoadedFolders((prev) => {
      const newSet = new Set(prev);
      newSet.delete(folderKey);
      return newSet;
    });

    await loadFolderContents(targetId);
  }, [currentFolderId, user, loadFolderContents]);

  // ✅ Load initial root data only once
  useEffect(() => {
    if (user && !currentFolderId && !loadedFolders.has("root")) {
      loadFolderContents(user.rootDir);
    }
  }, [user, currentFolderId, loadedFolders, loadFolderContents]);

  // --- Navigation Helpers ---
  const getBreadcrumbs = useCallback(() => {
    if (!currentFolderId) return [];

    const path: FolderItem[] = [];
    let current = folders.find((f) => f.id === currentFolderId);
    let safety = 0;

    while (current && safety < 50) {
      path.unshift(current);
      if (current.parentFolderId) {
        current = folders.find((f) => f.id === current!.parentFolderId);
      } else {
        current = undefined;
      }
      safety++;
    }

    return path;
  }, [currentFolderId, folders]);

  const navigateUp = () => {
    if (!currentFolderId) return;
    const current = folders.find((f) => f.id === currentFolderId);
    setCurrentFolderId(current?.parentFolderId || null);
  };

  // --- Actions ---

  const renameFile = async (fileId: string, newName: string) => {
    try {
      await api.renameFile(fileId, newName);

      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, name: newName } : f)),
      );

      setNotification(`File renamed to "${newName}"`);
    } catch (err: any) {
      setError(err.message || "Failed to rename file");
    }
  };

  const toggleStar = async (fileId: string) => {
    try {
      const currentFile = files.find((f) => f.id === fileId);
      const newStarredState = !currentFile?.isStarred;

      // Optimistic update
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, isStarred: newStarredState } : f,
        ),
      );

      await api.toggleStar(fileId);
      setNotification(
        newStarredState ? "Added to starred" : "Removed from starred",
      );
    } catch (err: any) {
      setError("Failed to update star status");
      await refreshData();
    }
  };

  const moveToTrash = async (fileId: string) => {
    try {
      const { deletedAt } = await api.moveToTrash(fileId);

      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, deletedAt } : f)),
      );

      const file = files.find((f) => f.id === fileId);
      if (file?.parentFolderId) {
        setFolders((prev) =>
          prev.map((folder) =>
            folder.id === file.parentFolderId
              ? { ...folder, itemCount: Math.max(0, folder.itemCount - 1) }
              : folder,
          ),
        );
      }

      setNotification("File moved to trash");
    } catch (err: any) {
      setError(err.message || "Failed to move file to trash");
    }
  };

  const restoreFromTrash = async (fileId: string) => {
    try {
      await api.restoreFromTrash(fileId);

      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, deletedAt: null } : f)),
      );

      const file = files.find((f) => f.id === fileId);
      if (file?.parentFolderId) {
        setFolders((prev) =>
          prev.map((folder) =>
            folder.id === file.parentFolderId
              ? { ...folder, itemCount: folder.itemCount + 1 }
              : folder,
          ),
        );
      }

      setNotification("File restored");
    } catch (err: any) {
      setError(err.message || "Failed to restore file");
    }
  };

  const deleteForever = async (fileId: string) => {
    try {
      await api.deleteForever(fileId);

      // Remove file from state completely
      setFiles((prev) => prev.filter((f) => f.id !== fileId));

      setNotification("File permanently deleted");
    } catch (err: any) {
      setError(err.message || "Failed to delete file");
    }
  };

  const createFolder = async (name: string, parentFolderId: string) => {
    try {
      const newFolder = await api.createFolder(name, parentFolderId);

      // ✅ Add new folder to state with parent ID
      setFolders((prev) => [...prev, newFolder]);

      // Update parent folder item count
      if (parentFolderId) {
        setFolders((prev) =>
          prev.map((folder) =>
            folder.id === parentFolderId
              ? { ...folder, itemCount: folder.itemCount + 1 }
              : folder,
          ),
        );
      }

      setNotification(`Folder "${name}" created`);
    } catch (err: any) {
      setError(err.message || "Failed to create folder");
    }
  };

  const uploadFiles = useCallback(
    (newFiles: File[]) => {
      const targetFolderId = currentFolderId || user?.rootDir;

      if (!targetFolderId) {
        setError("No target folder specified");
        return;
      }

      const newUploadEntries = newFiles.map((f) => ({
        id: Math.random().toString(36).substr(2, 9),
        fileObj: f,
        status: "uploading" as const,
        progress: 0,
        name: f.name,
      }));

      setUploads((prev) => [
        ...newUploadEntries.map(({ fileObj, ...rest }) => rest),
        ...prev,
      ]);
      setIsUploadMinimized(false);

      newUploadEntries.forEach(async (entry) => {
        try {
          const { uploadUrl, fileKey, fileId } = await api.initiateUpload(
            entry.name,
            entry.fileObj.size,
            entry.fileObj.type,
            targetFolderId,
          );

          await api.uploadFileToUrl(uploadUrl, entry.fileObj, (progress) => {
            setUploads((prev) =>
              prev.map((u) => (u.id === entry.id ? { ...u, progress } : u)),
            );
          });

          const completedFile = await api.completeUpload(fileKey, fileId);

          // ✅ Add new file to state with parent ID
          setFiles((currentFiles) => {
            const exists = currentFiles.some((f) => f.id === completedFile.id);
            if (exists) {
              console.warn("⚠️ File already exists, skipping add");
              return currentFiles;
            }

            return [completedFile, ...currentFiles];
          });

          // Update folder item count
          if (targetFolderId) {
            setFolders((prev) =>
              prev.map((folder) =>
                folder.id === targetFolderId
                  ? { ...folder, itemCount: folder.itemCount + 1 }
                  : folder,
              ),
            );
          }

          setUploads((prev) =>
            prev.map((u) =>
              u.id === entry.id
                ? { ...u, status: "completed", progress: 100 }
                : u,
            ),
          );
        } catch (err: any) {
          setUploads((prev) =>
            prev.map((u) =>
              u.id === entry.id ? { ...u, status: "error", progress: 0 } : u,
            ),
          );
          setError(`Failed to upload ${entry.name}: ${err.message}`);
        }
      });
    },
    [currentFolderId, user],
  );

  const closeUploadProgress = () => setUploads([]);
  const toggleUploadMinimize = () => setIsUploadMinimized((prev) => !prev);
  const clearNotification = () => {
    setNotification(null);
    setError(null);
  };

  // Auto-close completed uploads
  useEffect(() => {
    if (uploads.length === 0) return;
    const allFinished = uploads.every(
      (u) => u.status === "completed" || u.status === "error",
    );
    if (allFinished) {
      const timer = setTimeout(() => setUploads([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [uploads]);

  // Auto-clear notifications
  useEffect(() => {
    if (notification || error) {
      const timer = setTimeout(() => {
        setNotification(null);
        setError(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification, error]);

  return (
    <FileSystemContext.Provider
      value={{
        folders,
        files,
        uploads,
        currentFolderId,
        breadcrumbs: getBreadcrumbs(),
        isLoading,
        error,
        notification,
        loadedFolders,
        refreshData,
        setCurrentFolderId,
        navigateUp,
        renameFile,
        uploadFiles,
        createFolder,
        toggleStar,
        moveToTrash,
        restoreFromTrash,
        deleteForever,
        closeUploadProgress,
        isUploadMinimized,
        toggleUploadMinimize,
        clearNotification,
        loadFolderContents,
      }}
    >
      {children}
    </FileSystemContext.Provider>
  );
};

export const useFileSystem = () => {
  const context = useContext(FileSystemContext);
  if (context === undefined) {
    throw new Error("useFileSystem must be used within a FileSystemProvider");
  }
  return context;
};
