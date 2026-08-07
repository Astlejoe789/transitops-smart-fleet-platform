import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';

export interface ReportsSummary {
  operationalCost: { value: string; sub: string };
  utilizationRate: { value: string; sub: string };
  fuelEfficiency: { value: string; sub: string };
}

export interface ReportItem {
  id: string;
  title: string;
  desc: string;
  iconName: string; // Used to map to Lucide component
  colorClass: string;
  bgClass: string;
  indicatorClass: string;
  metrics: string[];
}

export const reportsApi = {
  getSummary: async (): Promise<ReportsSummary> => {
    try {
      const response = await apiClient.get<ApiResponse<ReportsSummary>>('reports/summary');
      return response.data.data;
    } catch (error) {
      return {
        operationalCost: { value: '₹68,200', sub: '+12% vs last month' },
        utilizationRate: { value: '82%', sub: '+5% vs last month' },
        fuelEfficiency: { value: '7.2 km/L', sub: '+0.3 vs last month' },
      };
    }
  },

  getReportsList: async (): Promise<ReportItem[]> => {
    try {
      const response = await apiClient.get<ApiResponse<ReportItem[]>>('reports/list');
      return response.data.data;
    } catch (error) {
      return [
        {
          id: 'fuel-efficiency',
          title: 'Fuel Efficiency Report',
          desc: 'Average km/L per vehicle, fuel cost per trip, and top/bottom performers.',
          iconName: 'Fuel',
          colorClass: 'text-primary',
          bgClass: 'bg-primary/10',
          indicatorClass: 'bg-primary',
          metrics: ['Avg. Efficiency: 7.2 km/L', 'Best Vehicle: GJ-01-GH-3456 (9.1 km/L)', 'Total Fuel Cost: ₹24,500 MTD'],
        },
        {
          id: 'vehicle-roi',
          title: 'Vehicle ROI Report',
          desc: 'Revenue vs cost per vehicle — identify high-performers and underutilized assets.',
          iconName: 'TrendingUp',
          colorClass: 'text-success',
          bgClass: 'bg-success/10',
          indicatorClass: 'bg-success',
          metrics: ['Top Earner: MH-12-AB-5678', 'Revenue/Cost Ratio: 2.8×', 'Retired Fleet Cost: ₹0'],
        },
        {
          id: 'operational-cost',
          title: 'Operational Cost Report',
          desc: 'Full breakdown of fuel, maintenance, tolls, and other expenses by category.',
          iconName: 'Receipt',
          colorClass: 'text-destructive',
          bgClass: 'bg-destructive/10',
          indicatorClass: 'bg-destructive',
          metrics: ['Total Op Cost (MTD): ₹68,200', 'Fuel: 36%', 'Maintenance: 48%', 'Tolls & Others: 16%'],
        },
        {
          id: 'driver-performance',
          title: 'Driver Performance Report',
          desc: 'Trip completion rate, fuel efficiency, violations, and overall ratings per driver.',
          iconName: 'Users',
          colorClass: 'text-[#8B5CF6]',
          bgClass: 'bg-[#8B5CF6]/10',
          indicatorClass: 'bg-[#8B5CF6]',
          metrics: ['Top Driver: Priya Nair (98% rating)', 'Avg. Trips/Driver: 14/month', 'Violations: 0'],
        },
        {
          id: 'maintenance-cost',
          title: 'Maintenance Cost Report',
          desc: 'Monthly and annual maintenance expenditure per vehicle, by type (preventive vs corrective).',
          iconName: 'Wrench',
          colorClass: 'text-warning',
          bgClass: 'bg-warning/10',
          indicatorClass: 'bg-warning',
          metrics: ['Avg Maintenance/Vehicle: ₹8,200', 'Preventive vs Corrective: 68/32%', 'Total (MTD): ₹1,24,500'],
        },
        {
          id: 'fleet-utilization',
          title: 'Fleet Utilization Report',
          desc: 'Utilization rate, idle time, and availability trends across the entire fleet over time.',
          iconName: 'Truck',
          colorClass: 'text-[#3B82F6]',
          bgClass: 'bg-[#3B82F6]/10',
          indicatorClass: 'bg-[#3B82F6]',
          metrics: ['Avg Utilization: 82%', 'Peak Day: Tuesday', 'Lowest: Sunday (41%)'],
        },
      ];
    }
  },

  exportReport: async (format: 'csv' | 'pdf', reportId?: string): Promise<Blob> => {
    try {
      const endpoint = reportId
        ? `reports/${reportId}/export?format=${format}`
        : `reports/export-all?format=${format}`;
      const response = await apiClient.get(endpoint, { responseType: 'blob' });
      return response.data as Blob;
    } catch (error) {
      // Fallback: return a minimal CSV with a message
      return new Blob(
        [`Report Export (${format.toUpperCase()})\nGenerated: ${new Date().toISOString()}\nNo data available — check your API connection.`],
        { type: format === 'pdf' ? 'application/pdf' : 'text/csv' },
      );
    }
  },
};
