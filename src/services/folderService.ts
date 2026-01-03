import { FolderItem } from "../types";
import axiosInstance from "./axios";

export const folderService = {
  createFolder: async (
    name: string,
    parentId?: string,
  ): Promise<FolderItem> => {
    const result = await axiosInstance.post("/directory/create", {
      name,
      parentDirId: parentId,
    });

    const folderData = result.data.data;
    const newFolder: FolderItem = {
      id: folderData._id,
      name: folderData.name,
      itemCount: 0,
      color: ["blue", "orange", "emerald", "purple"][
        Math.floor(Math.random() * 4)
      ],
      parentFolderId: parentId,
    };

    return newFolder;
  },
};
