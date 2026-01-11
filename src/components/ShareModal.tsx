import React, { useState, useEffect } from "react";
import { X, Link, Copy, Check, Loader2 } from "lucide-react";
import axiosInstance from "../services/axios";

// Base file without public sharing
interface PrivateFile {
  id: string;
  name: string;
  isPublic?: false;
  publicUrl?: never;
}

// File with public sharing - both fields are required
interface PublicFile {
  id: string;
  name: string;
  isPublic: true;
  publicUrl: string;
}

// Union type ensures type safety
type FileItem = PrivateFile | PublicFile;

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: FileItem | null;
  onShareUpdate?: (file: FileItem) => void; // Callback to update parent component
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  file,
  onShareUpdate,
}) => {
  const [isPublicLinkEnabled, setIsPublicLinkEnabled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [isToggling, setIsToggling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && file) {
      document.body.style.overflow = "hidden";

      // Fetch current sharing status from API
      const fetchShareStatus = async () => {
        setIsLoading(true);
        try {
          const response = await axiosInstance.get("/share/public/exist", {
            params: { fileId: file.id },
          });

          // If response is 200, share link exists
          if (response.status === 200 && response.data?.data?.url) {
            setIsPublicLinkEnabled(true);
            setShareLink(response.data.data.url);
          }
        } catch (error: any) {
          // If 404, no share link exists
          if (error.response?.status === 404) {
            setIsPublicLinkEnabled(false);
            setShareLink("");
          } else {
            console.error("Failed to fetch share status:", error);
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchShareStatus();
      setCopied(false);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, file]);

  if (!isOpen || !file) return null;

  const handleCopyLink = async () => {
    if (!shareLink) return;

    try {
      // Modern clipboard API (preferred)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement("textarea");
        textArea.value = shareLink;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          const successful = document.execCommand("copy");
          if (successful) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } else {
            throw new Error("Copy command failed");
          }
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (err) {
      console.error("Failed to copy:", err);
      // Show error feedback to user
      alert("Failed to copy link. Please try selecting and copying manually.");
    }
  };

  const handleTogglePublicLink = async () => {
    if (!file) return;

    setIsToggling(true);

    try {
      if (isPublicLinkEnabled) {
        // Disable public sharing
        await axiosInstance.delete(`/share/public/${file.id}`);

        // Update local state
        setIsPublicLinkEnabled(false);
        setShareLink("");

        // Update parent component
        if (onShareUpdate) {
          onShareUpdate({
            ...file,
            isPublic: false,
            publicUrl: undefined,
          } as FileItem);
        }
      } else {
        // Enable public sharing
        const result = await axiosInstance.post("/share/public", {
          fileId: file.id,
        });

        const { url } = result.data.data;

        // Update local state
        setIsPublicLinkEnabled(true);
        setShareLink(url);

        // Update parent component
        if (onShareUpdate) {
          onShareUpdate({
            ...file,
            isPublic: true,
            publicUrl: url,
          } as FileItem);
        }
      }
    } catch (error) {
      console.error("Failed to toggle public link:", error);
      alert("Failed to update sharing settings. Please try again.");
    } finally {
      setIsToggling(false);
    }
  };

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

        {/* Content - Public Link Only */}
        <div className="p-6">
          {isLoading ? (
            <div className="space-y-6 animate-pulse">
              {/* Skeleton for toggle section */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center flex-1">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 mr-3"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-40"></div>
                  </div>
                </div>
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 transition-colors ${
                      isToggling
                        ? "bg-slate-300 dark:bg-slate-600"
                        : isPublicLinkEnabled
                          ? "bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400"
                          : "bg-slate-200 text-slate-500 dark:bg-slate-700"
                    }`}
                  >
                    {isToggling ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Link size={20} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Public Link Access
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isToggling
                        ? "Updating..."
                        : isPublicLinkEnabled
                          ? "Anyone with the link can view"
                          : "Enable link sharing"}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isPublicLinkEnabled}
                    disabled={isToggling}
                    onChange={handleTogglePublicLink}
                  />
                  <div
                    className={`w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600 ${
                      isToggling ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  ></div>
                </label>
              </div>

              {isPublicLinkEnabled && !isToggling && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                      Link URL
                    </label>
                    <div className="flex shadow-sm rounded-lg">
                      <input
                        type="text"
                        readOnly
                        value={shareLink}
                        className="flex-1 block w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-l-lg text-sm text-slate-500 dark:text-slate-400 focus:outline-none"
                      />
                      <button
                        onClick={handleCopyLink}
                        disabled={!shareLink}
                        className={`px-4 py-2 border border-l-0 border-slate-200 dark:border-slate-700 rounded-r-lg font-medium text-sm transition-all flex items-center disabled:opacity-50 disabled:cursor-not-allowed ${
                          copied
                            ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                            : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600"
                        }`}
                      >
                        {copied ? (
                          <span className="flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-200">
                            <Check
                              size={16}
                              className="text-green-600 dark:text-green-400"
                            />
                            {/* <span className="text-xs">Copied!</span> */}
                          </span>
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
