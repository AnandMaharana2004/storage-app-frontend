import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-6 border border-blue-100">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
        New: Team folders are now available
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6">
        Simple cloud storage for <br />
        <span className="bg-linear-to-br from-blue-500 to-cyan-400 bg-clip-text text-transparent">
          devs & creators
        </span>
      </h1>
      <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10">
        Secure, fast, and built for your workflow. Get 1 GB free forever. No
        credit card required.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
        <button
          onClick={() => navigate("/register")}
          className="w-full sm:w-auto bg-linear-to-br from-blue-500 to-cyan-400 text-white px-8 py-3.5 rounded-lg text-base font-semibold hover:opacity-90 transition-all shadow-xl shadow-blue-500/30 transform hover:-translate-y-1"
        >
          Start for Free
        </button>
        <button
          onClick={() =>
            document
              .getElementById("pricing")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="w-full sm:w-auto bg-white text-slate-700 border border-slate-200 px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-slate-50 transition-all"
        >
          View Plans
        </button>
      </div>
      <div className="relative max-w-5xl mx-auto rounded-2xl shadow-2xl border border-slate-200 overflow-hidden bg-white">
        <div className="absolute top-0 left-0 right-0 h-8 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1481487484168-9b995ecc1660?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80"
          alt="Dashboard Preview"
          className="w-full h-auto opacity-90 mt-8"
        />
        <div className="absolute inset-0 bg-linear-to-br from-white/50 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
}

export default HeroSection;
