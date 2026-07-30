import { Link } from 'react-router-dom';
import { 
  Truck, 
  Users, 
  Route, 
  Receipt, 
  Wrench, 
  FileText,
  type LucideIcon 
} from 'lucide-react';

interface QuickAction {
  title: string;
  icon: LucideIcon;
  path: string;
  color: string;
  bgColor: string;
}

export function QuickActions() {
  const actions: QuickAction[] = [
    { title: 'Add Vehicle', icon: Truck, path: '/fleet', color: 'text-emerald-500', bgColor: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { title: 'Add Driver', icon: Users, path: '/drivers', color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-500/10' },
    { title: 'Create Trip', icon: Route, path: '/trips', color: 'text-indigo-500', bgColor: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { title: 'Record Expense', icon: Receipt, path: '/expenses', color: 'text-rose-500', bgColor: 'bg-rose-50 dark:bg-rose-500/10' },
    { title: 'Schedule Maint.', icon: Wrench, path: '/maintenance', color: 'text-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-500/10' },
    { title: 'Create Invoice', icon: FileText, path: '/billing', color: 'text-cyan-500', bgColor: 'bg-cyan-50 dark:bg-cyan-500/10' },
  ];

  return (
    <div className="rounded-[16px] border border-surface-200 bg-white p-6 shadow-sm dark:border-surface-800 dark:bg-surface-900">
      <h3 className="mb-4 text-lg font-semibold text-surface-900 dark:text-white">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {actions.map((action, idx) => (
          <Link
            key={idx}
            to={action.path}
            className={`group flex h-32 flex-col items-center justify-center rounded-[16px] border border-transparent transition-all hover:border-surface-200 hover:-translate-y-1 hover:shadow-lg dark:hover:border-surface-700 ${action.bgColor}`}
          >
            <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-surface-800 transition-transform group-hover:scale-110 ${action.color}`}>
              <action.icon className="h-6 w-6" />
            </div>
            <span className="text-sm font-semibold text-surface-900 dark:text-white">
              {action.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
