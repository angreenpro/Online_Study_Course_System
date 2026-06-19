'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import CourseForm from '@/components/ui/CourseForm';
import { toast } from '@/components/ui/Toast';
import { PageLoader } from '@/components/ui/Spinner';

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/courses/${params.id}`);
        setCourse(data.data);
      } catch (error) {
        toast('error', 'Không thể tải thông tin khóa học');
        router.push('/instructor/courses');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchCourse();
    }
  }, [params.id, router]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await api.put(`/courses/${params.id}`, data);
      toast('success', 'Cập nhật thông tin thành công!');
      router.push('/instructor/courses');
    } catch (error: any) {
      toast('error', error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <PageLoader />;
  if (!course) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
          <Link href="/instructor/courses" className="hover:text-[var(--text-primary)] transition-colors">
            Quản lý khóa học
          </Link>
          <span>/</span>
          <span className="text-[var(--text-primary)]">Sửa thông tin</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Chỉnh sửa khóa học</h1>
        <p className="text-[var(--text-muted)]">Cập nhật thông tin chung cho khóa học "{course.title}"</p>
      </div>

      <CourseForm 
        initialData={course}
        onSubmit={handleSubmit} 
        onCancel={() => router.push('/instructor/courses')} 
        isLoading={isSubmitting} 
      />
    </div>
  );
}
