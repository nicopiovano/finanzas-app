import { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'danger' | 'neutral' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  const variants = {
    success: 'bg-[var(--success)] text-[var(--success-foreground)]',
    danger: 'bg-[var(--danger)] text-[var(--danger-foreground)]',
    neutral: 'bg-muted text-muted-foreground',
    info: 'bg-[var(--info)] text-[var(--info-foreground)]'
  };

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}
