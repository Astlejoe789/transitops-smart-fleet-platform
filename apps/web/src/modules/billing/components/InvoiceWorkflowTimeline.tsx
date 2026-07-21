import { InvoiceStatus } from '../types';
import { CheckCircle2, Clock, Send, FileText, CheckSquare, XCircle, AlertCircle } from 'lucide-react';

interface InvoiceWorkflowTimelineProps {
  status: InvoiceStatus;
}

export function InvoiceWorkflowTimeline({ status }: InvoiceWorkflowTimelineProps) {
  const steps = [
    { id: InvoiceStatus.DRAFT, label: 'Draft', icon: FileText },
    { id: InvoiceStatus.PENDING_APPROVAL, label: 'Pending Approval', icon: Clock },
    { id: InvoiceStatus.APPROVED, label: 'Approved', icon: CheckSquare },
    { id: InvoiceStatus.SENT, label: 'Sent', icon: Send },
    { id: InvoiceStatus.PAID, label: 'Paid', icon: CheckCircle2 },
  ];

  const getStepStatus = (stepId: InvoiceStatus) => {
    if (status === InvoiceStatus.VOID || status === InvoiceStatus.CANCELLED) {
      return 'failed';
    }
    if (status === InvoiceStatus.OVERDUE) {
      if (stepId === InvoiceStatus.PAID) return 'failed';
      return 'completed';
    }

    const currentIndex = steps.findIndex(s => s.id === status);
    const stepIndex = steps.findIndex(s => s.id === stepId);

    if (status === InvoiceStatus.ISSUED && stepId === InvoiceStatus.SENT) return 'completed';
    if (status === InvoiceStatus.ISSUED && stepId === InvoiceStatus.PAID) return 'upcoming';
    
    if (status === InvoiceStatus.PARTIALLY_PAID) {
      if (stepId === InvoiceStatus.PAID) return 'current';
      return 'completed';
    }

    if (currentIndex === -1 || stepIndex === -1) return 'upcoming';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  if (status === InvoiceStatus.VOID || status === InvoiceStatus.CANCELLED) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-danger-50 dark:bg-danger-900/20 text-danger-600 dark:text-danger-400 border border-danger-200 dark:border-danger-800/30">
        <XCircle className="h-6 w-6" />
        <div>
          <h4 className="font-bold">Invoice {status}</h4>
          <p className="text-sm opacity-80">This invoice has been {status.toLowerCase()} and is no longer active.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-200 dark:bg-surface-800 -translate-y-1/2 rounded-full" />
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const stepStatus = getStepStatus(step.id);
            const Icon = step.icon;
            
            let colorClass = 'text-surface-400 bg-white dark:bg-surface-900 border-surface-300 dark:border-surface-700';

            if (stepStatus === 'completed') {
              colorClass = 'text-primary-600 bg-primary-50 dark:bg-primary-900/30 border-primary-600';
            } else if (stepStatus === 'current') {
              colorClass = 'text-accent-600 bg-accent-50 dark:bg-accent-900/30 border-accent-600 shadow-[0_0_0_4px_rgba(var(--color-accent-500),0.1)]';
            } else if (stepStatus === 'failed') {
              colorClass = 'text-danger-600 bg-danger-50 dark:bg-danger-900/30 border-danger-600';
            }

            return (
              <div key={step.id} className="flex flex-col items-center relative z-10">
                {/* Connecting Line override for completed segments */}
                {index > 0 && stepStatus === 'completed' && (
                  <div className="absolute top-4 right-1/2 w-full h-0.5 bg-primary-600 -z-10" />
                )}
                
                <div className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all ${colorClass}`}>
                  {stepStatus === 'completed' ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                </div>
                <span className={`mt-3 text-xs font-semibold ${stepStatus === 'upcoming' ? 'text-surface-400' : 'text-surface-900 dark:text-white'}`}>
                  {step.label}
                </span>
                
                {step.id === InvoiceStatus.PAID && status === InvoiceStatus.OVERDUE && (
                  <span className="absolute -bottom-5 text-[10px] font-bold text-danger-600 flex items-center gap-1 bg-danger-50 dark:bg-danger-900/30 px-2 py-0.5 rounded-full whitespace-nowrap">
                    <AlertCircle className="h-3 w-3" /> Overdue
                  </span>
                )}
                {step.id === InvoiceStatus.PAID && status === InvoiceStatus.PARTIALLY_PAID && (
                  <span className="absolute -bottom-5 text-[10px] font-bold text-amber-600 flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full whitespace-nowrap">
                    Partial
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
