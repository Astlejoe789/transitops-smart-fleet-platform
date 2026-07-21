import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Building2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CustomerType, CustomerStatus } from '../types';

const customerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  type: z.nativeEnum(CustomerType),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  status: z.nativeEnum(CustomerStatus),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<CustomerFormData>) => void;
  initialData?: any;
  isLoading?: boolean;
}

export function CustomerFormModal({ isOpen, onClose, onSubmit, initialData, isLoading }: CustomerFormModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialData || {
      status: CustomerStatus.ACTIVE,
      type: CustomerType.CORPORATE,
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl bg-surface-50 dark:bg-surface-900 rounded-xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 dark:border-surface-700">
          <h2 className="text-xl font-semibold">{initialData ? 'Edit Customer' : 'Add New Customer'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-200 dark:hover:bg-surface-800 rounded-full transition-colors">
            <X className="h-5 w-5 text-surface-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-surface-500 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Company Details
              </h3>
              
              <div>
                <label className="block mb-1 text-sm font-medium">Customer Name</label>
                <Input {...register('name')} error={!!errors.name} placeholder="Acme Corp" />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Customer Type</label>
                <select 
                  {...register('type')} 
                  className="flex h-10 w-full rounded-md border border-surface-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-700 dark:bg-surface-900"
                >
                  {Object.values(CustomerType).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">Status</label>
                <select 
                  {...register('status')} 
                  className="flex h-10 w-full rounded-md border border-surface-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-700 dark:bg-surface-900"
                >
                  {Object.values(CustomerStatus).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-surface-500 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Info
              </h3>
              
              <div>
                <label className="block mb-1 text-sm font-medium">Email Address</label>
                <Input {...register('email')} error={!!errors.email} placeholder="contact@acme.com" />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Phone</label>
                <Input {...register('phone')} error={!!errors.phone} placeholder="+1 234 567 890" />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">City</label>
                <Input {...register('city')} error={!!errors.city} placeholder="New York" />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Country</label>
                <Input {...register('country')} error={!!errors.country} placeholder="United States" />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {initialData ? 'Update Customer' : 'Add Customer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
