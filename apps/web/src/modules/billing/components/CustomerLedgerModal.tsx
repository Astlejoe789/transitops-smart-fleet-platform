import { Modal } from '@/components/ui/Modal';
import { useCustomerLedger } from '../hooks/useInvoices';
import { format } from 'date-fns';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface CustomerLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
  customerName: string;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amount);
}

export function CustomerLedgerModal({ isOpen, onClose, customerId, customerName }: CustomerLedgerModalProps) {
  const { data, isLoading } = useCustomerLedger(customerId);

  const ledgerEntries = data?.data || [];

  let balance = 0;
  const entriesWithBalance = ledgerEntries.map(entry => {
    if (entry.type === 'INVOICE') {
      balance += entry.amount;
    } else {
      balance -= entry.amount;
    }
    return { ...entry, runningBalance: balance };
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Ledger: ${customerName}`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-surface-50 dark:bg-surface-800/50 p-4 rounded-xl border border-surface-200 dark:border-surface-700">
          <div>
            <p className="text-sm text-surface-500 font-medium">Current Balance</p>
            <p className={`text-2xl font-bold mt-1 ${balance > 0 ? 'text-danger-600' : balance < 0 ? 'text-emerald-600' : 'text-surface-900 dark:text-white'}`}>
              {formatCurrency(balance)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-surface-500 font-medium">Total Entries</p>
            <p className="text-lg font-bold text-surface-900 dark:text-white mt-1">{ledgerEntries.length}</p>
          </div>
        </div>

        <div className="border border-surface-200 dark:border-surface-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto max-h-[400px]">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-surface-50 dark:bg-surface-800/50 sticky top-0 z-10 shadow-sm border-b border-surface-200 dark:border-surface-800">
                <tr>
                  <th className="px-4 py-3 font-semibold text-surface-900 dark:text-white">Date</th>
                  <th className="px-4 py-3 font-semibold text-surface-900 dark:text-white">Type</th>
                  <th className="px-4 py-3 font-semibold text-surface-900 dark:text-white">Reference</th>
                  <th className="px-4 py-3 font-semibold text-surface-900 dark:text-white text-right">Debit (Invoice)</th>
                  <th className="px-4 py-3 font-semibold text-surface-900 dark:text-white text-right">Credit (Payment)</th>
                  <th className="px-4 py-3 font-semibold text-surface-900 dark:text-white text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-800 bg-white dark:bg-surface-900">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-surface-500">
                      Loading ledger data...
                    </td>
                  </tr>
                ) : entriesWithBalance.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-surface-500">
                      No financial history found for this customer.
                    </td>
                  </tr>
                ) : (
                  entriesWithBalance.map((entry, index) => (
                    <tr key={`${entry.id}-${index}`} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                      <td className="px-4 py-3 text-surface-600 dark:text-surface-300">
                        {format(new Date(entry.date), 'MMM d, yyyy')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {entry.type === 'INVOICE' ? (
                            <div className="flex items-center gap-1.5 text-danger-600 dark:text-danger-400">
                              <ArrowUpRight className="h-4 w-4" />
                              <span className="font-medium">Invoice</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                              <ArrowDownRight className="h-4 w-4" />
                              <span className="font-medium">Payment</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-surface-900 dark:text-white">
                        {entry.reference}
                        <span className="ml-2 text-xs text-surface-400">({entry.status})</span>
                      </td>
                      <td className="px-4 py-3 text-right text-surface-900 dark:text-white">
                        {entry.type === 'INVOICE' ? formatCurrency(entry.amount) : '-'}
                      </td>
                      <td className="px-4 py-3 text-right text-surface-900 dark:text-white">
                        {entry.type === 'PAYMENT' ? formatCurrency(entry.amount) : '-'}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-surface-900 dark:text-white">
                        {formatCurrency(entry.runningBalance)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium text-surface-700 bg-surface-100 hover:bg-surface-200 dark:text-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
