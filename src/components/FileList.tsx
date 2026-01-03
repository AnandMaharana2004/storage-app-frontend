import React, { useState, useRef } from "react";
import {
  MoreVertical,
  Star,
  Download,
  Share2,
  Trash2,
  RotateCcw,
  Edit2,
} from "lucide-react";
import { FileItem } from "../types";
import { FileIcon } from "./FileCard";

interface FileListProps {
  files: FileItem[];
  onPreview: (file: FileItem) => void;
  onToggleStar?: (id: string) => void;
  onMoveToTrash?: (id: string) => void;
  onRestore?: (id: string) => void;
  onDeleteForever?: (id: string) => void;
  onShare?: (file: FileItem) => void;
  onRename?: (file: FileItem) => void;
}

interface FileRowProps {
  file: FileItem;
  onPreview: (file: FileItem) => void;
  onToggleStar?: (id: string) => void;
  onMoveToTrash?: (id: string) => void;
  onRestore?: (id: string) => void;
  onDeleteForever?: (id: string) => void;
  onShare?: (file: FileItem) => void;
  onRename?: (file: FileItem) => void;
}

const FileRow: React.FC<FileRowProps> = ({
  file,
  onPreview,
  onToggleStar,
  onMoveToTrash,
  onRestore,
  onDeleteForever,
  onShare,
  onRename,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<"top" | "bottom">("bottom");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isTrashItem = !!file.deletedAt;

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

  return (
    <>
      {showMenu && (
        <div
          className="fixed inset-0 z-[60] cursor-default"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(false);
          }}
        />
      )}
      <tr
        className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer relative ${
          showMenu ? "z-40" : "z-0"
        }`}
        onClick={() => onPreview(file)}
      >
        <td className="px-3 sm:px-6 py-4 max-w-[200px] sm:max-w-xs md:max-w-md">
          <div className="flex items-center">
            <div className="mr-3 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:shadow-sm transition-all shrink-0">
              <FileIcon type={file.type} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                {file.name}
              </p>
              <div className="flex items-center mt-0.5 space-x-2">
                {file.isStarred && !file.deletedAt && (
                  <div className="flex items-center text-xs text-yellow-500 shrink-0">
                    <Star size={10} fill="currentColor" className="mr-1" />
                    <span>Starred</span>
                  </div>
                )}
                <span className="text-xs text-slate-400 dark:text-slate-500 sm:hidden">
                  {file.size}
                </span>
              </div>
            </div>
          </div>
        </td>
        <td className="px-3 sm:px-6 py-4 hidden md:table-cell whitespace-nowrap">
          {file.sharedBy ? (
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center text-[10px] font-bold text-brand-600 dark:text-brand-400 mr-2">
                {file.sharedBy.charAt(0)}
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-300 truncate max-w-[120px]">
                {file.sharedBy}
              </span>
            </div>
          ) : (
            <span className="text-sm text-slate-400 dark:text-slate-500 italic">
              me
            </span>
          )}
        </td>
        <td className="px-3 sm:px-6 py-4 hidden sm:table-cell whitespace-nowrap">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {file.date}
          </span>
        </td>
        <td className="px-3 sm:px-6 py-4 hidden lg:table-cell whitespace-nowrap">
          <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            {file.size}
          </span>
        </td>
        <td className="px-3 sm:px-6 py-4 text-right whitespace-nowrap">
          <div
            className={`flex items-center justify-end space-x-1 relative ${
              showMenu ? "z-[70]" : ""
            }`}
          >
            <div className="hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className="p-2 text-slate-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-slate-700 rounded-full"
                title="Download"
                onClick={(e) => e.stopPropagation()}
              >
                <Download size={16} />
              </button>
              {onShare && (
                <button
                  className="p-2 text-slate-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-slate-700 rounded-full"
                  title="Share"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare(file);
                  }}
                >
                  <Share2 size={16} />
                </button>
              )}
            </div>

            <div className="relative">
              <button
                ref={buttonRef}
                className={`p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full ${
                  showMenu
                    ? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                    : ""
                }`}
                onClick={toggleMenu}
              >
                <MoreVertical size={16} />
              </button>

              {showMenu && (
                <div
                  className={`absolute right-0 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 py-1 z-[80] animate-in fade-in zoom-in-95 duration-100 text-left ${
                    menuPosition === "top"
                      ? "bottom-full mb-1 origin-bottom-right"
                      : "top-full mt-1 origin-top-right"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {!isTrashItem ? (
                    <>
                      {onShare && (
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-brand-600 dark:hover:text-brand-400 flex items-center transition-colors"
                          onClick={() => handleMenuAction(() => onShare(file))}
                        >
                          <Share2 size={16} className="mr-2" />
                          Share
                        </button>
                      )}
                      {onRename && (
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-brand-600 dark:hover:text-brand-400 flex items-center transition-colors"
                          onClick={() => handleMenuAction(() => onRename(file))}
                        >
                          <Edit2 size={16} className="mr-2" />
                          Rename
                        </button>
                      )}
                      {onToggleStar && (
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-brand-600 dark:hover:text-brand-400 flex items-center transition-colors"
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
        </td>
      </tr>
    </>
  );
};

const FileList: React.FC<FileListProps> = ({
  files,
  onPreview,
  onToggleStar,
  onMoveToTrash,
  onRestore,
  onDeleteForever,
  onShare,
  onRename,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm w-full flex flex-col transition-colors">
      <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        <table className="w-full text-left border-collapse min-w-[600px] md:min-w-0">
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {files.map((file) => (
              <FileRow
                key={file.id}
                file={file}
                onPreview={onPreview}
                onToggleStar={onToggleStar}
                onMoveToTrash={onMoveToTrash}
                onRestore={onRestore}
                onDeleteForever={onDeleteForever}
                onShare={onShare}
                onRename={onRename}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileList;
