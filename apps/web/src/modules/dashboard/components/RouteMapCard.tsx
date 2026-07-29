import { ChevronDown, MapPin } from 'lucide-react';

export function RouteMapCard() {
  return (
    <div className="relative flex flex-col justify-between rounded-[20px] bg-[#0B1426]/80 border border-surface-800/40 p-5 overflow-hidden min-h-[360px]">
      {/* Header */}
      <div className="flex items-center justify-between z-10 mb-3">
        <div>
          <h3 className="text-[16px] font-bold text-white" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
            Route Map
          </h3>
          <p className="text-[12px] text-surface-400">Live fleet distribution • Los Angeles Area</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-800/40 border border-surface-700/40 text-[12px] font-medium text-surface-300 hover:text-white transition-colors">
          <span>Current traffic</span>
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      {/* Map Graphics */}
      <div className="relative flex-1 rounded-xl bg-[#070F1E] border border-surface-800/50 overflow-hidden flex items-center justify-center min-h-[260px]">
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Map SVG Routes & Points */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 300" fill="none">
          {/* Main Highway Lines */}
          <path d="M 40 250 Q 150 180, 250 200 T 450 100" stroke="#0D9488" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
          <path d="M 40 250 Q 150 180, 250 200 T 450 100" stroke="#2DD4BF" strokeWidth="2" strokeLinecap="round" />
          
          <path d="M 120 40 Q 200 120, 250 200 T 380 280" stroke="#06B6D4" strokeWidth="3" opacity="0.7" />
          <path d="M 280 40 Q 250 150, 420 220" stroke="#10B981" strokeWidth="2" opacity="0.6" />

          {/* Secondary Connectors */}
          <path d="M 180 140 L 320 160" stroke="#0D9488" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
          <path d="M 250 200 L 220 270" stroke="#14B8A6" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />

          {/* Location Labels */}
          <text x="260" y="190" fill="#94A3B8" fontSize="11" fontWeight="bold">Los Angeles</text>
          <text x="180" y="270" fill="#64748B" fontSize="10">Culver City</text>
          <text x="320" y="270" fill="#64748B" fontSize="10">South Gate</text>
          <text x="210" y="110" fill="#64748B" fontSize="10">Glendale</text>

          {/* Vehicle Markers */}
          <g transform="translate(180, 190)">
            <circle cx="0" cy="0" r="10" fill="#0D9488" fillOpacity="0.3" />
            <circle cx="0" cy="0" r="4" fill="#2DD4BF" />
          </g>
          <g transform="translate(320, 160)">
            <circle cx="0" cy="0" r="8" fill="#10B981" fillOpacity="0.3" />
            <circle cx="0" cy="0" r="3.5" fill="#34D399" />
          </g>
          <g transform="translate(380, 125)">
            <circle cx="0" cy="0" r="8" fill="#06B6D4" fillOpacity="0.3" />
            <circle cx="0" cy="0" r="3.5" fill="#38BDF8" />
          </g>
          <g transform="translate(120, 200)">
            <circle cx="0" cy="0" r="8" fill="#F59E0B" fillOpacity="0.3" />
            <circle cx="0" cy="0" r="3.5" fill="#FBBF24" />
          </g>
        </svg>

        {/* Bottom Left Status Pill */}
        <div className="absolute bottom-4 left-4 z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B1426]/90 border border-surface-700/50 backdrop-blur-md text-[12px] font-medium text-surface-200 shadow-lg">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span>32 Vehicles on route</span>
        </div>
      </div>
    </div>
  );
}
