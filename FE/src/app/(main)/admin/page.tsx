'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { PageLoader } from '@/components/ui/Spinner';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [revenue, setRevenue] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user?.roles.includes('ADMIN')) {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [statsRes, revenueRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/revenue')
        ]);
        setStats(statsRes.data.data);
        setRevenue(revenueRes.data.data);
      } catch (error) {
        console.error('Failed to fetch admin data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, router]);

  if (isLoading) return <PageLoader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tổng quan Hệ thống (Admin)</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="glass-card p-6">
          <p className="text-[var(--text-muted)] text-sm mb-1">Tổng Người dùng</p>
          <h3 className="text-3xl font-bold">{stats?.totalUsers || 0}</h3>
        </div>
        <div className="glass-card p-6">
          <p className="text-[var(--text-muted)] text-sm mb-1">Tổng Khóa học</p>
          <h3 className="text-3xl font-bold">{stats?.totalCourses || 0}</h3>
        </div>
        <div className="glass-card p-6">
          <p className="text-[var(--text-muted)] text-sm mb-1">Lượt Đăng ký</p>
          <h3 className="text-3xl font-bold">{stats?.totalEnrollments || 0}</h3>
        </div>
        <div className="glass-card p-6 border-l-4 border-[var(--primary)]">
          <p className="text-[var(--text-muted)] text-sm mb-1">Tổng Doanh thu</p>
          <h3 className="text-3xl font-bold text-[var(--primary-light)]">
            {formatCurrency(stats?.totalRevenue || 0)}
          </h3>
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-xl font-bold mb-6">Biểu đồ Doanh thu</h2>
        {revenue.length === 0 ? (
          <div className="text-center py-10 text-[var(--text-muted)]">Chưa có dữ liệu doanh thu</div>
        ) : (
          <div className="space-y-4">
            {revenue.map((r, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium">{r.month}</div>
                <div className="flex-1 bg-[var(--bg-tertiary)] h-4 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[var(--primary)]" 
                    style={{ width: `${Math.min(100, (r.revenue / (Math.max(...revenue.map(x => x.revenue)) || 1)) * 100)}%` }}
                  />
                </div>
                <div className="w-32 text-right font-bold">{formatCurrency(r.revenue)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
