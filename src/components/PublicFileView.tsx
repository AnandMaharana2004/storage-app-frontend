import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Download,
  AlertCircle,
  FileText,
  Loader2,
  ArrowRight,
  ExternalLink,
  FileAudio,
  File,
  Info,
  X,
} from "lucide-react";
import { api } from "../services/api";

interface FileData {
  _id: string;
  name: string;
  size: number;
  extension: string;
  userId: string;
  isUploading: boolean;
  parentDirId: string;
  s3Key: string;
  createdAt: string;
  updatedAt: string;
  url: string;
}

const PublicFileView: React.FC = () => {
  const { token } = useParams<{ fileId: string; token: string }>();
  const [file, setFile] = useState<FileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const fetchFile = async () => {
      if (!token) {
        setError("Invalid link.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await api.getPublicFile(token);
        setFile(data);
      } catch (err: any) {
        setError(err.message || "File not found or link has expired.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFile();
  }, [token]);

  // Lock body scroll when info modal is open
  useEffect(() => {
    if (showInfo) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showInfo]);

  /* ---------------- Helper Functions ---------------- */

  const getFileType = (extension: string): string => {
    const ext = extension.toLowerCase();
    if (ext.includes("image/") || ext.match(/\.(jpg|jpeg|png|gif|webp|svg)$/))
      return "image";
    if (ext.includes("video/") || ext.match(/\.(mp4|webm|ogg|mov)$/))
      return "video";
    if (ext.includes("audio/") || ext.match(/\.(mp3|wav|ogg|m4a)$/))
      return "audio";
    if (ext.includes("pdf") || ext.endsWith(".pdf")) return "pdf";
    if (ext.match(/\.(doc|docx)$/)) return "doc";
    return "other";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleDownload = async () => {
    if (!file) return;
    try {
      const link = document.createElement("a");
      link.href = file.url;
      link.download = file.name;
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      alert("Failed to download file");
    }
  };

  const openInNewTab = () => {
    if (!file) return;
    window.open(file.url, "_blank", "noopener,noreferrer");
  };

  /* ---------------- Loading State ---------------- */

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 size={32} className="animate-spin mb-4 text-blue-600" />
        <p className="text-slate-500 dark:text-slate-400">
          Loading file preview...
        </p>
      </div>
    );
  }

  /* ---------------- Error State ---------------- */

  if (error || !file) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
            File Unavailable
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const fileType = getFileType(file.extension);

  /* ---------------- Render Preview Content ---------------- */

  const renderPreview = () => {
    switch (fileType) {
      case "image":
        return (
          <div className="w-full h-full flex items-center justify-center p-4">
            <img
              src={file.url}
              alt={file.name}
              className="max-h-full max-w-full object-contain rounded-lg"
              style={{ maxHeight: "80vh", maxWidth: "90vw" }}
            />
          </div>
        );

      case "video":
        return (
          <div className="w-full max-w-5xl mx-auto">
            <video
              src={file.url}
              controls
              className="w-full rounded-lg bg-black"
              style={{ maxHeight: "75vh" }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );

      case "audio":
        return (
          <div className="w-full max-w-md p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl">
            <p className="text-sm mb-4 text-slate-700 dark:text-slate-300 truncate">
              {file.name}
            </p>
            <audio src={file.url} controls className="w-full" />
          </div>
        );

      case "pdf":
      case "doc":
        return (
          <div className="text-center">
            <FileText size={64} className="mx-auto mb-4 text-slate-400" />
            <p className="mb-2 text-slate-600 dark:text-slate-400">
              {fileType.toUpperCase()} Document
            </p>
            <p className="mb-6 text-sm text-slate-500 dark:text-slate-500 max-w-xs mx-auto truncate">
              {file.name}
            </p>
            <button
              onClick={openInNewTab}
              className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition-colors inline-flex items-center gap-2"
            >
              <ExternalLink size={18} />
              Open in New Tab
            </button>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <FileText size={64} className="mx-auto mb-4 text-slate-400" />
            <p className="mb-4 text-slate-600 dark:text-slate-400">
              No preview available
            </p>
            <button
              onClick={handleDownload}
              className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition-colors"
            >
              Download
            </button>
          </div>
        );
    }
  };

  /* ---------------- Main Render ---------------- */

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* ---------------- Header ---------------- */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3">
            Z
          </div>
          <span className="text-lg font-semibold text-slate-800 dark:text-white">
            CloudZoon
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="File Info"
          >
            <Info size={18} />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Download"
          >
            <Download size={18} />
          </button>
          <button
            onClick={() => (window.location.href = "/sign-in")}
            className="ml-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Log In
          </button>
        </div>
      </header>

      {/* ---------------- Content Area ---------------- */}
      <main className="flex-1 flex items-center justify-center overflow-hidden">
        {renderPreview()}
      </main>

      {/* ---------------- Info Modal (Center Popup) ---------------- */}
      {showInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 p-4"
          onClick={() => setShowInfo(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="h-14 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-base font-semibold text-slate-800 dark:text-white">
                File Details
              </h2>
              <button
                onClick={() => setShowInfo(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <FileText
                    size={18}
                    className="text-slate-500 dark:text-slate-400"
                  />
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {fileType}
                  </span>
                </div>
                <h3 className="text-base font-medium text-slate-800 dark:text-white mb-1 break-words">
                  {file.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Shared with you
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Size
                  </span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {formatFileSize(file.size)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Type
                  </span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {file.extension}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Shared
                  </span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 text-center">
                  Want to share files like this?
                </p>
                <button
                  onClick={() => (window.location.href = "/sign-up")}
                  className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2 font-medium"
                >
                  Create Free Account
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicFileView;
