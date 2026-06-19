import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({ children, className, hover = true, padding = 'md' }: CardProps) {
  return (
    <div
      className={cn(
        'glass-card',
        paddingStyles[padding],
        hover && 'hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-glow)] hover:-translate-y-0.5',
        className
      )}
    >
      {children}
    </div>
  );
}
