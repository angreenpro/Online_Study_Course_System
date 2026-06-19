import { useEffect, useRef, type RefObject } from 'react';

/**
 * Hook that detects clicks outside a referenced element.
 * Useful for closing dropdowns, modals, sidebars, etc.
 */
export function useClickOutside<T extends HTMLElement>(
  handler: () => void,
  enabled: boolean = true
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    }

    // Use mousedown for better UX (fires before click)
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handler, enabled]);

  return ref;
}
