

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
  notes?: string;
  items: CreateInvoiceItemDTO[];
}

export interface UpdateInvoiceDTO {
  dueDate?: string | Date;
  taxAmount?: number;
  notes?: string;
  items?: CreateInvoiceItemDTO[];
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
