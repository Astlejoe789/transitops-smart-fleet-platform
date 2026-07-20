import { useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'transitops_theme';

/**
 * Custom hook for theme management (light/dark/system mode) with persistence.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    } catch {
      // Fallback if localStorage is unavailable
    }
    return 'system';
  });

  const setTheme = (newTheme: ThemeMode) => {
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch (e) {
      console.error('Failed to save theme in storage:', e);
    }
    setThemeState(newTheme);
  };

  useEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = () => {
      root.classList.remove('light', 'dark');

      if (theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.add(isDark ? 'dark' : 'light');
      } else {
        root.classList.add(theme);
      }
    };

    applyTheme();

    // Listen for OS theme changes if in 'system' mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return { theme, setTheme };
}
