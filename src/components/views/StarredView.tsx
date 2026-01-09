import React from "react";
import FileCard from "../FileCard";
import FileList from "../FileList";
import { FileItem, ViewMode } from "../../types";
import { Star } from "lucide-react";
import { FileCardSkeleton, FileListSkeleton } from "../Skeletons";

interface StarredViewProps {
  files: FileItem[];
  onPreview: (file: FileItem) => void;
  viewMode: ViewMode;
  onToggleStar?: (id: string) => void;
  onMoveToTrash?: (id: string) => void;
  onShare?: (file: FileItem) => void;
  isLoading?: boolean;
}

const StarredView: React.FC<StarredViewProps> = ({
  files,
  onPreview,
  viewMode,
  onToggleStar,
  onMoveToTrash,
  onShare,
  isLoading,
}) => {
  const starredFiles = files.filter((f) => f.isStarred && !f.deletedAt);

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

    if (starredFiles.length === 0) {
      return (
        <div
          className="text-center py-20 rounded-2xl border border-dashed
                     bg-white dark:bg-slate-900
                     border-slate-300 dark:border-slate-700"
        >
          <Star
            size={48}
            className="mx-auto mb-4 text-slate-300 dark:text-slate-600"
          />
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200">
            No starred files
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Star items to find them easily later.
          </p>
        </div>
      );
    }

    if (viewMode === "LIST") {
      return (
        <FileList
          files={starredFiles}
          onPreview={onPreview}
          onToggleStar={onToggleStar}
          onMoveToTrash={onMoveToTrash}
          onShare={onShare}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {starredFiles.map((file) => (
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
    <div className="animate-in fade-in duration-500">{renderContent()}</div>
  );
};

export default StarredView;
