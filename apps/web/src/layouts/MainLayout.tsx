import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileDrawer } from '@/components/layout/MobileDrawer';
import { Footer } from '@/components/layout/Footer';

/**
 * Main application layout shell with collapsible sidebar, top navigation,
 * responsive mobile drawer, footer, and main content area.
 */
export function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-white transition-colors duration-200">
      {/* Desktop Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Mobile Slide-Over Drawer */}
      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />

      {/* Main Content Workspace */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Navigation */}
        <Header onOpenMobileDrawer={() => setMobileDrawerOpen(true)} />

        {/* Dynamic Route Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        {/* Application Footer */}
        <Footer />
      </div>
    </div>
  );
}
