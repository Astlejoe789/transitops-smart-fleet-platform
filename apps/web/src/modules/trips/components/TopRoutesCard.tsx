import { ChevronDown } from 'lucide-react';

export function TopRoutesCard() {
  const routes = [
    { route: 'Los Angeles → San Diego', count: 18, max: 20 },
    { route: 'Las Vegas → Phoenix', count: 14, max: 20 },
    { route: 'San Francisco → Sacramento', count: 12, max: 20 },
    { route: 'Dallas → Houston', count: 10, max: 20 },
    { route: 'Atlanta → Nashville', count: 8, max: 20 },
  ];

  return (
    <div className="flex flex-col justify-between rounded-[20px] bg-[#0B1426]/80 border border-surface-800/40 p-5 min-h-[220px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-bold text-white" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
          Top Routes
        </h3>
        <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-800/40 border border-surface-700/40 text-[11px] font-medium text-surface-300 hover:text-white transition-colors">
          <span>By Trips</span>
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      <div className="space-y-3">
        {routes.map((r) => (
          <div key={r.route} className="flex flex-col gap-1 text-[11px]">
            <div className="flex justify-between font-medium text-surface-200">
              <span>{r.route}</span>
              <span className="font-bold text-white">{r.count}</span>
            </div>
            <div className="h-1.5 w-full bg-surface-800/60 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full" 
                style={{ width: `${(r.count / r.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
