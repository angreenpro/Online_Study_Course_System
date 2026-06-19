'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  icon,
  className,
  id,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || label.toLowerCase().replace(/\s/g, '-');

  return (
    <div className="w-full">
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full px-4 py-3 bg-[var(--bg-tertiary)] border rounded-xl text-[var(--text-primary)] placeholder-transparent transition-all duration-200 outline-none peer',
            icon && 'pl-11',
            error
              ? 'border-red-500/50 focus:border-red-500'
              : 'border-[var(--border)] focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_rgba(108,99,255,0.1)]',
            className
          )}
          placeholder={label}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            'absolute left-4 transition-all duration-200 pointer-events-none',
            icon && 'left-11',
            'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[var(--text-muted)]',
            'peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-[var(--primary)] peer-focus:bg-[var(--bg-tertiary)] peer-focus:px-2',
            'top-0 -translate-y-1/2 text-xs bg-[var(--bg-tertiary)] px-2',
            error ? 'text-red-400' : 'text-[var(--text-secondary)]'
          )}
        >
          {label}
        </label>
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
