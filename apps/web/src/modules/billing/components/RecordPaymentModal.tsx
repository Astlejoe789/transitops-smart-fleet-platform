import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Invoice, PaymentMethod } from '../types';

const paymentSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive'),
  paymentDate: z.string().min(1, 'Payment date is required'),
  paymentMethod: z.nativeEnum(PaymentMethod),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

const methodLabels: Record<PaymentMethod, string> = {
  BANK_TRANSFER: 'Bank Transfer',
  CREDIT_CARD: 'Credit Card',
  CASH: 'Cash',
  CHECK: 'Check',
  DIGITAL_WALLET: 'Digital Wallet',
  CORPORATE_CARD: 'Corporate Card',
  FUEL_CARD: 'Fuel Card',
  UPI: 'UPI',
  OTHER: 'Other',
};

interface RecordPaymentModalProps {
  isOpen: boolean;
  invoice: Invoice | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function RecordPaymentModal({ isOpen, invoice, onClose, onSubmit, isLoading }: RecordPaymentModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: invoice?.totalAmount ?? 0,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: PaymentMethod.BANK_TRANSFER,
    },
  });

  if (!isOpen || !invoice) return null;

  const handleFormSubmit = (data: PaymentFormData) => {
    onSubmit({
      invoiceId: invoice.id,
      amount: Number(data.amount),
      paymentDate: new Date(data.paymentDate).toISOString(),
      paymentMethod: data.paymentMethod,
      referenceNumber: data.referenceNumber,
      notes: data.notes,
    });
  };

  const paidSoFar = (invoice.payments ?? [])
    .filter((p) => p.paymentStatus === 'COMPLETED')
    .reduce((s, p) => s + p.amount, 0);
  const remaining = invoice.totalAmount - paidSoFar;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg bg-white dark:bg-surface-900 rounded-2xl shadow-2xl mx-4">
        <div className="flex items-center justify-between px-6 py-5 border-b border-surface-200 dark:border-surface-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
              <CreditCard className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-surface-900 dark:text-white">Record Payment</h2>
              <p className="text-sm text-surface-500">{invoice.invoiceNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-full transition-colors">
            <X className="h-5 w-5 text-surface-500" />
          </button>
        </div>

        {/* Invoice summary */}
        <div className="px-6 py-4 bg-surface-50 dark:bg-surface-800/50 border-b border-surface-200 dark:border-surface-700">
          <div className="flex justify-between text-sm">
            <span className="text-surface-500">Customer</span>
            <span className="font-medium">{invoice.customer?.name ?? '—'}</span>
          </div>
          <div className="flex justify-between text-sm mt-1.5">
            <span className="text-surface-500">Invoice Total</span>
            <span className="font-semibold">${invoice.totalAmount.toFixed(2)}</span>
          </div>
          {paidSoFar > 0 && (
            <div className="flex justify-between text-sm mt-1.5">
              <span className="text-surface-500">Already Paid</span>
              <span className="font-medium text-emerald-600">${paidSoFar.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold mt-2 pt-2 border-t border-surface-200 dark:border-surface-700">
            <span>Remaining</span>
            <span className="text-primary-600">${remaining.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-surface-700 dark:text-surface-300">
                Amount <span className="text-red-500">*</span>
              </label>
              <Input type="number" step="0.01" {...register('amount')} error={!!errors.amount} />
              {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount.message}</p>}
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-surface-700 dark:text-surface-300">
                Date <span className="text-red-500">*</span>
              </label>
              <Input type="date" {...register('paymentDate')} error={!!errors.paymentDate} />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-semibold text-surface-700 dark:text-surface-300">
              Payment Method <span className="text-red-500">*</span>
            </label>
            <select
              {...register('paymentMethod')}
              className="flex h-10 w-full rounded-md border border-surface-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
            >
              {Object.entries(methodLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-semibold text-surface-700 dark:text-surface-300">
              Reference Number
            </label>
            <Input {...register('referenceNumber')} placeholder="Bank transfer ID, check number, etc." />
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-semibold text-surface-700 dark:text-surface-300">Notes</label>
            <textarea
              {...register('notes')}
              rows={2}
              placeholder="Optional notes..."
              className="flex w-full rounded-md border border-surface-200 bg-white px-3 py-2 text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-surface-700 dark:bg-surface-900 dark:text-white resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" isLoading={isLoading}>Record Payment</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
