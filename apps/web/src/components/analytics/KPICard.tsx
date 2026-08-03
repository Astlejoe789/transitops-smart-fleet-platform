import { Card, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  onClick?: () => void;
  className?: string;
}

export function KPICard({ title, value, icon: Icon, trend, onClick, className }: KPICardProps) {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-200", 
        onClick && "cursor-pointer hover:shadow-md hover:border-primary/50",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center justify-center text-center p-6">
        <div className="p-2.5 bg-primary/10 rounded-full mb-3">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <p className="text-[12px] font-medium text-muted-foreground tracking-wide uppercase mb-1">
          {title}
        </p>
        <div className="text-[26px] font-bold leading-tight">{value}</div>
        {trend && (
          <p className="text-xs mt-2">
            <span className={cn(
              "font-medium",
              trend.isPositive ? "text-emerald-500" : "text-rose-500"
            )}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
            {" "}
            <span className="text-muted-foreground">{trend.label}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
