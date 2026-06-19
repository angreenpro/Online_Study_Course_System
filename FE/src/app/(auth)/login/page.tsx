'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { toast } from '@/components/ui/Toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = 'Vui lòng nhập email';
    if (!password) newErrors.password = 'Vui lòng nhập mật khẩu';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast('success', 'Đăng nhập thành công!');
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Đăng nhập thất bại';
      toast('error', message);
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--primary)] rounded-full opacity-[0.07] blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[var(--accent)] rounded-full opacity-[0.07] blur-[150px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center font-bold text-white text-2xl shadow-[var(--shadow-glow)]">
              E
            </div>
          </Link>
          <h1 className="text-2xl font-bold mt-4">Chào mừng trở lại</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Đăng nhập để tiếp tục học tập</p>
        </div>

        {/* Form */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />

            <Input
              label="Mật khẩu"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />

            {errors.general && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                {errors.general}
              </div>
            )}

            <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
              Đăng nhập
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--text-muted)]">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="text-[var(--primary-light)] hover:underline font-medium">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>

        {/* Demo credentials */}
        <div className="mt-4 glass-card p-4">
          <p className="text-xs text-[var(--text-muted)] text-center mb-2">🔑 Tài khoản demo (mật khẩu: 123456)</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { role: 'Admin', email: 'admin1@elearning.vn' },
              { role: 'Giảng viên', email: 'instructor1@elearning.vn' },
              { role: 'Học viên', email: 'student1@gmail.com' },
            ].map((demo) => (
              <button
                key={demo.role}
                type="button"
                onClick={() => { setEmail(demo.email); setPassword('123456'); }}
                className="px-2 py-1.5 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--primary)]/20 border border-[var(--border)] hover:border-[var(--primary)]/30 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all text-center cursor-pointer"
              >
                {demo.role}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
