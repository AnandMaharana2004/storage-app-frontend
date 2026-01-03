import React, { useState, useRef } from "react";
import { UploadCloud, X } from "lucide-react";

interface UploadWidgetProps {
  onFilesDropped?: (files: File[]) => void;
}

const UploadWidget: React.FC<UploadWidgetProps> = ({ onFilesDropped }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);

    if (onFilesDropped && droppedFiles.length > 0) {
      onFilesDropped(droppedFiles);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);

      if (onFilesDropped) {
        onFilesDropped(selectedFiles);
      }

      // Reset input so same file can be selected again
      e.target.value = "";
    }
  };

  if (!isExpanded) {
    return (
      <div className="mb-8 flex justify-end">
        <button
          onClick={() => setIsExpanded(true)}
          className="text-sm text-brand-600 dark:text-brand-400 font-medium hover:underline flex items-center transition-colors"
        >
          <UploadCloud size={16} className="mr-2" />
          Show Dropzone
        </button>
      </div>
    );
  }

  return (
    <div
      className={`relative mb-8 rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out
        ${
          isDragging
            ? "border-brand-500 bg-brand-50/50 dark:bg-brand-900/10 scale-[1.01]"
            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-brand-300 dark:hover:border-slate-600"
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <button
        onClick={() => setIsExpanded(false)}
        className="absolute top-3 right-3 p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <X size={16} />
      </button>

      {/* Hidden File Input - accepts ALL file types */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        onChange={handleFileInputChange}
      />

      <div className="py-8 flex flex-col items-center justify-center text-center px-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
            isDragging
              ? "bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400"
              : "bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
          }`}
        >
          <UploadCloud size={24} />
        </div>

        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1 transition-colors">
          Drag & drop files here
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">
          or{" "}
          <span
            onClick={handleBrowseClick}
            className="text-brand-600 dark:text-brand-400 cursor-pointer hover:underline font-medium"
          >
            browse
          </span>{" "}
          from your computer
        </p>

        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 transition-colors">
          All file types supported
        </p>
      </div>
    </div>
  );
};

export default UploadWidget;
