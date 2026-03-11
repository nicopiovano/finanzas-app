import { ReactNode } from 'react';
import { Card } from '../ui/Card';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '../../utils/cn';

interface KPICardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export function KPICard({ title, value, change, changeLabel, icon, trend = 'neutral' }: KPICardProps) {
  const isPositive = trend === 'up' || (change !== undefined && change > 0);
  const isNegative = trend === 'down' || (change !== undefined && change < 0);

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-semibold mb-2">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1">
              {isPositive && <ArrowUp className="w-4 h-4 text-[var(--success)]" />}
              {isNegative && <ArrowDown className="w-4 h-4 text-[var(--danger)]" />}
              <span
                className={cn(
                  'text-sm font-medium',
                  isPositive && 'text-[var(--success)]',
                  isNegative && 'text-[var(--danger)]',
                  !isPositive && !isNegative && 'text-muted-foreground'
                )}
              >
                {change > 0 ? '+' : ''}{change}%
                {changeLabel && ` ${changeLabel}`}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-2 bg-accent rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
