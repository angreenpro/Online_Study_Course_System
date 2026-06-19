import { cn, roleLabels, roleColors } from '@/lib/utils';

interface BadgeProps {
  role: string;
  className?: string;
}

export default function Badge({ role, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        roleColors[role] || 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        className
      )}
    >
      {roleLabels[role] || role}
    </span>
  );
}
