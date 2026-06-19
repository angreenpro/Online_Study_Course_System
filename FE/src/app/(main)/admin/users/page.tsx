'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { PageLoader } from '@/components/ui/Spinner';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function AdminUsersPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user?.roles.includes('ADMIN')) {
      router.push('/');
      return;
    }

    fetchUsers();
  }, [isAuthenticated, user, router]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data.items || []);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Quản lý người dùng</h1>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border)]">
                <th className="p-4 font-semibold text-[var(--text-secondary)]">Tên / Email</th>
                <th className="p-4 font-semibold text-[var(--text-secondary)]">Vai trò</th>
                <th className="p-4 font-semibold text-[var(--text-secondary)]">Ngày tham gia</th>
                <th className="p-4 font-semibold text-[var(--text-secondary)]">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-tertiary)]/30 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-[var(--text-primary)]">{u.fullName}</div>
                    <div className="text-sm text-[var(--text-muted)]">{u.email}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1 flex-wrap">
                      {u.roles.map((r: string) => (
                        <span key={r} className="px-2 py-1 text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 rounded-md">
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-[var(--text-secondary)]">
                    {formatDate(new Date(u.createdAt))}
                  </td>
                  <td className="p-4">
                    <button className="text-sm font-medium text-[var(--primary)] hover:underline">Phân quyền</button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[var(--text-muted)]">Không có người dùng nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
