import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
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
  currentDirectory: {
    id: string;
    name: string;
    parentId: string | null;
  } | null;
  isLoading: boolean;
  error: string | null;
  notification: string | null;
  trashData: {
    groupedByDate: Array<{
      date: string;
      files: FileItem[];
      count: number;
      totalSize: string;
    }>;
    stats: {
      totalFiles: number;
      totalSize: string;
    };
  } | null;

  setCurrentFolderId: (id: string | null) => void;
  navigateUp: () => void;
  refreshData: () => Promise<void>;
  loadTrashFiles: () => Promise<void>;
  uploadFiles: (files: File[]) => void;
  createFolder: (name: string, parentFolderId: string) => void;
  renameFile: (fileId: string, newName: string) => Promise<void>;
  toggleStar: (fileId: string) => void;
  moveToTrash: (fileId: string) => void;
  restoreFromTrash: (fileId: string) => void;
  deleteForever: (fileId: string) => void;
  emptyTrash: () => Promise<void>;
  closeUploadProgress: () => void;
  isUploadMinimized: boolean;
  toggleUploadMinimize: () => void;
  clearNotification: () => void;
  loadFolderContents: (folderId: string | null) => Promise<boolean>;
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(
  undefined,
);

export const FileSystemProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<FolderItem[]>([]);
  const [currentDirectory, setCurrentDirectory] = useState<{
    id: string;
    name: string;
    parentId: string | null;
  } | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [isUploadMinimized, setIsUploadMinimized] = useState(false);

  const [trashData, setTrashData] = useState<{
    groupedByDate: Array<{
      date: string;
      files: FileItem[];
      count: number;
      totalSize: string;
    }>;
    stats: {
      totalFiles: number;
      totalSize: string;
    };
  } | null>(null);

  const { user } = useUser();

  // ✅ Load folder contents from backend - includes breadcrumbs
  const loadFolderContents = useCallback(
    async (folderId: string | null): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await api.fetchFileSystem(folderId);

        // ✅ Set data directly from backend response
        setFolders(data.folders);
        setFiles(data.files);
        setBreadcrumbs(data.breadcrumbs);
        setCurrentDirectory(data.currentDirectory);

        return true;
      } catch (err: any) {
        console.error("❌ Error loading folder:", err);
        setError(err.message || "Failed to load folder contents");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // ✅ Load trash files from backend
  const loadTrashFiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.fetchTrashFiles();
      setTrashData(data);
    } catch (err: any) {
      console.error("❌ Error loading trash:", err);
      setError(err.message || "Failed to load trash files");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ Refresh current folder
  const refreshData = useCallback(async () => {
    await loadFolderContents(currentFolderId);
  }, [currentFolderId, loadFolderContents]);

  const navigateUp = () => {
    if (currentDirectory?.parentId) {
      setCurrentFolderId(currentDirectory.parentId);
    } else {
      setCurrentFolderId(null);
    }
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

      setNotification("File moved to trash");
      await refreshData(); // Refresh to update folder counts
    } catch (err: any) {
      setError(err.message || "Failed to move file to trash");
    }
  };

  const restoreFromTrash = async (fileId: string) => {
    try {
      await api.restoreFromTrash(fileId);

      // Remove from trash data if loaded
      if (trashData) {
        setTrashData({
          ...trashData,
          groupedByDate: trashData.groupedByDate
            .map((group) => ({
              ...group,
              files: group.files.filter((f) => f.id !== fileId),
            }))
            .filter((group) => group.files.length > 0),
          stats: {
            totalFiles: trashData.stats.totalFiles - 1,
            totalSize: trashData.stats.totalSize,
          },
        });
      }

      setNotification("File restored");
    } catch (err: any) {
      setError(err.message || "Failed to restore file");
    }
  };

  const deleteForever = async (fileId: string) => {
    try {
      await api.deleteForever(fileId);

      // Remove from trash data if loaded
      if (trashData) {
        setTrashData({
          ...trashData,
          groupedByDate: trashData.groupedByDate
            .map((group) => ({
              ...group,
              files: group.files.filter((f) => f.id !== fileId),
            }))
            .filter((group) => group.files.length > 0),
          stats: {
            totalFiles: trashData.stats.totalFiles - 1,
            totalSize: trashData.stats.totalSize,
          },
        });
      }

      setNotification("File permanently deleted");
    } catch (err: any) {
      setError(err.message || "Failed to delete file");
    }
  };

  const emptyTrash = async () => {
    try {
      await api.emptyTrash();

      // Clear trash data
      setTrashData({
        groupedByDate: [],
        stats: { totalFiles: 0, totalSize: "0 B" },
      });

      setNotification("Trash emptied successfully");
    } catch (err: any) {
      setError(err.message || "Failed to empty trash");
    }
  };

  const createFolder = async (name: string, parentFolderId: string) => {
    try {
      const newFolder = await api.createFolder(name, parentFolderId);

      setFolders((prev) => [...prev, newFolder]);
      setNotification(`Folder "${name}" created`);
      await refreshData(); // Refresh to update folder counts
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

          setFiles((currentFiles) => {
            const exists = currentFiles.some((f) => f.id === completedFile.id);
            if (exists) {
              console.warn("⚠️ File already exists, skipping add");
              return currentFiles;
            }
            return [completedFile, ...currentFiles];
          });

          setUploads((prev) =>
            prev.map((u) =>
              u.id === entry.id
                ? { ...u, status: "completed", progress: 100 }
                : u,
            ),
          );

          // Refresh to update folder counts
          await refreshData();
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
    [currentFolderId, user, refreshData],
  );

  const closeUploadProgress = () => setUploads([]);
  const toggleUploadMinimize = () => setIsUploadMinimized((prev) => !prev);
  const clearNotification = () => {
    setNotification(null);
    setError(null);
  };

  return (
    <FileSystemContext.Provider
      value={{
        folders,
        files,
        uploads,
        currentFolderId,
        breadcrumbs,
        currentDirectory,
        isLoading,
        error,
        notification,
        trashData,
        refreshData,
        loadTrashFiles,
        setCurrentFolderId,
        navigateUp,
        renameFile,
        uploadFiles,
        createFolder,
        toggleStar,
        moveToTrash,
        restoreFromTrash,
        deleteForever,
        emptyTrash,
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
