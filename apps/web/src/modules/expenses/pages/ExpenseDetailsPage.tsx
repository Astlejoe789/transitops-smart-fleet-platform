import { useParams, useNavigate } from 'react-router-dom';
import { useExpense } from '../hooks/useExpenses';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, DollarSign, Calendar, User, Truck, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

export function ExpenseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: expense, isLoading, error } = useExpense(id!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 rounded-full border-primary-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
        <h2 className="text-xl font-bold text-surface-900 dark:text-white">Expense Not Found</h2>
        <Button className="mt-4" onClick={() => navigate('/expenses')}>Back to Expenses</Button>
      </div>
    );
  }

const getStatusColor = (status: string): 'default' | 'success' | 'warning' | 'destructive' | 'secondary' => {
    switch (status) {
      case 'DRAFT': return 'secondary';
      case 'SUBMITTED': return 'warning';
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'destructive';
      case 'PAID': return 'success';
      default: return 'default';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/expenses')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
              {expense.expenseNumber}
            </h1>
            <Badge variant={getStatusColor(expense.status)}>{expense.status}</Badge>
          </div>
          <p className="mt-1 text-sm text-surface-500">
            Created on {format(new Date(expense.createdAt), 'MMM d, yyyy')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Details */}
        <div className="space-y-6 lg:col-span-2">
          <div className="p-6 bg-white border shadow-sm dark:bg-surface-900 rounded-xl border-surface-200 dark:border-surface-800">
            <h2 className="mb-4 text-lg font-semibold text-surface-900 dark:text-white">Expense Details</h2>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                <div className="flex items-center gap-2 mb-1 text-sm font-medium text-surface-500">
                  <DollarSign className="w-4 h-4" />
                  Amount
                </div>
                <div className="text-2xl font-bold text-surface-900 dark:text-white">
                  {formatCurrency(expense.amount)} {expense.currency}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                <div className="flex items-center gap-2 mb-1 text-sm font-medium text-surface-500">
                  <Calendar className="w-4 h-4" />
                  Expense Date
                </div>
                <div className="text-lg font-medium text-surface-900 dark:text-white">
                  {format(new Date(expense.expenseDate), 'MMM d, yyyy h:mm a')}
                </div>
              </div>

              <div>
                <label className="block text-sm text-surface-500">Category</label>
                <div className="mt-1 font-medium capitalize text-surface-900 dark:text-white">
                  {expense.category.replace(/_/g, ' ').toLowerCase()}
                </div>
              </div>

              <div>
                <label className="block text-sm text-surface-500">Payment Method</label>
                <div className="mt-1 font-medium capitalize text-surface-900 dark:text-white">
                  {expense.paymentMethod.replace(/_/g, ' ').toLowerCase()}
                </div>
              </div>

              <div>
                <label className="block text-sm text-surface-500">Vendor</label>
                <div className="mt-1 font-medium text-surface-900 dark:text-white">
                  {expense.vendorName || '-'}
                </div>
              </div>

              <div>
                <label className="block text-sm text-surface-500">Reference / Receipt No</label>
                <div className="mt-1 font-medium text-surface-900 dark:text-white">
                  {expense.referenceNumber || expense.receiptNumber || '-'}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-surface-500">Description</label>
                <div className="mt-1 text-surface-900 dark:text-white">
                  {expense.description || '-'}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-surface-500">Notes</label>
                <div className="mt-1 p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50 text-surface-900 dark:text-white min-h-[60px]">
                  {expense.notes || 'No additional notes provided.'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="p-6 bg-white border shadow-sm dark:bg-surface-900 rounded-xl border-surface-200 dark:border-surface-800">
            <h2 className="mb-4 text-lg font-semibold text-surface-900 dark:text-white">Associations</h2>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 mb-1 text-sm text-surface-500">
                  <Truck className="w-4 h-4" />
                  Vehicle
                </label>
                {expense.vehicle ? (
                  <div className="font-medium text-surface-900 dark:text-white">
                    {expense.vehicle.plateNumber} ({expense.vehicle.make} {expense.vehicle.model})
                  </div>
                ) : (
                  <div className="text-sm italic text-surface-400">None attached</div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 mb-1 text-sm text-surface-500">
                  <User className="w-4 h-4" />
                  Driver
                </label>
                {expense.driver ? (
                  <div className="font-medium text-surface-900 dark:text-white">
                    {expense.driver.user?.firstName} {expense.driver.user?.lastName}
                  </div>
                ) : (
                  <div className="text-sm italic text-surface-400">None attached</div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 mb-1 text-sm text-surface-500">
                  <Clock className="w-4 h-4" />
                  Trip
                </label>
                {expense.trip ? (
                  <div className="font-medium text-surface-900 dark:text-white">
                    {expense.trip.tripNumber}
                  </div>
                ) : (
                  <div className="text-sm italic text-surface-400">None attached</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white border shadow-sm dark:bg-surface-900 rounded-xl border-surface-200 dark:border-surface-800">
            <h2 className="mb-4 text-lg font-semibold text-surface-900 dark:text-white">Audit</h2>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 mb-1 text-sm text-surface-500">
                  <User className="w-4 h-4" />
                  Created By
                </label>
                <div className="font-medium text-surface-900 dark:text-white">
                  {expense.createdBy?.firstName} {expense.createdBy?.lastName}
                </div>
              </div>
              
              {expense.approvedBy && (
                <div>
                  <label className="flex items-center gap-2 mb-1 text-sm text-surface-500">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Approved By
                  </label>
                  <div className="font-medium text-surface-900 dark:text-white">
                    {expense.approvedBy.firstName} {expense.approvedBy.lastName}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
