import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./logo";

function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Logo className="cursor-pointer" onClick={() => navigate("/")} />
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 hover:text-blue-500 transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-slate-600 hover:text-blue-500 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#"
              className="text-sm font-medium text-slate-600 hover:text-blue-500 transition-colors"
            >
              Docs
            </a>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-medium text-slate-600 hover:text-blue-500"
            >
              Log in
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-linear-to-br from-blue-500 to-cyan-400 text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/30"
            >
              Get 1 GB Free
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
