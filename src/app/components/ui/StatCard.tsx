import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from './Card';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: LucideIcon;
  iconColor?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'text-primary',
  className,
}: StatCardProps) {
  return (
    <Card className={cn('overflow-hidden bg-white transition-transform hover:-translate-y-1', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-muted-foreground">{title}</p>
            <p className="text-4xl font-extrabold tracking-[-0.05em]">{value}</p>
            {change && (
              <p
                className={cn('text-sm font-bold', {
                  'text-success': changeType === 'positive',
                  'text-destructive': changeType === 'negative',
                  'text-muted-foreground': changeType === 'neutral',
                })}
              >
                {change}
              </p>
            )}
          </div>
          {Icon && (
            <div className={cn('rounded-[20px] border-[3px] border-border bg-accent p-3 shadow-[4px_4px_0_0_var(--color-border)]', iconColor)}>
              <Icon className="w-6 h-6" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
