function Features() {
  const features = [
    {
      icon: "🛡️",
      title: "Secure Storage",
      desc: "End-to-end encryption for all your files. Your data is yours alone.",
    },
    {
      icon: "⚡",
      title: "Fast Sync",
      desc: "Lightning fast uploads and downloads with our global CDN network.",
    },
    {
      icon: "🔗",
      title: "Easy Sharing",
      desc: "Share files or folders with a single link. Control access with passwords.",
    },
  ];

  return (
    <div id="features" className="bg-white py-24 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-6">{f.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {f.title}
              </h3>
              <p className="text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Features;
