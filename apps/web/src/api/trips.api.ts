import { apiClient } from './client';

export interface Trip {
  id: string;
  tripId: string;
  origin: string;
  destination: string;
  driverId: string;
  vehicleId: string;
  status: string;
  distance: number;
  startDate: string;
  estimatedArrival: string;
  driverName?: string;
  vehiclePlate?: string;
}

export const getTrips = async (): Promise<Trip[]> => {
  try {
    const { data } = await apiClient.get('/api/trips');
    return data;
  } catch (err) {
    console.error("Error fetching trips:", err);
    return [];
  }
};

export const addTrip = async (tripData: Partial<Trip>): Promise<Trip | null> => {
  try {
    const { data } = await apiClient.post('/api/trips', tripData);
    return data;
  } catch (err) {
    console.error("Error adding trip:", err);
    return null;
  }
};
