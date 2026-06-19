'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { PageLoader } from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';
import Modal from '@/components/ui/Modal';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    maxUsage: 100
  });

  const fetchCoupons = async () => {
    try {
      const { data } = await api.get('/admin/coupons');
      setCoupons(data.data);
    } catch (error) {
      toast('error', 'Không thể tải danh sách mã giảm giá');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/admin/coupons', formData);
      toast('success', 'Đã tạo mã giảm giá mới');
      setIsModalOpen(false);
      fetchCoupons();
    } catch (error: any) {
      toast('error', error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/admin/coupons/${id}/toggle`, { isActive: !currentStatus });
      toast('success', 'Đã cập nhật trạng thái');
      fetchCoupons();
    } catch (error) {
      toast('error', 'Không thể cập nhật trạng thái');
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quản lý Mã giảm giá</h1>
          <p className="text-[var(--text-muted)]">Tạo và theo dõi các chiến dịch khuyến mãi</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Tạo mã mới</Button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border)]">
                <th className="p-4 font-medium text-[var(--text-secondary)]">Mã</th>
                <th className="p-4 font-medium text-[var(--text-secondary)]">Giảm giá</th>
                <th className="p-4 font-medium text-[var(--text-secondary)]">Thời hạn</th>
                <th className="p-4 font-medium text-[var(--text-secondary)]">Đã dùng</th>
                <th className="p-4 font-medium text-[var(--text-secondary)] text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-[var(--bg-tertiary)]/30 transition-colors">
                  <td className="p-4 font-bold text-[var(--primary)]">{coupon.code}</td>
                  <td className="p-4 font-medium">
                    {coupon.discountType === 'PERCENTAGE' 
                      ? `${coupon.discountValue}%` 
                      : formatCurrency(coupon.discountValue)}
                  </td>
                  <td className="p-4 text-sm">
                    {formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium">{coupon.currentUsage}</span>
                    <span className="text-xs text-[var(--text-muted)]"> / {coupon.maxUsage}</span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => toggleStatus(coupon.id, coupon.isActive)}
                      className={`px-3 py-1 text-xs font-bold rounded-full ${coupon.isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}
                    >
                      {coupon.isActive ? 'Đang hoạt động' : 'Đã khóa'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tạo mã giảm giá mới">
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Mã giảm giá</label>
            <input 
              required
              type="text" 
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
              className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl uppercase"
              placeholder="VD: KHUYENMAI50"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Loại giảm giá</label>
              <select 
                value={formData.discountType}
                onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl"
              >
                <option value="PERCENTAGE">Phần trăm (%)</option>
                <option value="FIXED_AMOUNT">Số tiền cố định (VNĐ)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Giá trị</label>
              <input 
                required
                type="number" 
                min="1"
                value={formData.discountValue}
                onChange={(e) => setFormData({...formData, discountValue: parseInt(e.target.value) || 0})}
                className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ngày bắt đầu</label>
              <input 
                required
                type="date" 
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ngày kết thúc</label>
              <input 
                required
                type="date" 
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Số lượt sử dụng tối đa</label>
            <input 
              required
              type="number" 
              min="1"
              value={formData.maxUsage}
              onChange={(e) => setFormData({...formData, maxUsage: parseInt(e.target.value) || 1})}
              className="w-full px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button type="submit" isLoading={isSubmitting}>Lưu mã</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
