'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from '@/components/ui/Toast';
import { PageLoader } from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import LessonForm from '@/components/ui/LessonForm';

export default function CourseContentPage() {
  const router = useRouter();
  const params = useParams();
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Section Modal state
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);
  const [sectionTitle, setSectionTitle] = useState('');
  const [sectionOrder, setSectionOrder] = useState(1);
  const [isSectionSubmitting, setIsSectionSubmitting] = useState(false);

  // Lesson Modal state
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

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

  useEffect(() => {
    if (params.id) fetchCourse();
  }, [params.id, router]);

  // --- SECTION HANDLERS ---
  const openAddSection = () => {
    setEditingSection(null);
    setSectionTitle('');
    setSectionOrder((course?.sections?.length || 0) + 1);
    setIsSectionModalOpen(true);
  };

  const openEditSection = (section: any) => {
    setEditingSection(section);
    setSectionTitle(section.title);
    setSectionOrder(section.order);
    setIsSectionModalOpen(true);
  };

  const submitSection = async () => {
    if (!sectionTitle) return toast('error', 'Vui lòng nhập tiêu đề');
    setIsSectionSubmitting(true);
    try {
      if (editingSection) {
        await api.put(`/courses/sections/${editingSection.id}`, { title: sectionTitle, order: sectionOrder });
        toast('success', 'Đã cập nhật phần học');
      } else {
        await api.post(`/courses/${params.id}/sections`, { title: sectionTitle, order: sectionOrder });
        toast('success', 'Đã thêm phần học mới');
      }
      setIsSectionModalOpen(false);
      fetchCourse();
    } catch (error: any) {
      toast('error', error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setIsSectionSubmitting(false);
    }
  };

  const deleteSection = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa phần học này? Tất cả bài học bên trong sẽ bị xóa!')) return;
    try {
      await api.delete(`/courses/sections/${id}`);
      toast('success', 'Đã xóa phần học');
      fetchCourse();
    } catch (error: any) {
      toast('error', error.response?.data?.message || 'Không thể xóa');
    }
  };

  // --- LESSON HANDLERS ---
  const openAddLesson = (sectionId: string) => {
    setEditingLesson(null);
    setActiveSectionId(sectionId);
    setIsLessonModalOpen(true);
  };

  const openEditLesson = (lesson: any, sectionId: string) => {
    setEditingLesson(lesson);
    setActiveSectionId(sectionId);
    setIsLessonModalOpen(true);
  };

  const submitLesson = async (data: any) => {
    try {
      if (editingLesson) {
        await api.put(`/courses/lessons/${editingLesson.id}`, data);
        toast('success', 'Đã cập nhật bài học');
      } else {
        await api.post(`/courses/sections/${activeSectionId}/lessons`, data);
        toast('success', 'Đã thêm bài học mới');
      }
      setIsLessonModalOpen(false);
      fetchCourse();
    } catch (error: any) {
      toast('error', error.response?.data?.message || 'Có lỗi xảy ra');
      throw error; // Let form handle it
    }
  };

  const deleteLesson = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài học này?')) return;
    try {
      await api.delete(`/courses/lessons/${id}`);
      toast('success', 'Đã xóa bài học');
      fetchCourse();
    } catch (error: any) {
      toast('error', error.response?.data?.message || 'Không thể xóa');
    }
  };

  if (isLoading) return <PageLoader />;
  if (!course) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
            <Link href="/instructor/courses" className="hover:text-[var(--text-primary)] transition-colors">
              Quản lý khóa học
            </Link>
            <span>/</span>
            <span className="text-[var(--text-primary)]">Nội dung</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Chương trình học</h1>
          <p className="text-[var(--text-muted)]">Quản lý các chương và bài học cho khóa: {course.title}</p>
        </div>
        <Button onClick={openAddSection}>+ Thêm phần học (Section)</Button>
      </div>

      <div className="space-y-6">
        {course.sections?.map((section: any) => (
          <div key={section.id} className="glass-card overflow-hidden">
            <div className="bg-[var(--bg-tertiary)]/50 px-6 py-4 flex items-center justify-between border-b border-[var(--border)]">
              <h3 className="font-bold text-lg">
                Phần {section.order}: {section.title}
              </h3>
              <div className="flex gap-2">
                <button onClick={() => openEditSection(section)} className="text-[var(--text-secondary)] hover:text-[var(--primary)] text-sm px-2">Sửa</button>
                <button onClick={() => deleteSection(section.id)} className="text-[var(--text-secondary)] hover:text-red-500 text-sm px-2">Xóa</button>
              </div>
            </div>
            
            <div className="p-6">
              {section.lessons?.length === 0 ? (
                <p className="text-[var(--text-muted)] text-sm mb-4">Chưa có bài học nào trong phần này.</p>
              ) : (
                <ul className="space-y-3 mb-6">
                  {section.lessons.map((lesson: any) => (
                    <li key={lesson.id} className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] hover:border-[var(--primary-light)]/30 transition-colors bg-[var(--bg-secondary)]">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 flex items-center justify-center bg-[var(--primary)]/10 text-[var(--primary)] rounded text-xs font-bold">
                          {lesson.order}
                        </span>
                        <span className="font-medium">{lesson.title}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                          {lesson.type} • {lesson.duration}s
                        </span>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity">
                        <button onClick={() => openEditLesson(lesson, section.id)} className="text-[var(--text-secondary)] hover:text-[var(--primary)] text-sm">Sửa</button>
                        <button onClick={() => deleteLesson(lesson.id)} className="text-[var(--text-secondary)] hover:text-red-500 text-sm">Xóa</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              
              <Button variant="outline" size="sm" onClick={() => openAddLesson(section.id)}>
                + Thêm bài học
              </Button>
            </div>
          </div>
        ))}

        {(!course.sections || course.sections.length === 0) && (
          <div className="text-center py-12 border-2 border-dashed border-[var(--border)] rounded-2xl">
            <p className="text-[var(--text-muted)] mb-4">Khóa học của bạn chưa có nội dung nào.</p>
            <Button onClick={openAddSection}>Tạo phần học đầu tiên</Button>
          </div>
        )}
      </div>

      {/* Section Modal */}
      <Modal isOpen={isSectionModalOpen} onClose={() => setIsSectionModalOpen(false)} title={editingSection ? 'Sửa phần học' : 'Thêm phần học mới'}>
        <div className="space-y-4 pt-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Tiêu đề phần học</label>
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl focus:border-[var(--primary)] focus:outline-none"
              placeholder="VD: Giới thiệu chung"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Thứ tự</label>
            <input
              type="number"
              min="1"
              value={sectionOrder}
              onChange={(e) => setSectionOrder(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <Button variant="ghost" onClick={() => setIsSectionModalOpen(false)}>Hủy</Button>
            <Button onClick={submitSection} isLoading={isSectionSubmitting}>Lưu</Button>
          </div>
        </div>
      </Modal>

      {/* Lesson Modal */}
      <Modal isOpen={isLessonModalOpen} onClose={() => setIsLessonModalOpen(false)} title={editingLesson ? 'Sửa bài học' : 'Thêm bài học mới'}>
        <div className="pt-4">
          <LessonForm 
            initialData={editingLesson}
            onSubmit={submitLesson}
            onCancel={() => setIsLessonModalOpen(false)}
          />
        </div>
      </Modal>
    </div>
  );
}
