import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';

export interface DashboardSummary {
  totalVehicles: { value: number; sub: string };
  activeVehicles: { value: number; sub: string };
  inMaintenance: { value: number; sub: string };
  fuelEfficiency: { value: string; sub: string };
}

export interface DashboardFleetData {
  utilizationData: { day: string; value: number }[];
  vehicles: {
    id: string;
    driver: string;
    status: string;
    statusClass: string;
    location: string;
    next: string;
  }[];
  alerts: {
    icon: any; // We'll map icon name to component in the UI
    iconName: string;
    title: string;
    body: string;
    level: string;
    levelClass: string;
  }[];
}

export const dashboardApi = {
  getSummary: async (): Promise<DashboardSummary> => {
    try {
      const response = await apiClient.get<ApiResponse<DashboardSummary>>('dashboard/summary');
      return response.data.data;
    } catch (error) {
      // Return mock data if backend not ready
      return {
        totalVehicles: { value: 248, sub: '+6 this month' },
        activeVehicles: { value: 187, sub: '75.4% utilization' },
        inMaintenance: { value: 12, sub: '3 need attention' },
        fuelEfficiency: { value: '8.4 mpg', sub: '+2.1% vs last week' },
      };
    }
  },

  getFleet: async (): Promise<DashboardFleetData> => {
    try {
      const response = await apiClient.get<ApiResponse<DashboardFleetData>>('dashboard/fleet-dashboard');
      return response.data.data;
    } catch (error) {
      return {
        utilizationData: [
          { day: 'Mon', value: 72 },
          { day: 'Tue', value: 78 },
          { day: 'Wed', value: 75 },
          { day: 'Thu', value: 88 },
          { day: 'Fri', value: 85 },
          { day: 'Sat', value: 74 },
          { day: 'Sun', value: 79 },
        ],
        vehicles: [
          { id: 'FT-2048', driver: 'Maya Chen', status: 'On route', statusClass: 'bg-success-soft text-success', location: 'I-80 · Oakland', next: '14 min' },
          { id: 'FT-1832', driver: 'Jon Bell', status: 'Idle', statusClass: 'bg-warning-soft text-warning', location: 'Depot 04 · Fremont', next: '42 min' },
          { id: 'FT-2175', driver: 'A. Rivera', status: 'On route', statusClass: 'bg-success-soft text-success', location: 'US-101 · San Jose', next: '26 min' },
          { id: 'FT-1951', driver: 'Sam Okafor', status: 'Service due', statusClass: 'bg-destructive text-destructive-foreground', location: 'Depot 02 · Richmond', next: '—' },
        ],
        alerts: [
          { icon: null, iconName: 'Wrench', title: 'FT-1951 service overdue', body: 'Oil service exceeded by 240 mi', level: 'High', levelClass: 'bg-destructive text-destructive-foreground' },
          { icon: null, iconName: 'Fuel', title: 'Unusual fuel consumption', body: 'FT-1784 used 18% above baseline', level: 'Medium', levelClass: 'bg-warning text-foreground' },
          { icon: null, iconName: 'Shield', title: 'Driver document expiring', body: 'Maya Chen · license in 12 days', level: 'Review', levelClass: 'bg-success-soft text-success' },
        ]
      };
    }
  }
};
