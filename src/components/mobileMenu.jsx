import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./logo";

function MobileMenu({ isOpen, onClose, onUpgradeClick }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-50 md:hidden transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-64 bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <Logo />
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors duration-200 p-1 hover:bg-slate-100 rounded"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg font-medium transition-all duration-200 hover:bg-blue-100 active:scale-95"
          >
            📁 My Files
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-all duration-200 active:scale-95"
          >
            🕐 Recent
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-all duration-200 active:scale-95"
          >
            ⭐ Starred
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-all duration-200 active:scale-95"
          >
            👥 Shared with me
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-all duration-200 active:scale-95"
          >
            🗑️ Trash
          </a>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4 transition-all duration-200 hover:shadow-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-700">
                Storage
              </span>
              <span className="text-xs text-slate-500">920 MB / 1 GB</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 mb-3 overflow-hidden">
              <div
                className="bg-linear-to-r from-amber-400 to-red-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: "92%" }}
              ></div>
            </div>
            <button
              onClick={() => {
                onUpgradeClick();
                onClose();
              }}
              className="w-full py-1.5 text-xs font-semibold text-blue-600 border border-blue-200 rounded bg-white hover:bg-blue-50 transition-all duration-200 active:scale-95"
            >
              Upgrade Plan
            </button>
          </div>

          <button
            onClick={() => {
              navigate("/settings");
              onClose();
            }}
            className="w-full flex items-center gap-3 px-2 py-2 hover:bg-slate-50 rounded-lg mb-2 transition-all duration-200 active:scale-95"
          >
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User"
              className="w-8 h-8 rounded-full border border-slate-200 transition-transform duration-200 hover:scale-110"
            />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-slate-900">
                Alex Developer
              </p>
              <p className="text-xs text-slate-500">Free Plan</p>
            </div>
            <span className="transition-transform duration-200 group-hover:rotate-90">
              ⚙️
            </span>
          </button>

          <button
            onClick={() => {
              navigate("/");
              onClose();
            }}
            className="w-full px-4 py-2 text-red-500 rounded-lg font-medium hover:bg-red-50 transition-all duration-200 active:scale-95"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
