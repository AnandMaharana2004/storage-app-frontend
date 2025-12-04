import React from "react";

function Logo({ showWithName = true, size = "md", className = "" }) {
  // Size configurations
  const sizes = {
    sm: {
      logo: "w-6 h-6 text-sm",
      text: "text-base",
    },
    md: {
      logo: "w-8 h-8 text-lg",
      text: "text-xl",
    },
    lg: {
      logo: "w-12 h-12 text-2xl",
      text: "text-2xl",
    },
  };

  const currentSize = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`${currentSize.logo} rounded-lg bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30`}
      >
        Z
      </div>
      {showWithName && (
        <span className={`font-bold ${currentSize.text} text-slate-800`}>
          CloudZoon
        </span>
      )}
    </div>
  );
}

export default Logo;
