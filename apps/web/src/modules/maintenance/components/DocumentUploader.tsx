import { useState } from 'react';
import { Upload, FileText, Trash2, Link } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAddDocument, useDeleteDocument } from '../hooks/useMaintenance';
import type { MaintenanceLog } from '../types';
import { format } from 'date-fns';

interface DocumentUploaderProps {
  maintenance: MaintenanceLog;
}

export function DocumentUploader({ maintenance }: DocumentUploaderProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    documentType: 'Invoice',
    fileUrl: '',
  });

  const addDocMutation = useAddDocument(maintenance.id);
  const deleteDocMutation = useDeleteDocument(maintenance.id);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDocMutation.mutateAsync(formData);
      setIsAdding(false);
      setFormData({
        title: '',
        documentType: 'Invoice',
        fileUrl: '',
      });
    } catch (error) {
      console.error('Failed to add document', error);
    }
  };

  const docs = maintenance.documents || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-surface-900 dark:text-white">Documents</h3>
          <p className="text-sm text-surface-500">Invoices, service reports, and photos.</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-surface-50 dark:bg-surface-800/50 p-4 rounded-lg border border-surface-200 dark:border-surface-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-surface-700 dark:text-surface-300">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Mechanic Invoice"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-surface-700 dark:text-surface-300">Type</label>
              <select
                className="w-full h-10 px-3 bg-white dark:bg-surface-950 border border-surface-200 dark:border-surface-800 rounded-md text-sm"
                value={formData.documentType}
                onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
              >
                <option value="Invoice">Invoice</option>
                <option value="Report">Service Report</option>
                <option value="Photo">Photo</option>
                <option value="Warranty">Warranty</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-surface-700 dark:text-surface-300">File URL</label>
              <Input
                type="url"
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                placeholder="https://..."
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={addDocMutation.isPending}>
              Save Document
            </Button>
          </div>
        </form>
      )}

      {docs.length === 0 && !isAdding ? (
        <div className="text-center py-12 bg-white dark:bg-surface-950 border border-dashed rounded-lg border-surface-200 dark:border-surface-800">
          <FileText className="w-8 h-8 mx-auto text-surface-400 mb-3" />
          <p className="text-sm font-medium text-surface-900 dark:text-white">No documents uploaded</p>
          <p className="text-sm text-surface-500">Keep track of important maintenance records.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {docs.map((doc) => (
            <div key={doc.id} className="flex flex-col p-4 bg-white dark:bg-surface-950 border rounded-lg border-surface-200 dark:border-surface-800 hover:border-primary-200 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-surface-100 dark:bg-surface-900 rounded-lg text-surface-500">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-surface-900 dark:text-white line-clamp-1" title={doc.title}>
                      {doc.title}
                    </h4>
                    <p className="text-xs text-surface-500">{doc.documentType}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 -mr-2 -mt-2"
                  onClick={() => deleteDocMutation.mutate(doc.id)}
                  disabled={deleteDocMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-auto pt-3 flex items-center justify-between border-t border-surface-100 dark:border-surface-800">
                <span className="text-xs text-surface-400">
                  {format(new Date(doc.createdAt), 'MMM d, yyyy')}
                </span>
                <a 
                  href={doc.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  <Link className="w-3 h-3" />
                  View
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
