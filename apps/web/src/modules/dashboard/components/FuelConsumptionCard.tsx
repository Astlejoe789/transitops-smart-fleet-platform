import { ChevronDown } from 'lucide-react';

export function FuelConsumptionCard() {
  return (
    <div className="flex flex-col justify-between rounded-[20px] bg-[#0B1426]/80 border border-surface-800/40 p-5 min-h-[195px]">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="text-[15px] font-bold text-white" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
            Fuel Consumption
          </h3>
          <p className="text-[11px] text-surface-400">Fuel usage (liters)</p>
        </div>
        <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-800/40 border border-surface-700/40 text-[11px] font-medium text-surface-300 hover:text-white transition-colors">
          <span>Last 6 months</span>
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      <div className="text-[22px] font-bold text-white mb-2" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
        110k L
      </div>

      {/* SVG Bar Chart */}
      <div className="relative h-[85px] w-full">
        {/* Background Y-axis */}
        <div className="absolute inset-0 flex flex-col justify-between text-[9px] text-surface-500 pointer-events-none">
          <div className="border-b border-surface-800/20 pb-0.5"><span>160k</span></div>
          <div className="border-b border-surface-800/20 pb-0.5"><span>80k</span></div>
          <div className="pb-0.5"><span>0</span></div>
        </div>

        {/* Bars Container */}
        <div className="absolute inset-0 flex items-end justify-between px-6 pt-2">
          {/* Jan */}
          <div className="w-6 bg-gradient-to-t from-primary-950 to-primary-700/80 rounded-t-md h-[45%]" />
          {/* Feb */}
          <div className="w-6 bg-gradient-to-t from-primary-950 to-primary-600/80 rounded-t-md h-[60%]" />
          {/* Mar */}
          <div className="w-6 bg-gradient-to-t from-primary-950 to-primary-700/80 rounded-t-md h-[50%]" />
          {/* Apr */}
          <div className="w-6 bg-gradient-to-t from-primary-950 to-primary-800/80 rounded-t-md h-[40%]" />
          {/* May */}
          <div className="w-6 bg-gradient-to-t from-primary-950 to-primary-500 rounded-t-md h-[80%] shadow-lg shadow-primary-500/20" />
          {/* Jun */}
          <div className="w-6 bg-gradient-to-t from-primary-950 to-primary-600/80 rounded-t-md h-[65%]" />
        </div>
      </div>

      {/* X-axis Months */}
      <div className="flex justify-between text-[10px] font-medium text-surface-400 mt-1 px-6">
        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
      </div>
    </div>
  );
}
