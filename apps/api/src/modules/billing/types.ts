

export interface CreateInvoiceItemDTO {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateInvoiceDTO {
  customerId: string;
  tripId?: string;
  branchId?: string;
  dueDate: string | Date;
  taxAmount?: number;
  discountAmount?: number;
  notes?: string;
  items: CreateInvoiceItemDTO[];
}

export interface UpdateInvoiceDTO {
  dueDate?: string | Date;
  taxAmount?: number;
  discountAmount?: number;
  notes?: string;
  items?: CreateInvoiceItemDTO[];
}

export interface GenerateFromTripDTO {
  tripId: string;
}

export interface RevenueDataQuery {
  year?: string;
}

export interface CustomerLedgerQuery {
  page?: string;
  limit?: string;
}

export interface GetInvoicesQuery {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
  customerId?: string;
  tripId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
