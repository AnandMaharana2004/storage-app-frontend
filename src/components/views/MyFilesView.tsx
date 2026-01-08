import React from "react";
import { FolderOpen, Folder, ChevronRight } from "lucide-react";
import UploadWidget from "../UploadWidget";
import FolderCard from "../FolderCard";
import FileCard from "../FileCard";
import FileList from "../FileList";
import { FileItem, FolderItem, ViewMode } from "../../types";
import {
  FolderCardSkeleton,
  FileCardSkeleton,
  FileListSkeleton,
} from "../Skeletons";

interface MyFilesViewProps {
  folders: FolderItem[];
  files: FileItem[];
  breadcrumbs: FolderItem[];
  currentDirectory: {
    id: string;
    name: string;
    parentId: string | null;
  } | null;
  onPreview: (file: FileItem) => void;
  onDropFiles: (files: File[]) => void;
  onFolderClick: (folderId: string) => void;
  onBreadcrumbClick: (folderId: string | null) => void;
  viewMode: ViewMode;
  onToggleStar?: (id: string) => void;
  onMoveToTrash?: (id: string) => void;
  onShare?: (file: FileItem) => void;
  onRename?: (file: FileItem) => void;
  isLoading?: boolean;
}

const folderColorStyles: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  orange:
    "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
  emerald:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  purple:
    "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
};

const MyFilesView: React.FC<MyFilesViewProps> = ({
  folders,
  files,
  breadcrumbs,
  currentDirectory,
  onPreview,
  onDropFiles,
  onFolderClick,
  onBreadcrumbClick,
  viewMode,
  onToggleStar,
  onMoveToTrash,
  onShare,
  onRename,
  isLoading,
}) => {
  // ✅ Filter out deleted files
  const displayFiles = files.filter((f) => !f.deletedAt);
  const isEmpty =
    !isLoading && folders.length === 0 && displayFiles.length === 0;

  const renderFolders = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <FolderCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (folders.length === 0) {
      return null;
    }

    if (viewMode === "LIST") {
      return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col w-full transition-colors overflow-hidden">
          <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-slate-200">
            <table className="w-full text-left border-collapse min-w-[300px]">
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {folders.map((folder) => {
                  const colorClasses =
                    folderColorStyles[folder.color] || folderColorStyles.blue;
                  return (
                    <tr
                      key={folder.id}
                      onClick={() => onFolderClick(folder.id)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                    >
                      <td className="px-3 sm:px-6 py-4">
                        <div className="flex items-center min-w-0">
                          <div
                            className={`p-2 rounded-lg mr-3 shrink-0 ${colorClasses}`}
                          >
                            <Folder size={18} className="fill-current" />
                          </div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate block">
                            {folder.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {folder.itemCount} items
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {folders.map((folder) => (
          <FolderCard key={folder.id} folder={folder} onClick={onFolderClick} />
        ))}
      </div>
    );
  };

  const renderFiles = () => {
    if (isLoading) {
      if (viewMode === "LIST") {
        return <FileListSkeleton />;
      }
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <FileCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (displayFiles.length === 0) {
      return null;
    }

    if (viewMode === "LIST") {
      return (
        <FileList
          files={displayFiles}
          onPreview={onPreview}
          onToggleStar={onToggleStar}
          onMoveToTrash={onMoveToTrash}
          onShare={onShare}
          onRename={onRename}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayFiles.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            onPreview={() => onPreview(file)}
            onToggleStar={onToggleStar}
            onMoveToTrash={onMoveToTrash}
            onShare={onShare}
            onRename={onRename}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 w-full">
      {/* Folder Stats */}
      <div className="mb-6">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {isLoading ? (
            "Loading contents..."
          ) : (
            <>
              {folders.length > 0 && `${folders.length} folders`}
              {folders.length > 0 && displayFiles.length > 0 && ", "}
              {displayFiles.length > 0 && `${displayFiles.length} files`}
              {isEmpty && "Empty folder"}
            </>
          )}
        </p>
      </div>

      <UploadWidget onFilesDropped={onDropFiles} />

      {/* Empty State */}
      {isEmpty && !isLoading && (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 transition-colors">
          <div className="bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
            <FolderOpen
              size={32}
              className="text-slate-400 dark:text-slate-500"
            />
          </div>
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200">
            {currentDirectory ? "Folder is empty" : "No files or folders yet"}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Upload files or create folders to get started
          </p>
        </div>
      )}

      {/* Folders Section */}
      {(isLoading || folders.length > 0) && (
        <div className="mb-8 animate-in slide-in-from-bottom-2 duration-300">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
            Folders
          </h3>
          {renderFolders()}
        </div>
      )}

      {/* Files Section */}
      {(isLoading || displayFiles.length > 0) && (
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
            Files
          </h3>
          {renderFiles()}
        </div>
      )}
    </div>
  );
};

export default MyFilesView;
