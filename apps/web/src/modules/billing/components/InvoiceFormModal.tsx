import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus, Trash2, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCustomers } from '@/modules/customers/hooks/useCustomers';

const lineItemSchema = z.object({
  description: z.string().min(1, 'Required'),
  quantity: z.coerce.number().positive(),
  unitPrice: z.coerce.number().nonnegative(),
});

const invoiceSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  taxAmount: z.coerce.number().nonnegative().optional(),
  discountAmount: z.coerce.number().nonnegative().optional(),
  notes: z.string().optional(),
  items: z.array(lineItemSchema).min(1, 'At least one line item is required'),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface InvoiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function InvoiceFormModal({ isOpen, onClose, onSubmit, isLoading }: InvoiceFormModalProps) {
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
      taxAmount: 0,
      discountAmount: 0,
    },
  });

  const { data: customersData } = useCustomers({ limit: '100' });
  const customers = customersData?.data || [];

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const watchedItems = watch('items') || [];
  const watchedTax = watch('taxAmount') || 0;
  const watchedDiscount = watch('discountAmount') || 0;
  const subtotal = watchedItems.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), 0);
  const total = subtotal + Number(watchedTax) - Number(watchedDiscount);

  if (!isOpen) return null;

  const handleFormSubmit = (data: InvoiceFormData) => {
    onSubmit({
      ...data,
      dueDate: new Date(data.dueDate).toISOString(),
      taxAmount: Number(data.taxAmount ?? 0),
      discountAmount: Number(data.discountAmount ?? 0),
      items: data.items.map((item) => ({
        description: item.description,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8">
      <div className="w-full max-w-3xl bg-white dark:bg-surface-900 rounded-2xl shadow-2xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-surface-200 dark:border-surface-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
              <Receipt className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-surface-900 dark:text-white">New Invoice</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-full transition-colors">
            <X className="h-5 w-5 text-surface-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-8 space-y-6">
          {/* Customer + Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-surface-700 dark:text-surface-300">
                Customer <span className="text-red-500">*</span>
              </label>
              <select
                {...register('customerId')}
                className={`flex w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-surface-900 dark:text-white ${
                  errors.customerId ? 'border-red-500' : 'border-surface-200 dark:border-surface-700'
                }`}
              >
                <option value="">Select a customer...</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.customerId && <p className="mt-1 text-xs text-red-500">{errors.customerId.message}</p>}
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-surface-700 dark:text-surface-300">
                Due Date <span className="text-red-500">*</span>
              </label>
              <Input type="date" {...register('dueDate')} error={!!errors.dueDate} />
              {errors.dueDate && <p className="mt-1 text-xs text-red-500">{errors.dueDate.message}</p>}
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider">Line Items</h3>
              <button
                type="button"
                onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}
                className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </button>
            </div>

            <div className="border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-surface-50 dark:bg-surface-800 text-surface-500 font-medium">
                  <tr>
                    <th className="px-4 py-3 text-left">Description</th>
                    <th className="px-4 py-3 text-right w-24">Qty</th>
                    <th className="px-4 py-3 text-right w-32">Unit Price</th>
                    <th className="px-4 py-3 text-right w-32">Total</th>
                    <th className="px-4 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                  {fields.map((field, index) => {
                    const qty = Number(watchedItems[index]?.quantity) || 0;
                    const price = Number(watchedItems[index]?.unitPrice) || 0;
                    const lineTotal = qty * price;
                    return (
                      <tr key={field.id}>
                        <td className="px-4 py-3">
                          <Input
                            {...register(`items.${index}.description`)}
                            placeholder="Service or product description"
                            className="text-sm"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            type="number"
                            {...register(`items.${index}.quantity`)}
                            className="text-sm text-right"
                            min={1}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            type="number"
                            step="0.01"
                            {...register(`items.${index}.unitPrice`)}
                            className="text-sm text-right"
                            min={0}
                          />
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-surface-700 dark:text-surface-300">
                          ${lineTotal.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="p-1 text-surface-400 hover:text-red-500 rounded transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tax and Total */}
          <div className="flex justify-end">
            <div className="w-72 space-y-2">
              <div className="flex justify-between text-sm text-surface-500">
                <span>Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-surface-500">
                <span>Tax</span>
                <div className="w-28">
                  <Input
                    type="number"
                    step="0.01"
                    {...register('taxAmount')}
                    className="text-sm text-right h-8"
                    min={0}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-surface-500">
                <span>Discount</span>
                <div className="w-28">
                  <Input
                    type="number"
                    step="0.01"
                    {...register('discountAmount')}
                    className="text-sm text-right h-8"
                    min={0}
                  />
                </div>
              </div>
              <div className="flex justify-between text-base font-bold text-surface-900 dark:text-white pt-2 border-t border-surface-200 dark:border-surface-700">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block mb-1.5 text-sm font-semibold text-surface-700 dark:text-surface-300">Notes</label>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="Optional payment terms or notes..."
              className="flex w-full rounded-md border border-surface-200 bg-white px-3 py-2 text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-surface-700 dark:bg-surface-900 dark:text-white resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" isLoading={isLoading}>Create Invoice</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
