'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import QuizPlayer from '@/components/features/QuizPlayer';

export default function LearningPlayerPage() {
  const { courseId } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState<any>(null);
  const [progresses, setProgresses] = useState<any[]>([]);
  const [enrollmentId, setEnrollmentId] = useState<string>('');
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, notes, qna, review
  
  // Review State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      const res = await api.get(`/learn/${courseId}`);
      if (res.data.success) {
        setCourse(res.data.data.course);
        setProgresses(res.data.data.progresses);
        setEnrollmentId(res.data.data.enrollmentId);

        // Chọn bài học đầu tiên nếu chưa chọn
        if (res.data.data.course.sections.length > 0 && res.data.data.course.sections[0].lessons.length > 0) {
          setCurrentLesson(res.data.data.course.sections[0].lessons[0]);
        }
      }
    } catch (error: any) {
      if (error.response?.status === 403) {
        alert('Bạn chưa mua khóa học này!');
        router.push(`/courses/${courseId}`);
      } else {
        console.error('Error fetching course:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSelect = (lesson: any) => {
    setCurrentLesson(lesson);
    // Cuộn video lên top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVideoEnded = async () => {
    if (!currentLesson || !enrollmentId) return;

    try {
      await api.put('/learn/progress', {
        enrollmentId,
        lessonId: currentLesson.id,
        status: 'COMPLETED',
      });
      // Cập nhật state progress
      setProgresses((prev) => {
        const exist = prev.find((p) => p.lessonId === currentLesson.id);
        if (exist) {
          return prev.map((p) => (p.lessonId === currentLesson.id ? { ...p, status: 'COMPLETED' } : p));
        }
        return [...prev, { lessonId: currentLesson.id, status: 'COMPLETED' }];
      });
    } catch (error) {
      console.error('Lỗi khi cập nhật tiến độ:', error);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return progresses.some((p) => p.lessonId === lessonId && p.status === 'COMPLETED');
  };

  const isCourseCompleted = () => {
    if (!course) return false;
    const totalLessons = course.sections.flatMap((s: any) => s.lessons).length;
    const completedLessons = progresses.filter((p) => p.status === 'COMPLETED').length;
    return totalLessons > 0 && totalLessons === completedLessons;
  };

  const submitReview = async () => {
    setIsSubmittingReview(true);
    try {
      await api.post('/reviews', {
        enrollmentId,
        rating: reviewRating,
        comment: reviewComment
      });
      alert('Cảm ơn bạn đã đánh giá khóa học!');
      setHasReviewed(true);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Lỗi khi gửi đánh giá');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center mt-20">Đang tải nội dung khóa học...</div>;
  }

  if (!course) {
    return <div className="p-8 text-center mt-20">Không tìm thấy khóa học</div>;
  }

  return (
    <div className="min-h-screen pt-16 flex flex-col md:flex-row bg-[var(--bg-primary)]">
      {/* LEFT PANEL: Video Player & Tabs */}
      <div className="flex-1 flex flex-col w-full h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar">
        {/* Video or Quiz Player */}
        <div className={`w-full relative flex items-center justify-center group ${currentLesson?.type === 'QUIZ' ? 'min-h-[60vh]' : 'bg-black aspect-video'}`}>
          {currentLesson ? (
            currentLesson.type === 'QUIZ' ? (
              <QuizPlayer 
                lesson={currentLesson} 
                enrollmentId={enrollmentId}
                onCompleted={handleVideoEnded}
              />
            ) : (
              <video
                ref={videoRef}
                src={currentLesson.contentUrl || 'https://www.w3schools.com/html/mov_bbb.mp4'} // Default mock video
                controls
                autoPlay
                className="w-full h-full object-contain"
                onEnded={handleVideoEnded}
              >
                Trình duyệt của bạn không hỗ trợ HTML5 video.
              </video>
            )
          ) : (
            <div className="text-white text-lg">Chưa chọn bài học</div>
          )}
        </div>

        {/* Content Below Video */}
        <div className="p-4 sm:p-8 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">{currentLesson?.title || 'Đang tải...'}</h1>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-[var(--border)] mb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'overview'
                  ? 'border-[var(--primary)] text-[var(--primary-light)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              Tổng quan
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'notes'
                  ? 'border-[var(--primary)] text-[var(--primary-light)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              Ghi chú
            </button>
            <button
              onClick={() => setActiveTab('qna')}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'qna'
                  ? 'border-[var(--primary)] text-[var(--primary-light)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              Hỏi đáp (Q&A)
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'review'
                  ? 'border-[var(--primary)] text-[var(--primary-light)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              Đánh giá khóa học
            </button>
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in min-h-[300px]">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Về bài học này</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Đây là khu vực mô tả chi tiết bài học. Nội dung mô tả sẽ được hiển thị ở đây.
                </p>
              </div>
            )}
            
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Thêm ghi chú mới..." 
                    className="flex-1 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[var(--primary)]"
                  />
                  <Button size="sm">Lưu</Button>
                </div>
                <div className="text-sm text-[var(--text-muted)] text-center py-10">
                  Chưa có ghi chú nào cho bài học này.
                </div>
              </div>
            )}

            {activeTab === 'qna' && (
              <div className="space-y-4">
                <div className="flex flex-col gap-3">
                  <textarea 
                    placeholder="Bạn có câu hỏi gì không?" 
                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] min-h-[100px]"
                  />
                  <div className="flex justify-end">
                    <Button size="sm">Gửi câu hỏi</Button>
                  </div>
                </div>
                <div className="text-sm text-[var(--text-muted)] text-center py-10">
                  Chưa có thảo luận nào. Hãy là người đầu tiên đặt câu hỏi!
                </div>
              </div>
            )}

            {activeTab === 'review' && (
              <div className="space-y-4 max-w-2xl">
                {!isCourseCompleted() ? (
                  <div className="p-6 bg-[var(--bg-tertiary)] rounded-xl text-center border border-[var(--border)]">
                    <p className="mb-2">Vui lòng hoàn thành tất cả bài học để đánh giá và nhận chứng chỉ.</p>
                  </div>
                ) : hasReviewed ? (
                  <div className="p-6 bg-[var(--success)]/10 text-[var(--success)] rounded-xl text-center border border-[var(--success)]/20">
                    <p className="font-bold text-lg mb-2">Cảm ơn bạn!</p>
                    <p>Đánh giá của bạn đã được ghi nhận.</p>
                  </div>
                ) : (
                  <div className="p-6 glass-card border border-[var(--border)]">
                    <h3 className="text-lg font-bold mb-4">Đánh giá trải nghiệm học tập</h3>
                    <div className="flex gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button 
                          key={star} 
                          onClick={() => setReviewRating(star)}
                          className={`text-2xl ${reviewRating >= star ? 'text-yellow-400' : 'text-gray-600'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <textarea 
                      placeholder="Chia sẻ cảm nhận của bạn về khóa học này..." 
                      className="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] min-h-[100px] mb-4"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                    />
                    <Button onClick={submitReview} isLoading={isSubmittingReview}>Gửi đánh giá</Button>
                  </div>
                )}

                {/* Certificate Section */}
                {isCourseCompleted() && (
                  <div className="mt-8 p-6 glass-card border border-[var(--primary)]/30 bg-[var(--primary)]/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-[var(--primary-light)] mb-1">Chứng nhận hoàn thành</h3>
                      <p className="text-sm text-[var(--text-secondary)]">Xin chúc mừng! Bạn đã đủ điều kiện nhận chứng chỉ.</p>
                    </div>
                    <Button onClick={() => router.push(`/certificates/${enrollmentId}`)}>
                      Xem chứng chỉ
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Curriculum Sidebar */}
      <div className="w-full md:w-80 lg:w-96 border-l border-[var(--border)] bg-[var(--bg-secondary)] flex flex-col h-[50vh] md:h-[calc(100vh-64px)]">
        <div className="p-4 border-b border-[var(--border)] glass">
          <h2 className="font-semibold text-lg line-clamp-1">{course.title}</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 bg-[var(--bg-tertiary)] rounded-full h-2 overflow-hidden">
              <div 
                className="h-full gradient-primary" 
                style={{ 
                  width: `${course.sections.flatMap((s: any) => s.lessons).length > 0 
                    ? Math.round((progresses.filter((p) => p.status === 'COMPLETED').length / course.sections.flatMap((s: any) => s.lessons).length) * 100) 
                    : 0}%` 
                }} 
              />
            </div>
            <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">
              {progresses.filter((p) => p.status === 'COMPLETED').length} / {course.sections.flatMap((s: any) => s.lessons).length} bài
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {course.sections.map((section: any, index: number) => (
            <div key={section.id} className="border-b border-[var(--border)]">
              <div className="p-4 bg-[var(--bg-tertiary)]/50">
                <h3 className="font-medium text-sm text-[var(--text-primary)]">
                  Chương {index + 1}: {section.title}
                </h3>
              </div>
              <div className="flex flex-col">
                {section.lessons.map((lesson: any, lIndex: number) => {
                  const isCompleted = isLessonCompleted(lesson.id);
                  const isActive = currentLesson?.id === lesson.id;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonSelect(lesson)}
                      className={`flex items-start gap-3 p-4 text-left transition-colors border-l-2 ${
                        isActive 
                          ? 'border-[var(--primary)] bg-[var(--primary)]/10' 
                          : 'border-transparent hover:bg-[var(--bg-tertiary)]'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isCompleted ? (
                          <div className="w-5 h-5 rounded-full bg-[var(--success)] flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : (
                          <div className={`w-5 h-5 rounded-full border-2 ${isActive ? 'border-[var(--primary)]' : 'border-[var(--text-muted)]'}`} />
                        )}
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className={`text-sm ${isActive ? 'text-[var(--primary-light)] font-medium' : 'text-[var(--text-secondary)]'}`}>
                          {index + 1}.{lIndex + 1} {lesson.title}
                        </span>
                        <span className="text-xs text-[var(--text-muted)] mt-1 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {lesson.duration > 0 ? `${Math.round(lesson.duration / 60)} phút` : 'Video'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
