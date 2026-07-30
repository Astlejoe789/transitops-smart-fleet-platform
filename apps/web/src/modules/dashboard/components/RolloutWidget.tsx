const ROLLOUT_MODULES = [
  { id: 1, name: 'Foundation & Auth', status: 'Live' },
  { id: 2, name: 'Fleet Management', status: 'Live' },
  { id: 3, name: 'Trips & Dispatch', status: 'Live' },
  { id: 4, name: 'Maintenance', status: 'Live' },
  { id: 5, name: 'Fuel & Expenses', status: 'Live' },
  { id: 6, name: 'Reports & Analytics', status: 'Live' },
  { id: 7, name: 'AI Fleet Copilot', status: 'Live' },
  { id: 8, name: 'Driver Portal', status: 'Live' },
  { id: 9, name: 'Audit & Compliance', status: 'Live' },
  { id: 10, name: 'Production Polish', status: 'Live' },
];

export function RolloutWidget() {
  return (
    <div className="flex flex-col justify-between rounded-[20px] bg-[#0B1426]/80 border border-surface-800/40 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-bold text-white" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
          System Rollout
        </h3>
        <button className="text-[12px] font-semibold text-primary-400 hover:text-primary-300 transition-colors">
          View all
        </button>
      </div>
      
      <div className="space-y-2.5">
        {ROLLOUT_MODULES.map((module) => (
          <div key={module.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-400">
                {module.id}
              </div>
              <span className="text-[12px] font-medium text-surface-200">{module.name}</span>
            </div>
            <span className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              {module.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
