import { Route, Wrench, Fuel, Truck, ArrowRight } from 'lucide-react';

const SAMPLE_ACTIVITIES = [
  { 
    id: '1', 
    type: 'TRIP', 
    title: 'Trip #TR-2048 dispatched to Route 9', 
    subtitle: 'checklist passed', 
    time: '8m ago',
    icon: Route,
    iconColor: 'text-[#10B981] bg-[#10241A] border-[#10B981]/20'
  },
  { 
    id: '2', 
    type: 'MAINTENANCE', 
    title: 'Vehicle VH-112 flagged for scheduled service', 
    subtitle: '', 
    time: '34m ago',
    icon: Wrench,
    iconColor: 'text-[#F59E0B] bg-[#292011] border-[#F59E0B]/20'
  },
  { 
    id: '3', 
    type: 'FUEL', 
    title: 'Fuel log added for VH-104', 
    subtitle: '68 L', 
    time: '1h ago',
    icon: Fuel,
    iconColor: 'text-[#0EA5E9] bg-[#12222E] border-[#0EA5E9]/20'
  },
  { 
    id: '4', 
    type: 'VEHICLE', 
    title: 'Vehicle VH-131 marked available after maintenance', 
    subtitle: '', 
    time: '2h ago',
    icon: Truck,
    iconColor: 'text-[#FF8A3D] bg-[#2A1E16] border-[#FF8A3D]/20'
  },
];

export function RecentActivityFeed() {
  return (
    <div className="flex flex-col justify-between rounded-[20px] bg-[#0B1426]/80 border border-surface-800/40 p-5 min-h-[170px]">
      <div>
        <h3 className="text-[15px] font-bold text-white mb-4" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
          Recent Activity
        </h3>

        <div className="space-y-3 mb-4">
          {SAMPLE_ACTIVITIES.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-center justify-between gap-3 text-[12px]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${activity.iconColor}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="truncate font-medium text-surface-200">
                    <span>{activity.title}</span>
                    {activity.subtitle && (
                      <span className="text-surface-400 font-normal"> — {activity.subtitle}</span>
                    )}
                  </div>
                </div>
                <span className="text-[11px] font-medium text-surface-500 shrink-0">{activity.time}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-2">
        <button className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary-400 hover:text-primary-300 transition-colors">
          <span>View all activity</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
