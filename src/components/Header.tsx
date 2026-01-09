import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, Upload, Filter, Menu, X, Check } from "lucide-react";

interface HeaderProps {
  onUploadClick: () => void;
  onMenuClick: () => void;
  showUploadAction?: boolean;
  currentPath?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onUploadClick,
  onMenuClick,
  showUploadAction = true,
  currentPath = "/",
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Check if current path matches allowed paths for mobile upload button
  const isAllowedPath = () => {
    if (!isMobile) return true; // Always show on desktop

    // Allow on home page
    if (currentPath === "/") return true;

    // Allow on /directory/:id pattern
    const directoryPattern = /^\/folder\/[^/]+$/;
    if (directoryPattern.test(currentPath)) return true;

    return false;
  };

  const shouldShowUpload = showUploadAction && isAllowedPath();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notificationRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  return (
    <header
      className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 transition-colors"
      style={{ zIndex: 30 }}
    >
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 mr-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
      >
        <Menu size={20} />
      </button>

      {/* Search Bar */}
      <div className="flex-1 max-w-2xl mr-2 lg:mr-0">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search
              size={18}
              className="text-slate-400 group-focus-within:text-brand-500 transition-colors"
            />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full pl-10 pr-12 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <button
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 transition-colors"
              title="Filter search"
            >
              <Filter size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-2 lg:space-x-4 ml-2 lg:ml-6">
        {/* Notifications */}
        <div ref={notificationRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <Bell size={20} />
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 text-xs bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <Bell
                      size={32}
                      className="mx-auto mb-2 text-slate-300 dark:text-slate-600"
                    />
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No notifications
                    </p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                        !notif.read ? "bg-brand-50/30 dark:bg-brand-900/10" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate">
                              {notif.title}
                            </h4>
                            {!notif.read && (
                              <span className="w-2 h-2 bg-brand-500 rounded-full flex-shrink-0"></span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-1">
                            {notif.message}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            {notif.time}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {!notif.read && (
                            <button
                              onClick={() => markAsRead(notif.id)}
                              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-slate-500 dark:text-slate-400"
                              title="Mark as read"
                            >
                              <Check size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => clearNotification(notif.id)}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded text-slate-500 dark:text-slate-400"
                            title="Dismiss"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700">
                  <button className="w-full text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium py-1">
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Upload Button - Desktop Only */}
        {shouldShowUpload && !isMobile && (
          <button
            onClick={onUploadClick}
            className="flex items-center bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all active:translate-y-0 duration-200"
          >
            <Upload size={18} className="mr-2" />
            <span>Upload New</span>
          </button>
        )}
      </div>

      {/* Floating Upload Button - Mobile Only */}
      {shouldShowUpload && isMobile && (
        <button
          onClick={onUploadClick}
          className="fixed bottom-6 right-6 flex items-center justify-center w-14 h-14 bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all active:scale-100 duration-200"
          style={{ zIndex: 1001 }}
        >
          <Upload size={22} />
        </button>
      )}
    </header>
  );
};

export default Header;
