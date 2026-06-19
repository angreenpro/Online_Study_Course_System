'use client';

import { useState } from 'react';
import Button from './Button';

interface LessonFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function LessonForm({ initialData, onSubmit, onCancel, isLoading }: LessonFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    order: initialData?.order || 1,
    type: initialData?.type || 'VIDEO',
    duration: initialData?.duration || 0,
    contentUrl: initialData?.contentUrl || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title || formData.title.length < 3) newErrors.title = 'Tiêu đề phải có ít nhất 3 ký tự';
    if (!formData.order || formData.order < 1) newErrors.order = 'Thứ tự không hợp lệ';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
          Tiêu đề bài học
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none transition-colors"
          placeholder="Nhập tiêu đề..."
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Loại nội dung
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none"
          >
            <option value="VIDEO">Video</option>
            <option value="READING">Bài đọc</option>
            <option value="QUIZ">Trắc nghiệm</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
            Thứ tự
          </label>
          <input
            type="number"
            min="1"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
            className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
          URL Nội dung (Tùy chọn)
        </label>
        <input
          type="text"
          value={formData.contentUrl}
          onChange={(e) => setFormData({ ...formData, contentUrl: e.target.value })}
          className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none"
          placeholder="https://..."
        />
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Đường dẫn video YouTube, Vimeo hoặc link tài liệu.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
          Thời lượng (giây)
        </label>
        <input
          type="number"
          min="0"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
          className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Cập nhật' : 'Tạo mới'}
        </Button>
      </div>
    </form>
  );
}
