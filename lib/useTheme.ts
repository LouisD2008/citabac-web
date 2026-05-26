'use client';

import { useCallback, useEffect, useState } from 'react';

type Mode = 'dark' | 'light';
const KEY = 'theme_mode';

export function useTheme() {
  const [mode, setMode] = useState<Mode>('dark');

  useEffect(() => {
    const stored = (localStorage.getItem(KEY) as Mode | null) ?? 'dark';
    setMode(stored);
    document.documentElement.classList.toggle('light', stored === 'light');
    document.documentElement.classList.toggle('dark', stored === 'dark');
  }, []);

  const toggle = useCallback(() => {
    setMode((prev) => {
      const next: Mode = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem(KEY, next);
      document.documentElement.classList.toggle('light', next === 'light');
      document.documentElement.classList.toggle('dark', next === 'dark');
      return next;
    });
  }, []);

  return { mode, isDark: mode === 'dark', toggle };
}
