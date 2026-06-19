'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { PageLoader } from '@/components/ui/Spinner';
import EnrollmentCard from '@/components/features/EnrollmentCard';
import Link from 'next/link';

export default function MyEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyEnrollments = async () => {
      try {
        const { data } = await api.get('/enrollments/my');
        setEnrollments(data.data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách đăng ký:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyEnrollments();
  }, []);

  if (isLoading) return <PageLoader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Khóa học của tôi</h1>
        <p className="text-[var(--text-muted)]">Quản lý và tiếp tục quá trình học tập của bạn</p>
      </div>

      {enrollments.length === 0 ? (
        <div className="glass-card py-16 text-center">
          <div className="text-6xl mb-4">🎓</div>
          <h3 className="text-xl font-semibold mb-2">Bạn chưa đăng ký khóa học nào</h3>
          <p className="text-[var(--text-muted)] max-w-md mx-auto mb-6">
            Khám phá hàng trăm khóa học chất lượng cao và bắt đầu hành trình nâng cao kiến thức của bạn.
          </p>
          <Link href="/courses">
            <button className="px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-bold hover:bg-[var(--primary-dark)]">
              Khám phá khóa học
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {enrollments.map((enrollment) => (
            <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
          ))}
        </div>
      )}
    </div>
  );
}
