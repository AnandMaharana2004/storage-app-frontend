import React from "react";
import { useNavigate } from "react-router-dom";

function Pricing() {
  const navigate = useNavigate();
  const plans = [
    {
      name: "Free",
      price: 0,
      storage: "1 GB",
      fileSize: "10 MB",
      support: "Basic",
      popular: false,
    },
    {
      name: "Pro",
      price: 9,
      storage: "100 GB",
      fileSize: "1 GB",
      support: "Priority",
      popular: true,
    },
    {
      name: "Team",
      price: 29,
      storage: "1 TB",
      fileSize: "5 GB",
      support: "Team Folders & Roles",
      popular: false,
    },
  ];

  return (
    <div id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Simple, transparent pricing
        </h2>
        <p className="text-slate-500">
          Start for free, upgrade when you need more.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all relative ${plan.popular ? "border-2 border-blue-500 transform md:-translate-y-4" : "border border-slate-200"}`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-linear-to-br from-blue-500 to-cyan-400 text-white px-4 py-1 rounded-full text-xs font-bold uppercase">
                Most Popular
              </div>
            )}
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {plan.name}
            </h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-slate-900">
                ${plan.price}
              </span>
              <span className="text-slate-500">/mo</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-slate-600">
                ✓ {plan.storage} Storage
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600">
                ✓ {plan.fileSize} max file size
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600">
                ✓ {plan.support}
              </li>
            </ul>
            <button
              onClick={() => navigate("/register")}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${plan.popular ? "bg-linear-to-br from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/30" : "border-2 border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600"}`}
            >
              {plan.name === "Free" ? "Get Started" : `Upgrade to ${plan.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pricing;
