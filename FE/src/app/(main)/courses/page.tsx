'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import CourseCard from '@/components/ui/CourseCard';
import CourseFilter from '@/components/ui/CourseFilter';
import { PageLoader } from '@/components/ui/Spinner';

function CoursesContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const level = searchParams.get('level') || '';

  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (level) params.set('level', level);

        const { data } = await api.get(`/courses?${params.toString()}`);
        setCourses(data.data.items || []);
      } catch (error) {
        console.error('Lỗi khi tải khóa học:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [search, level]);

  return (
    <>
      <CourseFilter />

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <PageLoader />
        </div>
      ) : courses.length === 0 ? (
        <div className="glass-card py-16 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2">Không tìm thấy khóa học</h3>
          <p className="text-[var(--text-muted)] max-w-md mx-auto">
            Hãy thử thay đổi từ khóa hoặc bộ lọc để xem các kết quả khác.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </>
  );
}

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function CoursesPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return <div className="py-20 flex justify-center"><PageLoader /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Khám phá <span className="gradient-text">khóa học</span>
        </h1>
        <p className="text-[var(--text-muted)]">
          Tìm kiếm khóa học phù hợp với mục tiêu của bạn
        </p>
      </div>

      <Suspense fallback={<div className="py-20"><PageLoader /></div>}>
        <CoursesContent />
      </Suspense>
    </div>
  );
}

