import React, { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { SidebarTab, FileItem, ViewMode } from "./types";
import {
  LayoutGrid,
  List,
  FolderPlus,
  CheckCircle,
  AlertCircle,
  X,
  Home,
  Clock,
  Star,
  Users,
  Trash2,
  User,
  Shield,
  ChevronRight,
} from "lucide-react";
import { useFileSystem } from "./context/FileSystemContext";
import { useLocation, useNavigate } from "react-router-dom";

import MyFilesView from "./components/views/MyFilesView";
import RecentView from "./components/views/RecentView";
import StarredView from "./components/views/StarredView";
import SharedView from "./components/views/SharedView";
import TrashView from "./components/views/TrashView";
import ProfileView from "./components/views/ProfileView";
import AdminView from "./components/views/AdminView";
import AdminUserDetailsView from "./components/views/AdminUserDetailsView";

import FilePreviewModal from "./components/FilePreviewModal";
import UploadProgress from "./components/UploadProgress";
import CreateFolderModal from "./components/CreateFolderModal";
import RenameFileModal from "./components/RenameFileModal";
import ShareModal from "./components/ShareModal";
import { useUser } from "./context/UserContext";

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const getTabFromPath = (pathname: string): SidebarTab => {
    if (pathname.startsWith("/admin/details/")) return "admin-user-details";
    if (pathname === "/admin") return "admin";
    if (pathname === "/profile") return "profile";
    if (pathname === "/recent") return "recent";
    if (pathname === "/starred") return "starred";
    if (pathname === "/shared") return "shared";
    if (pathname === "/trash") return "trash";
    if (pathname.startsWith("/folder/")) return "my-files";
    return "my-files";
  };

  const [activeTab, setActiveTab] = useState<SidebarTab>(() =>
    getTabFromPath(location.pathname),
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Grid);
  const [folderValidationError, setFolderValidationError] = useState<
    string | null
  >(null);

  const {
    files,
    folders,
    uploads,
    breadcrumbs,
    currentDirectory,
    isLoading,
    currentFolderId,
    error,
    notification,
    clearNotification,
    setCurrentFolderId,
    navigateUp,
    uploadFiles,
    createFolder,
    renameFile,
    toggleStar,
    moveToTrash,
    restoreFromTrash,
    deleteForever,
    closeUploadProgress,
    isUploadMinimized,
    toggleUploadMinimize,
    loadFolderContents,
  } = useFileSystem();

  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [sharingFile, setSharingFile] = useState<FileItem | null>(null);
  const [renamingFile, setRenamingFile] = useState<FileItem | null>(null);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const breadcrumbsRef = useRef<HTMLDivElement>(null);

  // Sync tab with route changes
  useEffect(() => {
    const newTab = getTabFromPath(location.pathname);
    setActiveTab(newTab);

    if (newTab !== "my-files") {
      setCurrentFolderId(null);
      setFolderValidationError(null);
    }
  }, [location.pathname, setCurrentFolderId]);

  // ✅ Load folder contents when URL changes
  useEffect(() => {
    const loadFolder = async () => {
      const match = location.pathname.match(/^\/folder\/([^/]+)$/);

      if (match) {
        const folderId = match[1];
        setCurrentFolderId(folderId);
        setFolderValidationError(null);

        try {
          const success = await loadFolderContents(folderId);

          if (!success) {
            throw new Error("Folder not found or inaccessible");
          }
        } catch (err: any) {
          console.error("❌ Folder validation error:", err);
          setFolderValidationError(
            err.message || "Unable to access this folder",
          );

          // Redirect to home after showing error
          setTimeout(() => {
            navigate("/", { replace: true });
            setFolderValidationError(null);
          }, 2000);
        }
      } else if (
        location.pathname === "/" ||
        location.pathname === "/my-files"
      ) {
        // Load root directory
        setCurrentFolderId(null);
        setFolderValidationError(null);
        await loadFolderContents(null);
      }
    };

    loadFolder();
  }, [location.pathname, setCurrentFolderId, navigate, loadFolderContents]);

  // ✅ Auto-scroll breadcrumbs to show the current folder
  useEffect(() => {
    if (breadcrumbsRef.current && breadcrumbs.length > 0) {
      breadcrumbsRef.current.scrollLeft = breadcrumbsRef.current.scrollWidth;
    }
  }, [breadcrumbs]);

  const handleTabChange = useCallback(
    (tab: SidebarTab) => {
      setActiveTab(tab);
      setFolderValidationError(null);

      const routeMap: Record<SidebarTab, string> = {
        "my-files": "/",
        recent: "/recent",
        starred: "/starred",
        shared: "/shared",
        trash: "/trash",
        profile: "/profile",
        admin: "/admin",
        "admin-user-details": "/admin/details",
      };

      const targetRoute = routeMap[tab];
      if (targetRoute && location.pathname !== targetRoute) {
        navigate(targetRoute);
      }

      if (tab !== "my-files") {
        setCurrentFolderId(null);
      }
    },
    [location.pathname, navigate, setCurrentFolderId],
  );

  const handleFolderClick = useCallback(
    async (folderId: string) => {
      setFolderValidationError(null);
      navigate(`/folder/${folderId}`);
    },
    [navigate],
  );

  const handleBreadcrumbClick = useCallback(
    (folderId: string | null) => {
      setFolderValidationError(null);

      if (folderId) {
        navigate(`/folder/${folderId}`);
      } else {
        navigate("/");
      }
    },
    [navigate],
  );

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const handleFilesDropped = (droppedFiles: any[]) => {
    const validFiles = droppedFiles.filter((f) => f.name || f instanceof File);
    if (validFiles.length > 0) {
      uploadFiles(validFiles);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "my-files":
        return (
          <MyFilesView
            folders={folders}
            files={files}
            breadcrumbs={breadcrumbs}
            currentDirectory={currentDirectory}
            onPreview={setPreviewFile}
            onDropFiles={handleFilesDropped}
            onFolderClick={handleFolderClick}
            onBreadcrumbClick={handleBreadcrumbClick}
            viewMode={viewMode}
            onToggleStar={toggleStar}
            onMoveToTrash={moveToTrash}
            onShare={setSharingFile}
            onRename={setRenamingFile}
            isLoading={isLoading}
          />
        );
      case "recent":
        return (
          <RecentView
            files={files}
            onPreview={setPreviewFile}
            viewMode={viewMode}
            onToggleStar={toggleStar}
            onMoveToTrash={moveToTrash}
            onShare={setSharingFile}
            isLoading={isLoading}
          />
        );
      case "starred":
        return (
          <StarredView
            files={files}
            onPreview={setPreviewFile}
            viewMode={viewMode}
            onToggleStar={toggleStar}
            onMoveToTrash={moveToTrash}
            onShare={setSharingFile}
            isLoading={isLoading}
          />
        );
      case "shared":
        return (
          <SharedView
            files={files}
            onPreview={setPreviewFile}
            viewMode={viewMode}
            onToggleStar={toggleStar}
            onMoveToTrash={moveToTrash}
            onShare={setSharingFile}
            isLoading={isLoading}
          />
        );
      case "trash":
        return (
          <TrashView
            files={files}
            onPreview={setPreviewFile}
            viewMode={viewMode}
            onRestore={restoreFromTrash}
            onDeleteForever={deleteForever}
            isLoading={isLoading}
          />
        );
      case "profile":
        return <ProfileView />;
      case "admin":
        return user?.role === "admin" ? (
          <AdminView />
        ) : (
          <div className="p-8 text-center text-slate-500">Access Denied</div>
        );
      case "admin-user-details":
        return <AdminUserDetailsView />;
      default:
        return (
          <div className="p-8 text-center text-slate-500">View not found</div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-500">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        onChange={handleFileSelect}
      />

      <Sidebar
        activeTab={activeTab === "admin-user-details" ? "admin" : activeTab}
        onTabChange={handleTabChange}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenProfile={() => {
          handleTabChange("profile");
          setIsSidebarOpen(false);
        }}
      />

      <div className="flex-1 flex flex-col lg:ml-64 transition-all duration-300 min-w-0 w-full">
        <Header
          onUploadClick={handleUploadClick}
          onMenuClick={() => setIsSidebarOpen(true)}
          showUploadAction={
            activeTab !== "profile" &&
            activeTab !== "admin" &&
            activeTab !== "admin-user-details"
          }
          currentPath={location.pathname}
        />

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto w-full relative">
          <div className="max-w-7xl mx-auto w-full">
            <div className="mb-6 flex items-center justify-between gap-4">
              {/* Page Title or Breadcrumbs */}
              {activeTab === "my-files" ? (
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-md border border-blue-100 dark:border-blue-500/20 shrink-0">
                    <Home
                      size={20}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <div
                    ref={breadcrumbsRef}
                    className="flex items-center text-sm text-slate-600 dark:text-slate-300 overflow-x-auto min-w-0 scroll-smooth"
                    style={{
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >
                    <style>
                      {`
                        div::-webkit-scrollbar {
                          display: none;
                        }
                      `}
                    </style>
                    <span
                      className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors shrink-0 font-medium"
                      onClick={() => navigate("/")}
                    >
                      Home
                    </span>

                    {breadcrumbs.length > 1 && (
                      <>
                        {breadcrumbs.slice(1).map((crumb, index) => {
                          const isLast = index === breadcrumbs.length - 2;
                          return (
                            <React.Fragment key={crumb.id}>
                              <ChevronRight
                                size={16}
                                className="mx-1 text-slate-400 shrink-0"
                              />
                              <span
                                className={`truncate max-w-[150px] font-medium shrink-0 ${
                                  isLast
                                    ? "text-slate-900 dark:text-white"
                                    : "hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
                                }`}
                                onClick={() => {
                                  if (!isLast) {
                                    handleBreadcrumbClick(crumb.id);
                                  }
                                }}
                              >
                                {crumb.name}
                              </span>
                            </React.Fragment>
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-md border ${
                      activeTab === "recent"
                        ? "bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20"
                        : activeTab === "starred"
                          ? "bg-yellow-50 dark:bg-yellow-500/10 border-yellow-100 dark:border-yellow-500/20"
                          : activeTab === "shared"
                            ? "bg-green-50 dark:bg-green-500/10 border-green-100 dark:border-green-500/20"
                            : activeTab === "trash"
                              ? "bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20"
                              : activeTab === "profile"
                                ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20"
                                : activeTab === "admin" ||
                                    activeTab === "admin-user-details"
                                  ? "bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20"
                                  : "bg-slate-50 dark:bg-slate-500/10 border-slate-100 dark:border-slate-500/20"
                    }`}
                  >
                    {activeTab === "recent" ? (
                      <Clock
                        size={20}
                        className="text-purple-600 dark:text-purple-400"
                      />
                    ) : activeTab === "starred" ? (
                      <Star
                        size={20}
                        className="text-yellow-600 dark:text-yellow-400"
                      />
                    ) : activeTab === "shared" ? (
                      <Users
                        size={20}
                        className="text-green-600 dark:text-green-400"
                      />
                    ) : activeTab === "trash" ? (
                      <Trash2
                        size={20}
                        className="text-red-600 dark:text-red-400"
                      />
                    ) : activeTab === "profile" ? (
                      <User
                        size={20}
                        className="text-indigo-600 dark:text-indigo-400"
                      />
                    ) : activeTab === "admin" ||
                      activeTab === "admin-user-details" ? (
                      <Shield
                        size={20}
                        className="text-orange-600 dark:text-orange-400"
                      />
                    ) : (
                      <Home
                        size={20}
                        className="text-slate-600 dark:text-slate-400"
                      />
                    )}
                  </div>
                  <h1 className="text-md font-medium text-slate-900 dark:text-white capitalize">
                    {activeTab.replace(/-/g, " ")}
                  </h1>
                </div>
              )}

              {activeTab !== "profile" &&
                activeTab !== "admin" &&
                activeTab !== "admin-user-details" && (
                  <div className="flex items-center gap-2 shrink-0">
                    {activeTab === "my-files" && (
                      <>
                        <button
                          onClick={() => setIsCreateFolderOpen(true)}
                          className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-brand-400 rounded-lg transition-colors border border-transparent hover:border-brand-100 dark:hover:border-slate-700"
                          title="Create New Folder"
                        >
                          <FolderPlus size={20} />
                        </button>

                        <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1 hidden sm:block"></div>
                      </>
                    )}

                    <div className="flex bg-slate-200/50 dark:bg-slate-800 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode(ViewMode.Grid)}
                        className={`p-1.5 rounded-md transition-all ${
                          viewMode === ViewMode.Grid
                            ? "bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        }`}
                      >
                        <LayoutGrid size={16} />
                      </button>
                      <button
                        onClick={() => setViewMode(ViewMode.List)}
                        className={`p-1.5 rounded-md transition-all ${
                          viewMode === ViewMode.List
                            ? "bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        }`}
                      >
                        <List size={16} />
                      </button>
                    </div>
                  </div>
                )}
            </div>

            <div className="w-full">{renderContent()}</div>
          </div>
        </main>
      </div>

      <FilePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
        onShare={setSharingFile}
        onToggleStar={toggleStar}
        onMoveToTrash={moveToTrash}
      />

      <ShareModal
        isOpen={!!sharingFile}
        file={sharingFile}
        onClose={() => setSharingFile(null)}
      />

      <CreateFolderModal
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        // onCreate={createFolder}
      />

      {renamingFile && (
        <RenameFileModal
          isOpen={!!renamingFile}
          initialName={renamingFile.name}
          onClose={() => setRenamingFile(null)}
          onRename={(newName) => renameFile(renamingFile.id, newName)}
        />
      )}

      <UploadProgress
        uploads={uploads}
        onClose={closeUploadProgress}
        isMinimized={isUploadMinimized}
        onToggleMinimize={toggleUploadMinimize}
      />

      {folderValidationError && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center animate-in slide-in-from-right-10 fade-in duration-300 border bg-white dark:bg-slate-900 border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400">
          <div className="mr-3 p-1 rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertCircle size={16} />
          </div>
          <div className="mr-6">
            <p className="text-sm font-medium">{folderValidationError}</p>
          </div>
          <button
            onClick={() => setFolderValidationError(null)}
            className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-red-400"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {(notification || error) && (
        <div
          className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center animate-in slide-in-from-right-10 fade-in duration-300 border ${
            error
              ? "bg-white dark:bg-slate-900 border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400"
              : "bg-slate-900 dark:bg-slate-800 border-transparent text-white"
          }`}
        >
          <div
            className={`mr-3 p-1 rounded-full ${
              error
                ? "bg-red-100 dark:bg-red-900/30"
                : "bg-slate-800 dark:bg-slate-700"
            }`}
          >
            {error ? (
              <AlertCircle size={16} />
            ) : (
              <CheckCircle size={16} className="text-brand-400" />
            )}
          </div>
          <div className="mr-6">
            <p className="text-sm font-medium">{error || notification}</p>
          </div>
          <button
            onClick={clearNotification}
            className={`p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${
              error ? "text-red-400" : "text-slate-400"
            }`}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
