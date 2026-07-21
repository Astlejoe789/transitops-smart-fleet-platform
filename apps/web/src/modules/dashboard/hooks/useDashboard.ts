import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

// Types
export interface DashboardSummary {
  totalVehicles: number;
  availableVehicles: number;
  vehiclesOnTrip: number;
  totalDrivers: number;
  driversOnTrip: number;
  todayTrips: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  pendingInvoices: number;
  maintenanceDue: number;
  maintenanceInProgress: number;
  completedServices: number;
  maintenanceCost: number;
  fuelCost: number;
}

export interface FleetStatusData {
  name: string;
  value: number;
  color: string;
}

export interface TripsData {
  status: { name: string; value: number }[];
  monthly: { name: string; trips: number }[];
}

export interface ExpensesData {
  name: string;
  revenue: number;
  expenses: number;
  fuel: number;
}

export interface MaintenanceData {
  name: string;
  routine: number;
  repairs: number;
}

export interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  icon: string;
}

export interface DashboardNotification {
  id: string;
  title: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  time: string;
}

// Hooks
export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: async () => {
      const { data } = await apiClient.get<DashboardSummary>('/dashboard/summary');
      return data;
    },
  });
};

export const useFleetStatus = () => {
  return useQuery({
    queryKey: ['dashboard', 'fleet'],
    queryFn: async () => {
      const { data } = await apiClient.get<FleetStatusData[]>('/dashboard/fleet');
      return data;
    },
  });
};

export const useTripsData = () => {
  return useQuery({
    queryKey: ['dashboard', 'trips'],
    queryFn: async () => {
      const { data } = await apiClient.get<TripsData>('/dashboard/trips');
      return data;
    },
  });
};

export const useExpensesData = () => {
  return useQuery({
    queryKey: ['dashboard', 'expenses'],
    queryFn: async () => {
      const { data } = await apiClient.get<ExpensesData[]>('/dashboard/expenses');
      return data;
    },
  });
};

export const useMaintenanceData = () => {
  return useQuery({
    queryKey: ['dashboard', 'maintenance'],
    queryFn: async () => {
      const { data } = await apiClient.get<MaintenanceData[]>('/dashboard/maintenance');
      return data;
    },
  });
};

export const useRecentActivities = () => {
  return useQuery({
    queryKey: ['dashboard', 'recent-activities'],
    queryFn: async () => {
      const { data } = await apiClient.get<Activity[]>('/dashboard/recent-activities');
      return data;
    },
  });
};

export const useDashboardNotifications = () => {
  return useQuery({
    queryKey: ['dashboard', 'notifications'],
    queryFn: async () => {
      const { data } = await apiClient.get<DashboardNotification[]>('/dashboard/notifications');
      return data;
    },
  });
};
