import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import Button from '../ui/Button';

interface EnrollmentCardProps {
  enrollment: any;
}

export default function EnrollmentCard({ enrollment }: EnrollmentCardProps) {
  const course = enrollment.course;
  const isPending = enrollment.status === 'PENDING';

  return (
    <div className="glass-card overflow-hidden flex flex-col md:flex-row h-full">
      <div className="md:w-64 aspect-video md:aspect-auto bg-[var(--bg-tertiary)] flex-shrink-0 relative">
        {course.thumbnailUrl ? (
          <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[var(--text-muted)]">
            <span className="text-3xl mb-2">📚</span>
            <span className="text-sm font-medium">Khóa học</span>
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold line-clamp-2">{course.title}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            isPending ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'
          }`}>
            {isPending ? 'Chờ thanh toán' : 'Đang học'}
          </span>
        </div>
        
        <p className="text-[var(--text-secondary)] text-sm mb-4">
          Giảng viên: {course.instructor?.fullName}
        </p>
        
        <div className="mt-auto pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[var(--border)]">
          <span className="text-xs text-[var(--text-muted)]">
            Đăng ký lúc: {formatDate(enrollment.enrolledAt)}
          </span>
          
          {isPending ? (
            <Link href={`/courses/${course.id}/checkout?enrollmentId=${enrollment.id}`}>
              <Button>Thanh toán ngay</Button>
            </Link>
          ) : (
            <Link href={`/learn/${course.id}`}>
              <Button>Vào học</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
