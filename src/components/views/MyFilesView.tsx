import React, { useMemo } from "react";
import { FolderOpen, Folder } from "lucide-react";
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
import { useUser } from "../../context/UserContext";

interface MyFilesViewProps {
  folders: FolderItem[];
  files: FileItem[];
  onPreview: (file: FileItem) => void;
  onDropFiles: (files: File[]) => void;
  currentFolderId: string | null;
  onFolderClick: (folderId: string) => void;
  onNavigateUp: () => void;
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
};

const MyFilesView: React.FC<MyFilesViewProps> = ({
  folders,
  files,
  onPreview,
  onDropFiles,
  currentFolderId,
  onFolderClick,
  onNavigateUp,
  viewMode,
  onToggleStar,
  onMoveToTrash,
  onShare,
  onRename,
  isLoading,
}) => {
  const { user } = useUser();

  const currentFolder = useMemo(
    () =>
      currentFolderId ? folders.find((f) => f.id === currentFolderId) : null,
    [currentFolderId, folders],
  );

  // ✅ OPTIMIZED: Memoized filtering with proper root handling
  const displayFolders = useMemo(() => {
    return folders.filter((f) => {
      if (currentFolderId) {
        return f.parentFolderId === currentFolderId;
      } else {
        // Root level: show folders with no parent OR rootDir parent
        return !f.parentFolderId || f.parentFolderId === user?.rootDir;
      }
    });
  }, [folders, currentFolderId, user?.rootDir]);

  const displayFiles = useMemo(() => {
    return files.filter((f) => {
      if (f.deletedAt) return false;
      if (currentFolderId) {
        return f.parentFolderId === currentFolderId;
      } else {
        // Root level: show files with no parent OR rootDir parent
        return !f.parentFolderId || f.parentFolderId === user?.rootDir;
      }
    });
  }, [files, currentFolderId, user?.rootDir]);

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

    if (displayFolders.length === 0) {
      return null;
    }

    if (viewMode === "LIST") {
      return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col w-full transition-colors overflow-hidden">
          <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-slate-200">
            <table className="w-full text-left border-collapse min-w-[300px]">
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {displayFolders.map((folder) => {
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
        {displayFolders.map((folder) => (
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

  // ✅ FIXED: Better empty state handling
  const isEmpty =
    !isLoading && displayFolders.length === 0 && displayFiles.length === 0;

  if (currentFolderId && currentFolder) {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300 w-full">
        {/* ✅ Removed redundant back button and folder name - breadcrumbs handle navigation */}
        <div className="mb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isLoading ? (
              "Loading contents..."
            ) : (
              <>
                {displayFolders.length > 0 &&
                  `${displayFolders.length} folders`}
                {displayFolders.length > 0 && displayFiles.length > 0 && ", "}
                {displayFiles.length > 0 && `${displayFiles.length} files`}
                {isEmpty && "Empty folder"}
              </>
            )}
          </p>
        </div>

        <UploadWidget onFilesDropped={onDropFiles} />

        {isEmpty && !isLoading && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 transition-colors">
            <div className="bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
              <FolderOpen
                size={32}
                className="text-slate-400 dark:text-slate-500"
              />
            </div>
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200">
              Folder is empty
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Upload files or create folders to get started
            </p>
          </div>
        )}

        {(isLoading || displayFolders.length > 0) && (
          <div className="mb-8 animate-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
              Folders
            </h3>
            {renderFolders()}
          </div>
        )}

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
  }

  // Root view
  return (
    <>
      <UploadWidget onFilesDropped={onDropFiles} />

      {(isLoading || displayFolders.length > 0) && (
        <div className="mb-10 animate-in slide-in-from-bottom-4 duration-500 fade-in w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              Folders
            </h2>
          </div>
          {renderFolders()}
        </div>
      )}

      {(isLoading || displayFiles.length > 0) && (
        <div className="animate-in slide-in-from-bottom-8 duration-700 fade-in fill-mode-backwards w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              Files
            </h2>
            <div className="flex items-center space-x-2">
              <select className="text-sm bg-transparent border-none text-slate-500 dark:text-slate-400 focus:ring-0 cursor-pointer outline-none">
                <option>Last Modified</option>
                <option>Name</option>
                <option>Size</option>
              </select>
            </div>
          </div>
          {renderFiles()}
        </div>
      )}

      {isEmpty && !isLoading && (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 transition-colors">
          <div className="bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
            <FolderOpen
              size={32}
              className="text-slate-400 dark:text-slate-500"
            />
          </div>
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200">
            No files or folders yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Upload files or create folders to get started
          </p>
        </div>
      )}
    </>
  );
};

export default MyFilesView;
