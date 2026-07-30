import { ChevronDown } from 'lucide-react';

export function FleetUtilizationCard() {
  return (
    <div className="flex flex-col justify-between rounded-[20px] bg-[#0B1426]/80 border border-surface-800/40 p-5 min-h-[195px]">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-[15px] font-bold text-white" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
            Fleet Utilization
          </h3>
          <p className="text-[11px] text-surface-400">Daily utilization, %</p>
        </div>
        <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-800/40 border border-surface-700/40 text-[11px] font-medium text-surface-300 hover:text-white transition-colors">
          <span>Last 30 days</span>
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      {/* SVG Line Chart */}
      <div className="relative h-[110px] w-full mt-2">
        {/* Background Grid Lines & Y-axis labels */}
        <div className="absolute inset-0 flex flex-col justify-between text-[9px] text-surface-500 pointer-events-none">
          <div className="flex justify-between border-b border-surface-800/30 pb-0.5"><span>100%</span></div>
          <div className="flex justify-between border-b border-surface-800/30 pb-0.5"><span>75%</span></div>
          <div className="flex justify-between border-b border-surface-800/30 pb-0.5"><span>50%</span></div>
          <div className="flex justify-between border-b border-surface-800/30 pb-0.5"><span>25%</span></div>
          <div className="flex justify-between"><span>0%</span></div>
        </div>

        {/* Smooth Glowing Curved Line */}
        <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 300 90" preserveAspectRatio="none">
          <defs>
            <linearGradient id="utilGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Area fill under curve */}
          <path d="M 0 70 C 40 75, 60 40, 100 50 C 140 60, 160 20, 200 15 C 240 10, 260 55, 300 45 L 300 90 L 0 90 Z" fill="url(#utilGradient)" />
          
          {/* Main glowing line */}
          <path d="M 0 70 C 40 75, 60 40, 100 50 C 140 60, 160 20, 200 15 C 240 10, 260 55, 300 45" fill="none" stroke="#2DD4BF" strokeWidth="2.5" />
          
          {/* Glowing Peak Badge Node at Fri peak (x:200, y:15) */}
          <circle cx="200" cy="15" r="4" fill="#030712" stroke="#2DD4BF" strokeWidth="2" />
        </svg>

        {/* 78% Peak Badge Popup */}
        <div className="absolute left-[62%] top-[-8px] -translate-x-1/2 px-2 py-0.5 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 text-white text-[10px] font-bold shadow-md shadow-primary-900/30 border border-primary-400/40">
          78%
        </div>
      </div>

      {/* X-axis Days */}
      <div className="flex justify-between text-[10px] font-medium text-surface-400 mt-2 px-1">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>
    </div>
  );
}
