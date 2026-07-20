import { type LucideIcon, Sparkles, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface ModulePlaceholderPageProps {
  moduleName: string;
  category: string;
  description: string;
  icon: LucideIcon;
  plannedFeatures: string[];
}

export function ModulePlaceholderPage({
  moduleName,
  category,
  description,
  icon: Icon,
  plannedFeatures,
}: ModulePlaceholderPageProps) {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-surface-200 dark:border-surface-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-400 text-white shadow-lg shadow-primary-500/20">
            <Icon className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white sm:text-3xl">
                {moduleName}
              </h1>
              <span className="rounded-full bg-primary-500/10 px-2.5 py-0.5 text-xs font-bold text-primary-600 dark:text-primary-400 uppercase">
                {category}
              </span>
            </div>
            <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-500/10 px-3 py-1 text-xs font-bold text-accent-600 dark:text-accent-400 border border-accent-500/20">
            <Clock className="h-3.5 w-3.5" /> Coming Soon
          </span>
        </div>
      </div>

      {/* Main Info Banner Card */}
      <div className="relative overflow-hidden rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-primary-500/5 blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-500">
              <Sparkles className="h-4 w-4" /> Application Shell Ready
            </div>
            <h2 className="text-xl font-bold text-surface-900 dark:text-white sm:text-2xl">
              {moduleName} Module Scaffolding Complete
            </h2>
            <p className="text-sm text-surface-600 dark:text-surface-400">
              Welcome, <span className="font-semibold text-surface-900 dark:text-white">{user?.firstName}</span> ({user?.role}).
              The feature-based folder structure, database entities, routes, and security policies for this module are established. Business CRUD workflows will be activated in upcoming phases.
            </p>
          </div>

          <div className="flex shrink-0 gap-3">
            <button className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/30 hover:bg-primary-500 transition-colors">
              Explore Specs <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Planned Features Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-surface-500">
          Planned Feature Architecture
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plannedFeatures.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900/60 p-4 transition-all hover:border-primary-500/50 hover:shadow-md"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-500/10 text-accent-500 mt-0.5">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-surface-900 dark:text-white">{feature}</h4>
                <p className="mt-0.5 text-xs text-surface-400">Production architecture ready</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
