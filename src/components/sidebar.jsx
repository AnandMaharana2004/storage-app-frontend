import React from "react";
import { useNavigate } from "react-router-dom";

function Sidebar({ onUpgradeClick, onUploadClick }) {
  const navigate = useNavigate();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
      <div
        className="p-6 flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">
          Z
        </div>
        <span className="font-bold text-xl text-slate-800">CloudZoon</span>
      </div>
      <div className="px-4 mb-6">
        <button
          onClick={onUploadClick}
          className="w-full bg-linear-to-r from-blue-500 to-cyan-400 text-white py-3 rounded-lg font-semibold shadow-lg shadow-blue-500/30 hover:opacity-90"
        >
          📤 Upload File
        </button>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg font-medium"
        >
          📁 My Files
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium"
        >
          🕐 Recent
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium"
        >
          ⭐ Starred
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium"
        >
          👥 Shared with me
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium"
        >
          🗑️ Trash
        </a>
      </nav>
      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-700">
              Storage
            </span>
            <span className="text-xs text-slate-500">920 MB / 1 GB</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
            <div
              className="bg-linear-to-r from-amber-400 to-red-500 h-2 rounded-full"
              style={{ width: "92%" }}
            ></div>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            You're running low on space.
          </p>
          <button
            onClick={onUpgradeClick}
            className="w-full py-1.5 text-xs font-semibold text-blue-600 border border-blue-200 rounded bg-white hover:bg-blue-50"
          >
            Upgrade Plan
          </button>
        </div>
        <div
          className="flex items-center gap-3 px-2 cursor-pointer hover:bg-slate-50 p-2 rounded-lg"
          onClick={() => navigate("/settings")}
        >
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="User"
            className="w-8 h-8 rounded-full border border-slate-200"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900">Alex Developer</p>
            <p className="text-xs text-slate-500">Free Plan</p>
          </div>
          <span>⚙️</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
