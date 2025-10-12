'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MetricData {
  title: string;
  value: string | number;
  target?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
  color?: string;
  bgColor?: string;
  badge?: string;
  subtitle?: string;
}

interface MetricCardProps {
  data: MetricData;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function MetricCard({ data, className, size = 'md' }: MetricCardProps) {
  const Icon = data.icon;
  
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-yellow-600" />;
    }
  };

  const sizeClasses = {
    sm: {
      card: 'text-sm',
      value: 'text-lg',
      icon: 'w-3 h-3',
      padding: 'p-2'
    },
    md: {
      card: '',
      value: 'text-2xl',
      icon: 'w-4 h-4',
      padding: 'p-2'
    },
    lg: {
      card: 'text-lg',
      value: 'text-3xl',
      icon: 'w-5 h-5',
      padding: 'p-3'
    }
  };

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className={cn(
        "flex flex-row items-center justify-between space-y-0 pb-2",
        sizeClasses[size].card
      )}>
        <div className="flex-1">
          <CardTitle className="text-sm font-medium text-gray-600 line-clamp-2">
            {data.title}
          </CardTitle>
          {data.badge && (
            <Badge variant="secondary" className="mt-1 text-xs">
              {data.badge}
            </Badge>
          )}
        </div>
        <div className={cn(
          "rounded-full",
          sizeClasses[size].padding,
          data.bgColor || "bg-gray-100"
        )}>
          <Icon className={cn(
            sizeClasses[size].icon,
            data.color || "text-gray-600"
          )} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className={cn("font-bold", sizeClasses[size].value)}>
              {data.value}
            </div>
            {data.target && (
              <p className="text-xs text-gray-500 mt-1">
                Target: {data.target}
              </p>
            )}
            {data.subtitle && (
              <p className="text-xs text-gray-600 mt-1">
                {data.subtitle}
              </p>
            )}
          </div>
          {data.trend && (
            <div className="flex items-center gap-1 ml-2">
              {getTrendIcon(data.trend)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface MetricGridProps {
  metrics: MetricData[];
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  className?: string;
  cardSize?: 'sm' | 'md' | 'lg';
}

export function MetricGrid({ 
  metrics, 
  columns = { default: 1, md: 2, xl: 4 },
  gap = 4,
  className,
  cardSize = 'md'
}: MetricGridProps) {
  const gridClasses = cn(
    "grid",
    columns.default && `grid-cols-${columns.default}`,
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
    `gap-${gap}`,
    className
  );

  return (
    <div className={gridClasses}>
      {metrics.map((metric, index) => (
        <MetricCard 
          key={index} 
          data={metric} 
          size={cardSize}
        />
      ))}
    </div>
  );
}