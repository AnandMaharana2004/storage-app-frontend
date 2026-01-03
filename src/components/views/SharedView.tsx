import React from "react";
import FileCard from "../FileCard";
import FileList from "../FileList";
import { FileItem, ViewMode } from "../../types";
import { Users } from "lucide-react";
import { FileCardSkeleton, FileListSkeleton } from "../Skeletons";

interface SharedViewProps {
  files: FileItem[];
  onPreview: (file: FileItem) => void;
  viewMode: ViewMode;
  onToggleStar?: (id: string) => void;
  onMoveToTrash?: (id: string) => void;
  onShare?: (file: FileItem) => void;
  isLoading?: boolean;
}

const SharedView: React.FC<SharedViewProps> = ({
  files,
  onPreview,
  viewMode,
  onToggleStar,
  onMoveToTrash,
  onShare,
  isLoading,
}) => {
  const sharedFiles = files.filter((f) => f.sharedBy && !f.deletedAt);

  const renderContent = () => {
    if (isLoading) {
      if (viewMode === "LIST") {
        return <FileListSkeleton />;
      }
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <FileCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (sharedFiles.length === 0) {
      return (
        <div
          className="text-center py-20 rounded-2xl border border-dashed
                     bg-white dark:bg-slate-900
                     border-slate-300 dark:border-slate-700"
        >
          <Users
            size={48}
            className="mx-auto mb-4 text-slate-300 dark:text-slate-600"
          />
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200">
            No shared files
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Files shared with you will appear here.
          </p>
        </div>
      );
    }

    if (viewMode === "LIST") {
      return (
        <FileList
          files={sharedFiles}
          onPreview={onPreview}
          onToggleStar={onToggleStar}
          onMoveToTrash={onMoveToTrash}
          onShare={onShare}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sharedFiles.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            onPreview={() => onPreview(file)}
            onToggleStar={onToggleStar}
            onMoveToTrash={onMoveToTrash}
            onShare={onShare}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div
          className="p-2 rounded-lg mr-3
                     bg-blue-100 text-brand-600
                     dark:bg-blue-900/30 dark:text-blue-400"
        >
          <Users size={24} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Shared with me
        </h2>
      </div>

      {renderContent()}
    </div>
  );
};

export default SharedView;
