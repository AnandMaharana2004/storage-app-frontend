import React from "react";
import FileCard from "../FileCard";
import FileList from "../FileList";
import { FileItem, ViewMode } from "../../types";
import { Trash2, AlertTriangle } from "lucide-react";
import { FileCardSkeleton, FileListSkeleton } from "../Skeletons";

interface TrashViewProps {
  files: FileItem[];
  onPreview: (file: FileItem) => void;
  viewMode: ViewMode;
  onRestore?: (id: string) => void;
  onDeleteForever?: (id: string) => void;
  isLoading?: boolean;
}

const TrashView: React.FC<TrashViewProps> = ({
  files,
  onPreview,
  viewMode,
  onRestore,
  onDeleteForever,
  isLoading,
}) => {
  const trashFiles = files.filter((f) => f.deletedAt);
  const hasTrashFiles = trashFiles.length > 0;

  const renderContent = () => {
    if (isLoading) {
      if (viewMode === "LIST") {
        return <FileListSkeleton />;
      }
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 opacity-75">
          {[1, 2, 3, 4].map((i) => (
            <FileCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (!hasTrashFiles) {
      return (
        <div
          className="text-center py-20 rounded-2xl border border-dashed
                     bg-white dark:bg-slate-900
                     border-slate-300 dark:border-slate-700"
        >
          <Trash2
            size={48}
            className="mx-auto mb-4 text-slate-300 dark:text-slate-600"
          />
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200">
            Trash is empty
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Great job keeping things tidy!
          </p>
        </div>
      );
    }

    if (viewMode === "LIST") {
      return (
        <FileList
          files={trashFiles}
          onPreview={onPreview}
          onRestore={onRestore}
          onDeleteForever={onDeleteForever}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 opacity-75">
        {trashFiles.map((file) => (
          <FileCard
            key={file.id}
            file={file}
            onPreview={() => onPreview(file)}
            onRestore={onRestore}
            onDeleteForever={onDeleteForever}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center mb-4">
        <div
          className="p-2 rounded-lg mr-3
                     bg-red-100 text-red-600
                     dark:bg-red-900/30 dark:text-red-400"
        >
          <Trash2 size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Trash
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Items in trash are deleted forever after 30 days.
          </p>
        </div>
      </div>

      {/* Warning Banner — only when trash has files */}
      {!isLoading && hasTrashFiles && (
        <div
          className="flex items-start p-4 mb-6 rounded-xl border
                     bg-orange-50 border-orange-100
                     dark:bg-orange-900/20 dark:border-orange-900/40"
        >
          <AlertTriangle
            size={18}
            className="mr-3 mt-0.5 shrink-0
                       text-orange-500 dark:text-orange-400"
          />
          <p className="text-sm text-orange-800 dark:text-orange-300">
            You can restore files from here. Emptying trash will permanently
            delete these items.
          </p>
          <button
            className="ml-auto text-sm font-semibold
                       text-orange-700 hover:text-orange-900
                       dark:text-orange-400 dark:hover:text-orange-300"
          >
            Empty Trash
          </button>
        </div>
      )}

      {renderContent()}
    </div>
  );
};

export default TrashView;
