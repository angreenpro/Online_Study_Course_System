'use client';

import { useState } from 'react';
import Button from '../ui/Button';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { toast } from '../ui/Toast';

interface CheckoutFormProps {
  enrollmentId: string;
  originalPrice: number;
  onSuccess: () => void;
}

export default function CheckoutForm({ enrollmentId, originalPrice, onSuccess }: CheckoutFormProps) {
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const finalPrice = Math.max(0, originalPrice - discount);

  const handleValidateCoupon = async () => {
    if (!couponCode) return;
    setIsValidatingCoupon(true);
    try {
      const { data } = await api.post('/payments/coupons/validate', { code: couponCode });
      const coupon = data.data;
      if (coupon.discountType === 'PERCENTAGE') {
        setDiscount(originalPrice * (coupon.discountValue / 100));
      } else {
        setDiscount(coupon.discountValue);
      }
      toast('success', 'Đã áp dụng mã giảm giá');
    } catch (error: any) {
      setDiscount(0);
      toast('error', error.response?.data?.message || 'Mã giảm giá không hợp lệ');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await api.post(`/payments/${enrollmentId}/process`, {
        paymentMethod,
        couponCode: couponCode || undefined,
      });
      toast('success', 'Thanh toán thành công!');
      onSuccess();
    } catch (error: any) {
      toast('error', error.response?.data?.message || 'Thanh toán thất bại');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleProcessPayment} className="space-y-6">
      {/* Chọn phương thức thanh toán */}
      <div>
        <h3 className="text-lg font-bold mb-4">Phương thức thanh toán</h3>
        <div className="space-y-3">
          <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'CREDIT_CARD' ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-[var(--border)] hover:bg-[var(--bg-tertiary)]'}`}>
            <input type="radio" name="paymentMethod" value="CREDIT_CARD" checked={paymentMethod === 'CREDIT_CARD'} onChange={() => setPaymentMethod('CREDIT_CARD')} className="w-4 h-4 text-[var(--primary)]" />
            <span className="font-medium">Thẻ Tín dụng / Ghi nợ (Mock)</span>
          </label>
          <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'BANK_TRANSFER' ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-[var(--border)] hover:bg-[var(--bg-tertiary)]'}`}>
            <input type="radio" name="paymentMethod" value="BANK_TRANSFER" checked={paymentMethod === 'BANK_TRANSFER'} onChange={() => setPaymentMethod('BANK_TRANSFER')} className="w-4 h-4 text-[var(--primary)]" />
            <span className="font-medium">Chuyển khoản Ngân hàng (Mock)</span>
          </label>
        </div>
      </div>

      {/* Mã giảm giá */}
      <div>
        <h3 className="text-lg font-bold mb-4">Mã giảm giá</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Nhập mã (VD: WELCOME2026)"
            className="flex-1 px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl focus:border-[var(--primary)] focus:outline-none uppercase"
          />
          <Button type="button" variant="outline" onClick={handleValidateCoupon} isLoading={isValidatingCoupon}>
            Áp dụng
          </Button>
        </div>
      </div>

      {/* Tổng kết */}
      <div className="border-t border-[var(--border)] pt-4 space-y-3">
        <div className="flex justify-between text-[var(--text-secondary)]">
          <span>Giá gốc:</span>
          <span>{formatCurrency(originalPrice)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-500 font-medium">
            <span>Giảm giá:</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-xl font-bold pt-2 border-t border-[var(--border)]">
          <span>Tổng thanh toán:</span>
          <span className="text-[var(--primary-light)]">{formatCurrency(finalPrice)}</span>
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full text-lg mt-6" isLoading={isProcessing}>
        Thanh toán ngay (Mock)
      </Button>
    </form>
  );
}
