import React from "react";
import {
  X,
  CheckCircle,
  AlertCircle,
  File,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { UploadItem } from "../types";

interface UploadProgressProps {
  uploads: UploadItem[];
  onClose: () => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

const UploadProgress: React.FC<UploadProgressProps> = ({
  uploads,
  onClose,
  isMinimized,
  onToggleMinimize,
}) => {
  if (uploads.length === 0) return null;

  const completedCount = uploads.filter((u) => u.status === "completed").length;
  const isAllCompleted = completedCount === uploads.length;

  return (
    <div className="fixed bottom-6 right-6 z-40 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 transition-colors">
      {/* Header */}
      <div
        className="bg-slate-900 dark:bg-slate-950 text-white px-4 py-3 flex items-center justify-between cursor-pointer border-b border-transparent dark:border-slate-800"
        onClick={onToggleMinimize}
      >
        <div className="flex items-center">
          <span className="font-medium text-sm">
            {isAllCompleted
              ? "Upload Complete"
              : `Uploading ${uploads.length - completedCount} items`}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-1 hover:bg-white/20 rounded">
            {isMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1 hover:bg-white/20 rounded"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Body */}
      {!isMinimized && (
        <div className="max-h-64 overflow-y-auto bg-white dark:bg-slate-900">
          {uploads.map((file) => (
            <div
              key={file.id}
              className="p-3 border-b border-slate-100 dark:border-slate-800 last:border-0 flex items-center transition-colors"
            >
              <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-3 text-slate-500 dark:text-slate-400">
                <File size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                    {file.name}
                  </p>
                  {file.status === "error" ? (
                    <AlertCircle
                      size={14}
                      className="text-red-500 dark:text-red-400"
                    />
                  ) : file.status === "completed" ? (
                    <CheckCircle
                      size={14}
                      className="text-green-500 dark:text-green-400"
                    />
                  ) : (
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {file.progress}%
                    </span>
                  )}
                </div>
                {file.status === "uploading" && (
                  <div className="w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 dark:bg-brand-400 transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}
                {file.status === "error" && (
                  <p className="text-xs text-red-500 dark:text-red-400">
                    Upload failed
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadProgress;
