import React, { useEffect, useState } from "react";
import { Share2, Copy, CheckCircle, MapPin } from "lucide-react";
import FileCard from "../FileCard";
import FileList from "../FileList";
import { FileItem, ViewMode } from "../../types";
import { FileCardSkeleton, FileListSkeleton } from "../Skeletons";
import { useFileSystem } from "../../context/FileSystemContext";
import { api } from "../../services/api";

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
  onPreview,
  viewMode,
  onToggleStar,
  onMoveToTrash,
  onShare,
}) => {
  const [sharedFiles, setSharedFiles] = useState<FileItem[]>([]);
  const [stats, setStats] = useState<{
    totalFiles: number;
    totalSize: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Load shared files when component mounts
  useEffect(() => {
    loadSharedFiles();
  }, [onShare]);

  const loadSharedFiles = async () => {
    setIsLoading(true);
    try {
      const data = await api.fetchPublicFiles();
      setSharedFiles(data.files);
      setStats(data.stats);
    } catch (error) {
      console.error("Failed to load shared files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatPath = (filePath: string) => {
    return (
      filePath.replace(/^\//, "").split("/").slice(1).join(" > ") || "Root"
    );
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

    if (sharedFiles.length === 0) {
      return (
        <div className="text-center py-20 rounded-2xl border border-dashed bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700">
          <Share2
            size={48}
            className="mx-auto mb-4 text-slate-300 dark:text-slate-600"
          />
          <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200">
            No public files
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Files you share publicly will appear here.
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
          <div key={file.id} className="relative">
            <FileCard
              file={file}
              path={(file as any).path}
              onPreview={() => onPreview(file)}
              onToggleStar={onToggleStar}
              onMoveToTrash={onMoveToTrash}
              onShare={onShare}
              showPublicBadge={true}
              publicUrl={(file as any).publicUrl}
              onCopyLink={handleCopyLink}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {stats && stats.totalFiles > 0
              ? `${stats.totalFiles} ${stats.totalFiles === 1 ? "file" : "files"} · ${stats.totalSize}`
              : "Manage your publicly shared files"}
          </p>
        </div>
      </div>

      {/* Info Banner */}
      {!isLoading && sharedFiles.length > 0 && (
        <div className="flex items-start gap-3 p-4 mb-6 rounded-xl border bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/40">
          <Share2
            size={18}
            className="mt-0.5 shrink-0 text-blue-500 dark:text-blue-400"
          />
          <p className="text-sm text-blue-800 dark:text-blue-300">
            These files are publicly accessible. Anyone with the link can view
            and download them.
          </p>
        </div>
      )}

      {/* Content */}
      {renderContent()}

      {/* Copy confirmation toast */}
      {copiedUrl && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-4 duration-300 z-50">
          <CheckCircle size={18} />
          <span className="text-sm font-medium">Link copied to clipboard!</span>
        </div>
      )}
    </div>
  );
};

export default SharedView;
