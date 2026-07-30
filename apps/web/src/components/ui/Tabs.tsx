import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

export function Tabs({ tabs, defaultTab, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  const activeContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <div className={cn('w-full', className)}>
      {/* Tab Bar */}
      <div className="relative flex border-b border-surface-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'relative px-4 py-3 text-[length:var(--text-body-sm)] font-medium transition-colors',
              activeTab === tab.id
                ? 'text-white'
                : 'text-surface-400 hover:text-white'
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-x-0 -bottom-px h-0.5 bg-primary-500"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pt-6">{activeContent}</div>
    </div>
  );
}
