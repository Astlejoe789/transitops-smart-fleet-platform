import { ChevronDown } from 'lucide-react';

export function TripsOverviewCard() {
  const breakdown = [
    { label: 'Completed', count: 96, pct: '75%', color: 'bg-emerald-400', textColor: 'text-emerald-400' },
    { label: 'In Progress', count: 24, pct: '19%', color: 'bg-sky-400', textColor: 'text-sky-400' },
    { label: 'Scheduled', count: 6, pct: '5%', color: 'bg-purple-400', textColor: 'text-purple-400' },
    { label: 'Cancelled', count: 2, pct: '1%', color: 'bg-rose-400', textColor: 'text-rose-400' },
  ];

  return (
    <div className="flex flex-col justify-between rounded-[20px] bg-[#0B1426]/80 border border-surface-800/40 p-5 min-h-[220px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[15px] font-bold text-white" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
          Trips Overview
        </h3>
        <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-800/40 border border-surface-700/40 text-[11px] font-medium text-surface-300 hover:text-white transition-colors">
          <span>This Month</span>
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      <div className="flex items-center gap-6 my-2">
        {/* SVG Donut Chart */}
        <div className="relative h-[110px] w-[110px] shrink-0">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
            {/* Circle 1 - Completed 75% */}
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="#34D399"
              strokeWidth="4"
              strokeDasharray="66 100"
              strokeDashoffset="0"
            />
            {/* Circle 2 - In Progress 19% */}
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="4"
              strokeDasharray="17 100"
              strokeDashoffset="-67"
            />
            {/* Circle 3 - Scheduled 5% */}
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="#C084FC"
              strokeWidth="4"
              strokeDasharray="4 100"
              strokeDashoffset="-85"
            />
            {/* Circle 4 - Cancelled 1% */}
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="#FB7185"
              strokeWidth="4"
              strokeDasharray="2 100"
              strokeDashoffset="-90"
            />
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 flex-1">
          {breakdown.map((item) => (
            <div key={item.label} className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${item.color}`} />
                <span className="font-medium text-surface-300">{item.label}</span>
              </div>
              <span className="font-bold text-white">
                {item.count} <span className="text-surface-400 font-normal">({item.pct})</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
