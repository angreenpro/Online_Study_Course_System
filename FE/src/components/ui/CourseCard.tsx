import Link from 'next/link';
import { formatCurrency, truncate } from '@/lib/utils';
import Avatar from './Avatar';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    price: number;
    level: string;
    thumbnailUrl: string | null;
    instructor: {
      fullName: string;
      avatarUrl: string | null;
    };
    _count?: {
      sections: number;
    };
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  // Translate level
  const levelLabels: Record<string, string> = {
    BEGINNER: 'Cơ bản',
    INTERMEDIATE: 'Trung cấp',
    ADVANCED: 'Nâng cao',
  };

  const levelColors: Record<string, string> = {
    BEGINNER: 'bg-green-500/10 text-green-500',
    INTERMEDIATE: 'bg-blue-500/10 text-blue-500',
    ADVANCED: 'bg-purple-500/10 text-purple-500',
  };

  return (
    <Link href={`/courses/${course.id}`} className="group block">
      <div className="glass-card overflow-hidden h-full flex flex-col transition-all hover:translate-y-[-4px] hover:shadow-[var(--shadow-glow)]">
        {/* Thumbnail */}
        <div className="relative aspect-video w-full bg-[var(--bg-tertiary)] overflow-hidden">
          {course.thumbnailUrl ? (
            <img 
              src={course.thumbnailUrl} 
              alt={course.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)]">
              <span className="text-4xl">📚</span>
            </div>
          )}
          <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-medium backdrop-blur-md ${levelColors[course.level] || 'bg-gray-500/20 text-gray-400'}`}>
            {levelLabels[course.level] || course.level}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-semibold text-lg text-[var(--text-primary)] mb-2 line-clamp-2 group-hover:text-[var(--primary-light)] transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-[var(--text-muted)] mb-4 line-clamp-2">
            {course.description}
          </p>

          <div className="mt-auto pt-4 border-t border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar src={course.instructor.avatarUrl} name={course.instructor.fullName} size="sm" />
              <span className="text-xs text-[var(--text-secondary)] truncate max-w-[100px]">
                {course.instructor.fullName}
              </span>
            </div>
            <div className="text-right">
              <span className="block text-lg font-bold gradient-text">
                {course.price > 0 ? formatCurrency(course.price) : 'Miễn phí'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
