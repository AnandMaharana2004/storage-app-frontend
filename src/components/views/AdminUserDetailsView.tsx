import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Calendar,
  Shield,
  HardDrive,
  Laptop,
  MapPin,
  Clock,
  LogOut,
  Loader2,
  UserX,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  Filter,
  FileIcon as FileIconLucide,
  ExternalLink,
} from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import { FileIcon } from "../FileCard";
import FilePreviewModal from "../FilePreviewModal";
import { FileItem } from "../../types";

const AdminUserDetailsView: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const {
    selectedUser,
    selectedUserFiles,
    isLoadingDetail,
    isLoadingFiles,
    fetchUserDetails,
    toggleUserStatus,
    forceLogoutUser,
    clearSelectedUser,
  } = useAdmin();

  const [fileSearchQuery, setFileSearchQuery] = useState("");
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  useEffect(() => {
    if (userId) {
      fetchUserDetails(userId);
    }
    return () => clearSelectedUser();
  }, [userId, fetchUserDetails, clearSelectedUser]);

  if (isLoadingDetail && !selectedUser) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-slate-500 space-y-4">
        <Loader2 className="animate-spin text-brand-500" size={32} />
        <p className="font-medium animate-pulse">Retrieving user profile...</p>
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <div className="p-8 text-center text-slate-500 flex flex-col items-center">
        <AlertCircle size={48} className="mb-4 text-slate-300" />
        <p className="text-lg font-medium mb-4">User profile not found.</p>
        <button
          onClick={() => navigate("/admin")}
          className="text-brand-600 hover:underline flex items-center"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Directory
        </button>
      </div>
    );
  }

  const usagePercent =
    (selectedUser.storageUsedBytes / selectedUser.storageLimitBytes) * 100;

  const filteredFiles = selectedUserFiles.filter((file) =>
    file.name.toLowerCase().includes(fileSearchQuery.toLowerCase()),
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 pb-20">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/admin")}
            className="mr-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            title="Back to Directory"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center tracking-tight">
              User Details
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Managing account: {selectedUser.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleUserStatus(selectedUser.id)}
            className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all shadow-sm ${
              selectedUser.status === "Active"
                ? "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/50"
                : "bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-emerald-900/50"
            }`}
          >
            {selectedUser.status === "Active" ? (
              <UserX size={16} />
            ) : (
              <UserCheck size={16} />
            )}
            {selectedUser.status === "Active"
              ? "Suspend Account"
              : "Activate Account"}
          </button>
          <button
            onClick={() => forceLogoutUser(selectedUser.id)}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
          >
            <LogOut size={16} />
            Force Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Core Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Identity Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 border-4 border-slate-50 dark:border-slate-800 shadow-inner text-3xl font-bold text-slate-400">
                {selectedUser.name.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                {selectedUser.name}
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                {selectedUser.email}
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 uppercase tracking-widest">
                  {selectedUser.plan}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${
                    selectedUser.status === "Active"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {selectedUser.status}
                </span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center text-sm">
                <Mail className="text-slate-400 mr-3" size={18} />
                <span className="text-slate-500 mr-auto">Email Verified</span>
                <CheckCircle2 size={16} className="text-emerald-500" />
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="text-slate-400 mr-3" size={18} />
                <span className="text-slate-500 mr-auto">Member Since</span>
                <span className="text-slate-800 dark:text-slate-300 font-medium">
                  {selectedUser.joinedAt}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Shield className="text-slate-400 mr-3" size={18} />
                <span className="text-slate-500 mr-auto">Permission Level</span>
                <span className="text-slate-800 dark:text-slate-300 font-medium">
                  {selectedUser.role}
                </span>
              </div>
            </div>
          </div>

          {/* Storage Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-brand-50 dark:bg-brand-900/20 rounded-lg mr-3">
                <HardDrive size={18} className="text-brand-500" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white">
                Storage Analysis
              </h4>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm text-slate-500">Usage Overview</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-white">
                    {usagePercent.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      usagePercent > 90 ? "bg-red-500" : "bg-brand-500"
                    }`}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Used
                  </p>
                  <p className="text-lg font-bold text-slate-800 dark:text-white">
                    {selectedUser.usage}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Quota
                  </p>
                  <p className="text-lg font-bold text-slate-800 dark:text-white">
                    {selectedUser.storageLimit}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-blue-50/50 dark:bg-blue-900/10 p-2 rounded-lg border border-blue-100/50 dark:border-blue-900/30">
                <FileText size={14} className="text-brand-500" />
                <span>
                  Tracking {selectedUser.fileCount.toLocaleString()} total files
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sessions & Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Device Sessions Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg mr-3">
                <Laptop size={18} className="text-purple-500" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white">
                Active Device Sessions
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                    <th className="px-6 py-4">Device & Browser</th>
                    <th className="px-6 py-4">IP Address</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4 text-right">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedUser.activeSessions.length > 0 ? (
                    selectedUser.activeSessions.map((session) => (
                      <tr
                        key={session.id}
                        className="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center mr-3 text-slate-500">
                              <Laptop size={16} />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-slate-200">
                                {session.deviceName}
                              </p>
                              <p className="text-xs text-slate-500">
                                {session.browser}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">
                          {session.ipAddress}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-slate-500">
                            <MapPin size={14} className="mr-1 text-slate-300" />
                            {session.location}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex flex-col items-end">
                            <div className="flex items-center text-emerald-500 font-medium">
                              <Clock size={14} className="mr-1" />
                              {session.lastActive}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-slate-400 italic"
                      >
                        No active sessions found for this user.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* User Files Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center">
                <div className="p-2 bg-brand-50 dark:bg-brand-900/20 rounded-lg mr-3">
                  <FileText size={18} className="text-brand-500" />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-white">
                  User Content
                </h4>
              </div>

              <div className="relative group">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors"
                  size={14}
                />
                <input
                  type="text"
                  placeholder="Find specific file..."
                  value={fileSearchQuery}
                  onChange={(e) => setFileSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 w-full sm:w-48 transition-all"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                    <th className="px-6 py-4">File Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Size</th>
                    <th className="px-6 py-4 text-right">Upload Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {isLoadingFiles ? (
                    [1, 2, 3].map((i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4 flex items-center">
                          <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded mr-3" />
                          <div className="w-24 h-3 bg-slate-50 dark:bg-slate-800 rounded" />
                        </td>
                        <td colSpan={3} className="px-6 py-4">
                          <div className="w-full h-3 bg-slate-50 dark:bg-slate-800 rounded" />
                        </td>
                      </tr>
                    ))
                  ) : filteredFiles.length > 0 ? (
                    filteredFiles.map((file) => (
                      <tr
                        key={file.id}
                        className="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer"
                        onClick={() => setPreviewFile(file)}
                      >
                        <td className="px-6 py-4 max-w-xs">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-3 text-slate-500 shrink-0 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                              <FileIcon type={file.type} />
                            </div>
                            <span
                              className="font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors"
                              title={file.name}
                            >
                              {file.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 uppercase tracking-wider">
                            {file.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">
                          {file.size}
                        </td>
                        <td className="px-6 py-4 text-right text-slate-500 whitespace-nowrap">
                          {file.date}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-slate-400 italic"
                      >
                        {fileSearchQuery
                          ? "No matching files found for this search."
                          : "This user has no files uploaded yet."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Admin Action Logs */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <h4 className="font-bold text-slate-800 dark:text-white mb-6">
              Recent Administrative Actions
            </h4>
            <div className="space-y-4">
              <div className="flex gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm border border-slate-100 dark:border-slate-700">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                  <Shield size={16} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-slate-800 dark:text-slate-300 font-medium">
                    Password Reset Requested
                  </p>
                  <p className="text-xs text-slate-500">
                    Sent to recovery email address • Oct 14, 2023
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm border border-slate-100 dark:border-slate-700">
                <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center shrink-0">
                  <ArrowLeft size={16} className="text-brand-600" />
                </div>
                <div>
                  <p className="text-slate-800 dark:text-slate-300 font-medium">
                    Account Upgraded to Pro
                  </p>
                  <p className="text-xs text-slate-500">
                    Manual upgrade by administrator • Sep 22, 2023
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin File Preview Modal */}
      <FilePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
        onMoveToTrash={(id) => {
          // In a real app, admins could delete user files.
          // For now, we simulate the action and close the modal.
          setPreviewFile(null);
        }}
      />
    </div>
  );
};

export default AdminUserDetailsView;
