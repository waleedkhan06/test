'use client';

import { useEffect } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();

  // Set theme preference in user profile when changed
  useEffect(() => {
    const updateThemePreference = async () => {
      // In a real app, you would update the user's theme preference in the backend
      // For now, we'll just store it locally
      if (theme) {
        localStorage.setItem('theme-preference', theme);
      }
    };

    updateThemePreference();
  }, [theme]);

  const currentTheme = resolvedTheme || theme || 'system';

  return {
    theme: currentTheme,
    setTheme,
    isDark: currentTheme === 'dark' || (currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches),
    isLight: currentTheme === 'light' || (currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches),
  };
}