'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { PageLoader } from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { toast } from '@/components/ui/Toast';

export default function CertificatePage() {
  const { enrollmentId } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await api.get(`/certificates/${enrollmentId}`);
        setData(res.data.data);
      } catch (error: any) {
        toast('error', error.response?.data?.message || 'Không thể tải chứng chỉ');
        router.push('/dashboard/enrollments');
      } finally {
        setIsLoading(false);
      }
    };

    if (enrollmentId) fetchCertificate();
  }, [enrollmentId, router]);

  if (isLoading) return <PageLoader />;
  if (!data) return null;

  const { certificate, course, student } = data;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[var(--bg-secondary)] flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full">
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={() => router.back()}>
            Quay lại
          </Button>
          <Button onClick={() => window.print()}>
            Tải xuống / In chứng chỉ
          </Button>
        </div>

        {/* Certificate Card */}
        <div className="bg-white text-gray-900 rounded-none shadow-2xl overflow-hidden relative" style={{ aspectRatio: '1.414' }}>
          {/* Certificate Border */}
          <div className="absolute inset-4 border-8 border-double border-gray-300"></div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-16 text-center z-10">
            <h1 className="text-4xl md:text-5xl font-serif text-[var(--primary-dark)] mb-2 uppercase tracking-widest">Giấy Chứng Nhận</h1>
            <p className="text-gray-500 uppercase tracking-widest text-sm mb-12">Hoàn Thành Khóa Học</p>
            
            <p className="text-lg italic text-gray-600 mb-4">Chứng nhận học viên:</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 font-serif">{student.fullName}</h2>
            
            <p className="text-lg text-gray-600 mb-4">đã hoàn thành xuất sắc khóa học:</p>
            <h3 className="text-2xl md:text-3xl font-bold text-[var(--primary)] mb-12 max-w-2xl">{course.title}</h3>
            
            <div className="flex justify-between items-end w-full max-w-2xl mt-auto border-t-2 border-gray-200 pt-8">
              <div className="text-left">
                <p className="font-bold text-gray-800">ESimStudy Platform</p>
                <p className="text-sm text-gray-500">Giám đốc đào tạo</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Mã số: <span className="font-mono text-gray-800">{certificate.certificateCode}</span></p>
                <p className="text-sm text-gray-500">Ngày cấp: {formatDate(certificate.issuedAt)}</p>
              </div>
            </div>
          </div>
          
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-[var(--primary)] opacity-10 rounded-br-full"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-[var(--primary)] opacity-10 rounded-tl-full"></div>
        </div>
      </div>
    </div>
  );
}
