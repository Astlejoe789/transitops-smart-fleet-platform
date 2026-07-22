import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterConfig {
  id: string;
  label: string;
  options: FilterOption[];
}

interface FilterPanelProps {
  filters: FilterConfig[];
  onFilterChange: (filterId: string, value: string) => void;
  onClear: () => void;
  className?: string;
}

export function FilterPanel({ filters, onFilterChange, onClear, className }: FilterPanelProps) {
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>({});

  const handleChange = (id: string, value: string) => {
    setSelectedValues((prev) => ({ ...prev, [id]: value }));
    onFilterChange(id, value);
  };

  const handleClear = () => {
    setSelectedValues({});
    onClear();
  };

  return (
    <div className={`p-4 bg-card border rounded-md shadow-sm ${className || ''}`}>
      <div className="flex flex-col sm:flex-row gap-4 items-end flex-wrap">
        {filters.map((filter) => (
          <div key={filter.id} className="flex flex-col space-y-1 w-full sm:w-48">
            <label className="text-xs font-medium text-muted-foreground">{filter.label}</label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedValues[filter.id] || ''}
              onChange={(e) => handleChange(filter.id, e.target.value)}
            >
              <option value="">All</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={handleClear} className="h-9">
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
