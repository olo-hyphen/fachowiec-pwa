import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
  };
  icon: LucideIcon;
  className?: string;
  variant?: 'default' | 'premium' | 'elevated';
}

/**
 * Enhanced StatCard with better visual hierarchy and glassmorphism
 * 
 * @example
 * <StatCard
 *   title="Zakończone zlecenia"
 *   value={42}
 *   change={{ value: 12, label: 'w tym miesiącu' }}
 *   icon={Briefcase}
 *   variant="premium"
 * />
 */
export function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  className,
  variant = 'default' 
}: StatCardProps) {
  const glassClass = variant === 'premium' 
    ? 'glass-premium' 
    : variant === 'elevated' 
    ? 'glass-elevated' 
    : 'glass-card';

  return (
    <Card className={cn(
      glassClass,
      'border-none hover-lift hover-glow transition-glass group overflow-hidden relative',
      className
    )}>
      {/* Background Decoration - adds depth */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-opacity duration-500" />
      
      <CardContent className="p-5 md:p-7 relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            {/* Title */}
            <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors font-inter tracking-wide uppercase">
              {title}
            </p>
            
            {/* Value with Gradient */}
            <p className="text-3xl md:text-4xl font-bold font-poppins bg-gradient-primary bg-clip-text text-transparent">
              {value}
            </p>
            
            {/* Change Indicator */}
            {change && (
              <div className="flex items-center gap-2 flex-wrap">
                <div className={cn(
                  'px-2 py-1 rounded-full text-xs font-semibold font-inter inline-flex items-center gap-1',
                  change.value >= 0 
                    ? 'bg-success/10 text-success' 
                    : 'bg-destructive/10 text-destructive'
                )}>
                  <span>{change.value >= 0 ? '↑' : '↓'}</span>
                  <span>{Math.abs(change.value)}%</span>
                </div>
                <span className="text-xs text-muted-foreground font-inter">
                  {change.label}
                </span>
              </div>
            )}
          </div>
          
          {/* Icon with Glass Effect */}
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-primary blur-xl opacity-50 group-hover:opacity-70 transition-opacity animate-pulse-glow" />
            <div className="relative p-4 bg-gradient-primary rounded-2xl shadow-glow group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <Icon className="h-6 w-6 md:h-7 md:w-7 text-primary-foreground" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
