'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useAuth } from '@/lib/auth';

export default function Home() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen flex flex-col w-full items-center justify-start gap-y-16">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--border)] w-full flex justify-center">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center font-bold text-white text-lg">
                E
              </div>
              <span className="text-xl font-bold gradient-text">ESimStudy</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/dashboard" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
                Dashboard
              </Link>
              <Link href="/courses" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
                Khóa học
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="sm">Vào Bảng điều khiển</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Đăng nhập</Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">Bắt đầu học</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden w-full flex justify-center mt-10">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-[var(--primary)] rounded-full opacity-10 blur-[120px]" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[var(--accent)] rounded-full opacity-10 blur-[120px]" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          {/* Left Side: Large Box / Image */}
          <div className="w-full lg:w-1/2 h-[400px] lg:h-[500px] bg-[var(--bg-tertiary)] rounded-3xl border border-[var(--border)] shadow-xl flex items-center justify-center animate-slide-up overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Học sinh đang học tập" 
              className="w-full h-full object-cover" 
            />
          </div>

          {/* Right Side: Text and Buttons */}
          <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-sm text-[var(--primary-dark)] mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
              Hơn 1,000+ khóa học đang chờ bạn
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6 animate-slide-up text-[var(--text-primary)]">
              Nâng tầm kiến thức
              <br />
              <span className="gradient-text">cùng ESimStudy</span>
            </h1>

            <p className="text-lg sm:text-xl text-[var(--text-secondary)] mb-10 animate-slide-up stagger-1">
              Khám phá hàng ngàn khóa học chất lượng cao từ các giảng viên hàng đầu.
              Học mọi lúc, mọi nơi — hoàn toàn theo tốc độ của bạn.
            </p>

            <div className="flex flex-row items-center gap-4 animate-slide-up stagger-2">
              <Link href="/register">
                <Button size="lg" className="rounded-[100px] px-10 py-6 min-w-[200px] text-lg font-bold shadow-lg">
                  Bắt đầu miễn phí
                </Button>
              </Link>
              <Link href="/courses">
                <Button variant="secondary" size="lg" className="rounded-[100px] px-10 py-6 min-w-[200px] text-lg font-bold shadow-lg bg-white border-2 border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]">
                  Xem khóa học
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 w-full flex justify-center">
        <div className="w-full max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { number: '1,200+', label: 'Khóa học' },
            { number: '50,000+', label: 'Học viên' },
            { number: '200+', label: 'Giảng viên' },
            { number: '95%', label: 'Hài lòng' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`glass-card p-6 text-center animate-fade-in stagger-${i + 1}`}
            >
              <div className="text-3xl font-bold gradient-text mb-1">{stat.number}</div>
              <div className="text-sm text-[var(--text-muted)]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 w-full flex justify-center">
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Tại sao chọn <span className="gradient-text">ESimStudy</span>?
            </h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
              Chúng tôi cung cấp trải nghiệm học tập tốt nhất với công nghệ hiện đại
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🎯',
                title: 'Học theo lộ trình',
                desc: 'Hệ thống theo dõi tiến độ chi tiết, giúp bạn biết mình đang ở đâu và cần làm gì tiếp theo.',
              },
              {
                icon: '🏆',
                title: 'Chứng chỉ uy tín',
                desc: 'Nhận chứng chỉ hoàn thành được xác nhận sau khi hoàn tất khóa học và bài kiểm tra.',
              },
              {
                icon: '💬',
                title: 'Tương tác trực tiếp',
                desc: 'Hỏi đáp Q&A, ghi chú bài học, và thảo luận trực tiếp với giảng viên và học viên.',
              },
              {
                icon: '📱',
                title: 'Học mọi nơi',
                desc: 'Giao diện responsive, tương thích hoàn hảo trên mọi thiết bị từ điện thoại đến desktop.',
              },
              {
                icon: '🔒',
                title: 'An toàn & Bảo mật',
                desc: 'Hệ thống bảo mật đa tầng với mã hóa dữ liệu, xác thực JWT, và phân quyền RBAC.',
              },
              {
                icon: '💰',
                title: 'Giá cả hợp lý',
                desc: 'Mã giảm giá hấp dẫn, chính sách hoàn tiền linh hoạt, và nhiều khóa học miễn phí.',
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="glass-card p-6 group"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)] group-hover:text-[var(--primary-light)] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 w-full flex justify-center">
        <div className="w-full max-w-4xl mx-auto">
          <div className="relative glass-card p-10 sm:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 gradient-primary opacity-5" />
            <div className="relative flex flex-col items-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Sẵn sàng bắt đầu hành trình?
              </h2>
              <p className="text-[var(--text-secondary)] mb-8 max-w-lg mx-auto">
                Tham gia cộng đồng hơn 50,000 học viên và bắt đầu hành trình nâng cao kỹ năng ngay hôm nay.
              </p>
              <Link href="/register">
                <Button size="lg" className="animate-pulse-glow">
                  Đăng ký ngay — Miễn phí
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)] w-full flex justify-center mt-auto">
        <div className="w-full max-w-7xl px-4 py-8 text-center flex flex-col items-center">
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} ESimStudy. Bảo lưu mọi quyền.
          </p>
        </div>
      </footer>
    </div>
  );
}
