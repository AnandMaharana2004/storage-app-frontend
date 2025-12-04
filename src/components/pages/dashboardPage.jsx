import React, { useState } from "react";
import Sidebar from "../sidebar";
import UploadModal from "../uploadModal";
import UpgradeModal from "../upgradeModal";
import MobileMenu from "../mobileMenu";
import Logo from "../logo";

function DashboardPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const files = [
    {
      name: "Project_Proposal.pdf",
      icon: "📄",
      size: "2.4 MB",
      time: "Just now",
    },
    { name: "hero_banner_v2.jpg", icon: "🖼️", size: "3.1 MB", time: "2h ago" },
    {
      name: "source_code_backup.zip",
      icon: "📦",
      size: "8.5 MB",
      time: "5h ago",
    },
    { name: "App.jsx", icon: "💻", size: "4 KB", time: "1d ago" },
  ];

  const folders = [
    { name: "Design Assets", count: 12 },
    { name: "Marketing", count: 8 },
    { name: "Invoices", count: 3 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        onUploadClick={() => setShowUploadModal(true)}
        onUpgradeClick={() => setShowUpgradeModal(true)}
      />

      <main className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center sticky top-0 z-30">
          <Logo showWithName={false} />
          <button
            onClick={() => setShowMobileMenu(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Desktop Header */}
        <header className="hidden md:flex bg-white border-b border-slate-200 h-16 items-center justify-between px-8">
          <input
            type="text"
            placeholder="Search files, folders..."
            className="w-full max-w-xl px-4 py-2 bg-slate-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded-full relative">
            🔔
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div
            className="border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-xl p-8 text-center hover:bg-blue-50 cursor-pointer mb-8"
            onClick={() => setShowUploadModal(true)}
          >
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
              ☁️
            </div>
            <h3 className="text-slate-900 font-medium mb-1">
              Drag & drop files here
            </h3>
            <p className="text-sm text-slate-500">
              or click to select. Max 10 MB per file (Free Plan).
            </p>
          </div>

          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Folders
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {folders.map((folder, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md cursor-pointer transition-shadow"
              >
                <div className="text-3xl mb-2">📁</div>
                <p className="font-medium text-slate-700">{folder.name}</p>
                <p className="text-xs text-slate-400">{folder.count} files</p>
              </div>
            ))}
          </div>

          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Recent Files
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md cursor-pointer transition-shadow"
              >
                <div className="h-32 bg-slate-50 rounded-lg mb-3 flex items-center justify-center text-4xl">
                  {file.icon}
                </div>
                <p className="text-sm font-medium text-slate-700 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-slate-400">
                  {file.size} • {file.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
      <MobileMenu
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
      />
    </div>
  );
}

export default DashboardPage;
