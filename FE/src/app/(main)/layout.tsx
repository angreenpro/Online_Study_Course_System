'use client';


import { ToastContainer } from '@/components/ui/Toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToastContainer />
      <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
        <Header />
        <div className="flex-1 flex w-full max-w-7xl mx-auto">
          <Sidebar />
          <main className="flex-1 min-w-0 w-full">
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
}
