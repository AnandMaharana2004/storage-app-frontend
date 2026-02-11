import React from "react";
import {
  LayoutGrid,
  Clock,
  Star,
  Users,
  Trash2,
  Cloud,
  Settings,
  X,
  ShieldCheck,
} from "lucide-react";
import { SidebarTab } from "../types";
import { useUser } from "../context/UserContext";
import { redirect, useNavigate } from "react-router-dom";

interface SidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenProfile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isOpen,
  onClose,
  onOpenProfile,
}) => {
  const { storage, user } = useUser();
  const isAdmin = user?.role === "admin";

  const navItems = [
    { id: "my-files", label: "My Files", icon: LayoutGrid },
    { id: "recent", label: "Recent", icon: Clock },
    { id: "starred", label: "Starred", icon: Star },
    { id: "shared", label: "Shared with me", icon: Users },
    { id: "trash", label: "Trash", icon: Trash2 },
  ];

  // Add Admin item if user is admin
  if (isAdmin) {
    navItems.push({ id: "admin", label: "Admin Panel", icon: ShieldCheck });
  }

  const usagePercent = (storage.used / storage.total) * 100;
  const isCritical = usagePercent > 90;
  const navigate = useNavigate();
  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/50 z-30 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}
          flex flex-col
        `}
      >
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-50 dark:border-slate-800">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-3 shadow-sm">
              Z
            </div>
            <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
              CloudZoon
            </span>
          </div>
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-slate-400 hover:text-slate-600 rounded-md"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id as SidebarTab);
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 shadow-sm ring-1 ring-brand-200 dark:ring-brand-900/50"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <Icon
                  size={20}
                  className={`mr-3 ${
                    isActive
                      ? "text-brand-600 dark:text-brand-400"
                      : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                  }`}
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Storage Widget */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div
            className={`rounded-xl p-4 border ${
              isCritical
                ? "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            } transition-colors`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center text-slate-700 dark:text-slate-200 font-semibold text-sm">
                <Cloud
                  size={16}
                  className={`mr-2 ${
                    isCritical ? "text-red-500" : "text-brand-500"
                  }`}
                />
                Storage
              </div>
              <span
                className={`text-xs font-medium ${
                  isCritical
                    ? "text-red-600 dark:text-red-400"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {usagePercent.toFixed(0)}%
              </span>
            </div>

            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isCritical ? "bg-red-500" : "bg-brand-500"
                }`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              {storage.used * 1000} MB of {storage.total} GB used
            </p>

            {isCritical ? (
              <button
                className="w-full py-1.5 text-xs font-medium text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                onClick={() => {
                  return navigate("/plans");
                }}
              >
                Free up space
              </button>
            ) : (
              <button
                className="w-full py-1.5 text-xs font-medium text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/30 rounded-md hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors"
                onClick={() => {
                  return navigate("/plans");
                }}
              >
                Upgrade Plan
              </button>
            )}
          </div>

          {/* User Profile Mini */}
          {user && (
            <div
              className="mt-4 flex items-center px-1 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors"
              onClick={onOpenProfile}
            >
              <img
                src={user.avatar}
                alt="User"
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
              />
              <div className="ml-3 flex-1 overflow-hidden">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {storage.type} Plan
                </p>
              </div>
              <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md">
                <Settings size={16} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
