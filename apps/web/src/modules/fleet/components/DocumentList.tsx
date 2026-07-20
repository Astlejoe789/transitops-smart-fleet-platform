import { useState } from 'react';
import { FileText, Plus, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';
import { useVehicleDocuments, useAddDocument, useDeleteDocument } from '../hooks/useFleet';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useForm } from 'react-hook-form';

interface DocumentListProps {
  vehicleId: string;
}

export function DocumentList({ vehicleId }: DocumentListProps) {
  const { data: documents, isLoading } = useVehicleDocuments(vehicleId);
  const deleteMutation = useDeleteDocument(vehicleId);
  const addMutation = useAddDocument(vehicleId);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await addMutation.mutateAsync({
        title: data.title,
        documentType: data.documentType,
        fileUrl: data.fileUrl || 'https://example.com/dummy.pdf', // Using dummy for MVP
        issuedDate: data.issuedDate || undefined,
        expiryDate: data.expiryDate || undefined,
      });
      setIsAddModalOpen(false);
      reset();
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-surface-500">Loading documents...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Vehicle Documents</h3>
        <Button onClick={() => setIsAddModalOpen(true)} size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add Document
        </Button>
      </div>

      {!documents || documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-surface-300 py-12 dark:border-surface-700">
          <FileText className="mb-4 h-12 w-12 text-surface-400" />
          <h4 className="text-sm font-medium text-surface-900 dark:text-white">No documents uploaded</h4>
          <p className="mt-1 text-xs text-surface-500">Upload registration, insurance, and compliance documents.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => {
            const isExpired = doc.expiryDate && new Date(doc.expiryDate) < new Date();
            
            return (
              <div key={doc.id} className="relative flex flex-col rounded-xl border border-surface-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-surface-800 dark:bg-surface-900">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  {isExpired && <Badge variant="destructive">Expired</Badge>}
                </div>
                
                <h4 className="font-medium text-surface-900 dark:text-white">{doc.title}</h4>
                <p className="mb-4 text-xs text-surface-500">{doc.documentType.replace('_', ' ')}</p>
                
                <div className="mt-auto space-y-2 text-xs text-surface-600 dark:text-surface-400">
                  {doc.issuedDate && (
                    <div className="flex justify-between">
                      <span>Issued:</span>
                      <span className="font-medium">{format(new Date(doc.issuedDate), 'MMM dd, yyyy')}</span>
                    </div>
                  )}
                  {doc.expiryDate && (
                    <div className="flex justify-between">
                      <span>Expires:</span>
                      <span className={`font-medium ${isExpired ? 'text-red-500' : ''}`}>
                        {format(new Date(doc.expiryDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex space-x-2 border-t border-surface-100 pt-4 dark:border-surface-800">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => window.open(doc.fileUrl, '_blank')}>
                    <Download className="mr-2 h-3 w-3" /> View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="shrink-0 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this document?')) {
                        deleteMutation.mutate(doc.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Document"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Title</label>
            <Input {...register('title')} placeholder="e.g. 2026 Registration" required />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium">Document Type</label>
            <Select {...register('documentType')} required>
              <option value="REGISTRATION">Registration</option>
              <option value="INSURANCE">Insurance</option>
              <option value="PERMIT">Permit</option>
              <option value="INSPECTION">Inspection / Fitness</option>
              <option value="OTHER">Other</option>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Issue Date</label>
              <Input type="date" {...register('issuedDate')} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Expiry Date</label>
              <Input type="date" {...register('expiryDate')} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">File URL</label>
            <Input {...register('fileUrl')} placeholder="https://..." />
            <p className="text-xs text-surface-500">For MVP, provide a direct URL to the document.</p>
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting || addMutation.isPending}>Upload</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
