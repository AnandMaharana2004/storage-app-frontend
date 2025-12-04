import React from "react";

function UploadModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Upload Files</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>
        <div className="p-6">
          <div className="border-2 border-dashed border-blue-200 bg-blue-50 rounded-xl h-32 flex flex-col items-center justify-center mb-6">
            <p className="text-blue-400 text-2xl mb-2">☁️</p>
            <p className="text-sm text-slate-600 font-medium">
              Drop files here or click to browse
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-red-500 shadow-sm">
                📄
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">
                    presentation_final.pdf
                  </span>
                  <span className="text-blue-600">45%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full"
                    style={{ width: "45%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-slate-50 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 font-medium hover:bg-white rounded-lg"
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
            Upload Files
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadModal;
