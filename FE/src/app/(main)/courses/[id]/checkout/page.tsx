'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { PageLoader } from '@/components/ui/Spinner';
import CheckoutForm from '@/components/features/CheckoutForm';
import { toast } from '@/components/ui/Toast';

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const enrollmentId = searchParams.get('enrollmentId');

  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!enrollmentId) {
      toast('error', 'Không tìm thấy phiên đăng ký');
      router.push(`/courses/${params.id}`);
      return;
    }

    const fetchDetails = async () => {
      try {
        const { data } = await api.get(`/enrollments/${enrollmentId}`);
        const enrollment = data.data;
        
        if (enrollment.status === 'ACTIVE' || enrollment.status === 'COMPLETED') {
          toast('info', 'Bạn đã thanh toán khóa học này rồi');
          router.push(`/learn/${enrollment.courseId}`);
          return;
        }

        setCourse(enrollment.course);
      } catch (error) {
        toast('error', 'Không thể tải thông tin thanh toán');
        router.push(`/courses/${params.id}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [enrollmentId, params.id, router]);

  const handleSuccess = () => {
    router.push(`/learn/${course.id}`);
  };

  if (isLoading) return <PageLoader />;
  if (!course) return null;

  // Free course bypass
  if (course.price === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Khóa học miễn phí</h1>
        <p className="text-[var(--text-muted)] mb-8">Bạn có thể bắt đầu học ngay lập tức mà không cần thanh toán.</p>
        <button 
          onClick={() => {
            api.post(`/payments/${enrollmentId}/process`, { paymentMethod: 'CREDIT_CARD' })
              .then(() => handleSuccess())
              .catch(() => toast('error', 'Có lỗi xảy ra'));
          }}
          className="px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-bold hover:bg-[var(--primary-dark)]"
        >
          Vào học ngay
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <h1 className="text-3xl font-bold mb-8">Thanh toán khóa học</h1>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Course Info */}
        <div>
          <div className="glass-card overflow-hidden">
            <div className="aspect-video w-full bg-[var(--bg-tertiary)] relative">
              {course.thumbnailUrl ? (
                <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">Không có ảnh bìa</div>
              )}
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{course.title}</h2>
              <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-2">{course.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--text-muted)]">Giảng viên:</span>
                <span className="font-semibold">{course.instructor?.fullName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="glass-card p-6">
          <CheckoutForm 
            enrollmentId={enrollmentId as string}
            originalPrice={course.price}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  );
}
