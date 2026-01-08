import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
// import { FileItem } from "../types";
// import PrivateShare from "./PrivateShare"; // Uncomment for V2
import PublicShare from "./PublicShare";
import { FileItem } from "@/src/types";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: FileItem | null;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, file }) => {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setShowSuccess(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-md shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200 border dark:border-slate-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white">
              Share File
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
              {file.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {showSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 animate-in fade-in slide-in-from-bottom-2">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-3">
                <Check size={24} />
              </div>
              <p className="text-slate-800 dark:text-white font-medium">
                Link Created!
              </p>
            </div>
          ) : (
            <PublicShare fileId={file.id} onSuccess={handleSuccess} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;

// ============================================================================
// UPGRADE TO V2 (WITH PRIVATE SHARE):
// ============================================================================

// To add Private Share functionality in V2, follow these steps:

// 1. Uncomment the PrivateShare import at the top
// 2. Add state for active tab:
//    const [activeTab, setActiveTab] = useState<"private" | "public">("private");

// 3. Replace the Content section with tabs:

//    {/* Tabs *\/}
//    <div className="flex border-b border-slate-100 dark:border-slate-800 shrink-0">
//      <button
//        onClick={() => setActiveTab("private")}
//        className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center ${
//          activeTab === "private"
//            ? "border-brand-500 text-brand-600 dark:text-brand-400"
//            : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
//        }`}
//      >
//        <Users size={16} className="mr-2" />
//        Private Share
//      </button>
//      <button
//        onClick={() => setActiveTab("public")}
//        className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center ${
//          activeTab === "public"
//            ? "border-brand-500 text-brand-600 dark:text-brand-400"
//            : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
//        }`}
//      >
//        <Globe size={16} className="mr-2" />
//        Public Link
//      </button>
//    </div>

// 4. Update the content rendering logic:

//    {showSuccess ? (
//      <div>Success message</div>
//    ) : activeTab === "private" ? (
//      <PrivateShare
//        fileId={file.id}
//        onSuccess={() => handleSuccess("Invites Sent!")}
//      />
//    ) : (
//      <PublicShare
//        fileId={file.id}
//        onSuccess={() => handleSuccess("Link Created!")}
//      />
//    )}

// 5. Update handleSuccess to accept message parameter:
//    const handleSuccess = (message: string) => {
//      setSuccessMessage(message);
//      setShowSuccess(true);
//      setTimeout(() => onClose(), 1500);
