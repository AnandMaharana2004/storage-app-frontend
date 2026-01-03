import React, { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { SidebarTab, FileItem, ViewMode } from "./types";
import {
  ChevronRight,
  LayoutGrid,
  List,
  FolderPlus,
  CheckCircle,
  AlertCircle,
  X,
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

  // Sync tab with route changes
  useEffect(() => {
    const newTab = getTabFromPath(location.pathname);
    setActiveTab(newTab);

    if (newTab !== "my-files") {
      setCurrentFolderId(null);
      setFolderValidationError(null);
    }
  }, [location.pathname, setCurrentFolderId]);

  // ✅ FIXED: Validate folder and redirect on error with proper URL cleanup
  useEffect(() => {
    const validateAndLoadFolder = async (folderId: string) => {
      try {
        setFolderValidationError(null);
        setCurrentFolderId(folderId);

        // ✅ Load folder contents (with caching)
        const success = await loadFolderContents(folderId);

        if (!success) {
          throw new Error("Folder not found or inaccessible");
        }
      } catch (err: any) {
        console.error("❌ Folder validation error:", err);
        setFolderValidationError(err.message || "Unable to access this folder");

        // ✅ FIXED: Clear folder ID and redirect immediately
        setCurrentFolderId(null);
        setTimeout(() => {
          navigate("/", { replace: true });
          setFolderValidationError(null);
        }, 2000);
      }
    };

    const match = location.pathname.match(/^\/folder\/([^/]+)$/);
    if (match) {
      const folderId = match[1];
      validateAndLoadFolder(folderId);
    } else if (location.pathname === "/" || location.pathname === "/my-files") {
      setCurrentFolderId(null);
      setFolderValidationError(null);
    }
  }, [location.pathname, setCurrentFolderId, navigate, loadFolderContents]);

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

      // ✅ Pre-load folder contents before navigation
      const success = await loadFolderContents(folderId);

      if (success) {
        navigate(`/folder/${folderId}`);
      } else {
        setFolderValidationError("Unable to access this folder");
        setTimeout(() => setFolderValidationError(null), 3000);
      }
    },
    [navigate, loadFolderContents],
  );

  const handleNavigateUp = useCallback(() => {
    if (!currentFolderId) return;

    const current = folders.find((f) => f.id === currentFolderId);
    const parentId = current?.parentFolderId;

    setFolderValidationError(null);
    if (parentId && parentId !== user?.rootDir) {
      navigate(`/folder/${parentId}`);
    } else {
      navigate("/");
    }
  }, [currentFolderId, folders, user?.rootDir, navigate]);

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
            onPreview={setPreviewFile}
            onDropFiles={handleFilesDropped}
            currentFolderId={currentFolderId}
            onFolderClick={handleFolderClick}
            onNavigateUp={handleNavigateUp}
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
        />

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto w-full relative">
          <div className="max-w-7xl mx-auto w-full">
            <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
              {/* ✅ Enhanced breadcrumb navigation - now the primary navigation element */}
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 overflow-hidden whitespace-nowrap text-ellipsis mr-2">
                <span
                  className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors shrink-0 font-medium"
                  onClick={() => handleTabChange("my-files")}
                >
                  Home
                </span>

                {activeTab !== "my-files" ? (
                  <>
                    <ChevronRight
                      size={14}
                      className="mx-2 shrink-0 text-slate-400"
                    />
                    <span className="font-semibold text-slate-900 dark:text-white capitalize truncate">
                      {activeTab.replace(/-/g, " ")}
                    </span>
                  </>
                ) : (
                  <>
                    <ChevronRight
                      size={14}
                      className="mx-2 shrink-0 text-slate-400"
                    />
                    <span
                      className={`transition-colors shrink-0 ${
                        breadcrumbs.length === 0
                          ? "font-semibold text-slate-900 dark:text-white"
                          : "hover:text-slate-900 dark:hover:text-white cursor-pointer font-medium"
                      }`}
                      onClick={() => navigate("/")}
                    >
                      My Files
                    </span>

                    {breadcrumbs.map((folder, index) => (
                      <React.Fragment key={folder.id}>
                        <ChevronRight
                          size={14}
                          className="mx-2 shrink-0 text-slate-400"
                        />
                        <span
                          className={`truncate max-w-[100px] sm:max-w-xs ${
                            index === breadcrumbs.length - 1
                              ? "font-semibold text-slate-900 dark:text-white"
                              : "hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors font-medium"
                          }`}
                          onClick={() => {
                            if (index !== breadcrumbs.length - 1) {
                              navigate(`/folder/${folder.id}`);
                            }
                          }}
                        >
                          {folder.name}
                        </span>
                      </React.Fragment>
                    ))}
                  </>
                )}
              </div>

              {activeTab !== "profile" &&
                activeTab !== "admin" &&
                activeTab !== "admin-user-details" && (
                  <div className="flex items-center gap-2 ml-auto shrink-0">
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
        onCreate={createFolder}
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
