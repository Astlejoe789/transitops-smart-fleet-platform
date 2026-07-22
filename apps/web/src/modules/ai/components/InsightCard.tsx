import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AiInsight } from '../services/aiApi';

export function InsightCard({ insight, className }: { insight: AiInsight, className?: string }) {
  const isWarning = insight.type === 'WARNING';
  const isSuccess = insight.type === 'SUCCESS';

  return (
    <Card className={cn("border-l-4", 
      isWarning ? "border-l-destructive bg-destructive/5" : 
      isSuccess ? "border-l-green-500 bg-green-500/5" : 
      "border-l-blue-500 bg-blue-500/5", 
      className
    )}>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        {isWarning && <AlertTriangle className="h-5 w-5 text-destructive" />}
        {isSuccess && <CheckCircle2 className="h-5 w-5 text-green-500" />}
        {!isWarning && !isSuccess && <Info className="h-5 w-5 text-blue-500" />}
        <CardTitle className="text-sm font-semibold">{insight.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{insight.description}</p>
      </CardContent>
    </Card>
  );
}
