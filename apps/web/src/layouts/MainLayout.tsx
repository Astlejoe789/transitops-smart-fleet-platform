import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, MobileSidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';

export function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[236px_minmax(0,1fr)]">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main content */}
      <main className="min-w-0">
        <Header onOpenMobileDrawer={() => setMobileOpen(true)} />
        <div className="mx-auto max-w-[1540px] space-y-5 p-4 sm:p-7">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
