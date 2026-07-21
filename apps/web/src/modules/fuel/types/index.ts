import type { User } from '@/types';
import type { Vehicle } from '@/modules/fleet/hooks/useFleet';
import type { Driver } from '@/modules/drivers/types';

export enum FuelType {
  DIESEL = 'DIESEL',
  PETROL = 'PETROL',
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID',
  CNG = 'CNG',
  LPG = 'LPG',
  OTHER = 'OTHER',
}

export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  CASH = 'CASH',
  CHECK = 'CHECK',
  DIGITAL_WALLET = 'DIGITAL_WALLET',
  CORPORATE_CARD = 'CORPORATE_CARD',
  FUEL_CARD = 'FUEL_CARD',
  UPI = 'UPI',
  OTHER = 'OTHER',
}

export interface FuelLog {
  id: string;
  companyId: string;
  vehicleId: string;
  driverId: string;
  tripId?: string;
  fuelLogNumber: string;
  fuelType: FuelType;
  fuelGrade?: string;
  paymentMethod: PaymentMethod;
  fuelDate: string;
  liters: number;
  costPerLiter: number;
  totalCost: number;
  odometerReading: number;
  efficiency?: number;
  stationName?: string;
  location?: string;
  receiptNumber?: string;
  receiptUrl?: string;
  remarks?: string;
  createdById?: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  vehicle?: Vehicle;
  driver?: Driver;
  createdBy?: User;
}

export interface FuelAnalytics {
  totalLiters: number;
  totalCost: number;
  averageEfficiency: number;
  typeDistribution: Record<string, number>;
  highestConsumptionVehicleId: string | null;
  highestConsumptionCost: number;
}

export interface FuelDashboardMetrics {
  todayRefuels: number;
  monthlyCost: number;
  monthlyLiters: number;
  averageEfficiency: number;
}
