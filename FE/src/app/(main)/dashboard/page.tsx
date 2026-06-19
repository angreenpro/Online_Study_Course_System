'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import { PageLoader } from '@/components/ui/Spinner';
import { formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) return <PageLoader />;

  const isStudent = user.roles.includes('STUDENT');
  const isInstructor = user.roles.includes('INSTRUCTOR');
  const isAdmin = user.roles.includes('ADMIN');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-4">
          <Avatar src={user.avatarUrl} name={user.fullName} size="lg" />
          <div>
            <h1 className="text-2xl font-bold">
              Xin chào, <span className="gradient-text">{user.fullName}</span>! 👋
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              {user.roles.map((role) => (
                <Badge key={role} role={role} />
              ))}
              <span className="text-sm text-[var(--text-muted)]">• {user.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isStudent && (
          <>
            <Card className="animate-fade-in stagger-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl">
                  📚
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-[var(--text-muted)]">Khóa học đang học</p>
                </div>
              </div>
            </Card>
            <Card className="animate-fade-in stagger-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-2xl">
                  ✅
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-[var(--text-muted)]">Đã hoàn thành</p>
                </div>
              </div>
            </Card>
            <Card className="animate-fade-in stagger-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-2xl">
                  🏆
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-[var(--text-muted)]">Chứng chỉ</p>
                </div>
              </div>
            </Card>
            <Card className="animate-fade-in stagger-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-2xl">
                  ⏱️
                </div>
                <div>
                  <p className="text-2xl font-bold">0h</p>
                  <p className="text-xs text-[var(--text-muted)]">Giờ học tập</p>
                </div>
              </div>
            </Card>
          </>
        )}

        {isInstructor && (
          <>
            <Card className="animate-fade-in stagger-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-2xl">
                  📖
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-[var(--text-muted)]">Khóa học của tôi</p>
                </div>
              </div>
            </Card>
            <Card className="animate-fade-in stagger-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl">
                  👨‍🎓
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-[var(--text-muted)]">Tổng học viên</p>
                </div>
              </div>
            </Card>
            <Card className="animate-fade-in stagger-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-2xl">
                  💰
                </div>
                <div>
                  <p className="text-2xl font-bold">0₫</p>
                  <p className="text-xs text-[var(--text-muted)]">Doanh thu</p>
                </div>
              </div>
            </Card>
            <Card className="animate-fade-in stagger-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-2xl">
                  ⭐
                </div>
                <div>
                  <p className="text-2xl font-bold">0.0</p>
                  <p className="text-xs text-[var(--text-muted)]">Đánh giá TB</p>
                </div>
              </div>
            </Card>
          </>
        )}

        {isAdmin && !isStudent && !isInstructor && (
          <>
            <Card className="animate-fade-in stagger-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-2xl">
                  👥
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-[var(--text-muted)]">Tổng người dùng</p>
                </div>
              </div>
            </Card>
            <Card className="animate-fade-in stagger-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl">
                  📚
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-[var(--text-muted)]">Tổng khóa học</p>
                </div>
              </div>
            </Card>
            <Card className="animate-fade-in stagger-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-2xl">
                  💰
                </div>
                <div>
                  <p className="text-2xl font-bold">0₫</p>
                  <p className="text-xs text-[var(--text-muted)]">Tổng doanh thu</p>
                </div>
              </div>
            </Card>
            <Card className="animate-fade-in stagger-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-2xl">
                  📊
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-[var(--text-muted)]">Đăng ký mới</p>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card hover={false}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>📋</span> Hoạt động gần đây
            </h2>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-4xl mb-3">🎯</div>
              <p className="text-[var(--text-secondary)] font-medium">Chưa có hoạt động nào</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                {isStudent
                  ? 'Bắt đầu khám phá các khóa học để bắt đầu hành trình!'
                  : isInstructor
                  ? 'Tạo khóa học đầu tiên để bắt đầu!'
                  : 'Hệ thống đang hoạt động bình thường.'
                }
              </p>
            </div>
          </Card>
        </div>

        {/* Profile Card */}
        <div>
          <Card hover={false}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>👤</span> Thông tin cá nhân
            </h2>
            <div className="flex flex-col items-center text-center mb-4">
              <Avatar src={user.avatarUrl} name={user.fullName} size="lg" />
              <p className="font-semibold mt-3">{user.fullName}</p>
              <p className="text-sm text-[var(--text-muted)]">{user.email}</p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-[var(--border)]">
                <span className="text-[var(--text-muted)]">Vai trò</span>
                <div className="flex gap-1">
                  {user.roles.map((role) => (
                    <Badge key={role} role={role} />
                  ))}
                </div>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--border)]">
                <span className="text-[var(--text-muted)]">Ngày tham gia</span>
                <span>{formatDate(new Date())}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
