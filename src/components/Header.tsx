import React from "react";
import { Search, Bell, Upload, Filter, Menu } from "lucide-react";

interface HeaderProps {
  onUploadClick: () => void;
  onMenuClick: () => void;
  showUploadAction?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onUploadClick,
  onMenuClick,
  showUploadAction = true,
}) => {
  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10 transition-colors">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 mr-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
      >
        <Menu size={20} />
      </button>

      {/* Search Bar */}
      <div className="flex-1 max-w-2xl mr-2 lg:mr-0">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search
              size={18}
              className="text-slate-400 group-focus-within:text-brand-500 transition-colors"
            />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full pl-10 pr-12 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <button
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 transition-colors"
              title="Filter search"
            >
              <Filter size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-2 lg:space-x-4 ml-2 lg:ml-6">
        <button className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
        </button>

        {showUploadAction && (
          <button
            onClick={onUploadClick}
            className="flex items-center bg-brand-600 hover:bg-brand-700 text-white px-3 lg:px-5 py-2.5 rounded-xl text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all active:translate-y-0 duration-200"
          >
            <Upload size={18} className="sm:mr-2" />
            <span className="hidden sm:inline">Upload New</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
