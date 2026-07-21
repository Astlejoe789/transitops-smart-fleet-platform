import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expenseSchema, type ExpenseFormValues } from '../schemas/expenseSchema';
import type { Expense } from '../types';
import { ExpenseCategory, ExpenseStatus, PaymentMethod } from '../types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DollarSign, X } from 'lucide-react';
import { useVehicles } from '@/modules/fleet/hooks/useFleet';
import { useDrivers } from '@/modules/drivers/hooks/useDrivers';

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Expense>) => void;
  initialData?: Expense | null;
}

export function ExpenseFormModal({ isOpen, onClose, onSubmit, initialData }: ExpenseFormModalProps) {
  const { data: fleetData } = useVehicles({});
  const { data: driverData } = useDrivers({});

  const vehicles = fleetData?.data || [];
  const drivers = driverData?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      expenseDate: new Date().toISOString().slice(0, 16),
      category: ExpenseCategory.OTHER,
      paymentMethod: PaymentMethod.CORPORATE_CARD,
      currency: 'USD',
      status: ExpenseStatus.DRAFT,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          vehicleId: initialData.vehicleId || '',
          driverId: initialData.driverId || '',
          tripId: initialData.tripId || '',
          category: initialData.category,
          amount: initialData.amount,
          currency: initialData.currency,
          expenseDate: new Date(initialData.expenseDate).toISOString().slice(0, 16),
          paymentMethod: initialData.paymentMethod,
          vendorName: initialData.vendorName || '',
          description: initialData.description || '',
          referenceNumber: initialData.referenceNumber || '',
          receiptNumber: initialData.receiptNumber || '',
          notes: initialData.notes || '',
          receiptUrl: initialData.receiptUrl || '',
          status: initialData.status,
        });
      } else {
        reset({
          expenseDate: new Date().toISOString().slice(0, 16),
          category: ExpenseCategory.OTHER,
          paymentMethod: PaymentMethod.CORPORATE_CARD,
          currency: 'USD',
          status: ExpenseStatus.DRAFT,
        });
      }
    }
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl p-6 overflow-hidden bg-white rounded-xl shadow-xl dark:bg-surface-900 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30">
              <DollarSign className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
              {initialData ? 'Edit Expense' : 'Log New Expense'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 transition-colors rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          <form id="expense-form" onSubmit={handleSubmit((data) => {
             const cleanData = { ...data };
             if (!cleanData.vehicleId) delete cleanData.vehicleId;
             if (!cleanData.driverId) delete cleanData.driverId;
             if (!cleanData.tripId) delete cleanData.tripId;
             onSubmit(cleanData as Partial<Expense>);
          })} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Category</label>
                <div className="relative">
                  <select
                    {...register('category')}
                    className="flex w-full h-10 px-3 py-2 text-sm bg-transparent border rounded-md border-surface-300 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-700 dark:text-surface-50 focus:border-primary-500"
                  >
                    {Object.values(ExpenseCategory).map(cat => (
                      <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </div>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Amount</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('amount')}
                  error={!!errors.amount}
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-500">{errors.amount.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Expense Date & Time</label>
                <Input
                  type="datetime-local"
                  {...register('expenseDate')}
                  error={!!errors.expenseDate}
                />
                {errors.expenseDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.expenseDate.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Payment Method</label>
                <div className="relative">
                  <select
                    {...register('paymentMethod')}
                    className="flex w-full h-10 px-3 py-2 text-sm bg-transparent border rounded-md border-surface-300 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-700 dark:text-surface-50 focus:border-primary-500"
                  >
                    {Object.values(PaymentMethod).map(pm => (
                      <option key={pm} value={pm}>{pm.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </div>
                {errors.paymentMethod && (
                  <p className="mt-1 text-sm text-red-500">{errors.paymentMethod.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Vendor Name</label>
                <Input
                  placeholder="Enter vendor"
                  {...register('vendorName')}
                  error={!!errors.vendorName}
                />
                {errors.vendorName && (
                  <p className="mt-1 text-sm text-red-500">{errors.vendorName.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Receipt Number</label>
                <Input
                  placeholder="e.g. REC-1234"
                  {...register('receiptNumber')}
                  error={!!errors.receiptNumber}
                />
                {errors.receiptNumber && (
                  <p className="mt-1 text-sm text-red-500">{errors.receiptNumber.message}</p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block mb-1 text-sm font-medium">Description</label>
                <Input
                  placeholder="Brief description of the expense"
                  {...register('description')}
                  error={!!errors.description}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-surface-200 dark:border-surface-800">
              <h3 className="mb-4 text-sm font-medium text-surface-900 dark:text-white">
                Associations (Optional)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">Vehicle</label>
                  <div className="relative">
                    <select
                      {...register('vehicleId')}
                      className="flex w-full h-10 px-3 py-2 text-sm bg-transparent border rounded-md border-surface-300 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-700 dark:text-surface-50 focus:border-primary-500"
                    >
                      <option value="">None</option>
                      {vehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.plateNumber} - {v.make} {v.model}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">Driver</label>
                  <div className="relative">
                    <select
                      {...register('driverId')}
                      className="flex w-full h-10 px-3 py-2 text-sm bg-transparent border rounded-md border-surface-300 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-700 dark:text-surface-50 focus:border-primary-500"
                    >
                      <option value="">None</option>
                      {drivers.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.user?.firstName} {d.user?.lastName} ({d.employeeId})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <label className="block mb-1 text-sm font-medium">Notes</label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full px-3 py-2 text-sm bg-transparent border rounded-md resize-none border-surface-300 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-surface-700 dark:text-surface-50 focus:border-primary-500"
                placeholder="Additional details..."
              />
            </div>
          </form>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-surface-200 dark:border-surface-800">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            type="submit"
            form="expense-form"
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Update Expense' : 'Save Expense'}
          </Button>
        </div>
      </div>
    </div>
  );
}
