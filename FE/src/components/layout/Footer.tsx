export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center font-bold text-white text-lg">
                E
              </div>
              <span className="text-xl font-bold gradient-text">ESimStudy</span>
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Nền tảng học trực tuyến hàng đầu. Khám phá hàng ngàn khóa học chất lượng cao.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-[var(--text-primary)]">Khám phá</h4>
            <ul className="space-y-2">
              {['Tất cả khóa học', 'Khóa học miễn phí', 'Giảng viên', 'Chứng chỉ'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-[var(--text-primary)]">Hỗ trợ</h4>
            <ul className="space-y-2">
              {['Trung tâm trợ giúp', 'Điều khoản sử dụng', 'Chính sách bảo mật', 'Liên hệ'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-[var(--text-primary)]">Kết nối</h4>
            <div className="flex gap-3">
              {['Facebook', 'YouTube', 'GitHub'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all text-xs font-medium"
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--border)] text-center">
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} ESimStudy. Bảo lưu mọi quyền.
          </p>
        </div>
      </div>
    </footer>
  );
}
