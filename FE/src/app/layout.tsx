import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/lib/auth';

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ESimStudy - Nền tảng học trực tuyến",
  description: "Khám phá hàng ngàn khóa học chất lượng cao từ các giảng viên hàng đầu. Học mọi lúc, mọi nơi với ESimStudy.",
  keywords: ["e-learning", "khóa học trực tuyến", "học online", "ESimStudy"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
