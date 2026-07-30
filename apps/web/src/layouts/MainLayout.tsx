import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, CheckCircle2 } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileDrawer } from '@/components/layout/MobileDrawer';

export function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#030712] text-white relative">
      
      {/* ── Background Effects ── */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-[250px] w-[500px] h-[500px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <MobileDrawer 
        isOpen={isMobileDrawerOpen} 
        onClose={() => setIsMobileDrawerOpen(false)} 
      />

      <div className="flex flex-1 flex-col overflow-hidden relative z-10">
        <Header onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)} />

        <main className="flex-1 overflow-y-auto px-6 lg:px-8 xl:px-10 pt-8 pb-12 relative">
          <div className="mx-auto w-full">
            <Outlet />
          </div>

          {/* Floating Glassmorphism Bars (Persistent across dashboard) */}
          <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4 pointer-events-none hidden lg:flex">
            <motion.div 
              animate={{ y: [0, -4, 0] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} 
              className="px-4 py-3 rounded-[12px] bg-primary-950/40 border border-primary-700/30 backdrop-blur-md flex items-center gap-3 w-52 shadow-2xl shadow-primary-900/20 pointer-events-auto"
            >
              <div className="h-8 w-8 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center shrink-0">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] text-surface-400 font-medium uppercase tracking-wider mb-0.5">System Status</div>
                <div className="text-[14px] font-bold text-white leading-none">All Systems Go</div>
              </div>
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, 4, 0] }} 
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }} 
              className="px-4 py-3 rounded-[12px] bg-surface-900/50 border border-surface-700/50 backdrop-blur-md flex items-center gap-3 w-52 shadow-2xl pointer-events-auto"
            >
              <div className="h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[10px] text-surface-400 font-medium uppercase tracking-wider mb-0.5">Data Sync</div>
                <div className="text-[14px] font-bold text-white leading-none">Real-time Active</div>
              </div>
            </motion.div>
          </div>

        </main>
      </div>
    </div>
  );
}
