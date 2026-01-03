import React, { useState, useEffect, useMemo } from "react";
import { X, Edit2 } from "lucide-react";

interface RenameFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (newName: string) => void;
  initialName: string;
}

const RenameFileModal: React.FC<RenameFileModalProps> = ({
  isOpen,
  onClose,
  onRename,
  initialName,
}) => {
  // Separate extension from filename
  const splitName = useMemo(() => {
    const lastDotIndex = initialName.lastIndexOf(".");
    if (lastDotIndex === -1 || lastDotIndex === 0) {
      return { name: initialName, ext: "" };
    }
    return {
      name: initialName.substring(0, lastDotIndex),
      ext: initialName.substring(lastDotIndex),
    };
  }, [initialName]);

  const [fileName, setFileName] = useState(splitName.name);

  useEffect(() => {
    if (isOpen) {
      setFileName(splitName.name);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, splitName.name]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = fileName.trim();
    if (cleanName && cleanName !== splitName.name) {
      onRename(cleanName + splitName.ext);
      onClose();
    } else if (cleanName === splitName.name) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-sm shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200 border dark:border-slate-800 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 dark:text-white">
            Rename File
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            New File Name
          </label>
          <div className="relative mb-6">
            <div className="flex items-center w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 focus-within:bg-white dark:focus-within:bg-slate-950 transition-all">
              <Edit2
                size={16}
                className="text-slate-400 dark:text-slate-500 mr-2 shrink-0"
              />
              <input
                type="text"
                autoFocus
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white text-sm p-0 min-w-0"
                onFocus={(e) => e.target.select()}
              />
              {splitName.ext && (
                <span className="text-slate-400 dark:text-slate-500 text-sm font-medium ml-1 select-none shrink-0">
                  {splitName.ext}
                </span>
              )}
            </div>
            <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 italic">
              Extensions are locked for safety.
            </p>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!fileName.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Rename
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenameFileModal;
