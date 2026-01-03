import React from "react";
import { Folder } from "lucide-react";
import { FolderItem } from "../types";

interface FolderCardProps {
  folder: FolderItem;
  onClick: (id: string) => void;
}

const colorMap: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  orange:
    "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  emerald:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  purple:
    "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
};

const FolderCard: React.FC<FolderCardProps> = ({ folder, onClick }) => {
  const colorClass = colorMap[folder.color] || colorMap.blue;

  return (
    <div
      onClick={() => onClick(folder.id)}
      className="group bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:border-brand-200 dark:hover:border-brand-700 select-none"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${colorClass} transition-colors`}>
          <Folder size={20} className="fill-current" />
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
          <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
          <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
          <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
        </div>
      </div>
      <div>
        <h4 className="font-medium text-slate-700 dark:text-slate-200 text-sm truncate">
          {folder.name}
        </h4>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          {folder.itemCount} files
        </p>
      </div>
    </div>
  );
};

export default FolderCard;
