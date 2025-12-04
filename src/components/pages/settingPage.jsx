import React from "react";
import { useNavigate } from "react-router-dom";

function SettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-full bg-white border flex items-center justify-center hover:bg-slate-50"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold text-slate-900">
            Account Settings
          </h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 bg-white border border-slate-200 rounded-lg font-medium text-blue-600 shadow-sm">
              Profile
            </button>
            <button className="w-full text-left px-4 py-2 text-slate-600 hover:bg-white hover:shadow-sm rounded-lg font-medium">
              Billing & Plans
            </button>
            <button className="w-full text-left px-4 py-2 text-slate-600 hover:bg-white hover:shadow-sm rounded-lg font-medium">
              Security
            </button>
            <button className="w-full text-left px-4 py-2 text-slate-600 hover:bg-white hover:shadow-sm rounded-lg font-medium">
              Notifications
            </button>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">
                Personal Information
              </h2>
              <div className="flex items-center gap-4 mb-6">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  className="w-20 h-20 rounded-full border-2 border-slate-100"
                  alt="Profile"
                />
                <div>
                  <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                    Change Avatar
                  </button>
                  <p className="text-xs text-slate-400 mt-2">
                    JPG, GIF or PNG. Max 1MB.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Alex Developer"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="alex@devzoon.xyz"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Current Plan
                  </h2>
                  <p className="text-sm text-slate-500">
                    You are on the{" "}
                    <span className="font-semibold text-slate-900">
                      Free Plan
                    </span>
                  </p>
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                  FREE
                </span>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-slate-700">
                    Storage Usage
                  </span>
                  <span className="text-slate-500">920 MB of 1 GB</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div
                    className="bg-red-500 h-2.5 rounded-full"
                    style={{ width: "92%" }}
                  ></div>
                </div>
                <p className="text-xs text-red-500 mt-2">
                  ⚠️ You are nearing your storage limit.
                </p>
              </div>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full py-3 border-2 border-blue-500 text-blue-600 rounded-lg font-semibold hover:bg-blue-50"
              >
                Upgrade to Pro (100 GB)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
