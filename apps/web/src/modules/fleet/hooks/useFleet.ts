import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  plateNumber: string;
  type: string;
  fuelType: string;
  status: string;
  currentOdometer: number;
  fuelCapacity?: number;
  payloadCapacity?: number;
  color?: string;
  purchaseDate?: string;
  insuranceExpiry?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface VehicleFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
}

export const useVehicles = (filters: VehicleFilters) => {
  return useQuery({
    queryKey: ['vehicles', filters],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<Vehicle>>('/fleet', {
        params: filters,
      });
      return data;
    },
  });
};

export const useVehicle = (id: string) => {
  return useQuery({
    queryKey: ['vehicles', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Vehicle>(`/fleet/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Vehicle>) => {
      const { data } = await apiClient.post<Vehicle>('/fleet', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useUpdateVehicle = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Vehicle>) => {
      const { data } = await apiClient.put<Vehicle>(`/fleet/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/fleet/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export interface VehicleDocument {
  id: string;
  vehicleId: string;
  title: string;
  documentType: string;
  fileUrl: string;
  issuedDate?: string;
  expiryDate?: string;
  createdAt: string;
}

export const useVehicleDocuments = (vehicleId: string) => {
  return useQuery({
    queryKey: ['vehicles', vehicleId, 'documents'],
    queryFn: async () => {
      const { data } = await apiClient.get<VehicleDocument[]>(`/fleet/${vehicleId}/documents`);
      return data;
    },
    enabled: !!vehicleId,
  });
};

export const useAddDocument = (vehicleId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<VehicleDocument>) => {
      const { data } = await apiClient.post<VehicleDocument>(`/fleet/${vehicleId}/documents`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles', vehicleId, 'documents'] });
    },
  });
};

export const useDeleteDocument = (vehicleId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (docId: string) => {
      const { data } = await apiClient.delete(`/fleet/documents/${docId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles', vehicleId, 'documents'] });
    },
  });
};
