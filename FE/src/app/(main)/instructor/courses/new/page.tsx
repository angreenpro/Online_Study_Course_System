'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import CourseForm from '@/components/ui/CourseForm';
import { toast } from '@/components/ui/Toast';
import Link from 'next/link';

export default function NewCoursePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await api.post('/courses', data);
      toast('success', 'Tạo khóa học thành công!');
      // Navigate to content management page for the newly created course
      router.push(`/instructor/courses/${response.data.data.id}/content`);
    } catch (error: any) {
      toast('error', error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
          <Link href="/instructor/courses" className="hover:text-[var(--text-primary)] transition-colors">
            Quản lý khóa học
          </Link>
          <span>/</span>
          <span className="text-[var(--text-primary)]">Tạo mới</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Tạo khóa học mới</h1>
        <p className="text-[var(--text-muted)]">Điền thông tin cơ bản để bắt đầu xây dựng khóa học của bạn</p>
      </div>

      <CourseForm 
        onSubmit={handleSubmit} 
        onCancel={() => router.push('/instructor/courses')} 
        isLoading={isSubmitting} 
      />
    </div>
  );
}
