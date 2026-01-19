import React, { useState, useRef } from "react";
import {
  FileText,
  Image,
  FileCode,
  Archive,
  Film,
  MoreVertical,
  Share2,
  Download,
  Star,
  Trash2,
  RotateCcw,
  Edit2,
  Music,
  File,
  MapPin,
  Copy,
} from "lucide-react";
import { api } from "../services/api";

// Mock types for demonstration
interface FileItem {
  id: string;
  name: string;
  type:
    | "image"
    | "pdf"
    | "code"
    | "archive"
    | "video"
    | "doc"
    | "audio"
    | "other";
  size: string;
  date: string;
  thumbnail?: string;
  isStarred?: boolean;
  deletedAt?: string;
  sharedBy?: string;
}

interface FileCardProps {
  file: FileItem;
  onPreview?: () => void;
  onToggleStar?: (id: string) => void;
  onMoveToTrash?: (id: string) => void;
  onRestore?: (id: string) => void;
  onDeleteForever?: (id: string) => void;
  onShare?: (file: FileItem) => void;
  onRename?: (file: FileItem) => void;
  path?: string; // Optional path prop for trash/shared view
  showPublicBadge?: boolean; // NEW: Show public badge
  publicUrl?: string; // NEW: Public URL for sharing
  onCopyLink?: (url: string) => void; // NEW: Copy link callback
}

export const FileIcon = ({ type }: { type: FileItem["type"] }) => {
  switch (type) {
    case "image":
      return (
        <Image size={24} className="text-purple-500 dark:text-purple-400" />
      );
    case "pdf":
      return <FileText size={24} className="text-red-500 dark:text-red-400" />;
    case "code":
      return (
        <FileCode size={24} className="text-blue-500 dark:text-blue-400" />
      );
    case "archive":
      return (
        <Archive size={24} className="text-orange-500 dark:text-orange-400" />
      );
    case "video":
      return <Film size={24} className="text-pink-500 dark:text-pink-400" />;
    case "doc":
      return (
        <FileText size={24} className="text-blue-600 dark:text-blue-400" />
      );
    case "audio":
      return <Music size={24} className="text-green-500 dark:text-green-400" />;
    case "other":
      return <File size={24} className="text-slate-500 dark:text-slate-400" />;
    default:
      return (
        <FileText size={24} className="text-slate-500 dark:text-slate-400" />
      );
  }
};

