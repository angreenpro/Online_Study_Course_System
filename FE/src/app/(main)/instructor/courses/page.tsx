'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { formatCurrency, formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Spinner';
import { toast } from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';

export default function InstructorCoursesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      // In a real app, backend should filter by instructorId automatically based on token,
      // or we can just fetch all and let the backend filter if the role is INSTRUCTOR.
      // Currently our GET /courses returns all courses. 
      // For MVP, we'll fetch all and filter client-side, but ideally we'd have /api/instructor/courses.
      const { data } = await api.get('/courses');
      const myCourses = data.data.items.filter((c: any) => c.instructor.id === user?.id);
      setCourses(myCourses);
    } catch (error) {
      console.error('Lỗi khi tải khóa học:', error);
      toast('error', 'Không thể tải danh sách khóa học');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchCourses();
  }, [user, router]);

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khóa học này?')) return;
    
    try {
      await api.delete(`/courses/${id}`);
      toast('success', 'Đã xóa khóa học thành công');
      fetchCourses();
    } catch (error: any) {
      toast('error', error.response?.data?.message || 'Lỗi khi xóa khóa học');
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản lý Khóa học</h1>
          <p className="text-[var(--text-muted)]">Danh sách các khóa học bạn đang giảng dạy</p>
        </div>
        <Link href="/instructor/courses/new">
          <Button>+ Tạo khóa học mới</Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="glass-card py-16 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold mb-2">Chưa có khóa học nào</h3>
          <p className="text-[var(--text-muted)] max-w-md mx-auto mb-6">
            Hãy bắt đầu chia sẻ kiến thức của bạn bằng cách tạo khóa học đầu tiên!
          </p>
          <Link href="/instructor/courses/new">
            <Button>Tạo khóa học ngay</Button>
          </Link>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border)]">
                  <th className="p-4 font-medium text-[var(--text-secondary)]">Khóa học</th>
                  <th className="p-4 font-medium text-[var(--text-secondary)]">Giá</th>
                  <th className="p-4 font-medium text-[var(--text-secondary)]">Cập nhật</th>
                  <th className="p-4 font-medium text-[var(--text-secondary)] text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-[var(--bg-tertiary)]/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 bg-[var(--bg-tertiary)] rounded-md overflow-hidden flex-shrink-0">
                          {course.thumbnailUrl ? (
                            <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs">No Img</div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--text-primary)] max-w-md truncate" title={course.title}>
                            {course.title}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] mt-1">
                            {course._count?.sections || 0} chương
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium">
                      {course.price > 0 ? formatCurrency(course.price) : 'Miễn phí'}
                    </td>
                    <td className="p-4 text-sm text-[var(--text-secondary)]">
                      {formatDate(course.updatedAt)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => router.push(`/instructor/courses/${course.id}/content`)}
                        >
                          Nội dung
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => router.push(`/instructor/courses/${course.id}/edit`)}
                        >
                          Sửa
                        </Button>
                        <button 
                          onClick={() => handleDelete(course.id)}
                          className="px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
