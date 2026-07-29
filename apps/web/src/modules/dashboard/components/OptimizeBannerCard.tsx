export function OptimizeBannerCard() {
  return (
    <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#0B1426] via-[#0B1426]/90 to-[#0C202E] border border-surface-800/40 p-6 flex flex-col justify-between min-h-[170px]">
      <div className="relative z-10 max-w-[340px]">
        <h3 className="text-[18px] font-bold text-white mb-1.5" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
          Ready to optimize your fleet?
        </h3>
        <p className="text-[12px] text-surface-400 leading-relaxed mb-4">
          Get deeper insights, automate workflows, and scale your operations with AI.
        </p>
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white text-[12px] font-semibold transition-all shadow-md shadow-primary-600/20">
          Book a Demo
        </button>
        <button className="px-4 py-2 rounded-lg bg-surface-800/40 hover:bg-surface-800/80 border border-surface-700/40 text-surface-300 hover:text-white text-[12px] font-semibold transition-colors">
          Talk to Sales
        </button>
      </div>

      {/* Decorative dashboard graphics snippet in bottom right */}
      <div className="absolute right-[-10px] bottom-[-20px] w-[140px] opacity-25 pointer-events-none">
        <svg viewBox="0 0 100 80" fill="none">
          <rect x="10" y="10" width="80" height="60" rx="6" fill="#0D9488" stroke="#14B8A6" strokeWidth="1" />
          <path d="M 20 50 C 40 30, 60 60, 80 20" stroke="#2DD4BF" strokeWidth="3" />
        </svg>
      </div>
    </div>
  );
}
