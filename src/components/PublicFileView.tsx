import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Download,
  AlertCircle,
  FileText,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { api } from "../services/api";
import { FileItem } from "../types";
import { FileIcon } from "./FileCard";

const PublicFileView: React.FC = () => {
  const { fileId, token } = useParams<{ fileId: string; token: string }>();
  const [file, setFile] = useState<FileItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFile = async () => {
      if (!fileId || !token) {
        setError("Invalid link.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await api.getPublicFile(fileId, token);
        setFile(data);
      } catch (err: any) {
        setError(err.message || "File not found or link has expired.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFile();
  }, [fileId, token]);

  const handleDownload = () => {
    if (!file) return;
    // Simulate download
    alert(`Downloading ${file.name}...`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-400">
        <Loader2 size={32} className="animate-spin mb-4 text-brand-500" />
        <p>Loading file preview...</p>
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
            Unavailable
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
          <Link to="/" className="text-brand-600 font-medium hover:underline">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors">
      {/* Simple Header */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-3 shadow-sm">
            Z
          </div>
          <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
            CloudZoon
          </span>
        </div>
        <Link
          to="/sign-in"
          className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          Log In
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-500">
          {/* Preview Section */}
          <div className="flex-1 bg-slate-100 dark:bg-slate-800 min-h-[300px] md:min-h-[400px] flex items-center justify-center relative overflow-hidden group">
            {file.thumbnail ? (
              <img
                src={file.thumbnail}
                alt={file.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="transform transition-transform duration-500 group-hover:scale-110">
                <div className="w-32 h-32 bg-white dark:bg-slate-700 rounded-2xl shadow-lg flex items-center justify-center">
                  <FileIcon type={file.type} />
                </div>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="w-full md:w-96 p-8 flex flex-col border-l border-slate-100 dark:border-slate-800">
            <div className="mb-auto">
              <div className="flex items-center space-x-2 mb-1">
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase rounded tracking-wider">
                  {file.type}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 break-words leading-tight">
                {file.name}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Shared by{" "}
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {file.sharedBy || "Unknown User"}
                </span>
              </p>

              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    File Size
                  </span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {file.size}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Date Shared
                  </span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    Just now
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-lg shadow-brand-500/30 hover:shadow-brand-500/40 transition-all active:scale-[0.98]"
              >
                <Download size={20} className="mr-2" />
                Download
              </button>

              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">
                  Want to share files like this?
                </p>
                <Link
                  to="/sign-up"
                  className="inline-flex items-center text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
                >
                  Create free account
                  <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublicFileView;
