// import React, { useState, useEffect } from 'react';
// import {
//   Users, FileText, HardDrive, ShieldAlert, Search,
//   MoreHorizontal, ShieldCheck, Loader2, UserX, UserCheck, RefreshCw
// } from 'lucide-react';
// import { useAdmin } from '../../context/AdminContext';

// const AdminView: React.FC = () => {
//   const { stats, users, isLoading, error, searchUsers, toggleUserStatus, refreshAdminData } = useAdmin();
//   const [query, setQuery] = useState('');
//   const [debouncedQuery, setDebouncedQuery] = useState('');

//   // Search Debounce logic
//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedQuery(query), 300);
//     return () => clearTimeout(timer);
//   }, [query]);

//   useEffect(() => {
//     searchUsers(debouncedQuery);
//   }, [debouncedQuery]);

//   const statCards = [
//     { label: 'Total Users', value: stats?.totalUsers || '...', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
//     { label: 'Total Files', value: stats?.totalFiles || '...', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
//     { label: 'Storage Used', value: stats?.storageUsed || '...', icon: HardDrive, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
//     { label: 'Security Alerts', value: stats?.securityAlerts ?? '...', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
//   ];

//   if (isLoading && !stats) {
//     return (
//       <div className="h-96 flex flex-col items-center justify-center text-slate-500 space-y-4">
//         <Loader2 className="animate-spin text-brand-500" size={32} />
//         <p className="font-medium animate-pulse">Loading administrative data...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="animate-in fade-in duration-500 space-y-8 pb-10">
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center tracking-tight">
//               <ShieldCheck className="mr-3 text-brand-600" size={28} />
//               Admin Dashboard
//           </h2>
//           <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time system health and user directory management.</p>
//         </div>
//         <button
//           onClick={refreshAdminData}
//           className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
//         >
//           <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
//           Refresh Data
//         </button>
//       </div>

//       {error && (
//         <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm flex items-center">
//           <ShieldAlert className="mr-3 shrink-0" size={18} />
//           {error}
//         </div>
//       )}

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {statCards.map((stat, idx) => {
//           const Icon = stat.icon;
//           return (
//             <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
//               <div className="flex items-center justify-between mb-4">
//                 <div className={`p-2 rounded-lg ${stat.bg}`}>
//                   <Icon className={stat.color} size={20} />
//                 </div>
//               </div>
//               <div>
//                 <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
//                 <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{stat.value}</p>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* User Management Section */}
//       <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
//         <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <h3 className="font-bold text-slate-800 dark:text-white">User Directory</h3>
//             <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//                 <input
//                     type="text"
//                     placeholder="Search name or email..."
//                     value={query}
//                     onChange={(e) => setQuery(e.target.value)}
//                     className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 w-full sm:w-64 transition-all"
//                 />
//             </div>
//         </div>

//         <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//                 <thead>
//                     <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
//                         <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Name & Email</th>
//                         <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Role</th>
//                         <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Status</th>
//                         <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Usage</th>
//                         <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
//                     {users.length > 0 ? users.map((user) => (
//                         <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
//                             <td className="px-6 py-4">
//                                 <div className="flex items-center">
//                                     <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-3 text-slate-500 font-bold text-xs shrink-0">
//                                       {user.name.charAt(0)}
//                                     </div>
//                                     <div className="min-w-0">
//                                         <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
//                                         <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
//                                     </div>
//                                 </div>
//                             </td>
//                             <td className="px-6 py-4">
//                                 <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
//                                     user.role === 'Admin' ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
//                                 }`}>
//                                     {user.role}
//                                 </span>
//                             </td>
//                             <td className="px-6 py-4">
//                                 <div className="flex items-center">
//                                     <div className={`w-2 h-2 rounded-full mr-2 ${user.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
//                                     <span className="text-sm text-slate-600 dark:text-slate-400">{user.status}</span>
//                                 </div>
//                             </td>
//                             <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
//                                 {user.usage}
//                             </td>
//                             <td className="px-6 py-4 text-right">
//                                 <div className="flex items-center justify-end gap-2">
//                                   <button
//                                     onClick={() => toggleUserStatus(user.id)}
//                                     className={`p-2 rounded-lg transition-colors ${
//                                       user.status === 'Active'
//                                       ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
//                                       : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
//                                     }`}
//                                     title={user.status === 'Active' ? 'Suspend User' : 'Activate User'}
//                                   >
//                                     {user.status === 'Active' ? <UserX size={18} /> : <UserCheck size={18} />}
//                                   </button>
//                                   <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
//                                       <MoreHorizontal size={18} />
//                                   </button>
//                                 </div>
//                             </td>
//                         </tr>
//                     )) : (
//                       <tr>
//                         <td colSpan={5} className="px-6 py-10 text-center text-slate-500 italic">
//                           No users found matching your search.
//                         </td>
//                       </tr>
//                     )}
//                 </tbody>
//             </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminView;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  FileText,
  HardDrive,
  ShieldAlert,
  Search,
  MoreHorizontal,
  ShieldCheck,
  Loader2,
  UserX,
  UserCheck,
  RefreshCw,
  Eye,
} from "lucide-react";
import { useAdmin } from "../../context/AdminContext";

const AdminView: React.FC = () => {
  const navigate = useNavigate();
  const {
    stats,
    users,
    isLoading,
    error,
    searchUsers,
    toggleUserStatus,
    refreshAdminData,
  } = useAdmin();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Search Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    searchUsers(debouncedQuery);
  }, [debouncedQuery]);

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers || "...",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Total Files",
      value: stats?.totalFiles || "...",
      icon: FileText,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      label: "Storage Used",
      value: stats?.storageUsed || "...",
      icon: HardDrive,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      label: "Security Alerts",
      value: stats?.securityAlerts ?? "...",
      icon: ShieldAlert,
      color: "text-red-500",
      bg: "bg-red-50 dark:bg-red-900/20",
    },
  ];

  if (isLoading && !stats) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-slate-500 space-y-4">
        <Loader2 className="animate-spin text-brand-500" size={32} />
        <p className="font-medium animate-pulse">
          Loading administrative data...
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center tracking-tight">
            <ShieldCheck className="mr-3 text-brand-600" size={28} />
            Admin Dashboard
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Real-time system health and user directory management.
          </p>
        </div>
        <button
          onClick={refreshAdminData}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm flex items-center">
          <ShieldAlert className="mr-3 shrink-0" size={18} />
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={stat.color} size={20} />
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* User Management Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-bold text-slate-800 dark:text-white">
            User Directory
          </h3>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search name or email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 w-full sm:w-64 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                  Name & Email
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-3 text-slate-500 font-bold text-xs shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          user.role === "Admin"
                            ? "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            user.status === "Active"
                              ? "bg-emerald-500 animate-pulse"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
                      {user.usage}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => navigate(`/admin/details/${user.id}`)}
                          className="p-2 text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                          title="View Profile Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.status === "Active"
                              ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                              : "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                          }`}
                          title={
                            user.status === "Active"
                              ? "Suspend User"
                              : "Activate User"
                          }
                        >
                          {user.status === "Active" ? (
                            <UserX size={18} />
                          ) : (
                            <UserCheck size={18} />
                          )}
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-slate-500 italic"
                  >
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
