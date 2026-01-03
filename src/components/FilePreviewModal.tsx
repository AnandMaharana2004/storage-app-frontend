import React, { useEffect, useState, useRef } from "react";
import {
  X,
  Download,
  Share2,
  Info,
  FileText,
  MoreVertical,
  Star,
  Trash2,
} from "lucide-react";
import { FileItem } from "../types";
import { api } from "../services/api";

interface FilePreviewModalProps {
  file: FileItem | null;
  onClose: () => void;
  onShare?: (file: FileItem) => void;
  onToggleStar?: (id: string) => void;
  onMoveToTrash?: (id: string) => void;
}

const TEXT_VIEWABLE_TYPES: FileItem["type"][] = ["pdf", "doc"];

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  file,
  onClose,
  onShare,
  onToggleStar,
  onMoveToTrash,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  /* ---------------- Effects ---------------- */

  useEffect(() => {
    if (file) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [file]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  if (!file) return null;

  /* ---------------- Helpers ---------------- */

  const isTextViewable = TEXT_VIEWABLE_TYPES.includes(file.type);

  const downloadHandler = async () => {
    try {
      const { downloadUrl, fileName } = await api.downloadFile(file.id);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName || file.name;
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      alert("Failed to download file");
    }
  };

  /* ---------------- Redirect text files ---------------- */

  if (isTextViewable) {
    window.open(file.url, "_blank", "noopener,noreferrer");
    onClose();
    return null;
  }

  /* ---------------- Render ---------------- */

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="flex flex-col w-full h-full sm:h-[90vh] sm:max-w-6xl
                   bg-white dark:bg-slate-900
                   sm:rounded-xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ---------------- Header ---------------- */}
        <div
          className="h-14 flex items-center justify-between px-4
                        border-b border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center min-w-0">
            <button
              onClick={onClose}
              className="p-2 mr-2 rounded-full
                         hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X size={18} />
            </button>

            <div className="flex items-center min-w-0">
              <FileText
                size={18}
                className="text-slate-500 dark:text-slate-400 mr-2"
              />
              <h3 className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                {file.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={downloadHandler}
              className="p-2 rounded-full
                         hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Download size={18} />
            </button>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-full
                           hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <MoreVertical size={18} />
              </button>

              {showMenu && (
                <div
                  className="absolute right-0 mt-2 w-56
                             bg-white dark:bg-slate-800
                             border border-slate-200 dark:border-slate-700
                             rounded-lg shadow-lg py-1"
                >
                  {onShare && (
                    <button
                      onClick={() => {
                        onShare(file);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm
                                 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <Share2 size={16} className="inline mr-2" />
                      Share
                    </button>
                  )}

                  {onToggleStar && (
                    <button
                      onClick={() => {
                        onToggleStar(file.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm
                                 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <Star
                        size={16}
                        className={`inline mr-2 ${
                          file.isStarred
                            ? "fill-yellow-400 text-yellow-400"
                            : ""
                        }`}
                      />
                      {file.isStarred ? "Remove Star" : "Add Star"}
                    </button>
                  )}

                  {onMoveToTrash && (
                    <>
                      <div className="my-1 border-t border-slate-200 dark:border-slate-700" />
                      <button
                        onClick={() => {
                          onMoveToTrash(file.id);
                          setShowMenu(false);
                          onClose();
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-500
                                   hover:bg-red-50 dark:hover:bg-red-900/30"
                      >
                        <Trash2 size={16} className="inline mr-2" />
                        Move to Trash
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              className="hidden sm:block p-2 rounded-full
                         hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Info size={18} />
            </button>
          </div>
        </div>

        {/* ---------------- Content ---------------- */}
        {/* ---------------- Content ---------------- */}
        <div
          className="flex-1 flex items-center justify-center
             max-h-[calc(100vh-3.5rem)]
             overflow-hidden
             p-4
             bg-slate-50 dark:bg-slate-950"
        >
          {file.type === "image" && (
            <img
              src={file.url}
              alt={file.name}
              className="max-h-full max-w-full object-contain"
            />
          )}

          {file.type === "video" && (
            <video
              src={file.url}
              poster={file.thumbnail}
              controls
              className="max-h-full max-w-full rounded-lg bg-black"
            />
          )}

          {file.type === "audio" && (
            <div
              className="w-full max-w-md p-6 bg-white dark:bg-slate-900
                    border border-slate-200 dark:border-slate-700
                    rounded-xl"
            >
              <p className="text-sm mb-4 text-slate-700 dark:text-slate-300 truncate">
                {file.name}
              </p>
              <audio src={file.url} controls className="w-full" />
            </div>
          )}

          {!["image", "video", "audio"].includes(file.type) && (
            <div className="text-center">
              <FileText size={64} className="mx-auto mb-4 text-slate-400" />
              <p className="mb-4 text-slate-600 dark:text-slate-400">
                No preview available
              </p>
              <button
                onClick={downloadHandler}
                className="px-6 py-2 rounded-md bg-blue-600 text-white
                   hover:bg-blue-500"
              >
                Download
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
