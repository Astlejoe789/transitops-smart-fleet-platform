import React, { useState } from 'react';
import { Receipt, Plus, Search, MoreHorizontal, Download } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  DRAFT:    { label: 'Draft',          color: '#64748b', bg: 'hsl(222 47% 12%)' },
  PENDING:  { label: 'Pending Review', color: '#F59E0B', bg: 'hsl(38 50% 10%)' },
  APPROVED: { label: 'Approved',       color: '#10B981', bg: 'hsl(160 40% 10%)' },
  REJECTED: { label: 'Rejected',       color: '#ef4444', bg: 'hsl(0 40% 12%)' },
};

const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  FUEL:        { label: 'Fuel',              color: '#1a8fff' },
  MAINTENANCE: { label: 'Maintenance',       color: '#a78bfa' },
  TOLL:        { label: 'Toll',              color: '#F59E0B' },
  PARKING:     { label: 'Parking',           color: '#10B981' },
  LOADING:     { label: 'Loading/Unloading', color: '#64748b' },
  OTHER:       { label: 'Other',             color: '#94a3b8' },
};

import { getExpenses, addExpense, type Expense } from '@/api/expenses.api';
import { AddExpenseModal } from '../components/AddExpenseModal';


export default function ExpensesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  React.useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const data = await getExpenses();
    setExpenses(data);
  };

  const handleAddExpense = async (expenseData: Partial<Expense>) => {
    const newExpense = await addExpense(expenseData);
    if (newExpense) {
      setExpenses(prev => [...prev, newExpense]);
    }
  };

  const filtered = expenses.filter(e =>
    (e.id.toLowerCase().includes(search.toLowerCase()) ||
     e.description.toLowerCase().includes(search.toLowerCase()) ||
     (e as any).driver?.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === 'ALL' || (e as any).status === statusFilter)
  );

  const totalApproved = expenses.filter(e => (e as any).status === 'APPROVED').reduce((a, e) => a + e.amount, 0);
  const totalPending = expenses.filter(e => (e as any).status === 'PENDING').reduce((a, e) => a + e.amount, 0);

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <section className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div>
          <p className="mb-1 text-sm text-muted-foreground">Finance & Operations</p>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Expenses</h1>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm">
          <Plus className="h-4 w-4" /> Add Expense
        </button>
      </section>

      {/* KPIs */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Expense metrics">
        {[
          { label: 'Total Expenses (MTD)', value: `₹${((totalApproved + totalPending)/1000).toFixed(1)}K` },
          { label: 'Approved', value: `₹${(totalApproved/1000).toFixed(1)}K` },
          { label: 'Pending Review', value: `₹${(totalPending/1000).toFixed(1)}K` },
          { label: 'Expense Entries', value: `${expenses.length}` },
        ].map(k => (
          <article key={k.label} className="rounded-lg border bg-card p-5 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">{k.label}</p>
            <p className="font-display text-2xl font-bold mt-2">{k.value}</p>
          </article>
        ))}
      </section>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {[
          { label: 'All', filter: 'ALL' },
          { label: 'Pending', filter: 'PENDING' },
          { label: 'Approved', filter: 'APPROVED' },
        ].map(c => (
          <button key={c.filter} onClick={() => setStatusFilter(c.filter)}
            className={`h-8 px-3.5 rounded-lg border text-xs font-semibold transition-colors ${
              statusFilter === c.filter
                ? 'border-primary bg-secondary text-primary'
                : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}>
            {c.label}
          </button>
        ))}
        <div className="flex-1" />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search expenses..."
            className="w-full h-8 w-[220px] pl-8 pr-3 text-sm bg-muted/50 border border-border rounded-lg outline-none focus:ring-2 focus:ring-ring/30 text-foreground placeholder:text-muted-foreground" />
        </div>
        <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-input bg-card text-xs font-medium text-muted-foreground hover:bg-accent transition-colors shadow-sm">
          <Download className="h-3.5 w-3.5" /> Export
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-muted/60 text-[11px] uppercase text-muted-foreground">
              <tr>
                {['Expense ID', 'Category', 'Description', 'Trip', 'Driver', 'Date', 'Amount', 'Status', ''].map(h => (
                  <th key={h} className="px-5 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => {
                const s = STATUS_CONFIG[(e as any).status] || STATUS_CONFIG.PENDING;
                const c = CATEGORY_CONFIG[e.category] || CATEGORY_CONFIG.OTHER;
                return (
                  <tr key={e.id} className="border-t border-border hover:bg-muted/30 transition-colors group">
                    <td className="px-5 py-3.5 font-bold font-mono text-primary text-xs">{e.id.slice(0,8)}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-bold" style={{ color: c.color }}>{c.label}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs text-muted-foreground max-w-[200px] truncate">{e.description}</p>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-primary">{(e as any).trip || '—'}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{(e as any).driver || '—'}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{e.date}</td>
                    <td className="px-5 py-3.5 text-xs font-bold">₹{e.amount.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-semibold"
                        style={{ color: s.color, background: s.bg }}>
                        <span className="size-1.5 rounded-full" style={{ background: s.color }} />
                        {s.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Receipt className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-sm">No expenses found.</p>
          </div>
        )}
      </div>
      <AddExpenseModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddExpense} />
    </div>
  );
}
