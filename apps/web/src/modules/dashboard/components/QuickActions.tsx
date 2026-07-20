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
}

export function QuickActions() {
  const actions: QuickAction[] = [
    { title: 'Add Vehicle', icon: Truck, path: '/fleet', color: 'bg-emerald-500' },
    { title: 'Add Driver', icon: Users, path: '/drivers', color: 'bg-blue-500' },
    { title: 'Create Trip', icon: Route, path: '/trips', color: 'bg-indigo-500' },
    { title: 'Record Expense', icon: Receipt, path: '/expenses', color: 'bg-rose-500' },
    { title: 'Schedule Maint.', icon: Wrench, path: '/maintenance', color: 'bg-amber-500' },
    { title: 'Create Invoice', icon: FileText, path: '/billing', color: 'bg-cyan-500' },
  ];

  return (
    <div className="rounded-xl border border-surface-200 bg-white p-6 shadow-sm dark:border-surface-800 dark:bg-surface-900">
      <h3 className="mb-4 text-lg font-semibold text-surface-900 dark:text-white">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        {actions.map((action, idx) => (
          <Link
            key={idx}
            to={action.path}
            className="group flex flex-col items-center justify-center rounded-xl border border-surface-100 bg-surface-50 p-4 text-center transition-all hover:border-primary-500/30 hover:bg-primary-50 hover:shadow-md dark:border-surface-800 dark:bg-surface-800/50 dark:hover:border-primary-500/30 dark:hover:bg-surface-800"
          >
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm transition-transform group-hover:scale-110 ${action.color}`}>
              <action.icon className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-surface-700 dark:text-surface-300">
              {action.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
