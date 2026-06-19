import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export default function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div className={cn('relative', sizeStyles[size], className)}>
      <div className="absolute inset-0 rounded-full border-2 border-[var(--border)]" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--primary)] animate-spin" />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-[var(--text-secondary)] animate-pulse">Đang tải...</p>
      </div>
    </div>
  );
}
