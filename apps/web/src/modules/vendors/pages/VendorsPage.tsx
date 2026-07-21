import { useState } from 'react';
import { Plus, Search, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { VendorsTable } from '../components/VendorsTable';
import { VendorFormModal } from '../components/VendorFormModal';
import { useVendors, useCreateVendor, useUpdateVendor, useDeleteVendor } from '../hooks/useVendors';
import { Vendor } from '../types';

export function VendorsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: vendorsResponse, isLoading } = useVendors({ search: searchQuery });
  const createVendor = useCreateVendor();
  const updateVendor = useUpdateVendor();
  const deleteVendor = useDeleteVendor();

  const handleCreate = async (data: any) => {
    await createVendor.mutateAsync(data);
    setIsModalOpen(false);
  };

  const handleUpdate = async (data: any) => {
    if (selectedVendor) {
      await updateVendor.mutateAsync({ id: selectedVendor.id, data });
      setIsModalOpen(false);
      setSelectedVendor(null);
    }
  };

  const handleDelete = async (vendor: Vendor) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      await deleteVendor.mutateAsync(vendor.id);
    }
  };

  const openEditModal = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Vendors</h1>
          <p className="text-sm text-surface-500 mt-1">Manage your suppliers and service providers</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={() => {
              setSelectedVendor(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Vendor
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-400" />
          <Input 
            placeholder="Search vendors..." 
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <VendorsTable 
          data={vendorsResponse?.data || []} 
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      )}

      <VendorFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVendor(null);
        }}
        onSubmit={selectedVendor ? handleUpdate : handleCreate}
        initialData={selectedVendor}
        isLoading={createVendor.isPending || updateVendor.isPending}
      />
    </div>
  );
}
