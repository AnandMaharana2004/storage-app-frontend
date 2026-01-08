import { FileItem, FolderItem } from "../types";
import axiosInstance from "./axios";
import { getFileType, formatFileSize, timeAgo } from "./mockDb";

interface DirectoryResponse {
  directory: {
    _id: string;
    name: string;
    size: number;
    parentDirId: string | null;
    fileCount: number;
    folderCount: number;
    totalSizeInByte: number;
    createdAt: string;
    updatedAt: string;
  };
  subdirectories: Array<{
    _id: string;
    name: string;
    size: number;
    parentDirId: string;
    createdAt: string;
    updatedAt: string;
    fileCount: number;
    folderCount: number;
    totalSizeInByte: number;
  }>;
  files: Array<{
    _id: string;
    name: string;
    size: number;
    extension: string;
    isUploading: boolean;
    parentDirId: string;
    createdAt: string;
    updatedAt: string;
    url: string;
    isStarred?: boolean;
    deletedAt?: string;
  }>;
  breadcrumbs: Array<{
    _id: string;
    name: string;
  }>;
}

export const fileService = {
  fetchFileSystem: async (
    folderId?: string | null,
  ): Promise<{
    folders: FolderItem[];
    files: FileItem[];
    breadcrumbs: FolderItem[];
    currentDirectory: {
      id: string;
      name: string;
      parentId: string | null;
    } | null;
  }> => {
    try {
      // ✅ Use /directory for root, /directory/:folderId for specific folders
      const endpoint = folderId ? `/directory/${folderId}` : `/directory`;
      const result = await axiosInstance.get<{ data: DirectoryResponse }>(
        endpoint,
      );

      const { subdirectories, files, breadcrumbs, directory } =
        result.data.data;

      // Transform folders
      const folders: FolderItem[] = subdirectories.map((dir) => ({
        id: dir._id,
        name: dir.name,
        color: ["blue", "orange", "emerald", "purple"][
          Math.floor(Math.random() * 4)
        ] as string,
        parentFolderId: dir.parentDirId,
        itemCount: dir.fileCount + dir.folderCount,
      }));

      // Transform files
      const transformedFiles: FileItem[] = files.map((f) => ({
        id: f._id,
        name: f.name,
        type: getFileType(f.extension) || "image",
        size: formatFileSize(f.size),
        thumbnail: f.url,
        isStarred: f.isStarred || false,
        deletedAt: f.deletedAt || undefined,
        url: f.url,
        parentFolderId: f.parentDirId,
        date: timeAgo(f.createdAt),
      }));

      // Transform breadcrumbs from backend
      const transformedBreadcrumbs: FolderItem[] = breadcrumbs.map((crumb) => ({
        id: crumb._id,
        name: crumb.name,
        itemCount: 0,
        color: "blue",
      }));

      // Current directory info
      const currentDirectory = directory
        ? {
            id: directory._id,
            name: directory.name,
            parentId: directory.parentDirId,
          }
        : null;

      return {
        folders,
        files: transformedFiles,
        breadcrumbs: transformedBreadcrumbs,
        currentDirectory,
      };
    } catch (error: any) {
      console.error("Error fetching file system:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch directory",
      );
    }
  },

  initiateUpload: async (
    name: string,
    size: number,
    mimeType: string,
    parentId: string,
  ): Promise<{ uploadUrl: string; fileKey: string; fileId: string }> => {
    const result = await axiosInstance.post("/files/upload/request", {
      name,
      size,
      extension: mimeType,
      parentDirId: parentId,
    });

    const uploadUrl = result.data.data.uploadUrl;
    const fileKey = result.data.data.s3Key;
    const fileId = result.data.data.fileId;

    return { uploadUrl, fileKey, fileId };
  },

  uploadFileToUrl: (
    url: string,
    file: File,
    onProgress: (progress: number) => void,
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("PUT", url, true);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (event: ProgressEvent) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          onProgress(100);
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network error during file upload"));
      };

      xhr.send(file);
    });
  },

  completeUpload: async (
    fileKey: string,
    fileId: string,
  ): Promise<FileItem> => {
    const result = await axiosInstance.post("/files/upload/complete", {
      fileId,
    });

    const fileInfo = result.data.data.file;

    const newFile: FileItem = {
      id: fileInfo._id,
      name: fileInfo.name,
      type: getFileType(fileInfo.extension) || "image",
      size: formatFileSize(fileInfo.size),
      date: timeAgo(fileInfo.createdAt),
      parentFolderId: fileInfo.parentDirId || undefined,
      url: fileInfo.url,
      thumbnail: fileInfo.url,
      isStarred: false,
      deletedAt: undefined,
    };
    return newFile;
  },

  toggleStar: async (fileId: string): Promise<void> => {
    await axiosInstance.patch("/files/toggle-star", { fileId });
  },

  renameFile: async (
    fileId: string,
    newName: string,
  ): Promise<{ fileName: string }> => {
    const result = await axiosInstance.patch("/files/rename", {
      fileId: fileId,
      newName: newName,
    });

    if (result.status !== 200)
      throw new Error("Failed to rename file. Please try again.");

    return { fileName: newName };
  },

  moveToTrash: async (fileId: string): Promise<{ deletedAt: string }> => {
    const result = await axiosInstance.patch("/files/move-to-trash", {
      fileId,
    });

    const { deleteAt } = result.data.data;

    return { deletedAt: deleteAt };
  },

  restoreFromTrash: async (fileId: string): Promise<void> => {
    await axiosInstance.patch("/files/remove-from-trash", {
      fileId,
    });
  },

  deleteForever: async (fileId: string): Promise<void> => {
    await axiosInstance.delete("/files/delete", {
      data: {
        fileId,
      },
    });
  },

  createFolder: async (
    name: string,
    parentFolderId: string,
  ): Promise<FolderItem> => {
    const result = await axiosInstance.post("/folders/create", {
      name,
      parentDirId: parentFolderId,
    });

    const folderInfo = result.data.data.folder;

    return {
      id: folderInfo._id,
      name: folderInfo.name,
      color: "amber",
      parentFolderId: folderInfo.parentDirId || undefined,
      itemCount: 0,
    };
  },

  downloadFile: async (
    fileId: string,
  ): Promise<{ downloadUrl: string; fileName: string }> => {
    const response = await axiosInstance.post("/files/download", {
      fileId,
    });

    const data = response.data.data;

    return {
      downloadUrl: data.downloadUrl,
      fileName: data.fileName,
    };
  },

  fetchTrashFiles: async (): Promise<{
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
  }> => {
    try {
      const result = await axiosInstance.get("/files/trash");
      const { groupedByDate, stats } = result.data.data;

      // Transform the grouped data
      const transformedGroups = groupedByDate.map((group: any) => ({
        date: group.date,
        count: group.count,
        totalSize: formatFileSize(group.totalSize),
        files: group.files.map((f: any) => ({
          id: f._id,
          name: f.name,
          type: getFileType(f.extension) || "image",
          size: formatFileSize(f.size),
          thumbnail: f.url,
          isStarred: f.isStarred || false,
          deletedAt: f.deletedAt,
          url: f.url,
          parentFolderId: f.parentDirId,
          date: timeAgo(f.createdAt),
          path: f.path,
          pathSegments: f.pathSegments,
        })),
      }));

      return {
        groupedByDate: transformedGroups,
        stats: {
          totalFiles: stats.totalFiles,
          totalSize: formatFileSize(stats.totalSize),
        },
      };
    } catch (error: any) {
      console.error("Error fetching trash files:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch trash files",
      );
    }
  },

  emptyTrash: async (): Promise<void> => {
    await axiosInstance.delete("/files/trash/empty");
  },

  getPublicFile: async (fileId: string, token: string): Promise<FileItem> => {
    // Implement if needed
    throw new Error("Not implemented");
  },

  sendInvite: async (fileId: string, emails: string[]): Promise<void> => {
    // Implement if needed
    throw new Error("Not implemented");
  },
};
