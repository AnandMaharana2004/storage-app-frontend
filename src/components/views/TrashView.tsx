import React, { useEffect, useState } from "react";
import FileCard from "../FileCard";
import FileList from "../FileList";
import { FileItem, ViewMode } from "../../types";
import { Trash2, AlertTriangle, MapPin } from "lucide-react";
import { FileCardSkeleton, FileListSkeleton } from "../Skeletons";
import { useFileSystem } from "../../context/FileSystemContext";

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
  const { trashData, loadTrashFiles, emptyTrash } = useFileSystem();
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);

  // Load trash files when component mounts
  useEffect(() => {
    loadTrashFiles();
  }, [loadTrashFiles]);

  const handleEmptyTrash = async () => {
    await emptyTrash();
    setShowEmptyConfirm(false);
  };

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

    if (!trashData || trashData.stats.totalFiles === 0) {
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

    return (
      <div className="space-y-8">
        {trashData.groupedByDate.map((group) => (
          <div key={group.date} className="animate-in fade-in duration-300">
            {/* Date Header */}
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {group.date}
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {group.count} {group.count === 1 ? "file" : "files"} ·{" "}
                {group.totalSize}
              </span>
            </div>

            {/* Files Grid/List */}
            {viewMode === "LIST" ? (
              <FileList
                files={group.files}
                onPreview={onPreview}
                onRestore={onRestore}
                onDeleteForever={onDeleteForever}
                showPath={true}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {group.files.map((file) => (
                  <div key={file.id} className="relative">
                    <FileCard
                      key={file.id}
                      file={file}
                      path={(file as any).path} // Pass path as prop
                      onPreview={() => onPreview(file)}
                      onRestore={onRestore}
                      onDeleteForever={onDeleteForever}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {trashData && trashData.stats.totalFiles > 0
                ? `${trashData.stats.totalFiles} ${trashData.stats.totalFiles === 1 ? "item" : "items"} · ${trashData.stats.totalSize}`
                : "Items in trash are deleted forever after 30 days"}
            </p>
          </div>
        </div>
      </div>

      {/* Warning Banner – only when trash has files */}
      {!isLoading && trashData && trashData.stats.totalFiles > 0 && (
        <div
          className="flex flex-col sm:flex-row sm:items-start gap-3 p-4 mb-6 rounded-xl border
               bg-orange-50 border-orange-100
               dark:bg-orange-900/20 dark:border-orange-900/40"
        >
          <div className="flex items-start flex-1 min-w-0">
            <AlertTriangle
              size={18}
              className="mr-3 mt-0.5 shrink-0 text-orange-500 dark:text-orange-400"
            />
            <p className="text-sm text-orange-800 dark:text-orange-300">
              You can restore files from here. Emptying trash will permanently
              delete these items.
            </p>
          </div>

          <button
            onClick={() => setShowEmptyConfirm(true)}
            className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-semibold
             bg-orange-600 hover:bg-orange-700 text-white
             dark:bg-orange-500 dark:hover:bg-orange-600
             transition-colors whitespace-nowrap"
          >
            <Trash2 size={16} className="inline mr-2 -mt-0.5" />
            Empty Trash
          </button>
        </div>
      )}

      {/* Empty Trash Confirmation */}
      {showEmptyConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 mr-4">
                <AlertTriangle
                  size={24}
                  className="text-red-600 dark:text-red-400"
                />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Empty Trash?
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              This will permanently delete all {trashData?.stats.totalFiles}{" "}
              items in trash. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEmptyConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700
                         text-slate-700 dark:text-slate-300 font-medium
                         hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEmptyTrash}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium
                         hover:bg-red-700 transition-colors"
              >
                Empty Trash
              </button>
            </div>
          </div>
        </div>
      )}

      {renderContent()}
    </div>
  );
};

export default TrashView;
