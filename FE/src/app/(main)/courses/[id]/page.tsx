'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Spinner';
import CurriculumAccordion from '@/components/ui/CurriculumAccordion';
import { useAuth } from '@/lib/auth';
import { toast } from '@/components/ui/Toast';

export default function CourseDetailPage() {
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/courses/${params.id}`);
        setCourse(data.data);
      } catch (error) {
        console.error('Lỗi khi tải chi tiết khóa học:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchCourse();
    }
  }, [params.id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast('warning', 'Vui lòng đăng nhập để đăng ký khóa học');
      router.push('/login');
      return;
    }
    
    setIsEnrolling(true);
    try {
      const { data } = await api.post('/enrollments', { courseId: course.id });
      
      // If already enrolled and active, redirect to learning page
      if (data.data.status === 'ACTIVE' || data.data.status === 'COMPLETED') {
        toast('info', 'Bạn đã đăng ký khóa học này');
        router.push(`/learn/${course.id}`);
      } else {
        // Pending status -> go to checkout
        router.push(`/courses/${course.id}/checkout?enrollmentId=${data.data.id}`);
      }
    } catch (error: any) {
      toast('error', error.response?.data?.message || 'Không thể đăng ký khóa học');
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading) return <PageLoader />;
  if (!course) return <div className="p-8 text-center">Không tìm thấy khóa học</div>;

  return (
    <div className="w-full">
      {/* Banner */}
      <div className="bg-[var(--bg-tertiary)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary-light)] mb-4">
                {course.level === 'BEGINNER' ? 'Cơ bản' : course.level === 'INTERMEDIATE' ? 'Trung cấp' : 'Nâng cao'}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-[var(--text-secondary)] mb-6 text-lg">
                {course.description}
              </p>
              
              <div className="flex items-center gap-4 mb-8">
                <Avatar src={course.instructor.avatarUrl} name={course.instructor.fullName} size="md" />
                <div>
                  <p className="font-medium text-sm">Giảng viên</p>
                  <p className="font-semibold">{course.instructor.fullName}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button size="lg" onClick={handleEnroll} isLoading={isEnrolling}>
                  {course.price > 0 ? `Đăng ký học - ${formatCurrency(course.price)}` : 'Đăng ký học miễn phí'}
                </Button>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="aspect-video rounded-2xl overflow-hidden border border-[var(--border)] glass-card shadow-2xl">
                {course.thumbnailUrl ? (
                  <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20">
                    <span className="text-6xl mb-4">🎬</span>
                    <span className="text-[var(--text-muted)] font-medium">Video Giới thiệu</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Nội dung khóa học</h2>
            <div className="mb-4 flex justify-between text-sm text-[var(--text-muted)]">
              <span>{course.sections.length} phần học</span>
              <span>
                Cập nhật lần cuối: {formatDate(course.updatedAt)}
              </span>
            </div>
            
            <CurriculumAccordion sections={course.sections} />
          </div>

          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <h3 className="text-lg font-bold mb-4">Khóa học bao gồm:</h3>
              <ul className="space-y-3 text-sm text-[var(--text-secondary)] mb-6">
                <li className="flex items-center gap-3">
                  <span>📺</span> Truy cập trọn đời
                </li>
                <li className="flex items-center gap-3">
                  <span>📱</span> Học trên mọi thiết bị
                </li>
                <li className="flex items-center gap-3">
                  <span>🏆</span> Giấy chứng nhận hoàn thành
                </li>
                <li className="flex items-center gap-3">
                  <span>💬</span> Thảo luận & Hỏi đáp trực tiếp
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
