import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient as api } from '@/api/client';
import type { Trip, DispatchBoardData, TripStatus } from '../types';

interface GetTripsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  driverId?: string;
  vehicleId?: string;
}

export function useTrips(params?: GetTripsParams) {
  return useQuery({
    queryKey: ['trips', params],
    queryFn: async () => {
      const { data } = await api.get('/trips', { params });
      return data;
    },
  });
}

export function useTrip(id: string) {
  return useQuery({
    queryKey: ['trips', id],
    queryFn: async () => {
      const { data } = await api.get<{ data: Trip }>(`/trips/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useDispatchBoard() {
  return useQuery({
    queryKey: ['dispatch-board'],
    queryFn: async () => {
      const { data } = await api.get<{ data: DispatchBoardData }>('/trips/dispatch/board');
      return data.data;
    },
    refetchInterval: 30000, // Refetch every 30s
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post('/trips', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['dispatch-board'] });
    },
  });
}

export function useUpdateTrip() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string } & any) => {
      const { data } = await api.put(`/trips/${id}`, payload);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['trips', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dispatch-board'] });
    },
  });
}

export function useAssignDriver() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, driverId }: { id: string; driverId: string }) => {
      const { data } = await api.patch(`/trips/${id}/assign-driver`, { driverId });
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['trips', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dispatch-board'] });
    },
  });
}

export function useAssignVehicle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, vehicleId }: { id: string; vehicleId: string }) => {
      const { data } = await api.patch(`/trips/${id}/assign-vehicle`, { vehicleId });
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['trips', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dispatch-board'] });
    },
  });
}

export function useUpdateTripStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: TripStatus; notes?: string }) => {
      const { data } = await api.patch(`/trips/${id}/status`, { status, notes });
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['trips', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dispatch-board'] });
    },
  });
}
