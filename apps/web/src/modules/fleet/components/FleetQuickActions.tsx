import { Link } from 'react-router-dom';
import { Truck, Upload, Bell, BarChart3, ArrowRight } from 'lucide-react';

interface QuickActionProps {
  icon: any;
  title: string;
  description: string;
  linkLabel: string;
  linkTo?: string;
  onClick?: () => void;
}

function QuickAction({ icon: Icon, title, description, linkLabel, linkTo, onClick }: QuickActionProps) {
  const linkContent = (
    <>
      <span>{linkLabel}</span>
      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
    </>
  );

  return (
    <div className="flex flex-col gap-3 rounded-[16px] bg-[#0B1426]/70 border border-surface-800/40 p-5 transition-all hover:border-surface-700/60 hover:bg-[#0B1426]/90">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-950/60 border border-primary-800/30 text-primary-400">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h4 className="text-[14px] font-semibold text-white">{title}</h4>
        <p className="text-[12px] text-surface-500 mt-1 leading-relaxed">{description}</p>
      </div>
      {linkTo ? (
        <Link
          to={linkTo}
          className="group/link inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary-400 hover:text-primary-300 transition-colors mt-auto"
        >
          {linkContent}
        </Link>
      ) : (
        <button
          onClick={onClick}
          className="group/link inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary-400 hover:text-primary-300 transition-colors mt-auto"
        >
          {linkContent}
        </button>
      )}
    </div>
  );
}

interface FleetQuickActionsProps {
  onAddVehicle: () => void;
}

export function FleetQuickActions({ onAddVehicle }: FleetQuickActionsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <QuickAction
        icon={Truck}
        title="Add Your Vehicles"
        description="Add vehicle details, documents, and specifications to keep everything organized."
        linkLabel="Add Vehicle"
        onClick={onAddVehicle}
      />
      <QuickAction
        icon={Upload}
        title="Import in Bulk"
        description="Save time by importing multiple vehicles at once using CSV."
        linkLabel="Import CSV"
      />
      <QuickAction
        icon={Bell}
        title="Set Reminders"
        description="Get notified about upcoming renewals, maintenance, and inspections."
        linkLabel="Manage Reminders"
        linkTo="/maintenance"
      />
      <QuickAction
        icon={BarChart3}
        title="View Reports"
        description="Analyze vehicle utilization, maintenance costs, and performance."
        linkLabel="View Reports"
        linkTo="/reports"
      />
    </div>
  );
}
