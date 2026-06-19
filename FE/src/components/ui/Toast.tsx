'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastData {
  id: string;
  type: ToastType;
  message: string;
}

const typeStyles: Record<ToastType, string> = {
  success: 'border-l-4 border-l-green-500 bg-green-500/10',
  error: 'border-l-4 border-l-red-500 bg-red-500/10',
  warning: 'border-l-4 border-l-yellow-500 bg-yellow-500/10',
  info: 'border-l-4 border-l-blue-500 bg-blue-500/10',
};

const typeIcons: Record<ToastType, string> = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
};

// Global toast state
let toastListeners: ((toasts: ToastData[]) => void)[] = [];
let toasts: ToastData[] = [];

function notifyListeners() {
  toastListeners.forEach((listener) => listener([...toasts]));
}

export function toast(type: ToastType, message: string) {
  const id = Date.now().toString();
  toasts = [...toasts, { id, type, message }];
  notifyListeners();

  // Auto remove after 4 seconds
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notifyListeners();
  }, 4000);
}

export function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    toastListeners.push(setCurrentToasts);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== setCurrentToasts);
    };
  }, []);

  if (currentToasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm">
      {currentToasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'glass rounded-xl px-4 py-3 flex items-center gap-3 animate-slide-in-right shadow-lg',
            typeStyles[t.type]
          )}
        >
          <span className="text-lg">{typeIcons[t.type]}</span>
          <p className="text-sm text-[var(--text-primary)]">{t.message}</p>
        </div>
      ))}
    </div>
  );
}
