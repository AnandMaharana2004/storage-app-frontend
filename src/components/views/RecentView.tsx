import React from "react";
import FileCard from "../FileCard";
import FileList from "../FileList";
import { FileItem, ViewMode } from "../../types";
import { FileCardSkeleton, FileListSkeleton } from "../Skeletons";

interface RecentViewProps {
  files: FileItem[];
  onPreview: (file: FileItem) => void;
  viewMode: ViewMode;
  onToggleStar?: (id: string) => void;
  onMoveToTrash?: (id: string) => void;
  onShare?: (file: FileItem) => void;
  isLoading?: boolean;
}

const RecentView: React.FC<RecentViewProps> = ({
  files,
  onPreview,
  viewMode,
  onToggleStar,
  onMoveToTrash,
  onShare,
  isLoading,
}) => {
  // Filter out deleted items
  const recentFiles = files.filter((f) => !f.deletedAt);

  const renderContent = () => {
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

    if (viewMode === "LIST") {
      return (
        <FileList
          files={recentFiles}
          onPreview={onPreview}
          onToggleStar={onToggleStar}
          onMoveToTrash={onMoveToTrash}
          onShare={onShare}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recentFiles.map((file) => (
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

export default RecentView;
