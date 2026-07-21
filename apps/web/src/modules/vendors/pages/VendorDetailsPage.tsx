import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Star, Wrench } from 'lucide-react';
import { useVendor } from '../hooks/useVendors';
import { Badge } from '@/components/ui/Badge';

export function VendorDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: vendor, isLoading, error } = useVendor(id || '');

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-surface-900">Vendor not found</h2>
        <Link to="/vendors" className="text-primary-600 hover:underline mt-4 inline-block">
          Back to Vendors
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          to="/vendors" 
          className="p-2 hover:bg-surface-200 dark:hover:bg-surface-800 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-surface-500" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{vendor.name}</h1>
            <Badge variant={vendor.status === 'ACTIVE' ? 'success' : 'secondary'}>
              {vendor.status}
            </Badge>
          </div>
          <p className="text-sm text-surface-500 mt-1">ID: {vendor.vendorNumber}</p>
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
                  <p className="text-sm text-surface-600 dark:text-surface-400 capitalize">{vendor.type.replace('_', ' ').toLowerCase()}</p>
                </div>
              </div>
              
              {vendor.email && (
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-surface-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <a href={`mailto:${vendor.email}`} className="text-sm text-primary-600 hover:underline">
                      {vendor.email}
                    </a>
                  </div>
                </div>
              )}

              {vendor.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-surface-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <a href={`tel:${vendor.phone}`} className="text-sm text-primary-600 hover:underline">
                      {vendor.phone}
                    </a>
                  </div>
                </div>
              )}

              {(vendor.city || vendor.country) && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-surface-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-surface-600 dark:text-surface-400">
                      {[vendor.city, vendor.country].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Recent Maintenance (if applicable) */}
          <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Recent Services / Maintenance</h2>
              <span className="text-sm text-surface-500">{vendor._count?.maintenanceLogs || 0} Total</span>
            </div>
            {vendor.maintenanceLogs && vendor.maintenanceLogs.length > 0 ? (
              <div className="space-y-4">
                {vendor.maintenanceLogs.map((log: any) => (
                  <div key={log.id} className="flex justify-between items-center p-4 bg-surface-50 dark:bg-surface-800/50 rounded-lg border border-surface-200 dark:border-surface-700">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Wrench className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{(log.vehicle as any)?.plateNumber || 'Unknown Vehicle'}</p>
                        <p className="text-xs text-surface-500 mt-1">{log.serviceType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge>{log.status}</Badge>
                      <p className="text-xs text-surface-500 mt-2">{new Date(log.scheduledDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-surface-500 py-8">No records found for this vendor.</p>
            )}
          </div>
          
          {/* Ratings Summary (if applicable) */}
          <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Ratings & Reviews</h2>
              <span className="text-sm text-surface-500">{vendor._count?.ratings || 0} Reviews</span>
            </div>
            {vendor.ratings && vendor.ratings.length > 0 ? (
              <div className="space-y-4">
                {vendor.ratings.map((rating: any) => (
                  <div key={rating.id} className="p-4 bg-surface-50 dark:bg-surface-800/50 rounded-lg border border-surface-200 dark:border-surface-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-medium">{rating.overall.toFixed(1)}</span>
                      </div>
                      <span className="text-xs text-surface-500">{new Date(rating.createdAt).toLocaleDateString()}</span>
                    </div>
                    {rating.reviewNotes && (
                      <p className="text-sm text-surface-600 dark:text-surface-400 mt-2">"{rating.reviewNotes}"</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-surface-500 py-8">No ratings provided yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
