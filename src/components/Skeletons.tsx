import React from "react";

export const FolderCardSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse">
    <div className="flex items-start justify-between mb-3">
      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
      <div className="flex gap-1">
        <div className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
        <div className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
      </div>
    </div>
    <div>
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3 mb-2"></div>
      <div className="h-3 bg-slate-100 dark:bg-slate-800/50 rounded w-1/3"></div>
    </div>
  </div>
);

export const FileCardSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col animate-pulse h-full">
    <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-t-xl"></div>
    <div className="p-4 flex-1">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-slate-100 dark:bg-slate-800/50 rounded w-1/2"></div>
    </div>
  </div>
);

export const FileListSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm w-full flex flex-col overflow-hidden animate-pulse">
    <div className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-10 w-full"></div>
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className="flex items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800 last:border-0"
      >
        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-lg mr-4 shrink-0"></div>
        <div className="flex-1 min-w-0 mr-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-1.5"></div>
          <div className="h-3 bg-slate-100 dark:bg-slate-800/50 rounded w-1/4 sm:hidden"></div>
        </div>
        <div className="hidden md:block w-24 h-3 bg-slate-100 dark:bg-slate-800/50 rounded mr-6"></div>
        <div className="hidden sm:block w-20 h-3 bg-slate-100 dark:bg-slate-800/50 rounded mr-6"></div>
        <div className="hidden lg:block w-16 h-3 bg-slate-100 dark:bg-slate-800/50 rounded"></div>
      </div>
    ))}
  </div>
);
