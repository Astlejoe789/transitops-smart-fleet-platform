import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AIFleetCard() {
  return (
    <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#0B1426]/90 via-[#0B1426]/80 to-[#0A2628]/60 border border-surface-800/50 p-6 flex flex-col justify-between min-h-[145px]">
      {/* Background illustration / glow effect */}
      <div className="absolute top-0 right-0 w-[220px] h-[100%] pointer-events-none opacity-40">
        <svg className="w-full h-full" viewBox="0 0 200 120" fill="none">
          <path d="M0 60 Q 50 20, 100 60 T 200 40" stroke="#0D9488" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
          <path d="M20 90 Q 80 40, 140 80 T 200 60" stroke="#14B8A6" strokeWidth="3" opacity="0.8" />
          <circle cx="100" cy="60" r="5" fill="#14B8A6" />
          <circle cx="140" cy="80" r="4" fill="#0D9488" />
          <circle cx="160" cy="45" r="6" fill="#2DD4BF" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[260px]">
        <div className="text-[13px] font-semibold text-primary-400 mb-0.5">AI-Powered</div>
        <h3 className="text-[18px] font-bold text-white leading-snug mb-2" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
          Fleet Intelligence
        </h3>
        <p className="text-[12px] text-surface-400 leading-relaxed mb-4">
          Predict issues, optimize routes, and reduce costs with AI.
        </p>
      </div>

      <div className="relative z-10">
        <Link to="/ai">
          <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white text-[12px] font-semibold transition-all shadow-md shadow-primary-600/20">
            <span>Explore AI Copilot</span>
            <Sparkles className="h-3.5 w-3.5" />
          </button>
        </Link>
      </div>
    </div>
  );
}
