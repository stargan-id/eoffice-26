'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveContainer({ children, className }: ResponsiveContainerProps) {
  return (
    <div className={cn(
      "w-full min-h-screen bg-gray-50",
      "transition-all duration-200 ease-in-out",
      className
    )}>
      {children}
    </div>
  );
}

interface GridLayoutProps {
  children: ReactNode;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  className?: string;
}

export function GridLayout({ 
  children, 
  cols = { default: 1, md: 2, xl: 3 },
  gap = 6,
  className 
}: GridLayoutProps) {
  const gridClasses = cn(
    "grid",
    cols.default && `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    `gap-${gap}`,
    className
  );

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
}

interface MobileAdaptiveCardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export function MobileAdaptiveCard({ 
  children, 
  className,
  padding = 'md' 
}: MobileAdaptiveCardProps) {
  const paddingClasses = {
    sm: 'p-3 md:p-4',
    md: 'p-4 md:p-6', 
    lg: 'p-6 md:p-8'
  };

  return (
    <div className={cn(
      "bg-white rounded-lg border border-gray-200 shadow-sm",
      "transition-all duration-200 hover:shadow-md",
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
}