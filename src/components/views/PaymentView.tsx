import React, { useState } from "react";

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handlePlanSelect = (planName) => {
    setSelectedPlan(planName);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
      {/* Top Banner - Payment Under Development */}
      <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 dark:from-yellow-600 dark:via-yellow-700 dark:to-yellow-800 text-white py-3 px-4 shadow-md border-b border-yellow-600 dark:border-yellow-900">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm sm:text-base">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <p className="font-medium text-center">
            <span className="font-bold">
              Payment Integration Under Development
            </span>{" "}
            - Our secure payment system is coming soon. Stay tuned for updates!
          </p>
        </div>
      </div>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Simple &{" "}
              <span className="text-blue-600 dark:text-blue-400">
                Transparent Pricing
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-500 transition">
              <div className="text-4xl mb-4">🆓</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Free Plan
              </h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                ₹0
                <span className="text-lg text-gray-600 dark:text-slate-400 font-normal">
                  /month
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700 dark:text-slate-300">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">
                    ✓
                  </span>{" "}
                  1 GB Storage
                </li>
                <li className="flex items-center text-gray-700 dark:text-slate-300">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">
                    ✓
                  </span>{" "}
                  2 Device Access
                </li>
                <li className="flex items-center text-gray-700 dark:text-slate-300">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">
                    ✓
                  </span>{" "}
                  Trash clears in 1 day
                </li>
              </ul>
              <button
                onClick={() => handlePlanSelect("Free Plan")}
                className="block w-full py-3 bg-blue-600 text-white text-center font-semibold rounded-xl hover:bg-blue-700 transition shadow-md"
              >
                Get 1GB Free Storage
              </button>
            </div>

            {/* Standard Plan */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border-2 border-blue-600 dark:border-blue-500 relative transform md:scale-105">
              <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-xl rounded-tr-xl text-sm font-semibold">
                Popular
              </div>
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Standard Plan
              </h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                ₹149
                <span className="text-lg text-gray-600 dark:text-slate-400 font-normal">
                  /month
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700 dark:text-slate-300">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">
                    ✓
                  </span>{" "}
                  50 GB Storage
                </li>
                <li className="flex items-center text-gray-700 dark:text-slate-300">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">
                    ✓
                  </span>{" "}
                  Up to 5 Devices
                </li>
                <li className="flex items-center text-gray-700 dark:text-slate-300">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">
                    ✓
                  </span>{" "}
                  Trash retention: 30 days
                </li>
              </ul>
              <button
                onClick={() => handlePlanSelect("Standard Plan")}
                className="block w-full py-3 bg-blue-600 text-white text-center font-semibold rounded-xl hover:bg-blue-700 transition shadow-md"
              >
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-500 transition">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Pro Plan
              </h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                ₹199
                <span className="text-lg text-gray-600 dark:text-slate-400 font-normal">
                  /month
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700 dark:text-slate-300">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">
                    ✓
                  </span>{" "}
                  100 GB Storage
                </li>
                <li className="flex items-center text-gray-700 dark:text-slate-300">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">
                    ✓
                  </span>{" "}
                  Up to 5 Devices
                </li>
                <li className="flex items-center text-gray-700 dark:text-slate-300">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">
                    ✓
                  </span>{" "}
                  Trash retention: 30 days
                </li>
              </ul>
              <button
                onClick={() => handlePlanSelect("Pro Plan")}
                className="block w-full py-3 bg-blue-600 text-white text-center font-semibold rounded-xl hover:bg-blue-700 transition shadow-md"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal - Payment Under Development */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-center">
              {/* Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-4">
                <svg
                  className="h-8 w-8 text-yellow-600 dark:text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Payment Processing Coming Soon
              </h3>

              {/* Message */}
              <p className="text-gray-600 dark:text-slate-300 mb-6">
                You've selected the{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {selectedPlan}
                </span>
                . Our payment integration is currently under development and
                will be available soon.
              </p>

              {/* Features being worked on */}
              <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 mb-6 text-left">
                <p className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">
                  We're working on:
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-300">
                  <li className="flex items-center">
                    <span className="text-blue-600 dark:text-blue-400 mr-2">
                      ⚙️
                    </span>{" "}
                    Secure payment gateway integration
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-600 dark:text-blue-400 mr-2">
                      ⚙️
                    </span>{" "}
                    Multiple payment options
                  </li>
                  <li className="flex items-center">
                    <span className="text-blue-600 dark:text-blue-400 mr-2">
                      ⚙️
                    </span>{" "}
                    Automated subscription management
                  </li>
                </ul>
              </div>

              {/* CTA */}
              <div className="space-y-3">
                <button
                  onClick={closeModal}
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-md"
                >
                  Got it, thanks!
                </button>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  We'll notify you when payment processing is available
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
