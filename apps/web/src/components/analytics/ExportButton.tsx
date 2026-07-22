import { Button } from '@/components/ui/Button';
import { DownloadIcon } from 'lucide-react';

interface ExportButtonProps {
  data: any[];
  filename?: string;
  columns?: { key: string; label: string }[];
}

export function ExportButton({ data, filename = 'export.csv', columns }: ExportButtonProps) {
  const handleExport = () => {
    if (!data || data.length === 0) return;

    // Get headers
    let headers: string[] = [];
    if (columns) {
      headers = columns.map(c => c.label);
    } else {
      headers = Object.keys(data[0]);
    }

    // Convert data to CSV format
    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = columns 
        ? columns.map(c => {
            const val = row[c.key] !== undefined && row[c.key] !== null ? row[c.key] : '';
            return `"${String(val).replace(/"/g, '""')}"`;
          })
        : Object.values(row).map(val => {
            const safeVal = val !== undefined && val !== null ? val : '';
            return `"${String(safeVal).replace(/"/g, '""')}"`;
          });
      csvRows.push(values.join(','));
    }

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <DownloadIcon className="mr-2 h-4 w-4" />
      Export CSV
    </Button>
  );
}
