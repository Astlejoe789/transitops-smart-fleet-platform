import { useState } from 'react';
import { Plus, Search, Filter, Download, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CustomersTable } from '../components/CustomersTable';
import { CustomerFormModal } from '../components/CustomerFormModal';
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from '../hooks/useCustomers';
import type { Customer } from '../types';
import { PageContainer, PageHeader } from "@/components/layout";
import { EmptyState } from '@/components/ui/EmptyState';

export function CustomersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: customersResponse, isLoading } = useCustomers({ search: searchQuery });
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();

  const handleCreate = async (data: any) => {
    await createCustomer.mutateAsync(data);
    setIsModalOpen(false);
  };

  const handleUpdate = async (data: any) => {
    if (selectedCustomer) {
      await updateCustomer.mutateAsync({ id: selectedCustomer.id, data });
      setIsModalOpen(false);
      setSelectedCustomer(null);
    }
  };

  const handleDelete = async (customer: Customer) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      await deleteCustomer.mutateAsync(customer.id);
    }
  };

  const openEditModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  return (
    <PageContainer className="space-y-6">
      <PageHeader 
                  title="Customers"
                  subtitle="Manage your clients and corporate partners"
                  actions={<>
                    
          <Button variant="outline" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>

          <Button 
                      className="flex items-center gap-2"
                      onClick={() => {
                        setSelectedCustomer(null);
                        setIsModalOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      Add Customer
                    </Button>

                  </>}
                />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-400" />
          <Input 
            placeholder="Search customers..." 
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
      ) : (!customersResponse?.data || customersResponse.data.length === 0) ? (
        <EmptyState
          icon={Users}
          title="No customers yet"
          description="Add your first customer to start managing accounts."
          action={{ label: 'Add Customer', onClick: () => { setSelectedCustomer(null); setIsModalOpen(true); } }}
        />
      ) : (
        <CustomersTable 
          data={customersResponse?.data || []} 
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      )}

      <CustomerFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCustomer(null);
        }}
        onSubmit={selectedCustomer ? handleUpdate : handleCreate}
        initialData={selectedCustomer}
        isLoading={createCustomer.isPending || updateCustomer.isPending}
      />
    </PageContainer>
  );
}
