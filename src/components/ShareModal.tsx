import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Mail,
  Link,
  Copy,
  Check,
  Clock,
  Globe,
  Users,
  User as UserIcon,
  Loader2,
  SearchX,
} from "lucide-react";
import { FileItem } from "../types";
import { api } from "../services/api";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: FileItem | null;
}

interface SelectedPerson {
  email: string;
  name?: string;
  avatar?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, file }) => {
  const [activeTab, setActiveTab] = useState<"invite" | "link">("invite");

  // Invite State
  const [query, setQuery] = useState("");
  const [selectedPeople, setSelectedPeople] = useState<SelectedPerson[]>([]);
  const [suggestions, setSuggestions] = useState<SelectedPerson[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Link State
  const [expiration, setExpiration] = useState("60"); // Default 60 minutes
  const [isPublicLinkEnabled, setIsPublicLinkEnabled] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sending State
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Reset state on open
      setActiveTab("invite");
      setQuery("");
      setSelectedPeople([]);
      setSuggestions([]);
      setExpiration("60");
      setIsPublicLinkEnabled(false);
      setCopied(false);
      setShowSuccess(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // API Search with Debounce
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const search = async () => {
      setIsSearching(true);
      try {
        const results = await api.searchPeople(query);
        // Filter out already selected people
        const filtered = results.filter(
          (contact) => !selectedPeople.some((p) => p.email === contact.email),
        );
        setSuggestions(filtered);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(search, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, selectedPeople]);

  if (!isOpen || !file) return null;

  const handleCopyLink = () => {
    const link = `https://cloudzoon.com/s/${file.id}/${Math.random().toString(36).substr(2, 5)}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPeople.length === 0 && !query.trim()) return;

    // Prepare emails list
    const emailsToSend = selectedPeople.map((p) => p.email);

    // Add current query if it looks like an email and isn't empty
    if (query.trim() && query.includes("@")) {
      emailsToSend.push(query.trim());
    }

    if (emailsToSend.length === 0) return;

    setIsSending(true);
    try {
      await api.sendInvite(file.id, emailsToSend);
      setIsSending(false);
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsSending(false);
      // Could handle error display here
    }
  };

  const handleAddPerson = (person: SelectedPerson) => {
    if (!selectedPeople.some((p) => p.email === person.email)) {
      setSelectedPeople([...selectedPeople, person]);
    }
    setQuery("");
    setShowSuggestions(false);
  };

  const handleRemovePerson = (email: string) => {
    setSelectedPeople(selectedPeople.filter((p) => p.email !== email));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (query.trim()) {
        // Treat as raw email
        handleAddPerson({ email: query.trim(), name: query.trim() });
      }
    } else if (e.key === "Backspace" && !query && selectedPeople.length > 0) {
      // Remove last item
      const newPeople = [...selectedPeople];
      newPeople.pop();
      setSelectedPeople(newPeople);
    }
  };

  const ExpirationSelect = () => (
    <div className="mt-4">
      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1.5">
        Access Expires In (Minutes)
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Clock size={16} className="text-slate-400" />
        </div>
        <select
          value={expiration}
          onChange={(e) => setExpiration(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors appearance-none"
        >
          <option value="15">15 Minutes</option>
          <option value="30">30 Minutes</option>
          <option value="60">1 Hour</option>
          <option value="360">6 Hours</option>
          <option value="1440">24 Hours</option>
          <option value="10080">7 Days</option>
          <option value="-1">Never (Permanent)</option>
        </select>
      </div>
    </div>
  );

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

        {/* Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab("invite")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center ${
              activeTab === "invite"
                ? "border-brand-500 text-brand-600 dark:text-brand-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <Users size={16} className="mr-2" />
            Invite People
          </button>
          <button
            onClick={() => setActiveTab("link")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center ${
              activeTab === "link"
                ? "border-brand-500 text-brand-600 dark:text-brand-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <Globe size={16} className="mr-2" />
            Public Link
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-visible">
          {showSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 animate-in fade-in slide-in-from-bottom-2">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-3">
                <Check size={24} />
              </div>
              <p className="text-slate-800 dark:text-white font-medium">
                Invites Sent!
              </p>
            </div>
          ) : activeTab === "invite" ? (
            <form onSubmit={handleSendInvite}>
              <div className="relative">
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                  Add People
                </label>

                {/* Autocomplete Input Container */}
                <div
                  className="min-h-[50px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-colors"
                  onClick={() =>
                    document.getElementById("people-input")?.focus()
                  }
                >
                  {/* Selected Chips */}
                  {selectedPeople.map((person) => (
                    <div
                      key={person.email}
                      className="flex items-center bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 px-2 py-1 rounded-full text-xs font-medium border border-brand-100 dark:border-brand-800/50"
                    >
                      {person.avatar && (
                        <img
                          src={person.avatar}
                          alt=""
                          className="w-4 h-4 rounded-full mr-1.5"
                        />
                      )}
                      <span>{person.name || person.email}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemovePerson(person.email);
                        }}
                        className="ml-1.5 p-0.5 hover:bg-brand-200 dark:hover:bg-brand-800 rounded-full text-brand-600 dark:text-brand-400 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  {/* Input Field */}
                  <input
                    id="people-input"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      selectedPeople.length === 0
                        ? "Enter name or email..."
                        : ""
                    }
                    className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder-slate-400"
                    autoComplete="off"
                  />
                </div>

                {/* Dropdown Suggestions */}
                {showSuggestions && query && suggestions.length > 0 && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-50 left-0 right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                  >
                    {suggestions.map((contact) => (
                      <div
                        key={contact.email}
                        onClick={() => handleAddPerson(contact)}
                        className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex items-center transition-colors"
                      >
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="w-8 h-8 rounded-full mr-3 border border-slate-100 dark:border-slate-700"
                        />
                        <div className="overflow-hidden">
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                            {contact.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {contact.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* "Invite this email" option if no suggestions match */}
                {showSuggestions &&
                  query &&
                  suggestions.length === 0 &&
                  query.includes("@") &&
                  !isSearching && (
                    <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-2">
                      <div
                        onClick={() =>
                          handleAddPerson({ email: query, name: query })
                        }
                        className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex items-center rounded transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full mr-3 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                          <Mail size={16} />
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          Invite <span className="font-semibold">{query}</span>
                        </p>
                      </div>
                    </div>
                  )}

                {/* "No user found" message */}
                {showSuggestions &&
                  query &&
                  suggestions.length === 0 &&
                  !query.includes("@") &&
                  !isSearching && (
                    <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-4 text-center">
                      <SearchX
                        size={20}
                        className="mx-auto text-slate-400 mb-2"
                      />
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        No user found
                      </p>
                    </div>
                  )}

                {/* Loading State for Search */}
                {isSearching && query && (
                  <div className="absolute right-3 top-[34px] pointer-events-none">
                    <Loader2
                      size={16}
                      className="animate-spin text-slate-400"
                    />
                  </div>
                )}
              </div>

              <ExpirationSelect />

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={
                    (selectedPeople.length === 0 && !query) || isSending
                  }
                  className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSending ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    "Send Invite"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${isPublicLinkEnabled ? "bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400" : "bg-slate-200 text-slate-500 dark:bg-slate-700"}`}
                  >
                    <Link size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Public Link Access
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isPublicLinkEnabled
                        ? "Anyone with the link can view"
                        : "Link sharing is disabled"}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isPublicLinkEnabled}
                    onChange={() =>
                      setIsPublicLinkEnabled(!isPublicLinkEnabled)
                    }
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                </label>
              </div>

              {isPublicLinkEnabled && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <ExpirationSelect />

                  <div className="mt-4">
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1.5">
                      Link URL
                    </label>
                    <div className="flex shadow-sm rounded-lg">
                      <input
                        type="text"
                        readOnly
                        value={`https://cloudzoon.com/s/${file.id}/a8s9d`}
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
