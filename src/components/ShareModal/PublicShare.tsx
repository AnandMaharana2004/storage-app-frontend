import React, { useState } from "react";
import { Link, Copy, Check, Clock } from "lucide-react";
import axiosInstance from "@/src/services/axios";

interface PublicShareProps {
  fileId: string;
  onSuccess: () => void;
}

const PublicShare: React.FC<PublicShareProps> = ({ fileId, onSuccess }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [expiryHours, setExpiryHours] = useState(24); // Default 1 day
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (!isEnabled) {
      await createPublicLink();
    } else {
      setIsEnabled(false);
      setShareLink(null);
    }
  };

  const createPublicLink = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.post("/share", {
        fileId,
        visibility: "public",
        expiryHours: expiryHours === -1 ? null : expiryHours,
        sharedWithUserIds: null,
      });

      if (data.link) {
        setShareLink(data.link);
        setIsEnabled(true);
        onSuccess();
      }
    } catch (error) {
      console.error("Share failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpiryChange = async (newExpiryHours: number) => {
    setExpiryHours(newExpiryHours);

    // If link is already enabled, regenerate with new expiry
    if (isEnabled) {
      setIsLoading(true);
      try {
        const { data } = await axiosInstance.post("/share", {
          fileId,
          visibility: "public",
          expiryHours: newExpiryHours === -1 ? null : newExpiryHours,
          sharedWithUserIds: null,
        });

        if (data.link) {
          setShareLink(data.link);
        }
      } catch (error) {
        console.error("Update failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toggle Card */}
      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 transition-colors ${
              isEnabled
                ? "bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400"
                : "bg-slate-200 text-slate-500 dark:bg-slate-700"
            }`}
          >
            <Link size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              Public Link Access
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEnabled
                ? "Anyone with the link can view"
                : "Link sharing is disabled"}
            </p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isEnabled}
            onChange={handleToggle}
            disabled={isLoading}
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
        </label>
      </div>

      {/* Expiration & Link Display */}
      {isEnabled && (
        <div className="animate-in fade-in slide-in-from-top-2 space-y-4">
          {/* Expiration Select */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1.5">
              Link Expires In
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock size={16} className="text-slate-400" />
              </div>
              <select
                value={expiryHours}
                onChange={(e) => handleExpiryChange(Number(e.target.value))}
                disabled={isLoading}
                className="block w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value={1}>1 Hour</option>
                <option value={6}>6 Hours</option>
                <option value={24}>1 Day</option>
                <option value={168}>7 Days</option>
                <option value={-1}>Never</option>
              </select>
            </div>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              {expiryHours === -1
                ? "Link will never expire"
                : `Link will expire after ${expiryHours === 1 ? "1 hour" : expiryHours < 24 ? `${expiryHours} hours` : expiryHours === 24 ? "1 day" : `${expiryHours / 24} days`}`}
            </p>
          </div>

          {/* Link Display */}
          {shareLink && (
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                Share Link
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
                  className="px-4 py-2 bg-white dark:bg-slate-700 border border-l-0 border-slate-200 dark:border-slate-700 rounded-r-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 font-medium text-sm transition-colors flex items-center"
                >
                  {copied ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PublicShare;
