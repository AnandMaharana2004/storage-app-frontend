import { AwardIcon } from "lucide-react";
import { FileItem, FolderItem } from "../types";
import axiosInstance from "./axios";
import {
  mockDb,
  delay,
  shouldFail,
  getFileType,
  formatFileSize,
  timeAgo,
} from "./mockDb";

export const fileService = {
  fetchFileSystem: async (
    directoryName: string,
  ): Promise<{
    folders: FolderItem[];
    files: FileItem[];
  }> => {
    const result = await axiosInstance.get(`/directory/${directoryName}`);
    const { subdirectories, files } = result.data.data;

    const folders = subdirectories.map((dir) => {
      return {
        id: dir._id,
        name: dir.name,
        color: ["blue", "orange", "emerald", "purple"][
          Math.floor(Math.random() * 4)
        ],
        parentFolderId: dir.parentDirId ?? null,
        itemCount: dir.itemCount ?? 0,
      };
    });
    const finalFiles = files.map((f) => {
      return {
        id: f._id,
        name: f.name,
        type: getFileType(f.extension) || "image",
        size: formatFileSize(f.size),
        thumbnail: f.url,
        // thumbnail: "./video-placeholder.webp",
        isStarred: f.isStarred || false,
        deletedAt: f.deletedAt || null,
        url: f.url,
        parentFolderId: f.parentDirId || null,
        date: timeAgo(f.createdAt),
      };
    });
    return {
      folders: folders,
      files: finalFiles,
    };
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

  // FIXED: Properly transform API response to FileItem format
  completeUpload: async (
    fileKey: string,
    fileId: string,
  ): Promise<FileItem> => {
    const result = await axiosInstance.post("/files/upload/complete", {
      fileId,
    });

    const fileInfo = result.data.data.file;

    // Transform the API response to match FileItem interface
    const newFile: FileItem = {
      id: fileInfo._id,
      name: fileInfo.name,
      type: getFileType(fileInfo.extension) || "image",
      size: formatFileSize(fileInfo.size),
      date: timeAgo(fileInfo.createdAt),
      parentFolderId: fileInfo.parentDirId || null,
      url: fileInfo.url,
      thumbnail: fileInfo.url,
      isStarred: false,
      deletedAt: null,
    };
    return newFile;
  },

  toggleStar: async (fileId: string): Promise<void> => {
    await delay(200);
    mockDb.files = mockDb.files.map((f) =>
      f.id === fileId ? { ...f, isStarred: !f.isStarred } : f,
    );
  },

  renameFile: async (
    fileId: string,
    newName: string,
  ): Promise<{ fileName: string }> => {
    const result = await axiosInstance.patch("/files/rename", {
      fileId: fileId,
      newName: newName,
    });

    if (result.status != 200)
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

  // ADDED: New method to create folder that returns the created folder
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
      parentFolderId: folderInfo.parentId || null,
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

  getPublicFile: async (fileId: string, token: string): Promise<FileItem> => {
    await delay(800);
    const file = mockDb.files.find((f) => f.id === fileId);
    if (!file || file.deletedAt)
      throw new Error("File not found or link expired.");
    return file;
  },

  sendInvite: async (fileId: string, emails: string[]): Promise<void> => {
    await delay(1000);
    if (shouldFail())
      throw new Error("Failed to send invites. Please try again.");
  },
};
