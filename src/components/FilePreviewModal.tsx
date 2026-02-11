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
  Loader2,
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

// Types that can be displayed inline
const INLINE_PREVIEW_TYPES: FileItem["type"][] = ["pdf", "doc", "code"];

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  file,
  onClose,
  onShare,
  onToggleStar,
  onMoveToTrash,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [textContent, setTextContent] = useState<string>("");
  const [isLoadingText, setIsLoadingText] = useState(false);
  const [textError, setTextError] = useState<string>("");
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

  // Fetch text content for code/doc types
  useEffect(() => {
    if (!file) return;

    const shouldFetchText = file.type === "code" || file.type === "doc";

    if (shouldFetchText) {
      setIsLoadingText(true);
      setTextError("");
      setTextContent("");

      fetch(file.url)
        .then((response) => {
          if (!response.ok) throw new Error("Failed to load file");
          return response.text();
        })
        .then((text) => {
          setTextContent(text);
          setIsLoadingText(false);
        })
        .catch((error) => {
          setTextError(error.message || "Failed to load file content");
          setIsLoadingText(false);
        });
    }
  }, [file]);

  if (!file) return null;

  /* ---------------- Helpers ---------------- */

  const isInlinePreview = INLINE_PREVIEW_TYPES.includes(file.type);

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

  // Detect file extension for syntax highlighting hint
  const getFileExtension = (filename: string): string => {
    const parts = filename.split(".");
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
  };

  const getLanguageClass = (filename: string): string => {
    const ext = getFileExtension(filename);
    const languageMap: Record<string, string> = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      cs: "csharp",
      php: "php",
      rb: "ruby",
      go: "go",
      rs: "rust",
      swift: "swift",
      kt: "kotlin",
      html: "html",
      css: "css",
      scss: "scss",
      json: "json",
      xml: "xml",
      yaml: "yaml",
      yml: "yaml",
      md: "markdown",
      sql: "sql",
      sh: "bash",
      bash: "bash",
      txt: "plaintext",
    };
    return languageMap[ext] || "plaintext";
  };

  /* ---------------- Render ---------------- */

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm"
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
              className="p-2 mr-2 rounded-full text-slate-600 dark:text-slate-400
                         hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center min-w-0">
              <FileText
                size={18}
                className="text-slate-500 dark:text-slate-400 mr-2 flex-shrink-0"
              />
              <h3 className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                {file.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={downloadHandler}
              className="p-2 rounded-full text-slate-600 dark:text-slate-400
                         hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Download"
            >
              <Download size={18} />
            </button>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-full text-slate-600 dark:text-slate-400
                           hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <MoreVertical size={18} />
              </button>

              {showMenu && (
                <div
                  className="absolute right-0 mt-2 w-56 z-10
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
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300
                                 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
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
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300
                                 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
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
                                   hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
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
              className="hidden sm:block p-2 rounded-full text-slate-600 dark:text-slate-400
                         hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Info"
            >
              <Info size={18} />
            </button>
          </div>
        </div>

        {/* ---------------- Content ---------------- */}
        <div
          className="flex-1 flex items-center justify-center
             max-h-[calc(100vh-3.5rem)]
             overflow-hidden
             bg-slate-50 dark:bg-slate-950"
        >
          {/* Image Preview */}
          {file.type === "image" && (
            <div className="w-full h-full flex items-center justify-center p-4">
              <img
                src={file.url}
                alt={file.name}
                className="max-h-full max-w-full object-contain rounded-lg"
              />
            </div>
          )}

          {/* Video Preview */}
          {file.type === "video" && (
            <div className="w-full h-full flex items-center justify-center p-4">
              <video
                src={file.url}
                poster={file.thumbnail}
                controls
                className="max-h-full max-w-full rounded-lg bg-black shadow-lg"
              />
            </div>
          )}

          {/* Audio Preview */}
          {file.type === "audio" && (
            <div className="w-full h-full flex items-center justify-center p-4">
              <div
                className="w-full max-w-md p-6 bg-white dark:bg-slate-900
                      border border-slate-200 dark:border-slate-700
                      rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <FileText className="text-slate-400 mr-3" size={24} />
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                    {file.name}
                  </p>
                </div>
                <audio src={file.url} controls className="w-full" />
              </div>
            </div>
          )}

          {/* PDF Preview */}
          {file.type === "pdf" && (
            <div className="w-full h-full">
              <iframe
                src={`${file.url}#toolbar=0`}
                className="w-full h-full border-0"
                title={file.name}
              />
            </div>
          )}

          {/* Text/Code Preview */}
          {(file.type === "code" || file.type === "doc") && (
            <div className="w-full h-full overflow-auto">
              {isLoadingText ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="animate-spin text-slate-400" size={32} />
                </div>
              ) : textError ? (
                <div className="flex flex-col items-center justify-center h-full p-8">
                  <FileText size={64} className="text-slate-400 mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {textError}
                  </p>
                  <button
                    onClick={downloadHandler}
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white
                       hover:bg-blue-500 transition-colors shadow-sm"
                  >
                    Download File
                  </button>
                </div>
              ) : (
                <div className="w-full h-full bg-slate-900 dark:bg-slate-950">
                  <div className="sticky top-0 px-4 py-2 bg-slate-800 dark:bg-slate-900 border-b border-slate-700 flex items-center justify-between z-10">
                    <span className="text-xs text-slate-400 font-mono">
                      {getLanguageClass(file.name)}
                    </span>
                    <span className="text-xs text-slate-500">
                      {textContent.split("\n").length} lines
                    </span>
                  </div>
                  <pre className="p-4 text-sm overflow-auto">
                    <code className="text-slate-300 font-mono leading-relaxed whitespace-pre">
                      {textContent}
                    </code>
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* No Preview Available */}
          {!["image", "video", "audio", "pdf", "code", "doc"].includes(
            file.type,
          ) && (
            <div className="text-center p-8">
              <FileText
                size={64}
                className="mx-auto mb-4 text-slate-400 dark:text-slate-600"
              />
              <p className="mb-2 text-slate-700 dark:text-slate-300 font-medium">
                No preview available
              </p>
              <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                This file type cannot be previewed in the browser
              </p>
              <button
                onClick={downloadHandler}
                className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium
                   hover:bg-blue-500 transition-colors shadow-sm"
              >
                Download File
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
