import React from "react";

function UpgradeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-linear-to-br from-blue-500 to-cyan-400 p-8 text-center text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-white/80"
          >
            ✕
          </button>
          <div className="text-4xl mb-4">🚀</div>
          <h2 className="text-2xl font-bold mb-2">Upgrade your storage</h2>
          <p>Remove limits and get more space for your projects.</p>
        </div>
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-2 border-blue-500 rounded-xl p-6 bg-blue-50/30 relative">
              <div className="absolute -top-3 left-4 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                RECOMMENDED
              </div>
              <h3 className="font-bold text-lg">Pro Plan</h3>
              <div className="text-3xl font-bold my-2">
                $9<span className="text-sm font-normal">/mo</span>
              </div>
              <ul className="space-y-2 mb-4">
                <li className="text-sm">✓ 100 GB Storage</li>
                <li className="text-sm">✓ 1 GB File Size</li>
                <li className="text-sm">✓ Priority Support</li>
              </ul>
              <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold mt-4 hover:bg-blue-700">
                Choose Pro
              </button>
            </div>
            <div className="border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg">Team Plan</h3>
              <div className="text-3xl font-bold my-2">
                $29<span className="text-sm font-normal">/mo</span>
              </div>
              <ul className="space-y-2 mb-4">
                <li className="text-sm">✓ 1 TB Storage</li>
                <li className="text-sm">✓ 5 GB File Size</li>
                <li className="text-sm">✓ Team Features</li>
              </ul>
              <button className="w-full py-2 border border-slate-200 rounded-lg font-semibold mt-4 hover:bg-slate-50">
                Choose Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpgradeModal;
