import { Link } from 'react-router-dom';
import { Fuel, BarChart3, Bell, Download, ArrowRight } from 'lucide-react';

interface QuickActionProps {
  icon: any;
  title: string;
  description: string;
  linkLabel: string;
  linkTo?: string;
  onClick?: () => void;
  iconBg: string;
  iconColor: string;
}

function QuickAction({ icon: Icon, title, description, linkLabel, linkTo, onClick, iconBg, iconColor }: QuickActionProps) {
  const linkContent = (
    <>
      <span>{linkLabel}</span>
      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
    </>
  );

  return (
    <div className="flex flex-col items-center text-center gap-3 rounded-[16px] bg-[#0B1426]/70 border border-surface-800/40 p-5 transition-all hover:border-surface-700/60 hover:bg-[#0B1426]/90">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} border border-transparent`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
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

interface FuelQuickActionsProps {
  onLogFuel: () => void;
}

export function FuelQuickActions({ onLogFuel }: FuelQuickActionsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <QuickAction
        icon={Fuel}
        title="Log Fuel Entry"
        description="Record fuel purchases, quantity, and cost for your vehicles."
        linkLabel="Add Fuel Entry"
        onClick={onLogFuel}
        iconBg="bg-primary-950/60"
        iconColor="text-primary-400"
      />
      <QuickAction
        icon={BarChart3}
        title="Fuel Reports"
        description="Analyze fuel consumption, costs, and efficiency trends."
        linkLabel="View Reports"
        linkTo="/reports"
        iconBg="bg-blue-900/30"
        iconColor="text-blue-400"
      />
      <QuickAction
        icon={Bell}
        title="Set Reminders"
        description="Get alerts for refuel schedules and budget limits."
        linkLabel="Manage Reminders"
        linkTo="/settings"
        iconBg="bg-amber-900/30"
        iconColor="text-amber-400"
      />
      <QuickAction
        icon={Download}
        title="Export Data"
        description="Export fuel data for accounting and compliance."
        linkLabel="Export Now"
        iconBg="bg-purple-900/30"
        iconColor="text-purple-400"
      />
    </div>
  );
}
