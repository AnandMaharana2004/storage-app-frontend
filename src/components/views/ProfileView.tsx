import React, { useState, useRef, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import {
  User,
  Mail,
  Lock,
  Shield,
  CreditCard,
  HardDrive,
  Camera,
  Save,
  X,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Moon,
  Sun,
  Laptop,
  LogOut,
} from "lucide-react";
import axiosInstance from "@/src/services/axios";
import imageCompression from "browser-image-compression";

// Internal Modal Component
const ChangePasswordModal = ({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newPassword: string, confirmPassword: string) => void;
}) => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    onSave(newPassword, confirmPassword);
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleClose = () => {
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-md shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200 border dark:border-slate-800">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 dark:text-white">
            Change Password
          </h3>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full px-3 py-2 bg-white dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm transition-all pr-10"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full px-3 py-2 bg-white dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none text-sm transition-all pr-10"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-colors"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

type ToastStatus = "idle" | "loading" | "success" | "error";

const ProfileView: React.FC = () => {
  const { user, storage, theme, toggleTheme, updateUserProfile, logout } =
    useUser();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [toastStatus, setToastStatus] = useState<ToastStatus>("idle");
  const [toastMessage, setToastMessage] = useState("");

  // Local form state
  const [fullName, setFullName] = useState(user?.name || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const usagePercent = (storage.used / storage.total) * 100;

  // Sync state if context changes
  useEffect(() => {
    if (user) {
      setFullName(user.name);
    }
  }, [user?.name]);

  if (!user) return null;

  // Check if dirty
  const hasChanges = fullName !== user.name;

  const showToast = (
    message: string,
    status: "success" | "error" = "success",
  ) => {
    setToastMessage(message);
    setToastStatus(status);
    setTimeout(() => {
      setToastStatus("idle");
    }, 3000);
  };

  const handleSavePassword = async (
    newPassword: string,
    confirmPassword: string,
  ) => {
    setToastStatus("loading");
    setToastMessage("Changing password...");

    try {
      await axiosInstance.post("/auth/change-password", {
        newPassword,
        confirmPassword,
      });
      setIsPasswordModalOpen(false);
      showToast("Password changed successfully", "success");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to change password";
      showToast(errorMessage, "error");
    }
  };

  const handleSaveIdentity = async () => {
    if (!hasChanges) return;

    setToastStatus("loading");
    setToastMessage("Updating profile...");

    try {
      updateUserProfile({ name: fullName });
      showToast("Profile updated successfully", "success");
    } catch (error) {
      showToast("Failed to update profile", "error");
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const previousAvatar = user.avatar;
    try {
      if (!e.target.files || !e.target.files[0]) return;

      const file = e.target.files[0];

      if (!file.type.startsWith("image/")) {
        showToast("Please select an image file", "error");
        return;
      }
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1, // < 1MB
        maxWidthOrHeight: 512,
        useWebWorker: true,
        fileType: "image/webp",
      });

      if (compressedFile.size > 1 * 1024 * 1024) {
        showToast("Compressed image is still too large", "error");
        return;
      }

      const presignedRes = await axiosInstance.post(
        "/users/profilePic/update",
        {
          extension: "image/webp",
          size: compressedFile.size,
        },
      );
      const { uploadUrl } = presignedRes.data.data;
      console.log("the presigned url is : ", uploadUrl);

      await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "image/webp",
        },
        body: compressedFile,
      });

      const confirmRes = await axiosInstance.post(
        "/users/profilePic/conformation",
      );

      const { profilePicUrl } = confirmRes.data.data;
      const previewUrl = URL.createObjectURL(compressedFile);
      updateUserProfile({
        avatar: `${previewUrl}`,
      });

      setTimeout(() => {
        updateUserProfile({
          avatar: `${profilePicUrl}?v=${Date.now()}`,
        });
      }, 3000);

      showToast("Profile picture updated successfully", "success");
    } catch (error: any) {
      console.error(error);
      updateUserProfile({ avatar: previousAvatar });
      showToast(
        error?.response?.data?.message || "Failed to update profile picture",
        "error",
      );
    } finally {
      e.target.value = "";
    }
  };

  const handleSignOut = () => {
    logout();
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 w-full max-w-4xl mx-auto relative">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileSelect}
      />

      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
        Account Settings
      </h1>

      <div className="space-y-6">
        {/* 1. Identity Section */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center">
              <User size={18} className="mr-2 text-brand-500" />
              Profile Identity
            </h3>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              {/* Profile Pic */}
              <div className="flex flex-col items-center space-y-3 mx-auto sm:mx-0">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full border-4 border-slate-50 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-inner">
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-1.5 bg-brand-600 text-white border border-white dark:border-slate-900 rounded-full hover:bg-brand-700 transition-colors shadow-sm"
                    title="Change Photo"
                  >
                    <Camera size={14} />
                  </button>
                </div>
              </div>

              {/* Inputs */}
              <div className="flex-1 w-full space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={16} className="text-slate-400" />
                      </div>
                      <input
                        type="email"
                        defaultValue={user.email}
                        readOnly
                        className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 text-sm cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSaveIdentity}
                    disabled={!hasChanges}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-colors ${
                      hasChanges
                        ? "bg-brand-600 text-white hover:bg-brand-700"
                        : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed opacity-70"
                    }`}
                  >
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Appearance Section */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center">
              <Laptop size={18} className="mr-2 text-brand-500" />
              Appearance
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {/* Light Mode Card */}
              <button
                onClick={() => toggleTheme("light")}
                className={`group relative p-4 rounded-xl border-2 text-left transition-all ${
                  theme === "light"
                    ? "border-brand-500 bg-brand-50 dark:bg-slate-800"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-600 mb-3">
                  <Sun size={20} className="fill-current" />
                </div>
                <h4
                  className={`font-medium text-sm ${
                    theme === "light"
                      ? "text-brand-700 dark:text-brand-400"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  Light Mode
                </h4>
                {theme === "light" && (
                  <div className="absolute top-3 right-3 text-brand-500">
                    <Check size={18} />
                  </div>
                )}
              </button>

              {/* Dark Mode Card */}
              <button
                onClick={() => toggleTheme("dark")}
                className={`group relative p-4 rounded-xl border-2 text-left transition-all ${
                  theme === "dark"
                    ? "border-brand-500 bg-slate-800"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 mb-3">
                  <Moon size={20} className="fill-current" />
                </div>
                <h4
                  className={`font-medium text-sm ${
                    theme === "dark"
                      ? "text-brand-400"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  Dark Mode
                </h4>
                {theme === "dark" && (
                  <div className="absolute top-3 right-3 text-brand-500">
                    <Check size={18} />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 3. Security Section */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center">
              <Shield size={18} className="mr-2 text-brand-500" />
              Security
            </h3>
          </div>
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                Password
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Protect your account with a strong password.
              </p>
            </div>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 shadow-sm text-sm font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
            >
              <Lock size={16} className="mr-2 text-slate-400" />
              Change Password
            </button>
          </div>
        </div>

        {/* 4. Subscription & Storage */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center">
              <CreditCard size={18} className="mr-2 text-brand-500" />
              Subscription & Storage
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Plan Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">
                      Current Plan
                    </p>
                    <p className="text-lg font-bold text-slate-800 dark:text-white mt-1">
                      {storage.type} Tier
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full uppercase tracking-wider">
                    Active
                  </span>
                </div>
                <button className="w-full py-2 border border-brand-200 dark:border-brand-900 text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/20 hover:bg-brand-100 dark:hover:bg-brand-900/40 rounded-lg text-sm font-medium transition-colors">
                  Upgrade to Pro
                </button>
              </div>

              {/* Storage Info */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
                      <HardDrive size={16} className="mr-2 text-slate-400" />
                      Storage Usage
                    </div>
                    <span className="text-sm font-bold text-slate-800 dark:text-white">
                      {usagePercent.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-brand-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-right">
                    {storage.used * 1000} MB of {storage.total} GB used
                  </p>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleSignOut}
                  className="mt-6 md:mt-0 w-full flex items-center justify-center px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium transition-colors"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSave={handleSavePassword}
      />

      {/* Dynamic Notification Toast */}
      {toastStatus !== "idle" && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center animate-in slide-in-from-bottom-5 fade-in duration-300 ${
            toastStatus === "error"
              ? "bg-red-600 dark:bg-red-700 text-white"
              : "bg-slate-800 dark:bg-slate-700 text-white"
          }`}
        >
          {toastStatus === "loading" ? (
            <Loader2 className="animate-spin mr-3 text-brand-400" size={18} />
          ) : toastStatus === "error" ? (
            <div className="bg-white/20 rounded-full p-0.5 mr-3">
              <X className="text-white" size={12} />
            </div>
          ) : (
            <div className="bg-green-500 rounded-full p-0.5 mr-3">
              <Check className="text-white" size={12} />
            </div>
          )}
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
