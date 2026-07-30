import { useState } from 'react';
import { Plus, Route, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { SummaryCard } from '@/modules/dashboard/components/SummaryCard';
import { TripsTableWidget } from '../components/TripsTableWidget';
import { TripsOverviewCard } from '../components/TripsOverviewCard';
import { TopRoutesCard } from '../components/TopRoutesCard';
import { AutomateDispatchCard } from '../components/AutomateDispatchCard';
import { TripFormModal } from '../components/TripFormModal';
import { PageContainer } from "@/components/layout";

export default function TripsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] md:text-[32px] font-bold tracking-tight text-white leading-tight" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
              Trips
            </h1>
            <p className="mt-1 text-[13px] md:text-[14px] text-surface-400">
              Manage your fleet trips, routes, and assignments.
            </p>
          </div>

          <button 
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white text-[13px] font-semibold transition-all shadow-lg shadow-primary-600/20 shrink-0 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>New Trip</span>
          </button>
        </div>

        {/* Top 4 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard 
            title="Total Trips" 
            value={128}
            trend="↑ 18 this month"
            icon={Route} 
            color="primary"
          />
          <SummaryCard 
            title="Active Trips" 
            value={24}
            trend="↑ 6 this month"
            icon={Calendar} 
            color="info"
          />
          <SummaryCard 
            title="Completed" 
            value={96}
            trend="↑ 12 this month"
            icon={CheckCircle2} 
            color="success"
          />
          <SummaryCard 
            title="On Time" 
            value="92%"
            trend="↑ 4% this month"
            icon={Clock} 
            color="warning"
          />
        </div>

        {/* Main Grid: Left Table + Right Sidebar Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Columns: Trips Table */}
          <div className="lg:col-span-2">
            <TripsTableWidget />
          </div>

          {/* Right 1 Column: Widgets */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <TripsOverviewCard />
            <TopRoutesCard />
            <AutomateDispatchCard />
          </div>

        </div>

      </div>

      <TripFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </PageContainer>
  );
}
