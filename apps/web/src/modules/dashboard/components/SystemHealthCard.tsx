import { CheckCircle2 } from 'lucide-react';

export function SystemHealthCard() {
  const services = [
    { name: 'API Services', status: 'Operational' },
    { name: 'Database', status: 'Operational' },
    { name: 'Integrations', status: 'Operational' },
  ];

  return (
    <div className="flex flex-col justify-between rounded-[20px] bg-[#0B1426]/80 border border-surface-800/40 p-5 min-h-[150px]">
      <div>
        <h3 className="text-[15px] font-bold text-white mb-4" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
          System Health
        </h3>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {services.map((item) => (
            <div key={item.name} className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-1.5 text-success">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span className="text-[11px] font-semibold text-white leading-tight">{item.name}</span>
              </div>
              <span className="text-[10px] text-surface-400 pl-5">{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-surface-800/40 text-[11px] font-medium text-success">
        <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
        <span>All systems operational</span>
      </div>
    </div>
  );
}
