import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, differenceInDays } from 'date-fns';
import {
  FileText,
  Plus,
  Trash2,
  ExternalLink,
  Upload,
  AlertTriangle,
  CheckCircle,
  XCircle,
  File,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { useDriverDocuments, useAddDriverDocument, useDeleteDriverDocument } from '../hooks/useDrivers';
import { documentFormSchema, type DocumentFormData } from '../schemas/driverSchema';

interface DriverDocumentsProps {
  driverId: string;
}

const DOCUMENT_TYPES = [
  { value: 'DRIVER_LICENSE', label: 'Driver License' },
  { value: 'GOVERNMENT_ID', label: 'Government ID' },
  { value: 'MEDICAL_CERTIFICATE', label: 'Medical Certificate' },
  { value: 'POLICE_VERIFICATION', label: 'Police Verification' },
  { value: 'EXPERIENCE_CERTIFICATE', label: 'Experience Certificate' },
  { value: 'TRAINING_CERTIFICATE', label: 'Training Certificate' },
  { value: 'INSURANCE', label: 'Insurance' },
  { value: 'OTHER', label: 'Other' },
];

const DOC_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  DOCUMENT_TYPES.map((d) => [d.value, d.label]),
);

function getExpiryStatus(expiryDate?: string | null) {
  if (!expiryDate) return null;
  const days = differenceInDays(new Date(expiryDate), new Date());
  if (days < 0) return { icon: XCircle, color: 'text-red-500', label: 'Expired' };
  if (days <= 30) return { icon: AlertTriangle, color: 'text-amber-500', label: `${days}d left` };
  return { icon: CheckCircle, color: 'text-emerald-500', label: format(new Date(expiryDate), 'MMM dd, yyyy') };
}

export function DriverDocuments({ driverId }: DriverDocumentsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);

  const { data: documents = [], isLoading } = useDriverDocuments(driverId);
  const addMutation = useAddDriverDocument(driverId);
  const deleteMutation = useDeleteDriverDocument(driverId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DocumentFormData>({
    resolver: zodResolver(documentFormSchema),
  });

  const handleAdd = async (data: DocumentFormData) => {
    try {
      await addMutation.mutateAsync({
        title: data.title,
        documentType: data.documentType,
        fileUrl: data.fileUrl,
        issuedDate: data.issuedDate || null,
        expiryDate: data.expiryDate || null,
      } as any);
      reset();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to add document', err);
    }
  };

  const handleDelete = async (docId: string) => {
    try {
      await deleteMutation.mutateAsync(docId);
      setDeletingDocId(null);
    } catch (err) {
      console.error('Failed to delete document', err);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-lg bg-surface-100 dark:bg-surface-800"
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-surface-900 dark:text-white">Documents</h3>
          <p className="text-xs text-surface-500">{documents.length} document{documents.length !== 1 ? 's' : ''} attached</p>
        </div>
        <Button size="sm" onClick={() => setIsModalOpen(true)} id="add-document-btn">
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add Document
        </Button>
      </div>

      {/* Document List */}
      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-surface-200 py-10 dark:border-surface-700">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-100 dark:bg-surface-800">
            <FileText className="h-6 w-6 text-surface-400" />
          </div>
          <p className="mt-3 font-medium text-surface-700 dark:text-surface-300">No documents yet</p>
          <p className="mt-1 text-sm text-surface-500">
            Add important driver documents like license, medical cert, etc.
          </p>
          <Button size="sm" variant="outline" className="mt-4" onClick={() => setIsModalOpen(true)}>
            <Upload className="mr-1.5 h-3.5 w-3.5" />
            Upload Document
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {documents.map((doc) => {
            const expiryStatus = getExpiryStatus(doc.expiryDate);
            const ExpiryIcon = expiryStatus?.icon;

            return (
              <div
                key={doc.id}
                className="group flex items-start gap-3 rounded-lg border border-surface-200 bg-surface-50 p-4 transition-colors hover:border-primary-300 hover:bg-primary-50 dark:border-surface-700 dark:bg-surface-800/50 dark:hover:border-primary-700 dark:hover:bg-primary-950/20"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-surface-800">
                  <File className="h-5 w-5 text-primary-500" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-surface-900 dark:text-white">{doc.title}</p>
                      <Badge variant="secondary" className="mt-0.5 text-xs">
                        {DOC_TYPE_LABELS[doc.documentType] ?? doc.documentType}
                      </Badge>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-7 w-7 items-center justify-center rounded text-surface-400 hover:bg-white hover:text-primary-600 dark:hover:bg-surface-700 dark:hover:text-primary-400"
                        title="View Document"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <button
                        onClick={() => setDeletingDocId(doc.id)}
                        className="flex h-7 w-7 items-center justify-center rounded text-surface-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-950/30"
                        title="Delete Document"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {expiryStatus && ExpiryIcon && (
                    <div className={`mt-1.5 flex items-center gap-1 text-xs ${expiryStatus.color}`}>
                      <ExpiryIcon className="h-3 w-3" />
                      <span>{expiryStatus.label}</span>
                    </div>
                  )}

                  {doc.issuedDate && (
                    <p className="mt-0.5 text-xs text-surface-400">
                      Issued: {format(new Date(doc.issuedDate), 'MMM dd, yyyy')}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Document Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); reset(); }}
        title="Add Document"
        description="Upload or link a driver document."
      >
        <form onSubmit={handleSubmit(handleAdd)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
              Document Title *
            </label>
            <Input {...register('title')} placeholder="e.g. Driver License Front" error={!!errors.title} />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
              Document Type *
            </label>
            <Select {...register('documentType')} error={!!errors.documentType}>
              <option value="">Select type...</option>
              {DOCUMENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </Select>
            {errors.documentType && <p className="text-xs text-red-500">{errors.documentType.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
              File URL *
            </label>
            <Input
              {...register('fileUrl')}
              placeholder="https://example.com/document.pdf"
              error={!!errors.fileUrl}
            />
            {errors.fileUrl && <p className="text-xs text-red-500">{errors.fileUrl.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                Issued Date
              </label>
              <Input type="date" {...register('issuedDate')} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                Expiry Date
              </label>
              <Input type="date" {...register('expiryDate')} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => { setIsModalOpen(false); reset(); }}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting || addMutation.isPending}>
              Add Document
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingDocId}
        onClose={() => setDeletingDocId(null)}
        title="Delete Document"
        description="Are you sure you want to delete this document? This action cannot be undone."
      >
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeletingDocId(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            isLoading={deleteMutation.isPending}
            onClick={() => deletingDocId && handleDelete(deletingDocId)}
          >
            Delete Document
          </Button>
        </div>
      </Modal>
    </div>
  );
}
