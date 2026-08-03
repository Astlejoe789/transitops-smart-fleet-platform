import { Truck, ArrowRight } from 'lucide-react';

export function AutomateDispatchCard() {
  return (
    <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#0B1426] via-[#0B1426]/90 to-[#0A2628]/60 border border-surface-800/40 p-5 flex flex-col items-center justify-center text-center min-h-[160px]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-primary-950/60 border border-primary-800/30 text-primary-400 mb-3">
        <Truck className="h-5 w-5" />
      </div>
      <h3 className="text-[15px] font-bold text-white leading-tight mb-1" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
        Automate Dispatch
      </h3>
      <p className="text-[11px] text-surface-400 mb-3">
        Save time and reduce manual work with smart trip assignments.
      </p>

      <div>
        <button className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary-400 hover:text-primary-300 transition-colors">
          <span>Learn More</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
