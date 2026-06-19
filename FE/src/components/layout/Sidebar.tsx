'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, type Role } from '@/lib/auth';
import { cn } from '@/lib/utils';
import type { NavItem, SidebarSection } from '@/types';

// Icons mapping (using SVGs)
const icons = {
  dashboard: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  courses: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  enrollments: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  users: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  revenue: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  coupons: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>,
  settings: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
};

// Sidebar Configuration
const sidebarConfig: SidebarSection[] = [
  {
    items: [
      { label: 'Bảng điều khiển', href: '/dashboard', icon: icons.dashboard },
      { label: 'Khám phá khóa học', href: '/courses', icon: icons.courses },
    ],
  },
  {
    title: 'Học tập',
    items: [
      { label: 'Khóa học của tôi', href: '/dashboard/enrollments', icon: icons.enrollments, roles: ['STUDENT'] },
    ],
  },
  {
    title: 'Giảng viên',
    items: [
      { label: 'Quản lý khóa học', href: '/instructor/courses', icon: icons.courses, roles: ['INSTRUCTOR'] },
      { label: 'Thống kê doanh thu', href: '/instructor', icon: icons.revenue, roles: ['INSTRUCTOR'] },
    ],
  },
  {
    title: 'Quản trị hệ thống',
    items: [
      { label: 'Quản lý người dùng', href: '/admin/users', icon: icons.users, roles: ['ADMIN'] },
      { label: 'Báo cáo doanh thu', href: '/admin', icon: icons.revenue, roles: ['ADMIN'] },
      { label: 'Quản lý mã giảm giá', href: '/admin/coupons', icon: icons.coupons, roles: ['ADMIN'] },
    ],
  },
];

export default function Sidebar() {
  const { user, hasRole, isLoading } = useAuth();
  const pathname = usePathname();

  if (isLoading || !user) return null;

  // Filter sections and items based on user roles
  const filteredSections = sidebarConfig.map(section => {
    const filteredItems = section.items.filter(item => {
      // If no roles specified, visible to all authenticated users
      if (!item.roles || item.roles.length === 0) return true;
      // If roles specified, check if user has at least one of them
      return item.roles.some(role => hasRole(role));
    });

    return { ...section, items: filteredItems };
  }).filter(section => section.items.length > 0);

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-[var(--border)] bg-[var(--bg-secondary)] sticky top-16" style={{ height: 'calc(100vh - 64px)' }}>
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        {filteredSections.map((section, idx) => (
          <div key={idx}>
            {section.title && (
              <h3 className="px-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                {section.title}
              </h3>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-gradient-to-r from-[var(--primary)]/10 to-[var(--accent)]/10 text-[var(--primary-light)] border border-[var(--primary)]/20 shadow-[inset_0_0_20px_rgba(108,99,255,0.05)]'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
                      )}
                    >
                      <span className={cn('transition-colors', isActive ? 'text-[var(--primary-light)]' : 'text-[var(--text-muted)]')}>
                        {item.icon}
                      </span>
                      {item.label}
                      {item.badge !== undefined && (
                        <span className="ml-auto bg-[var(--primary)] text-white text-xs py-0.5 px-2 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
