import React, { useEffect } from "react";
import { X, User, CreditCard, LogOut, Shield } from "lucide-react";
import { StorageStats } from "../types";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  storage: StorageStats;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  storage,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const usagePercent = (storage.used / storage.total) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-brand-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-brand-100 hover:text-white bg-brand-700/50 hover:bg-brand-700 p-1.5 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center">
            <div className="w-16 h-16 bg-white p-1 rounded-full shadow-lg">
              <img
                src="https://picsum.photos/200"
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold">Alex Developer</h2>
              <p className="text-brand-100 text-sm">alex@cloudzoon.com</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Storage Section */}
          <div className="mb-6">
            <div className="flex justify-between items-end mb-2">
              <h3 className="text-sm font-semibold text-slate-700">
                Storage Usage
              </h3>
              <span className="text-xs font-medium text-brand-600">
                {usagePercent.toFixed(0)}% Used
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-brand-500 rounded-full"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 flex justify-between">
              <span>{storage.used * 1000} MB used</span>
              <span>{storage.total} GB Total</span>
            </p>
          </div>

          <div className="space-y-1">
            <button className="w-full flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
              <User size={20} className="mr-3 text-slate-400" />
              <span className="font-medium">Account Settings</span>
            </button>
            <button className="w-full flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
              <CreditCard size={20} className="mr-3 text-slate-400" />
              <span className="font-medium">Billing & Plans</span>
              <span className="ml-auto text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-bold">
                FREE
              </span>
            </button>
            <button className="w-full flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
              <Shield size={20} className="mr-3 text-slate-400" />
              <span className="font-medium">Security & Privacy</span>
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <button className="w-full flex items-center justify-center px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors">
              <LogOut size={18} className="mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