const FileCard: React.FC<FileCardProps> = ({
  file,
  onPreview,
  onToggleStar,
  onMoveToTrash,
  onRestore,
  onDeleteForever,
  onShare,
  onRename,
  path,
  showPublicBadge = false, // NEW
  publicUrl, // NEW
  onCopyLink, // NEW
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<"top" | "bottom">("bottom");
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isTrashItem = !!file.deletedAt;
  const shouldShowThumbnail = file.type === "image" && file.thumbnail;

  const handleMenuAction = (action: () => void) => {
    action();
    setShowMenu(false);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setMenuPosition(spaceBelow < 220 ? "top" : "bottom");
    }
    setShowMenu(!showMenu);
  };

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

  // Format path for display
  const formatPath = (filePath: string) => {
    return (
      filePath.replace(/^\//, "").split("/").slice(1).join(" > ") || "Root"
    );
  };

  return (
    <>
      {showMenu && (
        <div
          className="fixed inset-0 z-30 cursor-default"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(false);
          }}
        />
      )}

      <div
        className="group relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-700"
        onClick={onPreview}
      >
        <div className="h-32 bg-slate-50 dark:bg-slate-800 relative flex items-center justify-center overflow-hidden rounded-t-xl transition-colors">
          {shouldShowThumbnail ? (
            <img
              src={file.thumbnail}
              alt={file.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="p-4 bg-white dark:bg-slate-700 rounded-2xl shadow-sm relative z-10 transition-colors">
              <FileIcon type={file.type} />
            </div>
          )}

          {!showMenu && !isTrashItem && (
            <div
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 backdrop-blur-[2px] z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadHandler();
                }}
                className="p-2 bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 rounded-full hover:bg-white hover:text-indigo-600 dark:hover:bg-slate-700 dark:hover:text-indigo-400 transition-colors"
                title="Download"
              >
                <Download size={16} />
              </button>
              {onShare && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare(file);
                  }}
                  className="p-2 bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 rounded-full hover:bg-white hover:text-indigo-600 dark:hover:bg-slate-700 dark:hover:text-indigo-400 transition-colors"
                  title="Share"
                >
                  <Share2 size={16} />
                </button>
              )}
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex gap-1 z-10">
            {file.isStarred && !file.deletedAt && (
              <div className="bg-white/90 dark:bg-slate-800/90 p-1 rounded-full text-yellow-500 shadow-sm">
                <Star size={12} fill="currentColor" />
              </div>
            )}
          </div>

          {/* NEW: Public Badge */}
          {showPublicBadge && !isTrashItem && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Share2 size={12} />
              <span>Public</span>
            </div>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col justify-between bg-white dark:bg-slate-900 relative rounded-b-xl transition-colors">
          <div className="flex items-start justify-between">
            <div className="min-w-0 pr-2 flex-1">
              <h4
                className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate mb-1"
                title={file.name}
              >
                {file.name}
              </h4>
              <div className="flex items-center text-xs text-slate-400 dark:text-slate-500">
                <span>{file.size}</span>
                <span className="mx-1">•</span>
                <span>{file.date}</span>
              </div>

              {/* Show path if provided */}
              {path && (
                <div className="mt-2 flex items-start text-xs text-slate-500 dark:text-slate-400">
                  <MapPin size={11} className="mr-1 mt-0.5 shrink-0" />
                  <span className="line-clamp-1" title={path}>
                    {formatPath(path)}
                  </span>
                </div>
              )}

              {file.sharedBy && !file.deletedAt && (
                <p className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-1 font-medium flex items-center">
                  Shared by {file.sharedBy}
                </p>
              )}

              {/* NEW: Copy Public Link Button */}
              {publicUrl && onCopyLink && !isTrashItem && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopyLink(publicUrl);
                  }}
                  className="w-full mt-2 px-3 py-1.5 text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Copy size={12} />
                  Copy public link
                </button>
              )}
            </div>

            <div className="relative">
              <button
                ref={buttonRef}
                className={`text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${
                  showMenu
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    : ""
                }`}
                onClick={toggleMenu}
              >
                <MoreVertical size={16} />
              </button>

              {showMenu && (
                <div
                  className={`absolute right-0 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 py-1 z-40 animate-in fade-in zoom-in-95 duration-100 text-left ${
                    menuPosition === "top"
                      ? "bottom-full mb-1 origin-bottom-right"
                      : "top-full mt-1 origin-top-right"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {!isTrashItem ? (
                    <>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 flex items-center transition-colors"
                        onClick={() => handleMenuAction(downloadHandler)}
                      >
                        <Download size={16} className="mr-2" />
                        Download
                      </button>
                      {onShare && (
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 flex items-center transition-colors"
                          onClick={() => handleMenuAction(() => onShare(file))}
                        >
                          <Share2 size={16} className="mr-2" />
                          Share
                        </button>
                      )}
                      {onRename && (
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 flex items-center transition-colors"
                          onClick={() => handleMenuAction(() => onRename(file))}
                        >
                          <Edit2 size={16} className="mr-2" />
                          Rename
                        </button>
                      )}
                      {onToggleStar && (
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 flex items-center transition-colors"
                          onClick={() =>
                            handleMenuAction(() => onToggleStar(file.id))
                          }
                        >
                          <Star
                            size={16}
                            className={`mr-2 ${
                              file.isStarred
                                ? "fill-yellow-400 text-yellow-400"
                                : ""
                            }`}
                          />
                          {file.isStarred
                            ? "Remove from Starred"
                            : "Add to Starred"}
                        </button>
                      )}
                      {onMoveToTrash && (
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center transition-colors border-t border-slate-50 dark:border-slate-700 mt-1"
                          onClick={() =>
                            handleMenuAction(() => onMoveToTrash(file.id))
                          }
                        >
                          <Trash2 size={16} className="mr-2" />
                          Move to Trash
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      {onRestore && (
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center transition-colors"
                          onClick={() =>
                            handleMenuAction(() => onRestore(file.id))
                          }
                        >
                          <RotateCcw size={16} className="mr-2" />
                          Restore
                        </button>
                      )}
                      {onDeleteForever && (
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center transition-colors border-t border-slate-50 dark:border-slate-700 mt-1"
                          onClick={() =>
                            handleMenuAction(() => onDeleteForever(file.id))
                          }
                        >
                          <Trash2 size={16} className="mr-2" />
                          Delete Forever
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileCard;
