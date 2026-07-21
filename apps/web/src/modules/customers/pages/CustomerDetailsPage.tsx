import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import { useCustomer } from '../hooks/useCustomers';
import { Badge } from '@/components/ui/Badge';

export function CustomerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: customer, isLoading, error } = useCustomer(id || '');

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-surface-900">Customer not found</h2>
        <Link to="/customers" className="text-primary-600 hover:underline mt-4 inline-block">
          Back to Customers
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          to="/customers" 
          className="p-2 hover:bg-surface-200 dark:hover:bg-surface-800 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-surface-500" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{customer.name}</h1>
            <Badge variant={customer.status === 'ACTIVE' ? 'success' : 'secondary'}>
              {customer.status}
            </Badge>
          </div>
          <p className="text-sm text-surface-500 mt-1">ID: {customer.customerNumber}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {/* Overview Card */}
          <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6">
            <h2 className="text-lg font-semibold mb-4">Overview</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-surface-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Type</p>
                  <p className="text-sm text-surface-600 dark:text-surface-400 capitalize">{customer.type.toLowerCase()}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-surface-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <a href={`mailto:${customer.email}`} className="text-sm text-primary-600 hover:underline">
                    {customer.email}
                  </a>
                </div>
              </div>

              {customer.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-surface-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <a href={`tel:${customer.phone}`} className="text-sm text-primary-600 hover:underline">
                      {customer.phone}
                    </a>
                  </div>
                </div>
              )}

              {(customer.city || customer.country) && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-surface-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-surface-600 dark:text-surface-400">
                      {[customer.city, customer.country].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Recent Trips placeholder */}
          <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Recent Trips</h2>
              <span className="text-sm text-surface-500">{customer._count?.trips || 0} Total</span>
            </div>
            {customer.trips && customer.trips.length > 0 ? (
              <div className="space-y-4">
                {customer.trips.map((trip: any) => (
                  <div key={trip.id} className="flex justify-between items-center p-4 bg-surface-50 dark:bg-surface-800/50 rounded-lg">
                    <div>
                      <p className="font-medium">{trip.tripNumber}</p>
                      <p className="text-sm text-surface-500">{new Date(trip.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Badge>{trip.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-surface-500 py-8">No trips found for this customer.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
