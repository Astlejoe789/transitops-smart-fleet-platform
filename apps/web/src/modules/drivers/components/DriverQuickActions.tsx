import { Link } from 'react-router-dom';
import { UserPlus, FileUp, Bell, BarChart3, ArrowRight } from 'lucide-react';

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

interface DriverQuickActionsProps {
  onAddDriver: () => void;
}

export function DriverQuickActions({ onAddDriver }: DriverQuickActionsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <QuickAction
        icon={UserPlus}
        title="Add Drivers"
        description="Create driver profiles and store all essential details in one place."
        linkLabel="Add Driver"
        onClick={onAddDriver}
        iconBg="bg-primary-950/60"
        iconColor="text-primary-400"
      />
      <QuickAction
        icon={FileUp}
        title="Upload Documents"
        description="Add licenses, certificates, and other documents securely."
        linkLabel="Upload Documents"
        iconBg="bg-primary-950/60"
        iconColor="text-primary-400"
      />
      <QuickAction
        icon={Bell}
        title="Track Expiry"
        description="Get notified before licenses or certificates expire."
        linkLabel="Set Reminders"
        linkTo="/maintenance"
        iconBg="bg-primary-950/60"
        iconColor="text-primary-400"
      />
      <QuickAction
        icon={BarChart3}
        title="Driver Reports"
        description="Analyze driver performance and compliance in detail."
        linkLabel="View Reports"
        linkTo="/reports"
        iconBg="bg-primary-950/60"
        iconColor="text-primary-400"
      />
    </div>
  );
}
