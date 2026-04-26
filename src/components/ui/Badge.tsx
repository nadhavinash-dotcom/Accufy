import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200',
    secondary: 'border-transparent bg-slate-100 text-slate-700 hover:bg-slate-100',
    destructive: 'border-transparent bg-red-900/50 text-red-200 hover:bg-red-900/70',
    outline: 'text-slate-800 border-slate-300',
    success: 'border-transparent bg-emerald-900/30 text-emerald-600 hover:bg-emerald-900/50',
    warning: 'border-transparent bg-amber-900/30 text-amber-600 hover:bg-amber-900/50',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
