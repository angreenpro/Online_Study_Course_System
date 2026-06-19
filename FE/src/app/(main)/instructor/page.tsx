'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { PageLoader } from '@/components/ui/Spinner';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function InstructorDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user?.roles.includes('INSTRUCTOR')) {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        const res = await api.get('/instructor/revenue');
        setData(res.data.data);
      } catch (error) {
        console.error('Failed to fetch instructor data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, router]);

  if (isLoading) return <PageLoader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard Giảng viên</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="glass-card p-8 text-center">
          <div className="text-4xl mb-4">👥</div>
          <p className="text-[var(--text-muted)] mb-2">Học viên Đăng ký</p>
          <h3 className="text-5xl font-bold">{data?.totalEnrollments || 0}</h3>
        </div>
        <div className="glass-card p-8 text-center border-b-4 border-[var(--primary)]">
          <div className="text-4xl mb-4">💰</div>
          <p className="text-[var(--text-muted)] mb-2">Doanh thu Cá nhân (Sau phí)</p>
          <h3 className="text-5xl font-bold text-[var(--primary-light)]">
            {formatCurrency(data?.totalRevenue || 0)}
          </h3>
        </div>
      </div>

      {/* Note: In a real app, you would add a list of courses here to send announcements */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold mb-4">Tính năng sắp ra mắt</h2>
        <p className="text-[var(--text-muted)]">Bạn sẽ sớm có thể quản lý khóa học và gửi thông báo cho học viên trực tiếp từ màn hình này.</p>
      </div>
    </div>
  );
}
