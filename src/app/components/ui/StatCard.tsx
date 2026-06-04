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
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-semibold">{value}</p>
            {change && (
              <p
                className={cn('text-sm font-medium', {
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
            <div className={cn('p-3 rounded-lg bg-accent', iconColor)}>
              <Icon className="w-6 h-6" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
