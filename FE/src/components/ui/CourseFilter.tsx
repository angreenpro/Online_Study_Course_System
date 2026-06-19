'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import { useEffect } from 'react';

export default function CourseFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [level, setLevel] = useState(searchParams.get('level') || '');

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (level) params.set('level', level);
    
    // Update URL without reloading page
    router.push(`/courses?${params.toString()}`);
  }, [debouncedSearch, level, router]);

  return (
    <div className="glass-card p-4 mb-8 flex flex-col sm:flex-row gap-4">
      <div className="flex-1 relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm khóa học..."
          className="w-full pl-12 pr-4 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none transition-colors"
        />
      </div>
      <div className="sm:w-48">
        <select 
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full px-4 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl text-[var(--text-secondary)] focus:border-[var(--primary)] focus:outline-none appearance-none"
        >
          <option value="">Tất cả trình độ</option>
          <option value="BEGINNER">Cơ bản</option>
          <option value="INTERMEDIATE">Trung cấp</option>
          <option value="ADVANCED">Nâng cao</option>
        </select>
      </div>
    </div>
  );
}
