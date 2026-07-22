import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../services/reportsApi';
import { AnalyticsTable } from '@/components/analytics/AnalyticsTable';
import { FilterPanel } from '@/components/analytics/FilterPanel';
import { ExportButton } from '@/components/analytics/ExportButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const REPORT_TYPES = [
  { id: 'fleet', label: 'Fleet Status' },
  { id: 'drivers', label: 'Driver Activity' },
  { id: 'trips', label: 'Trip Logs' },
  { id: 'fuel', label: 'Fuel Logs' },
  { id: 'maintenance', label: 'Maintenance Logs' },
  { id: 'expenses', label: 'Expense Logs' },
  { id: 'billing', label: 'Billing Invoices' },
];

export default function ReportsPage() {
  const [reportType, setReportType] = useState('fleet');
  const [filters, setFilters] = useState<Record<string, string>>({});

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['reports', reportType, filters],
    queryFn: () => reportsApi.getReport(reportType, filters),
  });

  const handleFilterChange = (id: string, value: string) => {
    setFilters(prev => ({ ...prev, [id]: value }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  // Generate dynamic columns based on report data
  const generateColumns = () => {
    if (!reportData || reportData.length === 0) return [];
    
    // Simplistic column generation for demonstration
    // Ideally you define specific column definitions per report type
    return Object.keys(reportData[0])
      .filter(key => typeof reportData[0][key] !== 'object')
      .map(key => ({
        accessorKey: key,
        header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
        cell: (info: any) => {
          const val = info.getValue();
          if (val instanceof Date || (typeof val === 'string' && val.includes('T') && val.endsWith('Z'))) {
            return new Date(val).toLocaleDateString();
          }
          return val;
        }
      }));
  };

  const filterConfigs = [
    {
      id: 'status',
      label: 'Status',
      options: [
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Pending', value: 'PENDING' },
        { label: 'Completed', value: 'COMPLETED' },
      ],
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Operational Reports</h1>
        
        <div className="flex items-center space-x-2">
          <select 
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="flex h-9 w-[200px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          >
            {REPORT_TYPES.map(rt => (
              <option key={rt.id} value={rt.id}>{rt.label}</option>
            ))}
          </select>
          <ExportButton data={reportData || []} filename={`${reportType}-report.csv`} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <FilterPanel 
            filters={filterConfigs} 
            onFilterChange={handleFilterChange} 
            onClear={handleClearFilters} 
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{REPORT_TYPES.find(r => r.id === reportType)?.label} Data</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading report data...</div>
          ) : (
            <AnalyticsTable 
              columns={generateColumns()} 
              data={reportData || []} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
