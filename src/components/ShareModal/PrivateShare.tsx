import React, { useState, useEffect, useRef } from "react";
import { X, Mail, Loader2, SearchX } from "lucide-react";
import axiosInstance from "@/src/services/axios";
// import axiosInstance from "../services/axios";

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface PrivateShareProps {
  fileId: string;
  onSuccess: () => void;
}

const PrivateShare: React.FC<PrivateShareProps> = ({ fileId, onSuccess }) => {
  const [query, setQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Search users with debounce
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const searchUsers = async () => {
      setIsSearching(true);
      try {
        const { data } = await axiosInstance.get("/users/search", {
          params: { search: query, page: 1, limit: 10 },
        });

        const selectedUserIds = selectedUsers.map((u) => u.id);
        const filtered =
          data.users?.filter(
            (user: User) => !selectedUserIds.includes(user.id),
          ) || [];

        setSuggestions(filtered);
      } catch (error) {
        console.error("Search failed:", error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, selectedUsers]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddUser = (user: User) => {
    if (!selectedUsers.some((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setQuery("");
    setShowDropdown(false);
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== userId));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim() && query.includes("@")) {
      e.preventDefault();
      handleAddUser({ id: query, email: query, name: query });
    } else if (e.key === "Backspace" && !query && selectedUsers.length > 0) {
      const newUsers = [...selectedUsers];
      newUsers.pop();
      setSelectedUsers(newUsers);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUsers.length === 0 && !query.trim()) return;

    const userIds = selectedUsers.map((u) => u.id);
    if (query.trim() && query.includes("@")) {
      userIds.push(query);
    }

    setIsSharing(true);
    try {
      await axiosInstance.post("/share", {
        fileId,
        visibility: "private",
        expiryHours: null, // No expiry for private shares
        sharedWithUserIds: userIds,
      });
      onSuccess();
    } catch (error) {
      console.error("Share failed:", error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* User Selection */}
      <div className="relative">
        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1.5">
          Add People
        </label>

        <div
          className="min-h-[50px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-colors cursor-text"
          onClick={() => document.getElementById("people-input")?.focus()}
        >
          {selectedUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 px-2 py-1 rounded-full text-xs font-medium border border-brand-100 dark:border-brand-800/50"
            >
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt=""
                  className="w-4 h-4 rounded-full mr-1.5"
                />
              )}
              <span>{user.name || user.email}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveUser(user.id);
                }}
                className="ml-1.5 p-0.5 hover:bg-brand-200 dark:hover:bg-brand-800 rounded-full transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          ))}

          <input
            id="people-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedUsers.length === 0 ? "Enter name or email..." : ""
            }
            className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder-slate-400"
            autoComplete="off"
          />

          {isSearching && (
            <Loader2
              size={16}
              className="animate-spin text-slate-400 my-auto"
            />
          )}
        </div>

        {/* Dropdown Suggestions */}
        {showDropdown && query && (
          <div
            ref={dropdownRef}
            className="absolute z-50 left-0 right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-48 overflow-y-auto"
          >
            {suggestions.length > 0 ? (
              suggestions.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleAddUser(user)}
                  className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex items-center transition-colors"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full mr-3 border border-slate-100 dark:border-slate-700"
                  />
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              ))
            ) : query.includes("@") && !isSearching ? (
              <div
                onClick={() =>
                  handleAddUser({ id: query, email: query, name: query })
                }
                className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex items-center"
              >
                <div className="w-8 h-8 rounded-full mr-3 bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <Mail size={16} className="text-slate-500" />
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Invite <span className="font-semibold">{query}</span>
                </p>
              </div>
            ) : !isSearching ? (
              <div className="p-4 text-center">
                <SearchX size={20} className="mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  No user found
                </p>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Info Message */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-lg p-3">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          Selected users will have permanent access to this file until you
          revoke their permissions.
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={(selectedUsers.length === 0 && !query) || isSharing}
        className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isSharing ? (
          <>
            <Loader2 size={18} className="animate-spin mr-2" />
            Sending...
          </>
        ) : (
          "Send Invite"
        )}
      </button>
    </form>
  );
};

export default PrivateShare;
